const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { createServer } = require('node:net');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { EventEmitter } = require('node:events');

async function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'brandmint-server-test-'));
  const dist = path.join(root, 'dist');
  mkdirSync(path.join(dist, 'small-business-automation-ideas'), { recursive: true });
  mkdirSync(path.join(dist, 'api'), { recursive: true });
  writeFileSync(path.join(dist, 'index.html'), '<div id="root">Homepage</div>');
  writeFileSync(path.join(dist, 'small-business-automation-ideas/index.html'), '<h1>Automation article</h1>');
  writeFileSync(path.join(dist, 'api/subscribe.php'), '<?php /* PHP source must never be served */ ?>');
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1'); await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, [path.join(__dirname, '../server/local.mjs')], {
    cwd: root,
    env: { ...process.env, NODE_ENV: 'development', OPENAI_API_KEY: '', VOICE_PORT: String(port), VOICE_HOST: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (child.exitCode === null) { const closed = once(child, 'exit'); child.kill(); await closed; }
    rmSync(root, { recursive: true, force: true });
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Built server did not start')), 10000);
    child.stdout.on('data', bytes => {
      if (bytes.toString().includes('BrandMint + OpenAI voice:')) { clearTimeout(timer); resolve(); }
    });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Built server exited: ${code}`)); });
  });
  return `http://127.0.0.1:${port}`;
}

test('built Node server serves the physical SEO article before SPA fallback', async t => {
  const base = await fixture(t);
  for (const url of ['/small-business-automation-ideas/', '/small-business-automation-ideas']) {
    const response = await fetch(base + url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(await response.text(), '<h1>Automation article</h1>');
  }
  const route = await fetch(base + '/contact');
  assert.equal(await route.text(), '<div id="root">Homepage</div>');
});

test('built Node server never exposes PHP source through encoded paths', async t => {
  const base = await fixture(t);
  for (const url of ['/api/subscribe.php', '/%61pi/subscribe.php', '/api%2fsubscribe.php']) {
    const response = await fetch(base + url);
    assert.equal(response.status, 404, url);
    assert.doesNotMatch(await response.text(), /PHP source must never be served/);
  }
  const status = await fetch(base + '/api/voice/status');
  assert.equal(status.status, 200);
  assert.equal((await status.json()).configured, false);
});

test('Vite integration serves the production SEO article and blocks PHP source', async t => {
  const { createServer } = require('node:http');
  const { readFileSync } = require('node:fs');
  const { voiceProxyPlugin } = await import('../server/vite-plugin.mjs');
  const root = path.join(__dirname, '..');
  let middleware;
  await voiceProxyPlugin().configureServer({
    config: { root, publicDir: path.join(root, 'public'), logger: { error() {} } },
    watcher: new EventEmitter(),
    middlewares: { use(callback) { middleware = callback; } },
  });
  const server = createServer((request, response) => middleware(request, response, () => {
    response.writeHead(404); response.end('No route');
  }));
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const url of ['/small-business-automation-ideas/', '/small-business-automation-ideas']) {
    const response = await fetch(base + url);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), readFileSync(path.join(root, 'public/small-business-automation-ideas/index.html'), 'utf8'));
  }
  for (const url of ['/api/subscribe.php', '/%61pi/subscribe.php', '/api%2fsubscribe.php']) {
    assert.equal((await fetch(base + url)).status, 404);
  }
});
