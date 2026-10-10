const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function resolveEndpoints(backend, frontend) {
  const source = fs.readFileSync(path.join(__dirname, '../src/components/floating/voiceEndpoints.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, URL });
  return module.exports.resolveVoiceEndpoints(backend, frontend);
}

test('empty backend configuration preserves same-origin local voice', () => {
  const urls = resolveEndpoints('', 'http://127.0.0.1:5173');
  assert.equal(urls.status, '/api/voice/status');
  assert.equal(urls.speak, '/api/voice/speak');
  assert.equal(urls.realtime, 'ws://127.0.0.1:5173/api/voice/realtime');
});

test('ordinary HTTP website visits keep text chat available without endpoint errors', () => {
  const urls = resolveEndpoints('', 'http://brandmintai.io');
  assert.equal(urls.status, '/api/voice/status');
  assert.equal(urls.realtime, 'ws://brandmintai.io/api/voice/realtime');
  // The existing microphone support check requires a secure browser context.
});

test('configured Render origin routes both HTTP and WebSocket traffic to the backend', () => {
  const urls = resolveEndpoints('https://brandmint-voice.onrender.com/', 'https://staging.example.com');
  assert.equal(urls.status, 'https://brandmint-voice.onrender.com/api/voice/status');
  assert.equal(urls.speak, 'https://brandmint-voice.onrender.com/api/voice/speak');
  assert.equal(urls.realtime, 'wss://brandmint-voice.onrender.com/api/voice/realtime');
});

test('invalid backend destinations fail instead of silently sending voice elsewhere', () => {
  for (const value of ['http://remote.example', '//remote.example', 'https://remote.example/path', 'https://user:pass@remote.example', 'https://remote.example/?key=secret', 'https://remote.example/#fragment', 'file:///tmp/voice']) {
    assert.throws(() => resolveEndpoints(value, 'https://staging.example.com'));
  }
  const local = resolveEndpoints('http://127.0.0.1:8788', 'http://127.0.0.1:5173');
  assert.equal(local.realtime, 'ws://127.0.0.1:8788/api/voice/realtime');
});
