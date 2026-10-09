import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createVoiceHandler } from './voice-proxy.mjs';
import { createNodeListener } from './node-adapter.mjs';
import { attachRealtimeInput } from './realtime-input.mjs';
import { loadServerEnvironment } from './environment.mjs';
import replies from './generated-replies.mjs';

const env = loadServerEnvironment(), port = Number(env.VOICE_PORT || 8787);
const voice = createNodeListener(createVoiceHandler({ env, replies, realtimeAvailable: true }), { env });
const root = resolve('dist');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    // PHP remains on Hostinger/Apache. Node must never serve its source files.
    if (extname(pathname).toLowerCase() === '.php') { response.writeHead(404); response.end(); return; }
    if (pathname.startsWith('/api/')) { void voice(request, response); return; }
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
    if (pathname === '/voice-diagnostics.html' && (env.NODE_ENV === 'production' || env.VERCEL)) { response.writeHead(404); response.end(); return; }
    let file = resolve(root, '.' + pathname);
    if (!file.startsWith(root + sep) || pathname.split('/').some(part => part.startsWith('.'))) file = resolve(root, 'index.html');
    let body;
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      body = await readFile(file);
    }
    catch {
      if (extname(pathname) && !request.headers.accept?.includes('text/html')) throw new Error('Not found');
      file = resolve(root, 'index.html'); body = await readFile(file);
    }
    response.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream', 'x-content-type-options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(404, { 'content-type': 'text/plain' }); response.end('Build the website first with npm run build.'); }
});
attachRealtimeInput(server, { env });
server.requestTimeout = 35000; server.headersTimeout = 10000;
server.listen(port, env.VOICE_HOST || '127.0.0.1', () => {
  const host = env.VOICE_HOST || '127.0.0.1';
  console.log(`BrandMint + OpenAI voice: http://${host}:${port}`);
  console.log('Open that exact URL for the built website. Startup does not test your key, provider connection or audio.');
  console.log(`Local checks: http://${host}:${port}/api/voice/status and http://${host}:${port}/voice-diagnostics.html`);
  console.log('npm run dev already includes the voice backend; npm run preview is static-only.');
  console.log(`Safe stage diagnostics: ${env.VOICE_DEBUG === 'true' ? 'on' : 'off (set VOICE_DEBUG=true in .env.server.local and restart to enable)'}.`);
});
