// Server-only helpers. No environment value is serialized to clients or logs.
export class VoiceError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
export const SECURITY_HEADERS = { 'cache-control': 'no-store, max-age=0', 'x-content-type-options': 'nosniff', 'cross-origin-resource-policy': 'same-origin' };
export const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...SECURITY_HEADERS, 'content-type': 'application/json; charset=utf-8' } });
export function configuration(env) {
  const production = env.NODE_ENV === 'production' || Boolean(env.VERCEL);
  const origins = new Set((env.VOICE_ALLOWED_ORIGINS || '').split(',').filter(value => {
    try { const u = new URL(value.trim()); return u.origin === value.trim() && (production ? u.protocol === 'https:' : ['http:', 'https:'].includes(u.protocol)); } catch { return false; }
  }).map(value => value.trim()));
  return {
    production, origins,
    enabled: production ? env.VOICE_PROXY_ENABLED === 'true' && origins.size > 0 : env.VOICE_PROXY_ENABLED !== 'false',
    configured: /^[\x21-\x7E]+$/.test((env.OPENAI_API_KEY || '').trim()),
  };
}
export function checkOrigin(headers, config, statusOnly = false) {
  const origin = headers.get('origin');
  if (statusOnly && !origin) return;
  if (!origin || origin === 'null') throw new VoiceError(403, 'origin_not_allowed', 'Voice requests must come from this website.');
  if (config.origins.has(origin)) return;
  if (headers.get('sec-fetch-site') === 'cross-site') throw new VoiceError(403, 'origin_not_allowed', 'Voice requests must come from an allowed website.');
  if (!config.production && !config.origins.size) {
    try { const u = new URL(origin); if (u.origin === origin && u.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)) return; } catch { /* deny */ }
  }
  throw new VoiceError(403, 'origin_not_allowed', 'Voice requests must come from an allowed website.');
}
export async function readLimited(stream, maximum, signal) {
  if (!stream) return new Uint8Array();
  const reader = stream.getReader(), chunks = []; let total = 0;
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  try {
    if (signal.aborted) throw signal.reason;
    for (;;) {
      const { done, value } = await reader.read();
      if (signal.aborted) throw signal.reason;
      if (done) break;
      total += value.byteLength;
      if (total > maximum) { cancel(); throw new VoiceError(413, 'body_too_large', 'The voice request is too large.'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes;
  } finally { signal.removeEventListener('abort', cancel); reader.releaseLock(); }
}
// Per-process defense in depth. Origins are CSRF protection, NOT authentication.
// Put public installations behind user authentication and shared rate limits.
export function createUsageGuard({ perIpMinute = 12, globalMinute = 60, perIpConcurrent = 2, globalConcurrent = 6, hourlyUnits = 12000, ipEntries = 2048 } = {}, now = Date.now) {
  const ips = new Map(); let minute = -1, count = 0, active = 0, hour = -1, units = 0;
  const busy = () => { throw new VoiceError(429, 'rate_limited', 'Voice is busy. Please try again shortly.'); };
  return {
    enter(ip) {
      const m = Math.floor(now() / 60000);
      if (minute !== m) { minute = m; count = 0; }
      let entry = ips.get(ip);
      if (!entry) {
        if (ips.size >= ipEntries) for (const [key, value] of ips) if (!value.active && value.minute < m) ips.delete(key);
        if (ips.size >= ipEntries) busy();
        entry = { minute: m, count: 0, active: 0 }; ips.set(ip, entry);
      }
      if (entry.minute !== m) { entry.minute = m; entry.count = 0; }
      if (count >= globalMinute || entry.count >= perIpMinute || active >= globalConcurrent || entry.active >= perIpConcurrent) busy();
      count++; entry.count++; active++; entry.active++;
      let released = false;
      return () => { if (!released) { released = true; active--; entry.active--; } };
    },
    spend(amount) {
      const h = Math.floor(now() / 3600000);
      if (hour !== h) { hour = h; units = 0; }
      if (!Number.isFinite(amount) || amount < 0 || units + amount > hourlyUnits) throw new VoiceError(429, 'budget_exhausted', 'Voice has reached its usage limit. Please use text chat.');
      units += amount;
    },
  };
}
