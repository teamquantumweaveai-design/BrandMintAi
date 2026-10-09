import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once, EventEmitter } from 'node:events';
import { WebSocket } from 'ws';
import { createNodeListener } from '../server/node-adapter.mjs';
import { attachRealtimeInput } from '../server/realtime-input.mjs';

async function listen(t, server, beforeClose = () => {}) {
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => { beforeClose(); server.closeAllConnections(); server.close(resolve); }));
  return server.address().port;
}

test('HTTP trusts a single forwarded IP only from an explicitly configured proxy', async t => {
  for (const trusted of ['', '192.0.2.200', '127.0.0.1', '::ffff:127.0.0.1']) {
    const server = createServer(createNodeListener((_request, context) => Response.json(context), {
      env: { VOICE_TRUSTED_PROXY_IPS: trusted },
    }));
    const port = await listen(t, server);
    for (const header of ['192.0.2.1', '2001:db8::1', '192.0.2.1, 192.0.2.2', 'malformed']) {
      const response = await fetch(`http://127.0.0.1:${port}/`, { headers: { 'x-forwarded-for': header } });
      const { ip } = await response.json();
      const shouldTrust = trusted.includes('127.0.0.1') && !header.includes(',') && header !== 'malformed';
      assert.equal(ip, shouldTrust ? header : '127.0.0.1', `${trusted}: ${header}`);
    }
  }
});

class ProviderFixture extends EventEmitter {
  readyState = 1;
  send() {}
  terminate() { this.readyState = 3; this.emit('close'); }
}

async function websocketFixture(t, trusted) {
  const server = createServer();
  const dispose = attachRealtimeInput(server, {
    env: { OPENAI_API_KEY: 'test-only-not-a-real-key', NODE_ENV: 'production', VOICE_PROXY_ENABLED: 'true', VOICE_ALLOWED_ORIGINS: 'https://brandmintai.io', VOICE_TRUSTED_PROXY_IPS: trusted },
    connect: () => new ProviderFixture(),
  });
  const port = await listen(t, server, dispose);
  return async address => {
    const client = new WebSocket(`ws://127.0.0.1:${port}/api/voice/realtime`, {
      origin: 'https://brandmintai.io', headers: { 'x-forwarded-for': address },
    });
    t.after(() => client.terminate());
    return new Promise(resolve => {
      client.once('open', () => resolve(101));
      client.once('unexpected-response', (_request, response) => { response.resume(); client.terminate(); resolve(response.statusCode); });
      client.on('error', () => {});
    });
  };
}

test('trusted proxy gives distinct voice clients separate limits but keeps same-IP limits', async t => {
  const connect = await websocketFixture(t, '127.0.0.1');
  assert.equal(await connect('192.0.2.1'), 101);
  assert.equal(await connect('192.0.2.2'), 101);
  assert.equal(await connect('192.0.2.1'), 429);
});

test('untrusted proxy cannot bypass voice limits with spoofed forwarded addresses', async t => {
  const connect = await websocketFixture(t, '192.0.2.200');
  assert.equal(await connect('192.0.2.1'), 101);
  assert.equal(await connect('192.0.2.2'), 429);
});
