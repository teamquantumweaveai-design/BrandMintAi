// Server-only. Never expose OPENAI_API_KEY through VITE_* or a browser bundle.
import { createVoiceDiagnostics } from './voice-diagnostics.mjs';
import { renderOpenAiReadout, READOUT_MODEL, READOUT_VOICES } from './realtime-readout.mjs';
import { sanitizeSpeechText } from './generated-speech-text.mjs';
import { prepareReadoutText } from './readout-text.mjs';
import { VoiceError, SECURITY_HEADERS, json, configuration, checkOrigin, readLimited, createUsageGuard } from './voice-security.mjs';
export const LIMITS = Object.freeze({ jsonBytes: 8 * 1024, timeoutMs: 95000, perIpMinute: 12, globalMinute: 60, perIpConcurrent: 2, globalConcurrent: 6, hourlyUnits: 12000, ipEntries: 2048, outputBytes: 4 * 1024 * 1024 });
export function createVoiceHandler({ env = process.env, replies, renderImpl = renderOpenAiReadout, connect, now = Date.now, limits = LIMITS, realtimeAvailable = true } = {}) {
  const config = configuration(env), guard = createUsageGuard(limits, now);
  const allowed = replies instanceof Set ? replies : new Set(replies || []);
  const voice = (env.OPENAI_VOICE || 'cedar').trim();
  return async function handleVoice(request, { ip = 'unknown' } = {}) {
    let release = () => {}, timeout, diagnostics;
    const abort = new AbortController();
    const cancel = () => abort.abort(new VoiceError(499, 'cancelled', 'Voice request cancelled.'));
    try {
      const path = new URL(request.url).pathname, status = path === '/api/voice/status';
      if (!status && path !== '/api/voice/speak') throw new VoiceError(404, 'not_found', 'Voice endpoint not found.');
      if (request.method !== (status ? 'GET' : 'POST')) throw new VoiceError(405, 'method_not_allowed', 'This method is not supported.');
      checkOrigin(request.headers, config, status);
      const configured = config.configured && READOUT_VOICES.includes(voice);
      if (status) return json({ service: 'brandmint-openai-voice', output_model: READOUT_MODEL, voice: READOUT_VOICES.includes(voice) ? voice : null, enabled: config.enabled, configured, realtime: realtimeAvailable });
      if (!config.enabled || !configured || !realtimeAvailable) throw new VoiceError(503, 'voice_unavailable', 'OpenAI voice is not configured. Text chat is still available.');
      if (request.signal.aborted) throw new VoiceError(499, 'cancelled', 'Voice request cancelled.');
      if ((request.headers.get('content-type') || '').split(';')[0].trim() !== 'application/json') throw new VoiceError(415, 'unsupported_media', 'The voice request must be JSON.');
      const length = request.headers.get('content-length');
      if (length && (!/^\d+$/.test(length) || Number(length) > limits.jsonBytes)) throw new VoiceError(413, 'body_too_large', 'The voice request is too large.');
      release = guard.enter(String(ip).slice(0, 128));
      request.signal.addEventListener('abort', cancel, { once: true });
      timeout = setTimeout(() => abort.abort(new VoiceError(504, 'voice_timeout', 'Voice took too long. Text chat still works.')), limits.timeoutMs); timeout.unref?.();
      const bytes = await readLimited(request.body, limits.jsonBytes, abort.signal);
      let body; try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { throw new VoiceError(400, 'invalid_json', 'Invalid voice request.'); }
      if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length !== 1 || typeof body.text !== 'string' || !allowed.has(body.text)) throw new VoiceError(400, 'reply_not_allowed', 'Only this assistant’s existing replies can be spoken.');
      const spoken = prepareReadoutText(sanitizeSpeechText(body.text)); guard.spend(spoken.length);
      diagnostics = createVoiceDiagnostics('readout', { env });
      const audio = await renderImpl(spoken, { key: env.OPENAI_API_KEY.trim(), voice, signal: abort.signal, connect, diagnostics });
      if (abort.signal.aborted) throw abort.signal.reason;
      if (!(audio instanceof Uint8Array) || !audio.length || audio.length % 2 || audio.length > limits.outputBytes) throw new VoiceError(502, 'invalid_response', 'OpenAI voice returned invalid audio.');
      return new Response(audio, { headers: { ...SECURITY_HEADERS, 'content-type': 'application/octet-stream', 'x-audio-format': 'pcm_s16le', 'x-audio-sample-rate': '24000', 'x-audio-channels': '1' } });
    } catch (error) {
      const actual = abort.signal.aborted ? abort.signal.reason : error;
      const safe = actual instanceof VoiceError ? actual : new VoiceError(502, 'provider_error', 'OpenAI voice is unavailable. Text chat still works.');
      return json({ error: { code: safe.code, message: safe.message, ...(diagnostics ? { diagnostic_id: diagnostics.id } : {}) } }, safe.status);
    } finally { clearTimeout(timeout); request.signal.removeEventListener('abort', cancel); release(); }
  };
}
