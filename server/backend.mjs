import { createServer } from 'node:http';
import { createVoiceHandler } from './voice-proxy.mjs';
import { createNodeListener } from './node-adapter.mjs';
import { attachRealtimeInput } from './realtime-input.mjs';
import { configuration, checkOrigin, VoiceError, json } from './voice-security.mjs';
import replies from './generated-replies.mjs';

// Backend-only entry point: no static website, PHP files, or dist dependency.
export function createVoiceBackend({ env = process.env, connect, renderImpl } = {}) {
  const config = configuration(env);
  const voice = createVoiceHandler({ env, replies, connect, renderImpl, realtimeAvailable: true });
  const listener = createNodeListener(async (request, context) => {
    const path = new URL(request.url).pathname;
    if (path === '/healthz' && ['GET', 'HEAD'].includes(request.method)) {
      const response = json({ service: 'brandmint-openai-voice', status: 'ok' });
      return request.method === 'HEAD' ? new Response(null, { headers: response.headers }) : response;
    }
    if (!['/api/voice/status', '/api/voice/speak'].includes(path)) {
      return json({ error: { code: 'not_found', message: 'Endpoint not found.' } }, 404);
    }
    const origin = request.headers.get('origin');
    let response;
    try {
      checkOrigin(request.headers, config, path === '/api/voice/status' && request.method !== 'OPTIONS');
      if (request.method === 'OPTIONS') {
        const method = request.headers.get('access-control-request-method');
        const expected = path === '/api/voice/speak' ? 'POST' : 'GET';
        const headers = (request.headers.get('access-control-request-headers') || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
        if (method !== expected || headers.some(value => value !== 'content-type')) {
          throw new VoiceError(403, 'origin_not_allowed', 'This request is not allowed.');
        }
        response = new Response(null, { status: 204, headers: {
          'access-control-allow-methods': expected,
          'access-control-allow-headers': 'Content-Type',
          'access-control-max-age': '600',
          'cache-control': 'no-store',
        } });
      } else {
        response = await voice(request, context);
      }
    } catch (error) {
      const safe = error instanceof VoiceError ? error : new VoiceError(500, 'voice_error', 'Voice is unavailable.');
      return json({ error: { code: safe.code, message: safe.message } }, safe.status);
    }
    if (origin) {
      const headers = new Headers(response.headers);
      headers.set('access-control-allow-origin', origin);
      headers.set('vary', 'Origin');
      headers.set('access-control-expose-headers', 'X-Audio-Format, X-Audio-Sample-Rate, X-Audio-Channels');
      response = new Response(response.body, { status: response.status, headers });
    }
    return response;
  }, { env });
  const server = createServer(listener);
  const dispose = attachRealtimeInput(server, { env, connect });
  server.on('upgrade', (request, socket) => {
    if (request.url?.split('?')[0] !== '/api/voice/realtime') {
      socket.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
    }
  });
  server.requestTimeout = 35000;
  server.headersTimeout = 10000;
  return {
    server,
    close(callback) { dispose(); server.closeAllConnections(); server.close(callback); },
  };
}
