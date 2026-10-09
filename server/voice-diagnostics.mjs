// Fixed labels and whitelisted scalar fields only. Never log provider objects,
// headers, URLs, credentials, transcripts, supplied text or audio payloads.
import { randomUUID } from 'node:crypto';
const STAGES = new Set(['accepted', 'connect', 'connected', 'configured', 'first_audio', 'commit', 'first_transcript', 'final_transcript', 'requested', 'audio_done', 'transcript_verified', 'verified', 'failed', 'closed']);
const CODES = new Set(['invalid_api_key', 'authentication_error', 'permission_denied', 'insufficient_quota', 'rate_limit_exceeded', 'model_not_found', 'invalid_request_error', 'invalid_value', 'unknown_parameter', 'unsupported_value', 'missing_required_parameter', 'server_error', 'provider_unavailable', 'provider_error', 'voice_disconnected', 'setup_timeout', 'session_limit', 'idle_limit', 'invalid_response', 'invalid_or_limited_input', 'voice_timeout', 'cancelled', 'readout_not_verified', 'readout_text_mismatch', 'readout_no_audio', 'readout_incomplete', 'readout_failed', 'voice_unavailable', 'origin_not_allowed', 'rate_limited', 'budget_exhausted', 'reply_not_allowed']);
export function safeVoiceCode(value, fallback = 'provider_error') {
  return typeof value === 'string' && CODES.has(value) ? value : fallback;
}
export function providerFailure(error, status) {
  const code = safeVoiceCode(error?.code, safeVoiceCode(error?.type));
  if (status === 401) return 'invalid_api_key';
  if (status === 403) return 'permission_denied';
  if (status === 429) return 'rate_limit_exceeded';
  return code;
}
export function createVoiceDiagnostics(scope, { env = process.env, sink = line => console.info(line), enabled = env.VOICE_DEBUG === 'true' } = {}) {
  const id = randomUUID(); let count = 0;
  const emit = (stage, data = {}) => {
    if (!enabled || count >= 64 || !STAGES.has(stage)) return;
    const safe = { scope: scope === 'input' ? 'input' : 'readout', id, stage };
    if (data.code !== undefined) safe.code = safeVoiceCode(data.code);
    for (const name of ['status', 'bytes', 'frames', 'commits', 'finals', 'duration_ms']) {
      if (Number.isSafeInteger(data[name]) && data[name] >= 0 && data[name] <= 1e9) safe[name] = data[name];
    }
    count++;
    try { sink(`[voice] ${JSON.stringify(safe)}`); } catch { /* diagnostics never control voice */ }
  };
  return { id, emit };
}
