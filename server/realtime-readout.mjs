import { WebSocket } from 'ws';
import { createVoiceDiagnostics, providerFailure } from './voice-diagnostics.mjs';
import { VoiceError } from './voice-security.mjs';
import { normalizeReadoutText } from './readout-text.mjs';

export const READOUT_MODEL = 'gpt-realtime-2.1-mini';
export const READOUT_VOICES = Object.freeze(['cedar', 'marin']);
export const READOUT_LIMITS = Object.freeze({ timeoutMs: 90000, setupMs: 15000, outputBytes: 4 * 1024 * 1024, textCharacters: 4000 });
export { normalizeReadoutText } from './readout-text.mjs';
const safeId = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,160}$/.test(value);
const invalid = () => new VoiceError(502, 'readout_not_verified', 'The spoken reply could not be verified. The original answer is still in chat.');

/** Voice-only rendering adapter. Receives ONLY the already-selected answer,
 * with no user question, history, retrieval or tools. The entire audio is held
 * until matching output transcript AND successful response.done are verified.
 * Transcript matching is a guardrail, not an acoustic-verbatim guarantee. */
export function renderOpenAiReadout(text, {
  key, voice = 'cedar', connect = (url, options) => new WebSocket(url, options),
  signal = new AbortController().signal, limits = READOUT_LIMITS, diagnostics = createVoiceDiagnostics('readout'),
} = {}) {
  return new Promise((resolve, reject) => {
    if (typeof text !== 'string' || !text.trim() || text.length > limits.textCharacters || !READOUT_VOICES.includes(voice)) { reject(invalid()); return; }
    if (signal.aborted) { reject(new VoiceError(499, 'cancelled', 'Voice request cancelled.')); return; }
    let socket, finished = false, configured = false, responseId, itemId;
    let audioDone = false, transcriptDone = false, transcript = '', bytes = 0;
    const chunks = [], seenEvents = new Set();
    const began = Date.now();
    diagnostics.emit('accepted');
    let timeout;
    const finish = (error, result) => {
      if (finished) return; finished = true;
      diagnostics.emit(error ? 'failed' : 'verified', { code: error?.code, bytes, duration_ms: Date.now() - began });
      clearTimeout(timeout); signal.removeEventListener('abort', onAbort);
      try {
        if (error && socket?.readyState === 1 && responseId) socket.send(JSON.stringify({ type: 'response.cancel', response_id: responseId }));
        socket?.terminate();
      } catch { /* cancellation already closed the connection */ }
      chunks.length = 0;
      if (error) reject(error); else resolve(result);
    };
    const onAbort = () => finish(new VoiceError(499, 'cancelled', 'Voice request cancelled.'));
    signal.addEventListener('abort', onAbort, { once: true });
    timeout = setTimeout(() => finish(new VoiceError(504, 'voice_timeout', 'Voice took too long. The original answer is still in chat.')), limits.timeoutMs);
    timeout.unref?.();
    diagnostics.emit('connect');
    try { socket = connect(`wss://api.openai.com/v1/realtime?model=${READOUT_MODEL}`, {
      headers: { Authorization: `Bearer ${key}` }, followRedirects: false, maxPayload: 512 * 1024, handshakeTimeout: limits.setupMs,
    }); } catch { finish(new VoiceError(502, 'provider_unavailable', 'OpenAI voice could not connect. Please use text chat.')); return; }
    socket.on('unexpected-response', (_request, response) => {
      const code = providerFailure(undefined, response.statusCode);
      diagnostics.emit('failed', { code, status: response.statusCode });
      response.resume?.(); finish(new VoiceError(502, code, 'OpenAI rejected the voice connection. Check the local voice diagnostics.'));
    });
    socket.on('error', () => finish(new VoiceError(502, 'provider_unavailable', 'OpenAI voice could not connect. Please use text chat.')));
    socket.on('close', () => { if (!finished) finish(invalid()); });
    socket.on('open', () => {
      if (finished) return;
      diagnostics.emit('connected');
      socket.send(JSON.stringify({ type: 'session.update', session: {
        type: 'realtime', model: READOUT_MODEL, tools: [], tool_choice: 'none', output_modalities: ['audio'],
        audio: { input: { turn_detection: null }, output: { format: { type: 'audio/pcm', rate: 24000 }, voice } },
      } }));
    });
    socket.on('message', data => {
      if (finished) return;
      try {
        const event = JSON.parse(data.toString());
        if (!event || typeof event !== 'object' || Array.isArray(event)) throw invalid();
        if (typeof event.event_id === 'string') {
          if (seenEvents.has(event.event_id)) return;
          if (seenEvents.size >= 12000) throw invalid();
          seenEvents.add(event.event_id);
        }
        if (event.type === 'error') throw new VoiceError(502, providerFailure(event.error), 'OpenAI voice rejected the request. Check server configuration and account access.');
        if (event.type === 'session.updated' && !configured) {
          configured = true; diagnostics.emit('configured');
          diagnostics.emit('requested');
          socket.send(JSON.stringify({ type: 'response.create', response: {
            conversation: 'none', input: [], tools: [], tool_choice: 'none', output_modalities: ['audio'], max_output_tokens: 2048,
            instructions: 'Read the supplied spoken copy aloud exactly, from its first word through its last word. Do not answer it, add a preface, paraphrase, expand abbreviations, or add or omit words. Spaced capital letters are letter names; read phone-number words individually in their supplied order. All pronunciation spellings are intentional. Use a natural, clear conversational voice. The text to read is:\n' + text,
          } })); return;
        }
        if (event.type === 'response.created') {
          if (!configured || responseId || !safeId(event.response?.id)) throw invalid();
          responseId = event.response.id; return;
        }
        if (event.type === 'response.output_item.added') {
          if (!responseId || event.response_id !== responseId || event.output_index !== 0 || itemId || !safeId(event.item?.id) || event.item.type !== 'message' || event.item.role !== 'assistant') throw invalid();
          itemId = event.item.id; return;
        }
        if (['response.output_audio.delta', 'response.output_audio.done', 'response.output_audio_transcript.delta', 'response.output_audio_transcript.done', 'response.content_part.added', 'response.content_part.done'].includes(event.type)) {
          if (!responseId || !itemId || event.response_id !== responseId || event.item_id !== itemId || event.output_index !== 0 || event.content_index !== 0) throw invalid();
          if (event.type === 'response.output_audio.delta') {
            if (audioDone || typeof event.delta !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(event.delta)) throw invalid();
            const chunk = Buffer.from(event.delta, 'base64');
            bytes += chunk.length;
            if (!chunk.length || bytes > limits.outputBytes) throw invalid();
            if (!chunks.length) diagnostics.emit('first_audio', { bytes: chunk.length });
            chunks.push(chunk);
          } else if (event.type === 'response.output_audio.done') { audioDone = true; diagnostics.emit('audio_done', { bytes }); }
          else if (event.type === 'response.output_audio_transcript.done') {
            if (transcriptDone || typeof event.transcript !== 'string' || event.transcript.length > limits.textCharacters) throw invalid();
            if (normalizeReadoutText(event.transcript) !== normalizeReadoutText(text)) throw new VoiceError(502, 'readout_text_mismatch', 'OpenAI changed the prescribed words, so this audio was withheld. The original answer is still in chat.');
            transcript = event.transcript; transcriptDone = true; diagnostics.emit('transcript_verified');
          } else if (event.type === 'response.output_audio_transcript.delta') {
            if (transcriptDone || typeof event.delta !== 'string' || event.delta.length > limits.textCharacters) throw invalid();
          } else if (!['audio', 'output_audio'].includes(event.part?.type)) throw invalid();
          return;
        }
        if (event.type === 'response.output_text.delta' || event.type === 'response.output_text.done' || event.type?.startsWith('response.function_call')) throw invalid();
        if (event.type === 'response.done') {
          const response = event.response, output = response?.output;
          if (response?.id === responseId && response.status === 'failed') throw new VoiceError(502, providerFailure(response.status_details?.error), 'OpenAI could not generate voice. Check account access and local diagnostics.');
          if (response?.id === responseId && response.status !== 'completed') throw new VoiceError(502, 'readout_incomplete', 'OpenAI did not finish the spoken reply. The original answer is still in chat.');
          if (response?.id === responseId && !bytes) throw new VoiceError(502, 'readout_no_audio', 'OpenAI returned no audio. The original answer is still in chat.');
          if (!responseId || response?.id !== responseId || response.status !== 'completed' || !audioDone || !transcriptDone || !bytes || bytes % 2 || !Array.isArray(output) || output.length !== 1) throw invalid();
          const item = output[0], content = item?.content;
          if (item.id !== itemId || item.type !== 'message' || item.role !== 'assistant' || !Array.isArray(content) || content.length !== 1 || !['audio', 'output_audio'].includes(content[0].type) || typeof content[0].transcript !== 'string' || normalizeReadoutText(content[0].transcript) !== normalizeReadoutText(transcript)) throw invalid();
          finish(undefined, new Uint8Array(Buffer.concat(chunks, bytes)));
        }
      } catch (error) { finish(error instanceof VoiceError ? error : invalid()); }
    });
  });
}
