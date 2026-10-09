import { playPcmStream } from "./components/floating/voiceAudio";
import { createBrowserVoice } from "./components/floating/browserVoice";
import { voiceFailureCode, voiceFailureMessage } from "./components/floating/voiceDiagnostics";
import replies from "../server/generated-replies.mjs";

const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
const logElement = document.querySelector<HTMLPreElement>("#log")!;
const buttons = ["tone", "readout", "microphone"].map(id => document.getElementById(id) as HTMLButtonElement);
const publicReply: string = [...replies].filter(text => !/\d/.test(text)).sort((a, b) => a.length - b.length)[0];
let logCount = 0, generation = 0, abort: AbortController | undefined, context: AudioContext | undefined;
let input: ReturnType<typeof createBrowserVoice> | undefined;
let sources = new Set<AudioBufferSourceNode>();
function log(stage: string, details = "") {
  if (logCount++ >= 100) return;
  logElement.textContent += `${stage}${details ? `: ${details}` : ""}\n`;
}
function stop() {
  generation++; abort?.abort(); abort = undefined; input?.dispose(); input = undefined;
  for (const source of sources) { try { source.stop(); } catch { /* ended */ } source.disconnect(); }
  sources.clear(); if (context) void context.close().catch(() => {}); context = undefined;
  buttons.forEach(button => button.disabled = !loopback);
}
function begin() {
  stop(); logCount = 0; logElement.textContent = "";
  buttons.forEach(button => button.disabled = true);
  abort = new AbortController();
  return { token: generation, signal: abort.signal };
}
async function play(kind: "tone" | "readout") {
  const { token, signal } = begin();
  // Resume synchronously in the click handler before any network await.
  try {
    if (typeof AudioContext === "undefined") throw new Error("audio_unsupported");
    const audio = new AudioContext({ latencyHint: "interactive" }); context = audio;
    const resumed = audio.resume(); void resumed.catch(() => {});
    await resumed; if (signal.aborted) return;
    log("audio.context", audio.state);
    if (audio.state !== "running") throw new Error("audio_suspended");
    let body: ReadableStream<Uint8Array>;
    if (kind === "tone") {
      const bytes = new Uint8Array(24000); const view = new DataView(bytes.buffer);
      for (let n = 0; n < 12000; n++) view.setInt16(n * 2, Math.sin(2 * Math.PI * 440 * n / 24000) * 0.08 * 32767, true);
      // Odd network-style boundaries exercise actual PCM assembly and scheduling.
      body = new ReadableStream({ start(controller) { controller.enqueue(bytes.slice(0, 731)); controller.enqueue(bytes.slice(731)); controller.close(); } });
      log("offline.pcm", `${bytes.byteLength} bytes, 24000 Hz, 0.5 seconds; no network or microphone`);
    } else {
      log("readout.requested", "/api/voice/speak (one existing allowlisted reply)");
      const response = await fetch("/api/voice/speak", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: publicReply }), signal });
      if (signal.aborted || token !== generation) return;
      log("readout.http", String(response.status));
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        if (signal.aborted || token !== generation) return;
        log("readout.failure", voiceFailureCode(error?.error?.code));
        log("next", voiceFailureMessage(error?.error?.code, "Check safe server diagnostics. No audio was played.")); return;
      }
      if (response.headers.get("x-audio-format") !== "pcm_s16le" || response.headers.get("x-audio-sample-rate") !== "24000" || response.headers.get("x-audio-channels") !== "1") throw new Error("invalid_audio_headers");
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (signal.aborted || token !== generation) return;
      if (!bytes.length || bytes.length % 2) throw new Error("invalid_pcm");
      log("readout.pcm_received", `${bytes.byteLength} bytes, 24000 Hz mono`);
      body = new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } });
    }
    await playPcmStream(audio, body, signal, sources, () => log("playback.source_scheduled", `context ${audio.state}`), (stage, data) => log(stage, JSON.stringify(data)));
    if (!signal.aborted) log("playback.ended", "Player completed. Only you can confirm that the sound was audible.");
  } catch (error) {
    if (!signal.aborted) {
      const code = error instanceof Error && ["audio_unsupported", "audio_suspended", "invalid_audio_headers", "invalid_pcm"].includes(error.message) ? error.message
        : error instanceof Error && error.name === "NotAllowedError" ? "audio_permission_denied" : "playback_or_network_failure";
      log("test.failed", code);
      log("next", "Check browser audio permissions, output device and safe server diagnostics.");
    }
  }
  finally { if (token === generation) stop(); }
}
buttons[0].onclick = () => { if (loopback) void play("tone"); };
buttons[1].onclick = () => { if (loopback) void play("readout"); };
buttons[2].onclick = () => {
  if (!loopback) return;
  const { token } = begin(); let lastStatus = "";
  input = createBrowserVoice(state => {
    if (token !== generation) return;
    if (state.status === "idle" && state.message) { log("microphone.stopped", state.message); stop(); return; }
    if (state.status === lastStatus) return;
    lastStatus = state.status; log("microphone.state", state.status);
  }, (_text, _speak, _signal) => { log("microphone.final_received", "Input transcription succeeded; no transcript was logged and no readout was requested."); stop(); });
  void input.start();
};
document.getElementById("stop")!.onclick = () => { stop(); log("stopped"); };
window.addEventListener("pagehide", stop);
document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
document.getElementById("connection")!.textContent = `Browser origin: ${location.origin}. WebSocket: ${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/api/voice/realtime.`;
document.getElementById("reply")!.textContent = `Readout will speak this existing reply: ${publicReply}`;
buttons.forEach(button => button.disabled = !loopback);
if (!loopback) log("unavailable", "This diagnostic page runs on localhost only.");
else void fetch("/api/voice/status").then(async response => {
  const status = await response.json();
  if (status.service !== "brandmint-openai-voice") throw new Error("wrong_backend");
  log("backend.status", `HTTP ${response.status}; enabled ${status.enabled === true}; configured ${status.configured === true}; realtime ${status.realtime === true}; voice ${["cedar", "marin"].includes(status.voice) ? status.voice : "unavailable"}; model ${status.output_model === "gpt-realtime-2.1-mini" ? status.output_model : "unexpected"}`);
  log("backend.note", "Configuration presence is not proof of valid API credentials, billing or model access.");
}).catch(() => log("backend.unreachable", "Open the exact localhost URL printed by npm start or npm run dev. npm run preview is static-only."));
