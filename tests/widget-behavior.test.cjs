// Migrated widget regressions use the actual OpenAI controller with mock transport.
// Deterministic tests of the actual controller and widget. No network/paid API.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
function loadSource(relativePath, imports = {}, globals = {}) {
  const file = path.join(__dirname, '..', relativePath);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 }, fileName: file,
  });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports, require: name => name in imports ? imports[name] : require(name),
    setTimeout: (...args) => setTimeout(...args), clearTimeout: (...args) => clearTimeout(...args),
    Date: class extends Date { static now() { return Date.now(); } }, Error, DOMException, AbortController, Float32Array, ArrayBuffer, DataView, Uint8Array, Response, ReadableStream, console, ...globals,
  }, { filename: file });
  return module.exports;
}
const activity = loadSource('src/components/floating/voiceActivity.ts');
const speechText = loadSource('src/components/floating/speechText.ts');
const navigation = loadSource('src/components/floating/contactNavigation.ts');
const voiceSource = loadSource('src/components/floating/browserVoice.ts', {
  './voiceDiagnostics': loadSource('src/components/floating/voiceDiagnostics.ts'), './voiceActivity': activity, './voiceAudio': {}, './speechText': speechText,
  './voiceEndpoints': loadSource('src/components/floating/voiceEndpoints.ts', {}, { URL }),
});
const flush = async () => { for (let i = 0; i < 15; i++) await Promise.resolve(); };
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
function fakeDependencies(options = {}) {
  const plays = []; let socket, transcriptId = 0, closes = 0, active = false;
  const deps = {
    supported: options.supported !== false,
    fetchImpl: async (url, options = {}) => {
      if (url.endsWith('/status')) return Response.json({ enabled: true, configured: true, realtime: true });
      plays.push({ text: JSON.parse(options.body).text });
      return new Response(new Uint8Array([0, 0]), { headers: { 'x-audio-format': 'pcm_s16le', 'x-audio-sample-rate': '24000' } });
    },
    createSocket() {
      socket = { readyState: 1, bufferedAmount: 0, send() {}, close() { this.readyState = 3; } };
      queueMicrotask(() => socket.onmessage?.({ data: JSON.stringify({ type: 'ready' }) }));
      return socket;
    },
    openAudio: async (_frame, _failure, signal, beforeMicrophone) => {
      await beforeMicrophone; active = true; let closed = false;
      return { warning: '', close() { if (!closed) { closes++; closed = true; active = false; } }, stopPlayback() {},
        play: async (_body, _signal, onPlaying) => { onPlaying(); } };
    },
  };
  return { deps, plays,
    emit(text) { socket.onmessage?.({ data: JSON.stringify({ type: 'conversation.item.input_audio_transcription.completed', item_id: `item-${++transcriptId}`, content_index: 0, transcript: text }) }); },
    partial(text) { socket.onmessage?.({ data: JSON.stringify({ type: 'conversation.item.input_audio_transcription.delta', item_id: `item-${++transcriptId}`, content_index: 0, delta: text }) }); },
    get closes() { return closes; }, get active() { return active; },
  };
}
function clock(t) { t.mock.timers.enable({ apis: ['setTimeout', 'Date'] }); }
function widgetFixture(options) {
  const fake = fakeDependencies(options);
  const slots = [];
  let cursor = 0;
  let effects = [];
  let dirty = true;
  let tree;
  let open = true;
  let locationKey = 'home'; let pathname = '/'; const navigations = [];
  let mounted = true;
  let stateUpdatesAfterUnmount = 0;
  const events = new Map();
  const eventTarget = {
    hidden: false,
    addEventListener(name, handler) { events.set(name, handler); },
    removeEventListener(name) { events.delete(name); },
  };
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!slots[index]) slots[index] = { value: initial };
      return [slots[index].value, (next) => {
        if (!mounted) stateUpdatesAfterUnmount++;
        slots[index].value = typeof next === 'function' ? next(slots[index].value) : next;
        dirty = true;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!slots[index]) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(callback, dependencies) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || dependencies.some((dependency, i) => dependency !== previous.dependencies[i])) {
        effects.push(() => {
          previous?.cleanup?.();
          slots[index] = { dependencies, cleanup: callback() };
        });
      }
    },
  };
  const jsx = (type, props) => ({ type, props });
  const component = loadSource('src/components/floating/CustomAiAgentModal.tsx', {
    react: { ...hooks, default: hooks },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    'react-router-dom': { Link: 'Link', useLocation: () => ({ key: locationKey, pathname }), useNavigate: () => (to) => { navigations.push(to); pathname = to; locationKey += '-next'; dirty = true; } },
    './contactNavigation': navigation,
    'framer-motion': { motion: { div: 'div' }, AnimatePresence: 'AnimatePresence' },
    'lucide-react': new Proxy({}, { get: (_, name) => String(name) }),
    './browserVoice': { createBrowserVoice: (onChange, onTranscript) => voiceSource.createBrowserVoice(onChange, onTranscript, fake.deps) },
  }, { window: eventTarget, document: eventTarget }).default;
  function render() {
    for (let pass = 0; dirty && pass < 10; pass++) {
      dirty = false;
      cursor = 0;
      tree = component({ isOpen: open, onClose: () => { open = false; dirty = true; } });
      const pending = effects;
      effects = [];
      pending.forEach((effect) => effect());
    }
    return tree;
  }
  function all(node = render()) {
    if (node == null || typeof node !== 'object') return [];
    if (Array.isArray(node)) return node.flatMap((child) => all(child ?? null));
    return [node, ...all(node.props?.children ?? null)];
  }
  function find(label) {
    const found = all().find((node) => node.props?.['aria-label'] === label);
    assert.ok(found, `Missing control: ${label}`);
    return found;
  }
  function click(label) { const control = find(label); assert.ok(!control.props.disabled, `${label} disabled`); control.props.onClick(); render(); }
  function messages() { render(); return slots[0].value; }
  render();
  return {
    fake, render, find, click, messages, navigations,
    get isOpen() { return open; },
    setPath(value) { pathname = value; locationKey += "-set"; dirty = true; render(); },
    voice: () => { render(); return slots[9].value; },
    statusText: () => all().find((node) => node.props?.role === 'status')?.props.children,
    typeAndSend(text) {
      all().find((node) => node.type === 'input').props.onChange({ target: { value: text } });
      render();
      all().find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
      render();
    },
    quickPrompt(index = 0) {
      const buttons = all().filter((node) => node.type === 'button' && typeof node.props.children === 'string' && node.props.children.includes(['🚀', '🧬', '📊', '💼', '📅', '💬'][index]));
      buttons[0].props.onClick(); render();
    },
    setOpen(value) { open = value; dirty = true; render(); },
    navigate(key) { locationKey = key; dirty = true; render(); },
    hide(name = 'visibilitychange') { eventTarget.hidden = true; events.get(name)?.(); render(); },
    unmount() { mounted = false; slots.forEach((slot) => slot.cleanup?.()); },
    get stateUpdatesAfterUnmount() { return stateUpdatesAfterUnmount; },
  };
}



test('widget voice and text keep identical answers/links; only exact existing reply reaches readout', async t => {
  clock(t); const w = widgetFixture(); t.after(() => w.unmount());
  w.typeAndSend('Tell me about automation'); t.mock.timers.tick(650); const typed = w.messages().at(-1);
  w.click('Start voice input'); await flush(); w.fake.emit('Tell me about automation'); t.mock.timers.tick(350); t.mock.timers.tick(650);
  assert.equal(w.messages().at(-1).text, typed.text); assert.deepEqual(w.messages().at(-1).actionButtons, typed.actionButtons);
  await flush(); assert.equal(w.fake.plays[0].text, typed.text); assert.ok(typed.text.includes('**'));
});

test('widget barge-in cancels its pending answer callback', async t => {
  clock(t); const w = widgetFixture(); t.after(() => w.unmount()); w.click('Start voice input'); await flush();
  w.fake.emit('automation'); t.mock.timers.tick(350); assert.equal(w.messages().length, 2);
  w.fake.partial("wait"); t.mock.timers.tick(180); t.mock.timers.tick(650); assert.equal(w.messages().length, 2); assert.equal(w.fake.plays.length, 0);
});

for (const action of ['close', 'reset', 'navigate', 'external close', 'pagehide', 'hidden', 'unmount', 'typed', 'quick prompt']) {
  test(`widget ${action} cancels active OpenAI voice and its delayed answer`, async t => {
    clock(t); const w = widgetFixture(); w.click('Start voice input'); await flush();
    w.fake.emit('automation'); t.mock.timers.tick(350);
    if (action === 'close') w.click('Close chat');
    if (action === 'reset') w.click('Restart conversation');
    if (action === 'navigate') w.navigate('next');
    if (action === 'external close') w.setOpen(false);
    if (action === 'pagehide') w.hide('pagehide');
    if (action === 'hidden') w.hide();
    if (action === 'unmount') w.unmount();
    if (action === 'typed') w.typeAndSend('academy');
    if (action === 'quick prompt') w.quickPrompt();
    t.mock.timers.tick(1000); w.render();
    assert.equal(w.fake.closes, 1); assert.equal(w.fake.plays.length, 0); assert.equal(w.fake.active, false);
    if (action === 'unmount') assert.equal(w.stateUpdatesAfterUnmount, 0); else w.unmount();
  });
}

for (const command of ['Take me to the contact page', 'Go to the contact page', 'Book me a consultation', 'Schedule a consultation']) {
  test(`voice action '${command}' routes existing contact; same typed text stays normal chat`, async t => {
    clock(t); const w = widgetFixture(); t.after(() => w.unmount());
    w.typeAndSend(command); t.mock.timers.tick(650); const typed = w.messages().at(-1); assert.equal(w.navigations.length, 0);
    w.click('Start voice input'); await flush(); w.fake.emit(command); t.mock.timers.tick(350); t.mock.timers.tick(650); w.render();
    assert.equal(w.messages().at(-1).text, typed.text); assert.deepEqual(w.messages().at(-1).actionButtons, typed.actionButtons);
    assert.deepEqual(w.navigations, ['/contact']); assert.equal(w.isOpen, false); assert.equal(w.fake.plays.length, 0); assert.equal(w.fake.active, false);
  });
}

test('voice same-route action closes without duplicate route history; reopening retains chat', async t => {
  clock(t); const w = widgetFixture(); t.after(() => w.unmount()); w.setPath('/contact');
  w.click('Start voice input'); await flush(); w.fake.emit('Take me to the contact page'); t.mock.timers.tick(350); t.mock.timers.tick(650); w.render();
  assert.equal(w.navigations.length, 0); assert.equal(w.isOpen, false); const history = w.messages(); w.setOpen(true); assert.deepEqual(w.messages(), history);
});

test('speech sanitizer removes display markup only and preserves ordinary words and numbers', () => {
  const original = '👋 **BrandMint™**\n• Call +91 99729 65677. [Contact](/contact) or https://example.com/contact';
  assert.equal(speechText.sanitizeSpeechText(original), 'BrandMint Call +91 99729 65677. Contact or');
  assert.ok(original.includes('**')); assert.equal(speechText.sanitizeSpeechText(''), '');
});


test('spoken text omits common raw URLs and fenced code without changing chat input', () => {
  const original = 'Visit www.example.com, https://example.com or mailto:team@example.com. Email team@example.com.\n```js\nalert("debug");\n```\nThen ask us.';
  const spoken = speechText.sanitizeSpeechText(original);
  assert.equal(spoken, 'Visit or Email team@example.com. Then ask us.');
  assert.ok(original.includes('alert("debug")'));
});

for (const command of ["Don't take me to contact", 'Do not book me a consultation', 'How do I book a consultation?', 'Tell me about your contact page', 'What does a consultation cost?']) {
  test(`voice negative/question '${command}' stays normal chat`, async t => {
    clock(t); const w = widgetFixture(); t.after(() => w.unmount());
    w.click('Start voice input'); await flush(); w.fake.emit(command);
    t.mock.timers.tick(350); t.mock.timers.tick(650); await flush(); w.render();
    assert.equal(w.navigations.length, 0); assert.equal(w.isOpen, true);
    assert.equal(w.messages().length, 3); assert.equal(w.fake.plays.length, 1);
  });
}
for (const query of ['automation', 'quantum weave', 'growth scan', 'venture', 'book consultation', 'whatsapp', 'academy', 'unmatched question']) {
  test(`typed/voice answer and action buttons match for ${query}`, async t => {
    clock(t); const w = widgetFixture(); t.after(() => w.unmount());
    w.typeAndSend(query); t.mock.timers.tick(650); const typed = w.messages().at(-1);
    w.click('Start voice input'); await flush(); w.fake.emit(query); t.mock.timers.tick(350); t.mock.timers.tick(650); await flush();
    assert.equal(w.messages().at(-1).text, typed.text);
    assert.deepEqual(w.messages().at(-1).actionButtons, typed.actionButtons);
    if (w.fake.plays.length) assert.equal(w.fake.plays.at(-1).text, typed.text);
  });
}
