import { isIP } from 'node:net';

function normalize(value) {
  if (typeof value !== 'string') return '';
  let ip = value.trim().toLowerCase();
  if (ip.startsWith('::ffff:') && isIP(ip.slice(7)) === 4) ip = ip.slice(7);
  return isIP(ip) ? ip : '';
}

// Only trust a configured proxy peer and one validated address. The proxy must
// overwrite X-Forwarded-For with the client IP, never pass browser values through.
export function createClientIpResolver(env = {}) {
  const trusted = new Set((env.VOICE_TRUSTED_PROXY_IPS || '').split(',').map(normalize).filter(Boolean));
  return request => {
    const peer = normalize(request.socket.remoteAddress) || 'unknown';
    const forwarded = normalize(request.headers['x-forwarded-for']);
    return trusted.has(peer) && forwarded ? forwarded : peer;
  };
}
