import { openVoiceAudio, supportsVoiceAudio, type VoiceAudioSession } from "./voiceAudio";
import { browserVoiceDiagnostics, voiceFailureMessage, voiceFailureCode } from "./voiceDiagnostics";
import { VoiceActivityDetector } from "./voiceActivity";
import { browserVoiceEndpoints, type VoiceEndpoints } from "./voiceEndpoints";

export type VoiceStatus = "idle" | "listening" | "processing" | "speaking" | "interrupted";
export interface VoiceState { status: VoiceStatus; supported: boolean; message: string; transcript: string; }
export interface VoiceSocket {
  readyState: number;
  bufferedAmount: number;
  onopen: ((event?: unknown) => void) | null;
  onmessage: ((event: { data: string }) => void) | null;
  onerror: ((event?: unknown) => void) | null;
  onclose: ((event?: unknown) => void) | null;
  send(data: string | ArrayBuffer): void;
  close(): void;
}
export interface VoiceDependencies {
  supported: boolean;
  fetchImpl: typeof fetch;
  createSocket: () => VoiceSocket;
  openAudio: typeof openVoiceAudio;
  endpoints?: VoiceEndpoints;
  diagnostic?: (stage: string, data?: Record<string, string | number | boolean>) => void;
}
export const CONFIRM_SPEECH_MS = 180;
const LISTENING = "Listening… Speak to interrupt. Use headphones to reduce echo.";
const UNAVAILABLE = "OpenAI voice is unavailable or not configured. Text chat still works.";
const PLAYBACK_ERROR = "Voice couldn't finish. The full reply is in chat. Listening for your next question…";
// ASR lexical evidence, NOT an assertion of measured speech duration or identity.
// Non-speech labels and punctuation alone cannot stop a spoken reply.
export function hasSpeechEvidence(text: string): boolean {
  const clean = text.replace(/\[[^\]]*\]|\([^)]*\)|<[^>]*>/g, " ").trim();
  return /\p{L}{2}|\p{N}{2}/u.test(clean);
}
function browserDependencies(): VoiceDependencies {
  const endpoints = browserVoiceEndpoints();
  return {
    supported: supportsVoiceAudio() && typeof WebSocket !== "undefined",
    fetchImpl: (...args) => fetch(...args),
    createSocket: () => new WebSocket(endpoints.realtime) as unknown as VoiceSocket,
    openAudio: openVoiceAudio,
    endpoints,
    diagnostic: browserVoiceDiagnostics(),
  };
}
type Input = { id: string; order: number; text: string; confirmed: boolean; completed: boolean; submitted: boolean; timer?: ReturnType<typeof setTimeout>; };

/** OpenAI input transcription + existing CustomAgent callback + server readout.
 * No browser recognition, OS synthesis, alternate answer engine or provider. */
export function createBrowserVoice(
  onChange: (state: VoiceState) => void,
  onTranscript: (text: string, speakReply: (reply: string) => void, signal: AbortSignal) => void,
  dependencies?: VoiceDependencies,
) {
  const deps = dependencies || browserDependencies(), supported = deps.supported;
  const diagnose = (stage: string, data: Record<string, string | number | boolean> = {}) => { try { deps.diagnostic?.(stage, data); } catch { /* diagnostics never control voice */ } };
  let state: VoiceState = { status: "idle", supported, message: "", transcript: "" };
  let disposed = false, session = 0, generation = 0, sequence = 0, newestConfirmed = 0;
  let sessionAbort: AbortController | undefined, turnAbort: AbortController | undefined;
  let audio: VoiceAudioSession | undefined, socket: VoiceSocket | undefined, detector: VoiceActivityDetector | undefined;
  let ready = false, candidateId = "", audioSinceCommit = 0, firstFrame = false;
  const inputs = new Map<string, Input>(), events = new Set<string>();
  let idleTimer: ReturnType<typeof setTimeout>, setupTimer: ReturnType<typeof setTimeout>, sessionTimer: ReturnType<typeof setTimeout>;
  let turnTimer: ReturnType<typeof setTimeout>, commitTimer: ReturnType<typeof setTimeout>, interruptedTimer: ReturnType<typeof setTimeout>;
  let rejectSetup: ((error: Error) => void) | undefined;
  const active = () => !disposed && !!sessionAbort && !sessionAbort.signal.aborted;
  const update = (status: VoiceStatus, message = "", transcript = "") => { state = { status, supported, message, transcript }; if (!disposed) onChange(state); };
  const invalidateTurn = () => {
    generation++; turnAbort?.abort(); turnAbort = undefined;
    audio?.stopPlayback(); clearTimeout(turnTimer); clearTimeout(interruptedTimer);
  };
  function stop(message = "") {
    session++; ready = false; firstFrame = false; invalidateTurn();
    diagnose("session.stopped");
    sessionAbort?.abort(); sessionAbort = undefined;
    rejectSetup?.(new Error("Voice setup cancelled.")); rejectSetup = undefined;
    const old = socket; socket = undefined;
    if (old) { old.onopen = old.onmessage = old.onerror = old.onclose = null; try { old.close(); } catch { /* closed */ } }
    audio?.close(); audio = undefined; detector?.reset(); detector = undefined;
    for (const item of inputs.values()) clearTimeout(item.timer);
    inputs.clear(); events.clear(); candidateId = ""; audioSinceCommit = 0; sequence = newestConfirmed = 0;
    clearTimeout(idleTimer); clearTimeout(setupTimer); clearTimeout(sessionTimer); clearTimeout(commitTimer);
    update("idle", message);
  }
  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => stop("Voice stopped after a minute without a question. Tap the mic to continue."), 60000);
  }
  function listening(message = LISTENING) { if (active()) { update("listening", message); armIdle(); } }
  const current = (token: number) => active() && generation === token && !!turnAbort && !turnAbort.signal.aborted;
  function failTurn(token: number, message: string) { if (current(token)) { invalidateTurn(); listening(message); } }
  async function speak(reply: string, token: number) {
    if (!current(token) || state.status !== "processing") return;
    clearTimeout(turnTimer);
    const signal = turnAbort!.signal;
    turnTimer = setTimeout(() => failTurn(token, PLAYBACK_ERROR), 150000);
    try {
      // Send the exact existing answer. The server allowlist owns sanitization.
      diagnose("readout.requested");
      const response = await deps.fetchImpl(deps.endpoints?.speak || "/api/voice/speak", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: reply }), signal,
      });
      if (!current(token)) { void response.body?.cancel().catch(() => {}); return; }
      diagnose("readout.response", { status: response.status });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        diagnose("readout.failed", { code: voiceFailureCode(error?.error?.code) });
        failTurn(token, voiceFailureMessage(error?.error?.code, PLAYBACK_ERROR)); return;
      }
      if (!response.body || response.headers.get("x-audio-format") !== "pcm_s16le" || response.headers.get("x-audio-sample-rate") !== "24000") {
        void response.body?.cancel().catch(() => {}); throw new Error("Voice readout unavailable.");
      }
      await audio!.play(response.body, signal, () => {
        diagnose("playback.started");
        if (current(token)) update("speaking", "Speaking with an OpenAI AI-generated voice. Speak to interrupt.");
      });
      if (!current(token)) return;
      diagnose("playback.finished");
      clearTimeout(turnTimer); turnAbort = undefined; listening();
    } catch { diagnose("playback.failed"); failTurn(token, PLAYBACK_ERROR); }
  }
  function submit(item: Input) {
    if (!active() || item.submitted || !item.completed || !item.confirmed || item.order !== newestConfirmed || !hasSpeechEvidence(item.text)) return;
    diagnose("input.submitted");
    item.submitted = true; clearTimeout(commitTimer); clearTimeout(idleTimer); invalidateTurn();
    const token = generation, abort = new AbortController(); turnAbort = abort;
    update("processing", "Preparing the existing agent's reply…", item.text.trim());
    turnTimer = setTimeout(() => failTurn(token, "The reply took too long. Listening again; text chat still works."), 15000);
    let answered = false;
    try {
      onTranscript(item.text.trim(), reply => {
        if (answered || !current(token)) return;
        answered = true; void speak(reply, token);
      }, abort.signal);
    } catch { failTurn(token, PLAYBACK_ERROR); }
  }
  function confirm(item: Input) {
    if (!active() || item.confirmed || item.submitted || item.order < newestConfirmed || !hasSpeechEvidence(item.text)) return;
    item.confirmed = true; newestConfirmed = item.order;
    clearTimeout(idleTimer);
    const interrupted = state.status === "speaking" || state.status === "processing";
    invalidateTurn();
    if (interrupted) {
      update("interrupted", "Interrupted. Listening to your new question…", item.text);
      interruptedTimer = setTimeout(() => { if (active() && state.status === "interrupted") update("listening", "Listening…", item.text); }, 280);
    } else update("listening", "Listening…", item.text);
    // A recognizer that never finalizes must not leave the mic open indefinitely.
    armIdle(); submit(item);
  }
  function commit() {
    clearTimeout(commitTimer);
    if (!active() || !ready || !socket || socket.readyState !== 1 || audioSinceCommit < 4800) return;
    socket.send(JSON.stringify({ type: "commit" })); audioSinceCommit = 0;
    detector?.reset();
  }
  function eventReceived(event: Record<string, unknown>) {
    if (typeof event.event_id === "string") {
      if (events.has(event.event_id)) return;
      events.add(event.event_id);
      if (events.size > 2048) events.delete(events.values().next().value!);
    }
    const type = event.type;
    if (type === "error") { diagnose("input.failed", { code: voiceFailureCode(event.code) }); stop(voiceFailureMessage(event.code, "OpenAI voice disconnected. Tap the mic to retry, or use text chat.")); return; }
    // Raw speech_started, amplitude, activity and committed events never cancel.
    if (type === "input_audio_buffer.committed" && typeof event.item_id === "string" && event.item_id.length <= 160) {
      // Commits establish audio order before asynchronous transcription finals.
      if (!inputs.has(event.item_id)) {
        if (inputs.size >= 512) { stop("This voice session reached its turn limit. Tap the mic to continue."); return; }
        inputs.set(event.item_id, { id: event.item_id, order: ++sequence, text: "", confirmed: false, completed: false, submitted: false });
      }
      return;
    }
    if (type !== "conversation.item.input_audio_transcription.delta" && type !== "conversation.item.input_audio_transcription.completed" && type !== "conversation.item.input_audio_transcription.failed") return;
    const id = event.item_id;
    if (typeof id !== "string" || id.length > 160) return;
    let item = inputs.get(id);
    if (!item) {
      if (inputs.size >= 512) { stop("This voice session reached its turn limit. Tap the mic to continue."); return; }
      item = { id, order: ++sequence, text: "", confirmed: false, completed: false, submitted: false }; inputs.set(id, item);
    }
    if (item.submitted || item.completed || item.order < newestConfirmed) return;
    if (type === "conversation.item.input_audio_transcription.failed") {
      item.completed = true; clearTimeout(item.timer);
      if (item.confirmed && item.order === newestConfirmed) listening("I couldn't finish hearing that. Please try again, or type your question.");
      return;
    }
    if (type === "conversation.item.input_audio_transcription.delta") {
      if (typeof event.delta !== "string") return;
      item.text += event.delta;
    } else {
      if (typeof event.transcript !== "string") return;
      item.text = event.transcript; item.completed = true;
    }
    if (item.text.length > 4000) { stop("That question was too long. Tap the mic and try a shorter question."); return; }
    if (!hasSpeechEvidence(item.text)) {
      clearTimeout(item.timer); item.timer = undefined;
      if (item.completed && item.confirmed && item.order === newestConfirmed) listening();
      return;
    }
    candidateId = id;
    if (!item.confirmed && !item.timer) item.timer = setTimeout(() => confirm(item!), CONFIRM_SPEECH_MS);
    if (item.confirmed && !item.submitted) update(state.status === "interrupted" ? "interrupted" : "listening", "Listening…", item.text);
    if (item.completed) submit(item);
    else {
      // Endpoint backup for sustained traffic/very soft speech. It never cancels
      // output and may split unusually long pauses: see the real-mic checklist.
      clearTimeout(commitTimer); commitTimer = setTimeout(commit, 1200);
    }
  }
  async function start() {
    if (disposed || active()) return;
    if (!supported) { update("idle", "Voice needs HTTPS or localhost, a microphone, Web Audio and WebSocket support. Text chat still works."); return; }
    const token = ++session, abort = new AbortController(); sessionAbort = abort;
    update("listening", "Starting OpenAI voice… Allow microphone access if asked.");
    armIdle(); sessionTimer = setTimeout(() => stop("This voice session reached 10 minutes. Tap the mic to start another."), 600000);
    const initialize = async () => {
      diagnose("status.requested", typeof location !== "undefined" ? { origin: location.origin, websocket: deps.endpoints?.realtime || `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/api/voice/realtime` } : {});
      const response = await deps.fetchImpl(deps.endpoints?.status || "/api/voice/status", { signal: abort.signal });
      if (!active() || session !== token) throw new Error("Voice setup cancelled.");
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        if (!active() || session !== token) throw new Error("Voice setup cancelled.");
        stop(voiceFailureMessage(error?.error?.code, "This page could not reach its voice backend. Open the exact URL printed by npm start or npm run dev; preview is static-only."));
        throw new Error(UNAVAILABLE);
      }
      let availability;
      try { availability = await response.json(); } catch {
        if (!active() || session !== token) throw new Error("Voice setup cancelled.");
        stop("This page returned no voice status. Open the exact URL printed by npm start or npm run dev."); throw new Error(UNAVAILABLE);
      }
      if (!active() || session !== token) throw new Error("Voice setup cancelled.");
      diagnose("status.received", { enabled: availability.enabled === true, configured: availability.configured === true, realtime: availability.realtime === true });
      if (!availability.enabled || !availability.configured || availability.realtime === false) throw new Error(UNAVAILABLE);
      if (!active() || session !== token) throw new Error("Voice setup cancelled.");
      await new Promise<void>((resolve, reject) => {
        rejectSetup = reject;
        const ws = deps.createSocket(); socket = ws;
        const valid = () => active() && session === token && socket === ws;
        ws.onopen = () => { if (valid()) diagnose("input.socket_open"); };
        ws.onmessage = ({ data }) => {
          if (!valid()) return;
          let event; try { event = JSON.parse(data); } catch { stop("Voice returned an invalid response. Text chat still works."); return; }
          if (event?.type === "error" && !ready) {
            diagnose("input.setup_failed", { code: voiceFailureCode(event.code) });
            stop(voiceFailureMessage(event.code, "OpenAI rejected voice setup. Check the safe server diagnostics.")); return;
          }
          if (event?.type === "ready" && !ready) { diagnose("input.configured"); ready = true; clearTimeout(setupTimer); rejectSetup = undefined; resolve(); return; }
          if (ready && event && typeof event === "object") eventReceived(event);
        };
        ws.onerror = ws.onclose = () => { if (valid()) { reject(new Error("Voice connection failed.")); stop("OpenAI voice couldn't connect. Check the server and try again. Text chat still works."); } };
        setupTimer = setTimeout(() => { if (valid()) { reject(new Error("Voice setup timed out.")); stop("OpenAI voice setup timed out. Text chat still works."); } }, 15000);
      });
    };
    const initializing = initialize();
    // Observe readiness immediately while audio.open preserves click activation.
    void initializing.catch(() => {});
    detector = new VoiceActivityDetector(() => { /* endpoint hint only */ }, () => commit());
    try {
      const opened = await deps.openAudio(frame => {
        if (!active() || session !== token || !ready || !socket || socket.readyState !== 1) return;
        if (socket.bufferedAmount > 128000) { stop("Voice connection is too slow. Tap the mic to retry, or use text chat."); return; }
        const pcm = new ArrayBuffer(frame.length * 2), view = new DataView(pcm);
        frame.forEach((sample, index) => { const value = Math.max(-1, Math.min(1, sample)); view.setInt16(index * 2, value < 0 ? value * 32768 : value * 32767, true); });
        if (!firstFrame) { firstFrame = true; diagnose("microphone.first_frame", { bytes: pcm.byteLength }); }
        socket.send(pcm);
        if (audioSinceCommit === 0) diagnose("microphone.sent", { bytes: pcm.byteLength });
        audioSinceCommit += pcm.byteLength;
        detector?.push(frame);
      }, message => { if (active() && session === token) stop(message); }, abort.signal, initializing, diagnose);
      if (!active() || session !== token) { opened.close(); return; }
      audio = opened; diagnose("microphone.ready");
      listening(opened.warning || LISTENING);
    } catch (error) {
      if (!active() || session !== token) return;
      stop(error instanceof Error && (error.name === "NotAllowedError" || error.name === "SecurityError")
        ? "Microphone permission was blocked. Allow it in browser settings, or use text chat."
        : UNAVAILABLE);
    }
  }
  onChange(state);
  return { start, stop, dispose() { disposed = true; stop(); } };
}
