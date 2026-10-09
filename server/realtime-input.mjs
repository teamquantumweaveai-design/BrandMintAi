import { WebSocket, WebSocketServer } from 'ws';
import { createVoiceDiagnostics, providerFailure, safeVoiceCode } from './voice-diagnostics.mjs';
import { VoiceError, configuration, checkOrigin, createUsageGuard } from './voice-security.mjs';
import { createClientIpResolver } from './client-ip.mjs';

export const INPUT_SESSION = Object.freeze({
  type: 'transcription',
  audio: { input: {
    format: { type: 'audio/pcm', rate: 24000 },
    noise_reduction: { type: 'near_field' },
    transcription: { model: 'gpt-live-transcribe' },
    // This model provides pre-commit transcripts, not server/semantic VAD.
    turn_detection: null,
  } },
});
export const INPUT_LIMITS = Object.freeze({ sessionMs: 600000, setupMs: 15000, idleMs: 180000, audioSeconds: 600, hourlyUnits: 900, perIpMinute: 6, globalMinute: 24, perIpConcurrent: 1, globalConcurrent: 4 });
const UPSTREAM = 'wss://api.openai.com/v1/realtime?intent=transcription';
const safeId = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,160}$/.test(value);

/** Reject every arbitrary control/model/instruction/message field from browsers.
 * The main key and the actual upstream connection remain owned by the server. */
export function bindInputSession(client, { key, connect = (url, options) => new WebSocket(url, options), guard, release = () => {}, limits = INPUT_LIMITS, now = Date.now, diagnostics = createVoiceDiagnostics('input') } = {}) {
  let upstream, ready = false, closed = false, totalBytes = 0, lastCommit = -Infinity, lastEvidence = now(), windowAt = now(), windowBytes = 0, lastCommittedBytes = 0;
  let setup, session, idle, frames = 0, commits = 0, finals = 0, hadTranscript = false;
  const began = now();
  diagnostics.emit('accepted');
  const send = event => { if (!closed && client.readyState === 1) client.send(JSON.stringify(event)); };
  const close = (code = 'voice_disconnected') => {
    if (closed) return;
    diagnostics.emit('closed', { code, bytes: totalBytes, frames, commits, finals, duration_ms: now() - began });
    send({ type: 'error', code: safeVoiceCode(code), diagnostic_id: diagnostics.id, message: 'OpenAI voice stopped. Tap the mic to retry, or use text chat.' });
    closed = true; clearTimeout(setup); clearTimeout(session); clearInterval(idle); release();
    try { upstream?.terminate(); } catch { /* already closed */ }
    try { client.close(1000, 'Voice session ended'); } catch { /* already closed */ }
  };
  client.on('close', () => close()); client.on('error', () => close());
  diagnostics.emit('connect');
  try { upstream = connect(UPSTREAM, { headers: { Authorization: `Bearer ${key}` }, followRedirects: false, maxPayload: 64 * 1024, handshakeTimeout: limits.setupMs }); }
  catch { close('provider_unavailable'); return close; }
  setup = setTimeout(() => close('setup_timeout'), limits.setupMs);
  session = setTimeout(() => close('session_limit'), limits.sessionMs);
  idle = setInterval(() => { if (now() - lastEvidence >= limits.idleMs) close('idle_limit'); }, 1000);
  setup.unref?.(); session.unref?.(); idle.unref?.();
  upstream.on('open', () => { diagnostics.emit('connected'); if (!closed) upstream.send(JSON.stringify({ type: 'session.update', session: INPUT_SESSION })); });
  upstream.on('unexpected-response', (_request, response) => {
    const code = providerFailure(undefined, response.statusCode);
    diagnostics.emit('failed', { code, status: response.statusCode });
    response.resume?.(); close(code);
  });
  upstream.on('error', () => close('provider_unavailable'));
  upstream.on('close', () => close());
  upstream.on('message', data => {
    if (closed) return;
    let event; try { event = JSON.parse(data.toString()); } catch { close('invalid_response'); return; }
    if (!event || typeof event !== 'object' || Array.isArray(event)) { close('invalid_response'); return; }
    if (event.type === 'session.updated' && !ready) { ready = true; clearTimeout(setup); diagnostics.emit('configured'); send({ type: 'ready' }); return; }
    if (event.type === 'error') { const code = providerFailure(event.error); diagnostics.emit('failed', { code }); close(code); return; }
    if (!ready) return;
    if (event.type === 'input_audio_buffer.committed' && safeId(event.item_id)) {
      send({ type: event.type, item_id: event.item_id, ...(safeId(event.previous_item_id) ? { previous_item_id: event.previous_item_id } : {}) }); return;
    }
    // Current delta schema permits an omitted index; this pipeline owns one audio part.
    if (event.type === 'conversation.item.input_audio_transcription.delta' && event.content_index === undefined) event.content_index = 0;
    if (!safeId(event.item_id) || !Number.isInteger(event.content_index) || event.content_index < 0 || event.content_index > 10) return;
    if (event.type === 'conversation.item.input_audio_transcription.delta' && typeof event.delta === 'string' && event.delta.length <= 4000) {
      if (/[\p{L}\p{N}]/u.test(event.delta)) lastEvidence = now();
      if (!hadTranscript) { hadTranscript = true; diagnostics.emit('first_transcript'); }
      send({ type: event.type, ...(safeId(event.event_id) ? { event_id: event.event_id } : {}), item_id: event.item_id, content_index: event.content_index, delta: event.delta });
    } else if (event.type === 'conversation.item.input_audio_transcription.completed' && typeof event.transcript === 'string' && event.transcript.length <= 4000) {
      finals++; diagnostics.emit('final_transcript', { finals });
      send({ type: event.type, ...(safeId(event.event_id) ? { event_id: event.event_id } : {}), item_id: event.item_id, content_index: event.content_index, transcript: event.transcript });
    } else if (event.type === 'conversation.item.input_audio_transcription.failed') {
      send({ type: event.type, item_id: event.item_id, content_index: event.content_index });
    }
  });
  client.on('message', (data, isBinary) => {
    if (closed || !ready) return;
    try {
      if (isBinary) {
        const bytes = Buffer.from(data);
        if (!bytes.length || bytes.length % 2 || bytes.length > 9600) throw new Error('invalid audio');
        const t = now(); if (t - windowAt >= 1000) { windowAt = t; windowBytes = 0; }
        windowBytes += bytes.length; totalBytes += bytes.length;
        // Allow scheduling jitter, but not arbitrary faster-than-real-time uploads.
        if (windowBytes > 144000 || totalBytes > limits.audioSeconds * 48000 || upstream.bufferedAmount > 128000) throw new Error('audio limit');
        guard?.spend(bytes.length / 48000);
        frames++; if (frames === 1) diagnostics.emit('first_audio', { bytes: bytes.length, frames });
        upstream.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: bytes.toString('base64') }));
      } else {
        const value = JSON.parse(data.toString());
        if (!value || value.type !== 'commit' || Object.keys(value).length !== 1) throw new Error('invalid control');
        if (now() - lastCommit < 250 || totalBytes - lastCommittedBytes < 4800) return;
        lastCommit = now(); lastCommittedBytes = totalBytes;
        commits++; diagnostics.emit('commit', { commits, bytes: totalBytes });
        upstream.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
      }
    } catch { close('invalid_or_limited_input'); }
  });
  return close;
}

export function attachRealtimeInput(server, { env = process.env, connect, limits = INPUT_LIMITS, now = Date.now } = {}) {
  const config = configuration(env), guard = createUsageGuard(limits, now);
  const clientIp = createClientIpResolver(env);
  const wss = new WebSocketServer({ noServer: true, maxPayload: 12 * 1024 });
  const onUpgrade = (request, socket, head) => {
    if (request.url?.split('?')[0] !== '/api/voice/realtime') return;
    let release;
    try {
      const headers = new Headers(); for (const [name, value] of Object.entries(request.headers)) if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
      checkOrigin(headers, config);
      if (!config.enabled || !config.configured) throw new VoiceError(503, 'voice_unavailable', 'Voice is not configured.');
      release = guard.enter(clientIp(request));
      wss.handleUpgrade(request, socket, head, client => bindInputSession(client, { key: env.OPENAI_API_KEY.trim(), connect, guard, release, limits, now, diagnostics: createVoiceDiagnostics('input', { env }) }));
    } catch (error) {
      release?.(); const status = error instanceof VoiceError ? error.status : 503;
      socket.end(`HTTP/1.1 ${status} Voice unavailable\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
    }
  };
  server.on('upgrade', onUpgrade);
  const dispose = () => { server.off('upgrade', onUpgrade); for (const client of wss.clients) client.terminate(); wss.close(); };
  server.once('close', dispose);
  return dispose;
}
