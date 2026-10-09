import { createVoiceHandler } from './voice-proxy.mjs';
import { attachRealtimeInput } from './realtime-input.mjs';
import { createNodeListener } from './node-adapter.mjs';
import { loadServerEnvironment } from './environment.mjs';
import { readReplies, replySource } from '../scripts/voice-replies.mjs';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export function voiceProxyPlugin() {
  return {
    name: 'brandmint-server-only-voice',
    async configureServer(server) {
      const replies = new Set(await readReplies());
      const env = loadServerEnvironment(server.config.root);
      const listener = createNodeListener(createVoiceHandler({ env, replies, realtimeAvailable: true }), { env });
      if (server.httpServer) attachRealtimeInput(server.httpServer, { env });
      const source = fileURLToPath(replySource);
      const refresh = async (file) => {
        if (file !== source) return;
        try {
          const next = await readReplies();
          replies.clear();
          for (const reply of next) replies.add(reply);
        } catch {
          replies.clear(); // Never keep a stale allowlist after an invalid edit.
          server.config.logger.error('Voice reply extraction failed. Text chat still works; check static reply structure.');
        }
      };
      server.watcher.on('change', refresh);
      server.httpServer?.once('close', () => server.watcher.off('change', refresh));
      server.middlewares.use(async (request, response, next) => {
        let pathname;
        try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
        catch { response.writeHead(400); response.end(); return; }
        // This backend executes voice only; PHP execution stays on Hostinger.
        if (/\.php$/i.test(pathname)) { response.writeHead(404); response.end(); return; }
        // Vite's SPA fallback does not resolve public directory index pages.
        if (['/small-business-automation-ideas', '/small-business-automation-ideas/'].includes(pathname)) {
          if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
          try {
            const html = await readFile(join(server.config.publicDir, 'small-business-automation-ideas/index.html'));
            response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
            response.end(request.method === 'HEAD' ? undefined : html);
          } catch { response.writeHead(404); response.end(); }
          return;
        }
        if (pathname.startsWith('/api/voice/')) void listener(request, response);
        else next();
      });
    },
  };
}
