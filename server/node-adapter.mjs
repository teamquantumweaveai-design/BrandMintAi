import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createClientIpResolver } from './client-ip.mjs';

// Forwarded headers are ignored unless the socket peer is explicitly trusted.
export function createNodeListener(handler, { env = {} } = {}) {
  const clientIp = createClientIpResolver(env);
  return async function nodeListener(incoming, outgoing) {
    const controller = new AbortController();
    const disconnected = () => {
      if (!outgoing.writableFinished) controller.abort(new Error('Client disconnected.'));
    };
    incoming.once('aborted', disconnected);
    outgoing.once('close', disconnected);
    try {
      const headers = new Headers();
      for (const [name, value] of Object.entries(incoming.headers)) {
        if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
      }
      const init = { method: incoming.method, headers, signal: controller.signal };
      if (!['GET', 'HEAD'].includes(incoming.method || 'GET')) {
        init.body = Readable.toWeb(incoming);
        init.duplex = 'half';
      }
      const protocol = incoming.socket.encrypted ? 'https' : 'http';
      const request = new Request(`${protocol}://${incoming.headers.host || 'localhost'}${incoming.url}`, init);
      const response = await handler(request, { ip: clientIp(incoming) });
      if (controller.signal.aborted || outgoing.destroyed) {
        await response.body?.cancel();
        return;
      }
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) await pipeline(Readable.fromWeb(response.body), outgoing, { signal: controller.signal });
      else outgoing.end();
    } catch {
      // Never log credentials, recordings, text, or provider response bodies.
      if (!outgoing.headersSent && !outgoing.destroyed) {
        outgoing.writeHead(500, { 'content-type': 'application/json', 'cache-control': 'no-store' });
        outgoing.end(JSON.stringify({ error: { code: 'voice_error', message: 'Voice is unavailable. Please use text chat.' } }));
      } else if (!outgoing.destroyed) outgoing.destroy();
    } finally {
      incoming.removeListener('aborted', disconnected);
      outgoing.removeListener('close', disconnected);
    }
  };
}
