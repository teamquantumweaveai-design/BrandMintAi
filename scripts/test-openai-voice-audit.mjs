// Independent audit regressions. All voice/provider fixtures are synthetic.
// No live microphone, paid OpenAI request, credentials, or deployment is used.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const sha256 = value => createHash('sha256').update(value).digest('hex');
// Footer, Navbar and newsletter use production main 3369efa as their baseline;
// the remaining hashes retain the imported voice audit baseline.
const unchangedSourceHashes = {
  "src/App.tsx": "d2429b796581c466d275fa9cfcaa2ca329e407931c6db057134874a0e137e0b8",
  "src/components/floating/ExitIntentModal.tsx": "a58403f09510e1a88dc74dbeffc788b4410f9696ce3e4d7f69710ace6cecf87d",
  "src/components/floating/FloatingButtons.tsx": "e579c0cbdd9db01d8e5cdc1613418b63870ab778cccccd7ba9a1f82103cda39a",
  "src/components/floating/WhatsAppButton.tsx": "2fd9f5be49c9427eb3b9edcb36291ae02249f28ce2985177b7c60893d1d16135",
  "src/components/floating/contactNavigation.ts": "57311878e1ed81638616c3fc1897485e21e33bd34690f0c46b4b8fd8120400a9",
  "src/components/floating/speechText.ts": "f38cf59e7ec608d55dc90d4569e844217cb2773b2f7d0ae9541998ddc956b661",
  "src/components/sections/CTA.tsx": "fff73ded9913fa4a6f86770e7062dd2ac22be5a8859535b7b7e630a9ff0fc7ee",
  "src/components/sections/FeatureGrid.tsx": "ac0da3a3c8a5f325b9a01f1e3d910089892f7dcae9fb7a5edb2ac00e2d0fa215",
  "src/components/sections/Footer.tsx": "39e3d996430fdf93f866e9f25cee55c2aba849a89ae62e89ef96dd80893f0ea6",
  "src/components/sections/Hero.tsx": "3ed13cd5b29ad5699c352f4ab382fc52c7107fa8cf2aeaa5867c4692eaf08e2a",
  "src/components/sections/LogoStrip.tsx": "676243dcf9c70aa49e6e7c6ab40084f5bb76bb2e2ba8c063789a069b1da7d1fb",
  "src/components/sections/Navbar.tsx": "7b5068c5b287f3f9fa28697233e2946245a4fd8c630d4caf95791d64d92c066c",
  "src/components/ui/GlowCard.tsx": "adc05705580fe1e26fa4352266c2b245fc11c1d5022f783076e4c3f84a93be9e",
  "src/components/ui/GradientBorder.tsx": "9c593b970377741f720468c8d11a888cc41630e76b3895ac8294b574d44fb9c5",
  "src/components/ui/GradientText.tsx": "404b99bbc1b0c2d6df3a70d1572ee4f55b91dd0e7630c97178d801919f287538",
  "src/lib/constants.ts": "f100cee9c0f2071260805f35caa8d809cf2e66c4118478322c910162e5d14b01",
  "src/lib/motion.ts": "607807971df230411cc63ef9c6b1e7b21f232107f26ce207955ba98b6ba5e097",
  "src/lib/newsletter.ts": "06a039310f214f8bd6892070eb489262fa6324ba4b6adb3f25a71553033e55a3",
  "src/lib/supabase.ts": "8feb2c779fe42fe91b7dbadf900474ddbf2fbdbae5bf622143e0a3043aa8a9ee",
  "src/lib/utils.ts": "d1f1e0d62cb8d8d1e04c26e14de842d8a151f75812d81b046c65b5d1fe8e4b27",
  "src/main.tsx": "17ff2974c378e3259af1cf1f1ec109dd5bbee4676d57a9c58fa301afc5686a1b",
  "src/pages/About.tsx": "2d4cbafeabe56ba8f3e5b2845413159293c6717c4a988ae01c0a32c608a521fd",
  "src/pages/Academy.tsx": "f87e2d61460aa0a8c9dc67ddd09f679586d092226a381c2232b67f6d55617249",
  "src/pages/AdminLeads.tsx": "3a558b8f174d65d00026ecc111d7ca33e678459296806e21a0d90c2a1b349e1d",
  "src/pages/BusinessGrowth.tsx": "c98a0c107cbdda1d009d317eee860ef4f967d35b413c5224cceb38743e6df692",
  "src/pages/Contact.tsx": "0c65e1c83a215885c3c31043b8e529e945f6c40643fc50e0f7b0674ade291a63",
  "src/pages/Home.tsx": "c4c4dfdea12d24c63cfbc70053d4923438bc7a7801d307d32ae463078c597639",
  "src/pages/QuantumWeave.tsx": "0d774284fdd3e1983f56371fb73539446aeb79f44898a0186321ab885cd7e926",
  "src/pages/Solutions.tsx": "89a3b721b3d59f3d542e5075e472809cc5d12a861ff4a13fdbc61cdc5138056e",
  "src/pages/Ventures.tsx": "8eb42bd0ead67cdfc432650f940b0ee017589ee206d191fa867bec8972f6cfc2",
  "src/styles/globals.css": "26ac03bd42f368a4496124af52cd12801245b75cae6bd9e18052274e7c6a57c4",
  "src/types/lead.ts": "f50e9534826bd981a7204784c36943e7021d82d8caf55c1e53f7dffd3a2919b8"
};
const modalHashes = {
  "DEFAULT_PROMPTS": "e18cd3dd2ee544d94d502da15da7e5bb912c49cf7ee7d2c51bf8e2380f24c00c",
  "KNOWLEDGE_RESPONSES": "74e6a93a8f27b5407ba2b5455ea36157f9362dc2b132bcc7054e5eae1c553330",
  "INITIAL_MESSAGE": "0f2bdda9470449b182f2c11a67dfd4d46baffcef53c1b9698894bbd8bcac8541",
  "handleSendMessage": "fec74af55eedb0ab343807e72f96843ccc034f5b91f7aacef68f2ecf1fb359d0",
  "handleClose": "170c92dcc89accbb98b007b0f2ce14960f778d944f65edb7bea4f47d37ed57a9",
  "handleResetChat": "a6abf53028a50a08fc39ca8d8a064df723faaddfbf9b106830d2f4a7f44b784b"
};

test('audit: original non-voice source and contact navigation stay byte-identical', () => {
  for (const [file, expected] of Object.entries(unchangedSourceHashes)) {
    assert.equal(sha256(read(file)), expected, file);
  }
});

test('audit: knowledge, matcher, reply text, typed-chat and reset/close behavior stay identical', () => {
  const source = read('src/components/floating/CustomAiAgentModal.tsx');
  const tree = ts.createSourceFile('modal.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = {}, classes = [];
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) in modalHashes) {
      found[node.name.getText(tree)] = sha256(node.getText(tree));
    }
    if (ts.isJsxAttribute(node) && node.name.getText(tree) === 'className') classes.push(node.getText(tree));
    ts.forEachChild(node, visit);
  };
  visit(tree);
  assert.deepEqual(found, modalHashes);
  assert.equal(sha256(JSON.stringify(classes)), '43f70de08a73d8c937a02989a69bd87254e91d1039fb54b64ce58448f234edd8', 'Existing UI class names');
});

function loadSource(relative, globals = {}, cache = new Map()) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: file,
  });
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports,
    require(name) {
      if (name.startsWith('.')) {
        const imported = path.resolve(path.dirname(file), name);
        return loadSource(fs.existsSync(imported) ? imported : `${imported}.ts`, globals, cache);
      }
      return require(name);
    },
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (...args) => clearTimeout(...args),
    Date, Error, DOMException, AbortController, Float32Array, ArrayBuffer, DataView,
    Uint8Array, Headers, Request, Response, ReadableStream, TextEncoder, TextDecoder,
    console, ...globals,
  }, { filename: file });
  return module.exports;
}
const flush = async () => { for (let i = 0; i < 30; i++) await Promise.resolve(); };
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

// Deliberately independent of provider SDKs: events below are hand-authored
// synthetic fixtures for state ownership and interruption policy, not audio QA.
function voiceFixture(t, options = {}) {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const sockets = [], states = [], submissions = [], playback = [], requests = [];
  let state, onFrame, onFailure, closes = 0, stops = 0;
  class Socket {
    readyState = 1;
    bufferedAmount = 0;
    onopen = null; onmessage = null; onerror = null; onclose = null;
    sent = [];
    send(data) { this.sent.push(typeof data === 'string' ? JSON.parse(data) : { binary: data }); }
    close() { this.readyState = 3; this.closed = true; if (options.synchronousClose) this.onclose?.({ code: 1000 }); }
    emit(data) { this.onmessage?.({ data: JSON.stringify(data) }); }
  }
  const { createBrowserVoice, ...exports } = loadSource('src/components/floating/browserVoice.ts', {
    btoa: value => Buffer.from(value, 'binary').toString('base64'),
  });
  const deps = {
    supported: options.supported !== false,
    fetchImpl: async (url, init = {}) => {
      requests.push({ url: String(url), init });
      if (options.fetchImpl) return options.fetchImpl(url, init);
      if (String(url).endsWith('/status')) return Response.json({ enabled: true, configured: options.configured !== false });
      return new Response(new Uint8Array([1, 2, 3, 4]), { headers: {
        'content-type': 'application/octet-stream', 'x-audio-format': 'pcm_s16le',
        'x-audio-sample-rate': '24000', 'x-audio-channels': '1',
      } });
    },
    createSocket: () => { const s = new Socket(); sockets.push(s); return s; },
    openAudio: async (frame, failure, signal, ready) => {
      onFrame = frame; onFailure = failure;
      if (ready) await ready;
      if (options.openAudio) return options.openAudio(frame, failure, signal, ready);
      return {
        warning: '',
        close() { closes++; },
        stopPlayback() { stops++; },
        play(body, turnSignal, onPlaying) {
          const result = deferred();
          playback.push({ body, signal: turnSignal, result });
          onPlaying();
          turnSignal.addEventListener('abort', () => result.reject(new DOMException('Aborted', 'AbortError')), { once: true });
          return result.promise;
        },
      };
    },
  };
  const controller = createBrowserVoice(next => { state = next; states.push(next); },
    (text, speak, signal) => submissions.push({ text, speak, signal }), deps);
  t.after(() => controller.dispose());
  return {
    controller, deps, exports, sockets, states, submissions, playback, requests,
    get state() { return state; }, get socket() { return sockets.at(-1); },
    get closes() { return closes; }, get stops() { return stops; },
    frame(value = 0, count = 1) { for (let i = 0; i < count; i++) onFrame?.(new Float32Array(480).fill(value)); },
    failure(message) { onFailure?.(message); },
    async tick(ms = 200) { t.mock.timers.tick(ms); await flush(); },
    async start() {
      const start = controller.start(); await flush();
      const socket = sockets.at(-1);
      if (socket) { socket.onopen?.(); socket.emit({ type: 'ready' }); }
      await flush(); await start; await flush();
    },
    delta(id, text, eventId) { sockets.at(-1).emit({ type: 'conversation.item.input_audio_transcription.delta', item_id: id, content_index: 0, delta: text, ...(eventId ? { event_id: eventId } : {}) }); },
    committed(id, previous = null) { sockets.at(-1).emit({ type: 'input_audio_buffer.committed', item_id: id, previous_item_id: previous }); },
    completed(id, text, eventId) { sockets.at(-1).emit({ type: 'conversation.item.input_audio_transcription.completed', item_id: id, content_index: 0, transcript: text, ...(eventId ? { event_id: eventId } : {}) }); },
  };
}
async function beginAnswer(f, id = 'item-first', text = 'services') {
  f.committed(id);
  f.completed(id, text);
  await f.tick(500);
  assert.ok(f.submissions.length > 0, 'final transcript reaches existing answer callback');
  f.submissions.at(-1).speak('Approved exact existing reply.');
  await flush();
  assert.equal(f.state.status, 'speaking');
  return f.playback.at(-1);
}

import { EventEmitter } from 'node:events';
import { configuration, checkOrigin, createUsageGuard } from '../server/voice-security.mjs';
import { bindInputSession, INPUT_SESSION, INPUT_LIMITS } from '../server/realtime-input.mjs';

class AuditSocket extends EventEmitter {
  readyState = 1;
  bufferedAmount = 0;
  sent = [];
  send(value) { this.sent.push(JSON.parse(value)); }
  close() { this.closed = true; this.readyState = 3; this.emit('close'); }
  terminate() { this.terminated = true; this.close(); }
  serverEvent(value) { this.emit('message', Buffer.from(JSON.stringify(value)), false); }
}
function inputFixture(t, options = {}) {
  const client = new AuditSocket(), upstream = new AuditSocket(), connections = [], spent = [];
  let releases = 0, time = 1000;
  const close = bindInputSession(client, {
    key: 'audit-fake-main-key-not-real', connect: (url, init) => { connections.push({ url, init }); return upstream; },
    guard: { spend(value) { spent.push(value); if (options.budgetError) throw new Error('limit'); } },
    release() { releases++; }, now: () => time,
    ...options,
  });
  t.after(() => close());
  upstream.emit('open');
  return {
    client, upstream, close, connections, spent,
    get releases() { return releases; },
    advance(ms) { time += ms; },
    ready() { upstream.serverEvent({ type: 'session.updated', session: INPUT_SESSION }); },
    audio(bytes = 960) { client.emit('message', Buffer.alloc(bytes), true); },
    control(value) { client.emit('message', Buffer.from(JSON.stringify(value)), false); },
  };
}

test('audit: production enablement and exact origins fail closed', () => {
  const env = { OPENAI_API_KEY: 'fake-key-for-test', NODE_ENV: 'production' };
  for (const value of ['', '*', 'https://brand.example/path', 'https://user:pass@brand.example', 'http://brand.example', 'null']) {
    const config = configuration({ ...env, VOICE_PROXY_ENABLED: 'true', VOICE_ALLOWED_ORIGINS: value });
    assert.equal(config.enabled, false, value);
  }
  const config = configuration({ ...env, VOICE_PROXY_ENABLED: 'true', VOICE_ALLOWED_ORIGINS: 'https://brand.example' });
  assert.equal(config.enabled, true);
  for (const value of ['', 'null', 'https://evil.example', 'https://brand.example.evil.test', 'https://brand.example/']) {
    assert.throws(() => checkOrigin(new Headers(value ? { origin: value } : {}), config), { status: 403 });
  }
  assert.doesNotThrow(() => checkOrigin(new Headers({ origin: 'https://brand.example', 'sec-fetch-site': 'cross-site' }), config));
  assert.throws(() => checkOrigin(new Headers({ origin: 'https://evil.example', 'sec-fetch-site': 'cross-site' }), config), { status: 403 });
  assert.doesNotThrow(() => checkOrigin(new Headers({ origin: 'https://brand.example' }), config));
  assert.equal(configuration({}).configured, false);
  assert.equal(configuration({ OPENAI_API_KEY: 'fake\nkey' }).configured, false);
});

test('audit: usage guard caps concurrent/minute/hourly work and release is idempotent', () => {
  let now = 1000;
  const guard = createUsageGuard({ perIpConcurrent: 1, globalConcurrent: 2, perIpMinute: 2, globalMinute: 3, hourlyUnits: 2, ipEntries: 2 }, () => now);
  const releaseA = guard.enter('A');
  assert.throws(() => guard.enter('A'), { status: 429 });
  const releaseB = guard.enter('B');
  assert.throws(() => guard.enter('C'), { status: 429 });
  releaseA(); releaseA();
  const releaseA2 = guard.enter('A'); releaseA2();
  assert.throws(() => guard.enter('A'), { status: 429 });
  guard.spend(1.5); assert.throws(() => guard.spend(0.6), { code: 'budget_exhausted' });
  assert.throws(() => guard.spend(Infinity), { code: 'budget_exhausted' });
  assert.throws(() => guard.spend(-1), { code: 'budget_exhausted' });
  releaseB(); now = 3601000;
  assert.doesNotThrow(() => { guard.spend(2); guard.enter('C')(); });
});

test('audit: input uses fixed OpenAI URL and server-only auth with transcription-only session', t => {
  const f = inputFixture(t); f.ready();
  assert.equal(f.connections[0].url, 'wss://api.openai.com/v1/realtime?intent=transcription');
  assert.equal(f.connections[0].init.followRedirects, false);
  assert.equal(f.connections[0].init.headers.Authorization, 'Bearer audit-fake-main-key-not-real');
  const config = f.upstream.sent[0];
  assert.equal(config.type, 'session.update');
  assert.equal(config.session.type, 'transcription');
  assert.equal(config.session.audio.input.transcription.model, 'gpt-live-transcribe');
  assert.equal(config.session.audio.input.turn_detection, null);
  assert.deepEqual(config.session.audio.input.format, { type: 'audio/pcm', rate: 24000 });
  assert.equal(JSON.stringify(f.client.sent).includes('audit-fake-main-key-not-real'), false);
  f.audio();
  const append = f.upstream.sent.at(-1);
  assert.equal(append.type, 'input_audio_buffer.append');
  assert.equal(Buffer.from(append.audio, 'base64').length, 960);
  assert.equal(f.spent[0], 0.02);
});

test('audit: input rejects arbitrary controls, model settings, URLs and text', t => {
  const payloads = [
    { type: 'session.update', session: { model: 'arbitrary', instructions: 'external content' } },
    { type: 'response.create' }, { type: 'commit', url: 'http://127.0.0.1/' },
    { type: 'input_audio_buffer.append', audio: 'AAAA' }, { type: 'commit', text: 'external content' },
    null, [], 'commit',
  ];
  for (const payload of payloads) {
    const f = inputFixture(t); f.ready(); const before = f.upstream.sent.length;
    f.control(payload);
    assert.equal(f.upstream.sent.length, before);
    assert.equal(f.client.closed, true);
    assert.equal(f.releases, 1);
  }
});

test('audit: input caps odd/oversized audio, backlog and paid audio budget', t => {
  for (const bytes of [0, 1, 9601, 12000]) {
    const f = inputFixture(t); f.ready(); f.audio(bytes);
    assert.equal(f.client.closed, true, `bytes=${bytes}`);
    assert.equal(f.spent.length, 0);
  }
  const backlog = inputFixture(t); backlog.ready(); backlog.upstream.bufferedAmount = 128001; backlog.audio();
  assert.equal(backlog.client.closed, true);
  const budget = inputFixture(t, { budgetError: true }); budget.ready(); budget.audio();
  assert.equal(budget.client.closed, true);
  assert.equal(budget.upstream.sent.length, 1);
});

test('audit: commit requires 100ms PCM, is debounced, and cannot forward other provider events', t => {
  const f = inputFixture(t); f.ready(); f.control({ type: 'commit' });
  assert.equal(f.upstream.sent.length, 1);
  f.audio(4800); f.control({ type: 'commit' });
  assert.equal(f.upstream.sent.at(-1).type, 'input_audio_buffer.commit');
  const count = f.upstream.sent.length; f.control({ type: 'commit' });
  assert.equal(f.upstream.sent.length, count);
  const before = f.client.sent.length;
  f.upstream.serverEvent({ type: 'response.output_audio.delta', delta: 'arbitrary' });
  f.upstream.serverEvent({ type: 'conversation.item.input_audio_transcription.delta', item_id: '../bad', content_index: 0, delta: 'secret' });
  assert.equal(f.client.sent.length, before);
});

test('audit: provider errors and malformed input fail closed without raw message/key leakage', t => {
  const f = inputFixture(t); f.ready();
  f.upstream.serverEvent({ type: 'error', error: { message: 'audit-fake-main-key-not-real private upstream body', code: 'internal detail' } });
  assert.equal(f.client.closed, true);
  const output = JSON.stringify(f.client.sent);
  assert.doesNotMatch(output, /audit-fake-main-key-not-real|private upstream body|internal detail/);
  f.close(); assert.equal(f.releases, 1);
  const malformed = inputFixture(t); malformed.ready();
  assert.doesNotThrow(() => malformed.upstream.serverEvent(null));
  assert.equal(malformed.client.closed, true);
});

test('audit: input session and setup deadlines are enforced by server-owned timers', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
  const pending = inputFixture(t, { limits: { ...INPUT_LIMITS, setupMs: 500, sessionMs: 2000, idleMs: 999999 } });
  t.mock.timers.tick(500);
  assert.equal(pending.client.closed, true);
  assert.equal(pending.client.sent.at(-1).code, 'setup_timeout');
  const live = inputFixture(t, { limits: { ...INPUT_LIMITS, setupMs: 500, sessionMs: 2000, idleMs: 999999 } });
  live.ready(); t.mock.timers.tick(1999); assert.equal(live.client.closed, undefined);
  t.mock.timers.tick(1); assert.equal(live.client.closed, true);
  assert.equal(live.client.sent.at(-1).code, 'session_limit');
  assert.equal(live.releases, 1);
});

test('audit: idle deadline and total audio duration are bounded independently of client claims', t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
  const idle = inputFixture(t, { limits: { ...INPUT_LIMITS, idleMs: 1000 } });
  idle.ready(); idle.advance(1000); t.mock.timers.tick(1000);
  assert.equal(idle.client.closed, true);
  assert.equal(idle.client.sent.at(-1).code, 'idle_limit');
  const duration = inputFixture(t, { limits: { ...INPUT_LIMITS, audioSeconds: 0.02 } });
  duration.ready(); duration.audio(); assert.equal(duration.client.closed, undefined);
  duration.advance(1000); duration.audio(); assert.equal(duration.client.closed, true);
  assert.equal(duration.spent.length, 1);
});

test('audit: input packets before provider readiness and all packets after close are discarded', t => {
  const f = inputFixture(t);
  f.audio(); f.control({ type: 'commit' });
  assert.equal(f.upstream.sent.length, 1);
  f.ready(); f.close();
  const upstream = f.upstream.sent.length, client = f.client.sent.length;
  f.audio(); f.upstream.serverEvent({ type: 'conversation.item.input_audio_transcription.completed', item_id: 'item_late', content_index: 0, transcript: 'stale speech' });
  assert.equal(f.upstream.sent.length, upstream);
  assert.equal(f.client.sent.length, client);
  assert.equal(f.releases, 1);
});

test('audit: short noise, sustained amplitude and speech-start events alone never cancel playback', async t => {
  const f = voiceFixture(t); await f.start();
  const playing = await beginAnswer(f), stops = f.stops;
  f.frame(0.8, 3); f.frame(0, 40); await f.tick(500);
  assert.equal(f.state.status, 'speaking'); assert.equal(playing.signal.aborted, false);
  f.frame(0.8, 20); f.frame(0, 40); await f.tick(500);
  f.socket.emit({ type: 'input_audio_buffer.speech_started', item_id: 'noise-item', audio_start_ms: 0 });
  await f.tick(1000);
  assert.equal(f.state.status, 'speaking'); assert.equal(playing.signal.aborted, false);
  assert.equal(f.stops, stops);
  assert.equal(f.submissions.length, 1);
});

test('audit: empty/punctuation/non-speech labels do not interrupt', async t => {
  const f = voiceFixture(t); await f.start(); const playing = await beginAnswer(f);
  for (const [index, text] of ['', '...', '[noise]', '(cough)', '<silence>', '[music] !!!'].entries()) {
    f.completed(`noise-${index}`, text); await f.tick(500);
  }
  assert.equal(f.state.status, 'speaking'); assert.equal(playing.signal.aborted, false);
  assert.equal(f.submissions.length, 1);
});

test('audit: lexical evidence waits for debounce, then interrupts and only a final submits', async t => {
  const f = voiceFixture(t); await f.start(); const playing = await beginAnswer(f);
  f.delta('actual-user-2', 'stop', 'event-delta-2');
  await f.tick(f.exports.CONFIRM_SPEECH_MS - 1);
  assert.equal(playing.signal.aborted, false);
  await f.tick(1); assert.equal(playing.signal.aborted, true);
  assert.equal(f.submissions.length, 1);
  f.completed('actual-user-2', 'stop and explain pricing', 'event-final-2'); await flush();
  assert.equal(f.submissions.length, 2);
  assert.equal(f.submissions.at(-1).text, 'stop and explain pricing');
  assert.equal(f.state.status, 'processing');
});

test('audit: early lexical guess retracted to non-speech before confirmation does not cancel', async t => {
  const f = voiceFixture(t); await f.start(); const playing = await beginAnswer(f);
  f.delta('retracted', 'hmm'); await f.tick(50);
  f.completed('retracted', '[noise]'); await f.tick(1000);
  assert.equal(playing.signal.aborted, false);
  assert.equal(f.state.status, 'speaking'); assert.equal(f.submissions.length, 1);
});

test('audit: repeated transcript-confirmed interruptions invalidate each prior callback and output', async t => {
  const f = voiceFixture(t); await f.start();
  let previous = await beginAnswer(f);
  for (let n = 2; n <= 5; n++) {
    const priorSubmission = f.submissions.at(-1);
    f.delta(`repeat-${n}`, 'tell me pricing', `repeat-delta-${n}`); await f.tick(180);
    assert.equal(previous.signal.aborted, true);
    assert.equal(priorSubmission.signal.aborted, true);
    f.completed(`repeat-${n}`, `tell me pricing ${n}`, `repeat-final-${n}`); await flush();
    const count = f.playback.length;
    priorSubmission.speak('Stale old reply must never play.'); await flush(); assert.equal(f.playback.length, count);
    f.submissions.at(-1).speak('Approved exact existing reply.'); await flush();
    previous = f.playback.at(-1); assert.equal(f.state.status, 'speaking');
  }
  assert.equal(f.submissions.length, 5);
});

test('audit: duplicate final/delta IDs cannot repeat submission or interrupt current answer', async t => {
  const f = voiceFixture(t); await f.start(); const playing = await beginAnswer(f);
  f.completed('item-first', 'services'); f.delta('item-first', 'services'); await f.tick(500);
  assert.equal(f.submissions.length, 1); assert.equal(playing.signal.aborted, false);
  f.delta('new-turn', 'price', 'stable-event'); f.delta('new-turn', 'price', 'stable-event');
  await f.tick(180); f.completed('new-turn', 'price'); await flush();
  assert.equal(f.submissions.at(-1).text, 'price');
  f.submissions.at(-1).speak('Approved exact existing reply.'); await flush();
  const nextPlaying = f.playback.at(-1);
  f.delta('other-unseen-turn', 'unexpected', 'stable-event'); await f.tick(500);
  assert.equal(nextPlaying.signal.aborted, false);
});

test('audit: older committed item finishing out of order cannot cancel a newer answer', async t => {
  const f = voiceFixture(t); await f.start();
  f.committed('older-delayed'); f.committed('newer-ready', 'older-delayed');
  f.completed('newer-ready', 'newer current question'); await f.tick(500);
  f.submissions.at(-1).speak('Approved exact existing reply.'); await flush();
  const playing = f.playback.at(-1);
  f.completed('older-delayed', 'old delayed question'); await f.tick(500);
  assert.equal(playing.signal.aborted, false, 'late old final must not steal current turn');
  assert.equal(f.submissions.length, 1);
});

test('audit: stop/restart rejects old socket events and old answer callbacks', async t => {
  const f = voiceFixture(t, { synchronousClose: true }); await f.start();
  const playing = await beginAnswer(f), oldSocket = f.socket, oldHandler = oldSocket.onmessage, oldSubmission = f.submissions[0];
  f.controller.stop(); assert.equal(playing.signal.aborted, true); assert.equal(oldSocket.closed, true); assert.equal(f.state.status, 'idle');
  await f.start();
  oldHandler?.({ data: JSON.stringify({ type: 'conversation.item.input_audio_transcription.completed', item_id: 'stale-item', content_index: 0, transcript: 'stale old words' }) });
  oldSubmission.speak('Stale reply'); await f.tick(1000);
  assert.equal(f.state.status, 'listening'); assert.equal(f.submissions.length, 1); assert.equal(f.playback.length, 1);
});

test('audit: missing server key fails before a socket or microphone session becomes active', async t => {
  let opened = 0;
  const f = voiceFixture(t, { configured: false, openAudio: async () => { opened++; throw new Error('should not run after failed readiness'); } });
  await f.start();
  assert.equal(f.state.status, 'idle'); assert.equal(f.socket, undefined); assert.equal(opened, 0);
  assert.equal(f.playback.length, 0); assert.match(f.state.message, /not configured|unavailable/i);
});

test('audit: shipped frontend has no provider credential configuration or alternate voice provider', () => {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
  const files = walk(path.join(root, 'src'));
  for (const file of files) {
    if (!/\.(?:ts|tsx|js|jsx)$/.test(file)) continue;
    assert.doesNotMatch(fs.readFileSync(file, 'utf8'), /OPENAI_API_KEY|ELEVENLABS_|SpeechSynthesisUtterance|speechSynthesis|webkitSpeechRecognition|api\.openai\.com/i, path.relative(root, file));
  }
  assert.match(read('.gitignore'), /^\.env\*/m, 'all local secret files excluded from Git');
});

import { renderOpenAiReadout, READOUT_MODEL, READOUT_LIMITS, normalizeReadoutText } from '../server/realtime-readout.mjs';
import { createVoiceHandler, LIMITS as HTTP_LIMITS } from '../server/voice-proxy.mjs';
import { readReplies } from './voice-replies.mjs';
import { sanitizeSpeechText } from '../server/generated-speech-text.mjs';
import { prepareReadoutText } from '../server/readout-text.mjs';

function readoutFixture(t, options = {}) {
  const socket = new AuditSocket(), connections = [], abort = new AbortController();
  const text = options.text || 'Existing approved answer, with +91 99729 65677. Do not change it.';
  let resolved = false;
  const result = renderOpenAiReadout(text, {
    key: 'audit-fake-main-key-not-real', signal: abort.signal,
    connect: (url, init) => { connections.push({ url, init }); return socket; }, ...options,
  });
  result.then(() => { resolved = true; }, () => {});
  t.after(() => abort.abort());
  const ref = { response_id: 'response_verified', item_id: 'item_verified', output_index: 0, content_index: 0 };
  return {
    socket, connections, abort, result, text, ref,
    get resolved() { return resolved; },
    ready() {
      socket.emit('open'); socket.serverEvent({ type: 'session.updated' });
      socket.serverEvent({ type: 'response.created', response: { id: ref.response_id, status: 'in_progress' } });
      socket.serverEvent({ type: 'response.output_item.added', response_id: ref.response_id, output_index: 0, item: { id: ref.item_id, type: 'message', role: 'assistant', status: 'in_progress', content: [] } });
    },
    emit(type, extra = {}) { socket.serverEvent({ type, ...ref, ...extra }); },
    audio(bytes = new Uint8Array([1, 2, 3, 4]), extra = {}) { this.emit('response.output_audio.delta', { delta: Buffer.from(bytes).toString('base64'), ...extra }); },
    completed(transcript = text, status = 'completed', extra = {}) {
      socket.serverEvent({ type: 'response.done', response: {
        id: ref.response_id, status, output: [{ id: ref.item_id, type: 'message', role: 'assistant', status: 'completed', content: [{ type: options.finalContentType || 'output_audio', transcript }] }], ...extra,
      } });
    },
    finish(transcript = text, status = 'completed') {
      this.audio(); this.emit('response.output_audio.done'); this.emit('response.output_audio_transcript.done', { transcript }); this.completed(transcript, status);
    },
  };
}

test('audit: readout has fixed model/server-only key, no conversation/history/tools and no early audio release', async t => {
  const f = readoutFixture(t); f.ready();
  assert.equal(f.connections[0].url, `wss://api.openai.com/v1/realtime?model=${READOUT_MODEL}`);
  assert.equal(READOUT_MODEL, 'gpt-realtime-2.1-mini');
  assert.equal(f.connections[0].init.followRedirects, false);
  assert.equal(f.connections[0].init.headers.Authorization, 'Bearer audit-fake-main-key-not-real');
  const session = f.socket.sent[0].session, response = f.socket.sent[1].response;
  assert.equal(session.type, 'realtime'); assert.equal(session.model, READOUT_MODEL);
  assert.equal(session.audio.input.turn_detection, null);
  assert.deepEqual(session.audio.output.format, { type: 'audio/pcm', rate: 24000 });
  assert.equal(response.conversation, 'none'); assert.deepEqual(response.input, []);
  assert.deepEqual(response.tools, []); assert.equal(response.tool_choice, 'none');
  assert.deepEqual(response.output_modalities, ['audio']);
  assert.ok(response.instructions.endsWith(f.text));
  assert.doesNotMatch(JSON.stringify(f.socket.sent), /audit-fake-main-key-not-real/);
  f.audio(); await flush(); assert.equal(f.resolved, false);
  f.emit('response.output_audio.done'); f.emit('response.output_audio_transcript.done', { transcript: f.text });
  await flush(); assert.equal(f.resolved, false, 'done markers are not response success');
  f.completed(); assert.deepEqual(await f.result, new Uint8Array([1, 2, 3, 4]));
  assert.equal(f.socket.terminated, true);
});

test('audit: readout rejects changed numbers, signs, negations and paraphrases', async t => {
  for (const text of ['Existing approved answer, with +91 99729 65678. Do not change it.', 'Existing approved answer, with -91 99729 65677. Do not change it.', 'Existing approved answer, with +91 99729 65677. Do change it.', 'A paraphrased response.']) {
    const f = readoutFixture(t); f.ready(); f.audio();
    f.emit('response.output_audio_transcript.done', { transcript: text });
    await assert.rejects(f.result, { code: 'readout_text_mismatch' }); assert.equal(f.resolved, false);
  }
  assert.notEqual(normalizeReadoutText('It costs 1,500.'), normalizeReadoutText('It costs 150.'));
  assert.notEqual(normalizeReadoutText('It is not free'), normalizeReadoutText('It is free'));
});

test('audit: cancelled/incomplete/failed readout never returns audio even with matching transcript', async t => {
  for (const status of ['cancelled', 'incomplete', 'failed', 'in_progress']) {
    const f = readoutFixture(t); f.ready(); f.finish(f.text, status);
    await assert.rejects(f.result, { code: status === 'failed' ? 'provider_error' : 'readout_incomplete' });
  }
});

test('audit: response/item/content identity mismatches and unexpected tool/text content fail closed', async t => {
  for (const change of [{ response_id: 'wrong_response' }, { item_id: 'wrong_item' }, { output_index: 1 }, { content_index: 1 }]) {
    const f = readoutFixture(t); f.ready(); f.audio(new Uint8Array([1, 2]), change);
    await assert.rejects(f.result, { code: 'readout_not_verified' });
  }
  for (const type of ['response.function_call_arguments.delta', 'response.output_text.delta']) {
    const f = readoutFixture(t); f.ready(); f.emit(type, { delta: 'unwanted content' });
    await assert.rejects(f.result, { code: 'readout_not_verified' });
  }
  const part = readoutFixture(t); part.ready(); part.emit('response.content_part.added', { part: { type: 'text', text: 'unwanted' } });
  await assert.rejects(part.result, { code: 'readout_not_verified' });
});

test('audit: final response must identify exactly the verified single audio item and transcript', async t => {
  for (const extra of [
    { id: 'stale-response' }, { output: [] },
    { output: [{ id: 'wrong-item', type: 'message', role: 'assistant', content: [{ type: 'audio', transcript: 'wrong' }] }] },
    { output: [{ id: 'item_verified', type: 'message', role: 'assistant', content: [{ type: 'audio', transcript: 'wrong text' }] }] },
    { output: [{ id: 'item_verified', type: 'function_call', name: 'unwanted_tool', arguments: '{}' }] },
  ]) {
    const f = readoutFixture(t); f.ready(); f.audio(); f.emit('response.output_audio.done'); f.emit('response.output_audio_transcript.done', { transcript: f.text });
    f.completed(f.text, 'completed', extra); await assert.rejects(f.result, { code: 'readout_not_verified' });
  }
});

test('audit: absent/odd/oversized PCM and absent transcript/audio completion never pass readout', async t => {
  for (const option of ['no-audio', 'odd-audio', 'no-transcript', 'no-audio-done']) {
    const f = readoutFixture(t); f.ready();
    if (option !== 'no-audio') f.audio(option === 'odd-audio' ? new Uint8Array([1]) : new Uint8Array([1, 2]));
    if (option !== 'no-audio-done') f.emit('response.output_audio.done');
    if (option !== 'no-transcript') f.emit('response.output_audio_transcript.done', { transcript: f.text });
    f.completed(); await assert.rejects(f.result, { code: option === 'no-audio' ? 'readout_no_audio' : 'readout_not_verified' });
  }
  const over = readoutFixture(t, { limits: { ...READOUT_LIMITS, outputBytes: 2 } }); over.ready(); over.audio();
  await assert.rejects(over.result, { code: 'readout_not_verified' });
  const badBase64 = readoutFixture(t); badBase64.ready(); badBase64.emit('response.output_audio.delta', { delta: 'not base64!' });
  await assert.rejects(badBase64.result, { code: 'readout_not_verified' });
});

test('audit: readout abort cancels matching OOB response and ignores stale late success', async t => {
  const f = readoutFixture(t); f.ready(); f.audio(); f.abort.abort();
  await assert.rejects(f.result, { code: 'cancelled' });
  assert.deepEqual(f.socket.sent.at(-1), { type: 'response.cancel', response_id: f.ref.response_id });
  assert.equal(f.socket.terminated, true);
  f.finish(); await flush(); assert.equal(f.resolved, false);
});

test('audit: readout duplicate event IDs do not duplicate audio and malformed/provider errors are sanitized', async t => {
  const f = readoutFixture(t); f.ready();
  f.audio(new Uint8Array([1, 2]), { event_id: 'duplicate-audio' });
  f.audio(new Uint8Array([1, 2]), { event_id: 'duplicate-audio' });
  f.emit('response.output_audio.done'); f.emit('response.output_audio_transcript.done', { transcript: f.text }); f.completed();
  assert.deepEqual(await f.result, new Uint8Array([1, 2]));
  for (const event of [null, [], { type: 'error', error: { message: 'audit-fake-main-key-not-real secret upstream trace' } }]) {
    const bad = readoutFixture(t); bad.ready(); bad.socket.serverEvent(event);
    await assert.rejects(bad.result, error => { assert.doesNotMatch(error.message, /audit-fake-main-key-not-real|secret upstream trace/); return true; });
  }
});

test('audit: readout deadline and cancellation before connection require no paid follow-on work', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const f = readoutFixture(t, { limits: { ...READOUT_LIMITS, timeoutMs: 500 } }); f.ready(); t.mock.timers.tick(500);
  await assert.rejects(f.result, { code: 'voice_timeout' });
  const abort = new AbortController(); abort.abort(); let connected = false;
  await assert.rejects(renderOpenAiReadout('approved', { signal: abort.signal, connect: () => { connected = true; } }), { code: 'cancelled' });
  assert.equal(connected, false);
  await assert.rejects(renderOpenAiReadout('approved', { voice: 'arbitrary-voice', connect: () => { connected = true; } }), { code: 'readout_not_verified' });
  assert.equal(connected, false);
});

const actualReplies = await readReplies();
function httpFixture(options = {}) {
  const renders = [];
  const handle = createVoiceHandler({
    env: { NODE_ENV: 'test', OPENAI_API_KEY: 'audit-fake-main-key-not-real' }, replies: actualReplies,
    renderImpl: async (text, config) => { renders.push({ text, config }); return new Uint8Array([1, 2, 3, 4]); }, ...options,
  });
  return { handle, renders };
}
function speakRequest(body = { text: actualReplies[0] }, init = {}) {
  return new Request('http://localhost:5173/api/voice/speak', {
    method: 'POST', headers: { origin: 'http://localhost:5173', 'content-type': 'application/json' },
    body: JSON.stringify(body), ...init,
  });
}

test('audit: HTTP readout accepts only current exact answer registry and sanitizes speech copy', async () => {
  assert.equal(actualReplies.length, 8);
  const f = httpFixture();
  for (const reply of actualReplies) {
    const result = await f.handle(speakRequest({ text: reply })); assert.equal(result.status, 200);
    assert.deepEqual(new Uint8Array(await result.arrayBuffer()), new Uint8Array([1, 2, 3, 4]));
    assert.equal(f.renders.at(-1).text, prepareReadoutText(sanitizeSpeechText(reply)));
    assert.equal(result.headers.get('x-audio-format'), 'pcm_s16le'); assert.equal(result.headers.get('x-audio-sample-rate'), '24000');
    assert.equal(result.headers.get('cache-control'), 'no-store, max-age=0');
  }
  for (const body of [{ text: 'external arbitrary content' }, { text: actualReplies[0], model: 'arbitrary' }, { text: actualReplies[0], voice: 'arbitrary' }, { text: actualReplies[0], url: 'http://169.254.169.254/' }, null, [], { text: actualReplies[0] + ' ' }]) {
    const before = f.renders.length, result = await f.handle(speakRequest(body), { ip: 'distinct-test-ip-' + before + JSON.stringify(body).length });
    assert.equal(result.status, 400); assert.equal(f.renders.length, before);
  }
});

test('audit: missing key, invalid server voice, production disabled and unavailable realtime never call upstream', async () => {
  for (const options of [{ env: {} }, { env: { OPENAI_API_KEY: 'fake', OPENAI_VOICE: 'invalid' } }, { env: { OPENAI_API_KEY: 'fake', NODE_ENV: 'production' } }, { realtimeAvailable: false }]) {
    const f = httpFixture(options);
    const result = await f.handle(speakRequest()); assert.ok([403, 503].includes(result.status)); assert.equal(f.renders.length, 0);
    const status = await f.handle(new Request('http://localhost:5173/api/voice/status'));
    const info = await status.json(); assert.deepEqual(Object.keys(info).sort(), ['configured', 'enabled', 'output_model', 'realtime', 'service', 'voice']);
    assert.ok(['enabled', 'configured', 'realtime'].every(key => typeof info[key] === 'boolean'));
    assert.equal(info.service, 'brandmint-openai-voice');
    assert.equal(info.output_model, READOUT_MODEL);
    assert.ok(info.voice === null || ['cedar', 'marin'].includes(info.voice));
    assert.doesNotMatch(JSON.stringify(info), /fake|key|Bearer/);
  }
});

test('audit: HTTP origin/body/format/method bounds reject before renderer', async () => {
  const cases = [
    [speakRequest({}, { headers: { 'content-type': 'application/json' } }), 403],
    [speakRequest({}, { headers: { origin: 'https://evil.example', 'content-type': 'application/json' } }), 403],
    [speakRequest({}, { headers: { origin: 'http://localhost:5173', 'content-type': 'text/plain' } }), 415],
    [speakRequest({}, { headers: { origin: 'http://localhost:5173', 'content-type': 'application/json', 'content-length': String(HTTP_LIMITS.jsonBytes + 1) } }), 413],
    [speakRequest({}, { body: 'x'.repeat(HTTP_LIMITS.jsonBytes + 1) }), 413],
    [speakRequest({}, { body: '{broken' }), 400],
    [new Request('http://localhost:5173/api/voice/speak', { headers: { origin: 'http://localhost:5173' } }), 405],
    [new Request('http://localhost:5173/api/voice/transcribe', { method: 'POST' }), 404],
  ];
  for (const [request, status] of cases) {
    const f = httpFixture(); const result = await f.handle(request); assert.equal(result.status, status); assert.equal(f.renders.length, 0);
  }
});

test('audit: HTTP exception/error responses never include key or provider text, and invalid PCM fails closed', async () => {
  for (const value of [new Uint8Array(), new Uint8Array([1]), 'not PCM', new Uint8Array(HTTP_LIMITS.outputBytes + 2)]) {
    const f = httpFixture({ renderImpl: async () => value });
    const response = await f.handle(speakRequest()); assert.equal(response.status, 502);
  }
  const f = httpFixture({ renderImpl: async () => { throw new Error('audit-fake-main-key-not-real secret provider output'); } });
  const response = await f.handle(speakRequest()); assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /audit-fake-main-key-not-real|secret provider output/);
});

test('audit: readout retains percentage and currency meaning instead of forgiving removed or changed symbols', async t => {
  for (const [approved, changed] of [
    ['Growth is 30%.', 'Growth is 30.'], ['Growth is 30%.', 'Growth is 30‰.'],
    ['It costs ₹999.', 'It costs 999.'], ['It costs $999.', 'It costs 999.'],
    ['It costs $999.', 'It costs €999.'], ['It costs £9.99.', 'It costs 9.99.'],
  ]) {
    assert.notEqual(normalizeReadoutText(approved), normalizeReadoutText(changed), `${approved} versus ${changed}`);
    const f = readoutFixture(t, { text: approved }); f.ready(); f.audio();
    f.emit('response.output_audio_transcript.done', { transcript: changed });
    await assert.rejects(f.result, { code: 'readout_text_mismatch' });
  }
});

import { createServer } from 'node:http';
import { WebSocket as LocalWebSocket } from 'ws';
import { attachRealtimeInput } from '../server/realtime-input.mjs';
import { createNodeListener } from '../server/node-adapter.mjs';

test('audit: real loopback WebSocket handshake rejects missing key/cross-origin before mock provider connection', async t => {
  for (const [env, origin, expected] of [
    [{}, 'http://localhost:5173', 503],
    [{ OPENAI_API_KEY: 'audit-fake-main-key-not-real' }, 'https://evil.example', 403],
    [{ OPENAI_API_KEY: 'audit-fake-main-key-not-real', NODE_ENV: 'production', VOICE_PROXY_ENABLED: 'true', VOICE_ALLOWED_ORIGINS: 'https://brand.example' }, 'http://localhost:5173', 403],
  ]) {
    let connected = 0;
    const server = createServer();
    const dispose = attachRealtimeInput(server, { env, connect: () => { connected++; return new AuditSocket(); } });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(() => { dispose(); server.close(); });
    const socket = new LocalWebSocket(`ws://127.0.0.1:${server.address().port}/api/voice/realtime`, { origin });
    socket.on('error', () => {});
    const status = await new Promise((resolve, reject) => {
      socket.on('unexpected-response', (_request, response) => { response.resume(); socket.terminate(); resolve(response.statusCode); });
      socket.on('open', () => reject(new Error('An unauthorized upgrade unexpectedly opened.')));
    });
    assert.equal(status, expected); assert.equal(connected, 0);
    dispose(); await new Promise(resolve => server.close(resolve));
  }
});

test('audit: Node adapter ignores spoofed forwarded IPs and exposes only safe missing-key status', async t => {
  const seen = [];
  const handler = createVoiceHandler({ env: {}, replies: actualReplies, renderImpl: async () => { throw new Error('must not call'); } });
  const server = createServer(createNodeListener((request, context) => { seen.push(context.ip); return handler(request, context); }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/voice/status`, { headers: { 'x-forwarded-for': 'malicious-spoofed-ip' } });
  assert.deepEqual(await response.json(), { service: 'brandmint-openai-voice', output_model: READOUT_MODEL, voice: 'cedar', enabled: true, configured: false, realtime: true });
  assert.equal(seen[0], '127.0.0.1');
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
});

test('audit: HTTP cancellation and deadline abort renderer, release concurrency and do not leak details', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  let observedSignal, completed = false;
  const renderImpl = async (_text, { signal }) => {
    observedSignal = signal;
    if (completed) return new Uint8Array([1, 2]);
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
  };
  const f = httpFixture({ renderImpl, limits: { ...HTTP_LIMITS, perIpConcurrent: 1, timeoutMs: 500 } });
  const abort = new AbortController();
  const pending = f.handle(speakRequest(undefined, { signal: abort.signal })); await flush();
  assert.equal(observedSignal.aborted, false);
  const busy = await f.handle(speakRequest()); assert.equal(busy.status, 429);
  abort.abort(); const cancelled = await pending; assert.equal(cancelled.status, 499); assert.equal(observedSignal.aborted, true);
  const slow = f.handle(speakRequest()); await flush(); t.mock.timers.tick(500);
  const timeout = await slow; assert.equal(timeout.status, 504);
  completed = true; const next = await f.handle(speakRequest()); assert.equal(next.status, 200);
});

test('audit: a streaming request with no end cannot occupy the HTTP handler forever', async t => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  let cancelled = false;
  const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{')); }, cancel() { cancelled = true; } });
  const f = httpFixture({ limits: { ...HTTP_LIMITS, timeoutMs: 500 } });
  const request = speakRequest(undefined, { body, duplex: 'half' });
  const pending = f.handle(request); await flush(); t.mock.timers.tick(500);
  const result = await pending; assert.equal(result.status, 504); assert.equal(cancelled, true); assert.equal(f.renders.length, 0);
});

// Current official assistant-message schema uses output_audio; event docs also
// contain legacy audio. Both must retain every existing identity/text check.
test('regression: current output_audio and legacy audio content parts verify', async t => {
  for (const finalContentType of ['output_audio', 'audio']) for (const partType of ['output_audio', 'audio']) {
    const f = readoutFixture(t, { finalContentType }); f.ready();
    f.emit('response.content_part.added', { part: { type: partType, transcript: '' } });
    f.emit('response.content_part.done', { part: { type: partType, transcript: f.text } });
    f.finish();
    assert.deepEqual(await f.result, new Uint8Array([1, 2, 3, 4]));
  }
});
test('regression: current transcription delta may omit content_index, completed may not', t => {
  const f = inputFixture(t); f.ready();
  f.upstream.serverEvent({ type: 'conversation.item.input_audio_transcription.delta', item_id: 'modern_item', delta: 'services' });
  assert.equal(f.client.sent.at(-1).content_index, 0);
  assert.equal(f.client.sent.at(-1).delta, 'services');
  const before = f.client.sent.length;
  f.upstream.serverEvent({ type: 'conversation.item.input_audio_transcription.completed', item_id: 'modern_item', transcript: 'services' });
  assert.equal(f.client.sent.length, before);
  f.upstream.serverEvent({ type: 'conversation.item.input_audio_transcription.delta', item_id: 'modern_item', content_index: -1, delta: 'services' });
  assert.equal(f.client.sent.length, before);
});
test('regression: browser preserves safe provider errors that arrive before ready', async t => {
  const f = voiceFixture(t);
  const starting = f.controller.start(); await flush();
  f.socket.emit({ type: 'error', code: 'invalid_api_key', message: 'never render raw provider text' });
  await starting;
  assert.equal(f.state.status, 'idle');
  assert.match(f.state.message, /rejected.*API key/);
  assert.doesNotMatch(f.state.message, /raw provider text/);
});
test('regression: browser distinguishes withheld changed words from playback failure', async t => {
  const f = voiceFixture(t, { fetchImpl: async url => url.endsWith('/status')
    ? Response.json({ enabled: true, configured: true, realtime: true })
    : Response.json({ error: { code: 'readout_text_mismatch', message: 'private upstream text' } }, { status: 502 }) });
  await f.start(); f.completed('item_mismatch', 'services'); await f.tick(500);
  f.submissions[0].speak('Approved exact existing reply.'); await flush();
  assert.equal(f.state.status, 'listening');
  assert.match(f.state.message, /withheld.*changed/);
  assert.doesNotMatch(f.state.message, /private upstream text/);
  assert.equal(f.playback.length, 0);
});

import { createVoiceDiagnostics, providerFailure } from '../server/voice-diagnostics.mjs';
import { runProviderSmoke } from './voice-smoke.mjs';
test('regression: diagnostics whitelist scalar fields, drop raw secrets and cap events', () => {
  const lines = [], diagnostic = createVoiceDiagnostics('input', { enabled: true, sink: line => lines.push(line) });
  for (let i = 0; i < 100; i++) diagnostic.emit('failed', { code: 'private-key-secret', status: 401, transcript: 'private transcript', key: 'private-key-secret', error: { message: 'private upstream body' }, bytes: 960 });
  diagnostic.emit('private transcript');
  assert.equal(lines.length, 64);
  assert.doesNotMatch(lines.join(''), /private-key-secret|private transcript|private upstream body/);
  assert.match(lines[0], /"status":401/);
  assert.equal(providerFailure({ code: 'insufficient_quota', message: 'private' }), 'insufficient_quota');
  assert.equal(providerFailure({ code: 'arbitrary_private_text' }), 'provider_error');
});
test('regression: provider handshake HTTP failures retain only safe categories', async t => {
  for (const [status, code] of [[401, 'invalid_api_key'], [403, 'permission_denied'], [429, 'rate_limit_exceeded']]) {
    const input = inputFixture(t); let consumed = false;
    input.upstream.emit('unexpected-response', {}, { statusCode: status, resume() { consumed = true; } });
    assert.equal(consumed, true); assert.equal(input.client.sent.at(-1).code, code);
    const readout = readoutFixture(t);
    readout.socket.emit('unexpected-response', {}, { statusCode: status, resume() {} });
    await assert.rejects(readout.result, { code });
  }
});
test('regression: smoke script refuses missing credentials without connecting', async () => {
  let connections = 0; const lines = [];
  assert.equal(await runProviderSmoke({ env: {}, connect() { connections++; }, sink: line => lines.push(line) }), false);
  assert.equal(connections, 0); assert.match(lines[0], /No provider request/);
});

test('regression: delayed old status error body cannot stop a restarted session', async t => {
  for (const malformedSuccess of [false, true]) {
    const body = deferred(); let calls = 0;
    const f = voiceFixture(t, { fetchImpl: async () => ++calls === 1
      ? { ok: malformedSuccess, status: malformedSuccess ? 200 : 503, json: () => body.promise }
      : Response.json({ enabled: true, configured: true, realtime: true }) });
    const old = f.controller.start(); await flush(); f.controller.stop();
    await f.start(); const currentSocket = f.socket;
    body.reject(new Error('Old body aborted.')); await old; await flush();
    assert.equal(f.state.status, 'listening');
    assert.equal(currentSocket.readyState, 1);
    f.controller.dispose(); t.mock.timers.reset();
  }
});

test('regression: stale status response cannot stop a newer voice session', async t => {
  const first = deferred(); let calls = 0;
  const f = voiceFixture(t, { fetchImpl: async () => ++calls === 1 ? first.promise : Response.json({ enabled: true, configured: true, realtime: true }) });
  const old = f.controller.start(); await flush(); f.controller.stop(); await f.start();
  const currentSocket = f.socket;
  first.resolve(Response.json({ error: { code: 'voice_unavailable' } }, { status: 503 }));
  await old; await flush();
  assert.equal(f.state.status, 'listening'); assert.equal(currentSocket.readyState, 1);
});
test('regression: delayed old readout error cannot replace a newer speaking turn', async t => {
  const oldError = deferred(); let readouts = 0;
  const f = voiceFixture(t, { fetchImpl: async url => {
    if (url.endsWith('/status')) return Response.json({ enabled: true, configured: true, realtime: true });
    if (++readouts === 1) return { ok: false, status: 502, json: () => oldError.promise };
    return new Response(new Uint8Array([1, 2]), { headers: { 'x-audio-format': 'pcm_s16le', 'x-audio-sample-rate': '24000' } });
  } });
  await f.start(); f.completed('old_reply', 'services'); await f.tick(500);
  f.submissions[0].speak('Existing reply.'); await flush();
  f.completed('new_reply', 'pricing'); await f.tick(500);
  f.submissions[1].speak('New existing reply.'); await flush();
  const playing = f.playback.at(-1);
  oldError.resolve({ error: { code: 'invalid_api_key' } }); await flush();
  assert.equal(f.state.status, 'speaking'); assert.equal(playing.signal.aborted, false);
  assert.doesNotMatch(f.state.message, /API key/);
});
