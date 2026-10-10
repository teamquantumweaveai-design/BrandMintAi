import test from 'node:test';
import assert from 'node:assert/strict';
import { once, EventEmitter } from 'node:events';
import { spawn } from 'node:child_process';
import { createServer as createTcpServer } from 'node:net';
import { WebSocket } from 'ws';
import replies from '../server/generated-replies.mjs';

const origin = 'https://staging.example.com';
const environment = {
  NODE_ENV: 'production', VOICE_PROXY_ENABLED: 'true',
  VOICE_ALLOWED_ORIGINS: origin, OPENAI_API_KEY: 'fixture-only-not-a-real-key',
};
class Provider extends EventEmitter {
  readyState = 1;
  send() {}
  terminate() { this.readyState = 3; this.emit('close'); }
}

async function backend(t, options = {}) {
  const { createVoiceBackend } = await import('../server/backend.mjs');
  const app = createVoiceBackend({ env: environment, connect: () => new Provider(), ...options });
  app.server.listen(0, '127.0.0.1'); await once(app.server, 'listening');
  t.after(() => new Promise(resolve => app.close(resolve)));
  return `http://127.0.0.1:${app.server.address().port}`;
}

test('backend starts without dist and exposes a credential-free health check', async t => {
  const base = await backend(t);
  const response = await fetch(base + '/healthz');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { service: 'brandmint-openai-voice', status: 'ok' });
  for (const route of ['/', '/index.html', '/api/subscribe.php', '/.env.server.local']) {
    assert.equal((await fetch(base + route)).status, 404);
  }
});

test('allowed cross-site frontend can read voice status and exact-reply PCM headers', async t => {
  let renders = 0;
  const base = await backend(t, { renderImpl: async () => { renders++; return new Uint8Array([1, 2, 3, 4]); } });
  const headers = { origin, 'sec-fetch-site': 'cross-site' };
  const status = await fetch(base + '/api/voice/status', { headers });
  assert.equal(status.status, 200);
  assert.equal(status.headers.get('access-control-allow-origin'), origin);
  assert.equal(status.headers.get('vary'), 'Origin');
  const availability = await status.json();
  assert.equal(availability.configured, true);
  assert.equal(availability.realtime, true);
  const response = await fetch(base + '/api/voice/speak', {
    method: 'POST', headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify({ text: replies[0] }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
  assert.match(response.headers.get('access-control-expose-headers'), /x-audio-format/i);
  assert.equal(response.headers.get('x-audio-format'), 'pcm_s16le');
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [1, 2, 3, 4]);
  assert.equal(renders, 1);
});

test('JSON preflight accepts only configured origins, methods and headers', async t => {
  const base = await backend(t);
  const headers = { origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' };
  const response = await fetch(base + '/api/voice/speak', { method: 'OPTIONS', headers });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
  assert.equal(response.headers.get('access-control-allow-headers'), 'Content-Type');
  assert.equal(response.headers.get('access-control-allow-credentials'), null);
  for (const extra of [{ origin: 'https://untrusted.example' }, { origin: 'null' }, { 'access-control-request-method': 'DELETE' }, { 'access-control-request-headers': 'authorization' }]) {
    const denied = await fetch(base + '/api/voice/speak', { method: 'OPTIONS', headers: { ...headers, ...extra } });
    assert.ok(denied.status >= 400);
    if (extra.origin) assert.equal(denied.headers.get('access-control-allow-origin'), null);
  }
});

test('backend rejects untrusted POST requests before provider work', async t => {
  let renders = 0;
  const base = await backend(t, { renderImpl: async () => { renders++; return new Uint8Array([1, 2]); } });
  for (const originValue of ['https://untrusted.example', 'null', '']) {
    const response = await fetch(base + '/api/voice/speak', {
      method: 'POST', headers: { origin: originValue, 'content-type': 'application/json' },
      body: JSON.stringify({ text: replies[0] }),
    });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get('access-control-allow-origin'), null);
  }
  assert.equal(renders, 0);
});

test('backend accepts allowed cross-site WebSockets and rejects other origins', async t => {
  const base = await backend(t);
  async function connect(originValue, route = '/api/voice/realtime') {
    const socket = new WebSocket(base.replace('http:', 'ws:') + route, {
      origin: originValue, headers: { 'sec-fetch-site': 'cross-site' },
    });
    t.after(() => socket.terminate());
    return new Promise(resolve => {
      socket.once('open', () => resolve(101));
      socket.once('unexpected-response', (_request, response) => { response.resume(); socket.terminate(); resolve(response.statusCode); });
      socket.on('error', () => {});
    });
  }
  assert.equal(await connect(origin), 101);
  assert.equal(await connect('https://untrusted.example'), 403);
  assert.equal(await connect(origin, '/unknown'), 404);
});

test('missing credentials leave health available but voice unavailable without provider calls', async t => {
  let calls = 0;
  const base = await backend(t, { env: { ...environment, OPENAI_API_KEY: '' }, connect: () => { calls++; throw new Error('Unexpected provider call'); } });
  const status = await fetch(base + '/api/voice/status', { headers: { origin } });
  assert.equal((await status.json()).configured, false);
  const response = await fetch(base + '/api/voice/speak', {
    method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ text: replies[0] }),
  });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
  assert.equal(calls, 0);
});

test('Render startup honors PORT and shuts down cleanly on SIGTERM', { timeout: 7000 }, async t => {
  const reservation = createTcpServer();
  reservation.listen(0, '127.0.0.1'); await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['server/render.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, ...environment, OPENAI_API_KEY: '', PORT: String(port), VOICE_PORT: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const exited = once(child, 'exit');
  t.after(() => { if (child.exitCode === null) child.kill('SIGKILL'); });
  let logs = '';
  child.stdout.on('data', bytes => { logs += bytes; });
  child.stderr.on('data', bytes => { logs += bytes; });
  let response;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { response = await fetch(`http://127.0.0.1:${port}/healthz`, { signal: AbortSignal.timeout(500) }); break; }
    catch { await new Promise(resolve => setTimeout(resolve, 50)); }
  }
  assert.equal(response?.status, 200, 'Backend must listen on the supplied PORT');
  assert.deepEqual(await response.json(), { service: 'brandmint-openai-voice', status: 'ok' });
  assert.ok(!logs.includes(environment.OPENAI_API_KEY));
  child.kill('SIGTERM');
  assert.deepEqual(await exited, [0, null]);
});
