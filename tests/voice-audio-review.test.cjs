// Independent, deterministic review of audio resource ownership and PCM capture.
// These mocks do not verify real microphones, acoustic echo cancellation, speakers,
// browser permission prompts, provider quality, or measured interruption latency.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');
function loadAudio(globals = {}) {
  const source = fs.readFileSync(path.join(root, 'src/components/floating/voiceAudio.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports, DOMException, Uint8Array, Float32Array,
    DataView, ArrayBuffer, ReadableStream, AbortController, setTimeout, clearTimeout,
    console, ...globals,
  });
  return module.exports;
}
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };

function audioFixture(options = {}) {
  const contexts = [], processors = [], constraints = [], frames = [], failures = [];
  let stops = 0, captureCalls = 0;
  const track = { onended: null, stop() { stops++; }, getSettings: () => ({ echoCancellation: options.aec !== false }) };
  const stream = { getTracks: () => [track], getAudioTracks: () => [track] };
  const node = () => ({ connections: [], disconnected: false, connect(target) { this.connections.push(target); }, disconnect() { this.disconnected = true; } });
  class AudioContext {
    constructor() {
      contexts.push(this); this.state = 'running'; this.sampleRate = options.sampleRate || 48000;
      this.destination = {}; this.closed = 0; this.onstatechange = null;
      this.audioWorklet = { addModule: (url) => { this.module = url; return options.modulePromise || Promise.resolve(); } };
    }
    resume() { this.resumed = true; return options.resumePromise || Promise.resolve(); }
    close() { this.closed++; this.state = 'closed'; return Promise.resolve(); }
    createMediaStreamSource(value) { assert.equal(value, stream); return this.source = node(); }
    createGain() { return this.mute = { ...node(), gain: { value: 1 } }; }
  }
  class AudioWorkletNode {
    constructor(context, name) { Object.assign(this, node()); this.name = name; this.context = context; this.port = { onmessage: null, closed: false, close() { this.closed = true; } }; processors.push(this); }
  }
  const api = loadAudio({
    AudioContext, AudioWorkletNode,
    navigator: { mediaDevices: { getUserMedia: (value) => { captureCalls++; constraints.push(value); return options.capturePromise || Promise.resolve(stream); } } },
  });
  const abort = new AbortController();
  return {
    ...api, contexts, processors, constraints, frames, failures, track, stream, abort,
    open: (ready) => api.openVoiceAudio((frame) => frames.push(frame), (message) => failures.push(message), abort.signal, ready),
    get stops() { return stops; }, get captureCalls() { return captureCalls; },
  };
}

test('no-key readiness failure closes audio context without requesting microphone', async () => {
  const f = audioFixture();
  await assert.rejects(f.open(Promise.reject(new Error('not configured'))), /not configured/);
  assert.equal(f.captureCalls, 0);
  assert.equal(f.contexts[0].resumed, true);
  assert.equal(f.contexts[0].closed, 1);
});

test('cancelling pending readiness never acquires the microphone after readiness resolves', async () => {
  const ready = deferred(), f = audioFixture();
  const opening = f.open(ready.promise);
  f.abort.abort(); ready.resolve();
  await assert.rejects(opening, { name: 'AbortError' });
  assert.equal(f.captureCalls, 0);
  assert.equal(f.contexts[0].closed, 1);
});

test('late getUserMedia result after cancellation is stopped instead of leaking a live track', async () => {
  const capture = deferred(), f = audioFixture({ capturePromise: capture.promise });
  const opening = f.open(); await flush();
  assert.equal(f.captureCalls, 1);
  f.abort.abort(); capture.resolve(f.stream);
  await assert.rejects(opening, { name: 'AbortError' });
  assert.equal(f.stops, 1);
  assert.equal(f.processors.length, 0);
  assert.equal(f.contexts[0].closed, 1);
});

test('autoplay resume rejection still releases an acquired microphone', async () => {
  const f = audioFixture({ resumePromise: Promise.reject(new Error('autoplay blocked')) });
  await assert.rejects(f.open(), /autoplay blocked/);
  assert.equal(f.stops, 1);
  assert.equal(f.contexts[0].closed, 1);
});

test('worklet initialization failure releases tracks and context', async () => {
  const f = audioFixture({ modulePromise: Promise.reject(new Error('module unavailable')) });
  await assert.rejects(f.open(), /module unavailable/);
  assert.equal(f.stops, 1);
  assert.equal(f.contexts[0].closed, 1);
});

test('aborting a pending worklet load releases the mic and prevents late graph creation', async () => {
  const module = deferred(), f = audioFixture({ modulePromise: module.promise });
  const opening = f.open(); await flush();
  assert.equal(f.captureCalls, 1);
  f.abort.abort(); module.resolve();
  await assert.rejects(opening, { name: 'AbortError' });
  assert.equal(f.stops, 1); assert.equal(f.processors.length, 0);
  assert.equal(f.contexts[0].closed, 1);
});

test('unsupported low sample-rate context fails visibly without mislabeled recording or microphone access', async () => {
  const f = audioFixture({ sampleRate: 8000 });
  await assert.rejects(f.open(), /sample rate.*24 kHz/i);
  assert.equal(f.captureCalls, 0); assert.equal(f.contexts[0].closed, 1);
});

test('capture requests AEC and stays muted locally; close removes audio callbacks and tracks', async () => {
  const f = audioFixture(); const session = await f.open();
  const options = f.constraints[0].audio;
  assert.equal(options.echoCancellation, true); assert.equal(options.noiseSuppression, true);
  assert.equal(options.channelCount, 1); assert.equal(f.contexts[0].mute.gain.value, 0);
  assert.equal(session.warning, '');
  const processor = f.processors[0], frame = new Float32Array(480);
  const lateFrame = processor.port.onmessage;
  lateFrame({ data: frame }); assert.equal(f.frames.length, 1);
  session.close(); session.close(); lateFrame({ data: frame });
  assert.equal(f.frames.length, 1); assert.equal(f.stops, 1);
  assert.equal(processor.port.onmessage, null); assert.equal(processor.port.closed, true);
  assert.equal(f.track.onended, null); assert.equal(f.contexts[0].onstatechange, null);
  assert.equal(f.contexts[0].closed, 1);
});

test('unconfirmed AEC produces an explicit headphone warning', async () => {
  const f = audioFixture({ aec: false }); const session = await f.open();
  assert.match(session.warning, /headphones/i); session.close();
});

test('disconnected track and suspended audio each report a restartable failure', async () => {
  const f = audioFixture(); const session = await f.open();
  f.track.onended(); f.contexts[0].state = 'suspended'; f.contexts[0].onstatechange();
  assert.equal(f.failures.length, 2); assert.match(f.failures[0], /microphone disconnected/i);
  assert.match(f.failures[1], /audio paused/i); session.close();
});

function pcmContext(autoEnd = true) {
  const sources = [], buffers = [];
  return {
    sources, buffers, currentTime: 0, destination: {},
    createBuffer(channels, count, rate) {
      const data = new Float32Array(count); const buffer = { channels, count, rate, data, getChannelData: () => data };
      buffers.push(buffer); return buffer;
    },
    createBufferSource() {
      const source = { stopped: 0, disconnected: 0, connect() {}, disconnect() { this.disconnected++; }, stop() { this.stopped++; }, start(at) { this.at = at; if (autoEnd) queueMicrotask(() => this.onended?.()); } };
      sources.push(source); return source;
    },
  };
}
function bodyOf(chunks) { return new ReadableStream({ start(controller) { chunks.forEach((chunk) => controller.enqueue(chunk)); controller.close(); } }); }

test('PCM playback reconstructs split odd-byte chunks and decodes signed little-endian samples', async () => {
  const api = loadAudio(), context = pcmContext(), active = new Set();
  const bytes = new Uint8Array([0, 128, 0, 0, 255, 127]); let plays = 0;
  await api.playPcmStream(context, bodyOf([bytes.slice(0, 1), bytes.slice(1, 3), bytes.slice(3)]), new AbortController().signal, active, () => plays++);
  assert.equal(context.buffers.length, 1); assert.equal(context.buffers[0].rate, 24000);
  assert.equal(context.buffers[0].data[0], -1); assert.equal(context.buffers[0].data[1], 0);
  assert.equal(context.buffers[0].data[2], 32767 / 32768); assert.equal(plays, 1); assert.equal(active.size, 0);
});

for (const [name, chunks, pattern] of [
  ['empty output', [], /no voice audio/i],
  ['trailing half-sample', [new Uint8Array([1])], /incomplete voice audio/i],
]) test(`PCM rejects ${name} instead of claiming successful playback`, async () => {
  await assert.rejects(loadAudio().playPcmStream(pcmContext(), bodyOf(chunks), new AbortController().signal, new Set(), () => {}), pattern);
});

test('barge-in abort stops every already-scheduled PCM node and cancels the stream', async () => {
  const api = loadAudio(), context = pcmContext(false), active = new Set(), abort = new AbortController();
  let cancelled = false;
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(9600)); }, cancel() { cancelled = true; } });
  const playing = api.playPcmStream(context, body, abort.signal, active, () => {});
  await flush(); assert.equal(context.sources.length, 2); assert.equal(active.size, 2);
  abort.abort();
  assert.equal(active.size, 0); assert.ok(context.sources.every((source) => source.stopped >= 1));
  await assert.rejects(playing, { name: 'AbortError' }); assert.equal(cancelled, true);
});

test('aborting one PCM playback does not stop a different playback owned by the same session', async () => {
  const api = loadAudio(), context = pcmContext(false), active = new Set();
  const a = new AbortController(), b = new AbortController();
  const stream = () => new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(4800)); } });
  const first = api.playPcmStream(context, stream(), a.signal, active, () => {});
  await flush();
  const second = api.playPcmStream(context, stream(), b.signal, active, () => {});
  await flush(); assert.equal(context.sources.length, 2);
  a.abort(); await assert.rejects(first, { name: 'AbortError' });
  try { assert.equal(context.sources[1].stopped, 0); assert.equal(active.size, 1); }
  finally { b.abort(); await assert.rejects(second, { name: 'AbortError' }); }
});

for (const rate of [24000, 44100, 48000]) test(`capture worklet emits 50 exact 20ms mono frames per second at ${rate}Hz`, () => {
  let Constructor; const posted = [];
  class AudioWorkletProcessor { constructor() { this.port = { postMessage: (frame) => posted.push(Array.from(frame)) }; } }
  vm.runInNewContext(fs.readFileSync(path.join(root, 'public/audio/voice-capture-worklet.js'), 'utf8'), {
    AudioWorkletProcessor, Float32Array, sampleRate: rate,
    registerProcessor(name, value) { assert.equal(name, 'voice-capture'); Constructor = value; },
  });
  const worklet = new Constructor();
  for (let index = 0; index < rate; index += 128) worklet.process([[new Float32Array(Math.min(128, rate - index)).fill(0.25)]]);
  assert.equal(posted.length, 50); assert.ok(posted.every((frame) => frame.length === 480 && frame.every((value) => value === 0.25)));
});

test('PCM diagnostics distinguish audio receipt, decode, scheduling and completion without samples', async () => {
  const stages = [], api = loadAudio(), context = pcmContext(); context.state = 'running';
  await api.playPcmStream(context, bodyOf([new Uint8Array([0, 128, 255, 127])]), new AbortController().signal, new Set(), () => {}, (stage, details) => stages.push({ stage, details }));
  assert.deepEqual(stages.map(value => value.stage), ['audio.detected', 'audio.decoded', 'playback.scheduled', 'playback.completed']);
  assert.equal(stages[0].details.bytes, 4);
  assert.equal(stages[1].details.samples, 2);
  assert.equal(stages[2].details.audio_context_running, true);
  assert.equal(stages[3].details.bytes, 4);
  assert.equal(JSON.stringify(stages).includes('32767'), false);
});
test('PCM diagnostic sink failure cannot change playback or hide its own failure', async () => {
  const api = loadAudio();
  await api.playPcmStream(pcmContext(), bodyOf([new Uint8Array([0, 0])]), new AbortController().signal, new Set(), () => {}, () => { throw new Error('diagnostic sink failed'); });
  const stages = [];
  await assert.rejects(api.playPcmStream(pcmContext(), bodyOf([new Uint8Array([0])]), new AbortController().signal, new Set(), () => {}, (stage, details) => stages.push({ stage, details })), /incomplete voice audio/i);
  assert.equal(stages.at(-1).stage, 'playback.failed');
  assert.equal(stages.at(-1).details.code, 'pcm_playback_failed');
});
