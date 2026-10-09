export type VoiceAudioDiagnostic = (stage: string, data?: Record<string, string | number | boolean>) => void;

export interface VoiceAudioSession {
  warning: string;
  play(body: ReadableStream<Uint8Array>, signal: AbortSignal, onPlaying: () => void): Promise<void>;
  stopPlayback(): void;
  close(): void;
}

const interrupted = () => new DOMException("Voice turn cancelled", "AbortError");

/** PCM stream player with a bounded queue. All scheduled buffers are stopped on
 * barge-in, not just the currently audible one. No generated audio is persisted. */
export async function playPcmStream(
  context: AudioContext,
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  sources: Set<AudioBufferSourceNode>,
  onPlaying: () => void,
  diagnostic: VoiceAudioDiagnostic = () => {},
) {
  const diagnose: VoiceAudioDiagnostic = (stage, data = {}) => { try { diagnostic(stage, data); } catch { /* diagnostics never control playback */ } };
  const reader = body.getReader();
  const owned = new Set<AudioBufferSourceNode>();
  let pending = new Uint8Array(0);
  let nextTime = context.currentTime;
  let totalBytes = 0, decodedSamples = 0;
  let started = false;
  let finished = false;
  const stop = () => {
    owned.forEach((source) => { try { source.stop(); } catch { /* ended */ } source.disconnect(); sources.delete(source); });
    owned.clear();
    void reader.cancel().catch(() => {});
  };
  const delay = (ms: number) => new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(interrupted()); return; }
    const timer = setTimeout(done, ms);
    const abort = () => { clearTimeout(timer); signal.removeEventListener("abort", abort); reject(interrupted()); };
    function done() { signal.removeEventListener("abort", abort); resolve(); }
    signal.addEventListener("abort", abort, { once: true });
  });
  signal.addEventListener("abort", stop, { once: true });
  try {
    if (signal.aborted) throw interrupted();
    const enqueue = async (bytes: Uint8Array) => {
      while (nextTime - context.currentTime > 1.5) await delay(40);
      if (signal.aborted) throw interrupted();
      const count = bytes.length / 2;
      const buffer = context.createBuffer(1, count, 24000);
      const output = buffer.getChannelData(0);
      const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      for (let i = 0; i < count; i++) output[i] = view.getInt16(i * 2, true) / 32768;
      if (!decodedSamples) diagnose("audio.decoded", { samples: count, sample_rate: 24000, channels: 1 });
      decodedSamples += count;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      sources.add(source); owned.add(source);
      source.onended = () => { sources.delete(source); owned.delete(source); source.disconnect(); };
      nextTime = Math.max(nextTime, context.currentTime + 0.025);
      source.start(nextTime);
      nextTime += count / 24000;
      if (!started) {
        started = true;
        diagnose("playback.scheduled", { audio_context_running: context.state === "running", samples: count });
        onPlaying();
      }
    };
    while (true) {
      const { done, value } = await reader.read();
      if (signal.aborted) throw interrupted();
      if (done) break;
      if (!totalBytes && value.byteLength) diagnose("audio.detected", { bytes: value.byteLength });
      totalBytes += value.byteLength;
      if (totalBytes > 24000 * 2 * 120) throw new Error("Voice reply exceeded its audio limit.");
      const joined = new Uint8Array(pending.length + value.length);
      joined.set(pending); joined.set(value, pending.length);
      let offset = 0;
      // 100 ms chunks tolerate arbitrary HTTP byte boundaries, including odd ones.
      while (joined.length - offset >= 4800) {
        await enqueue(joined.subarray(offset, offset + 4800));
        offset += 4800;
      }
      pending = joined.slice(offset);
    }
    if (pending.length % 2) throw new Error("Incomplete voice audio received.");
    if (pending.length) await enqueue(pending);
    if (!started) throw new Error("No voice audio was received.");
    while (owned.size && !signal.aborted) await delay(40);
    if (signal.aborted) throw interrupted();
    finished = true;
    diagnose("playback.completed", { bytes: totalBytes, samples: decodedSamples });
  } catch (error) {
    diagnose("playback.failed", { code: signal.aborted ? "cancelled" : "pcm_playback_failed" });
    throw error;
  } finally {
    signal.removeEventListener("abort", stop);
    if (!finished) stop();
    reader.releaseLock();
  }
}

export function supportsVoiceAudio(): boolean {
  return typeof window !== "undefined" && window.isSecureContext &&
    !!navigator.mediaDevices?.getUserMedia && !!window.AudioContext && !!window.AudioWorkletNode;
}

/** Called only from the mic click. The context is resumed before the first await
 * to preserve user activation on browsers with autoplay restrictions. */
export async function openVoiceAudio(
  onFrame: (frame: Float32Array) => void,
  onFailure: (message: string) => void,
  signal: AbortSignal,
  beforeMicrophone: Promise<void> = Promise.resolve(),
  diagnostic: VoiceAudioDiagnostic = () => {},
): Promise<VoiceAudioSession> {
  const context = new AudioContext({ latencyHint: "interactive" });
  const resumed = context.resume();
  void resumed.catch(() => {});
  const sources = new Set<AudioBufferSourceNode>();
  let stream: MediaStream | undefined;
  let source: MediaStreamAudioSourceNode | undefined;
  let processor: AudioWorkletNode | undefined;
  let mute: GainNode | undefined;
  let closed = false;
  const stopPlayback = () => {
    sources.forEach((node) => { try { node.stop(); } catch { /* ended */ } node.disconnect(); });
    sources.clear();
  };
  const close = () => {
    if (closed) return;
    closed = true;
    signal.removeEventListener("abort", close);
    stopPlayback();
    if (processor) { processor.port.onmessage = null; processor.port.close(); processor.disconnect(); }
    source?.disconnect(); mute?.disconnect();
    stream?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    context.onstatechange = null;
    void context.close().catch(() => {});
  };
  signal.addEventListener("abort", close, { once: true });
  try {
    if (signal.aborted) throw interrupted();
    if (context.sampleRate < 24000) throw new Error("This audio device needs a sample rate of at least 24 kHz.");
    await beforeMicrophone;
    if (closed || signal.aborted) throw interrupted();
    const acquiring = navigator.mediaDevices.getUserMedia({ audio: {
      channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true,
    } });
    // Observe both operations immediately, so a rejected resume can't leak a mic.
    const [resumeResult, streamResult] = await Promise.allSettled([resumed, acquiring]);
    if (streamResult.status === "fulfilled") stream = streamResult.value;
    if (closed || signal.aborted) {
      stream?.getTracks().forEach((track) => track.stop());
      throw interrupted();
    }
    if (resumeResult.status === "rejected") throw resumeResult.reason;
    if (streamResult.status === "rejected") throw streamResult.reason;
    await context.audioWorklet.addModule("/audio/voice-capture-worklet.js");
    if (closed || signal.aborted) throw interrupted();
    processor = new AudioWorkletNode(context, "voice-capture");
    source = context.createMediaStreamSource(stream!);
    mute = context.createGain(); mute.gain.value = 0;
    source.connect(processor); processor.connect(mute); mute.connect(context.destination);
    processor.port.onmessage = (event) => { if (!closed) onFrame(event.data); };
    stream!.getAudioTracks().forEach((track) => { track.onended = () => { if (!closed) onFailure("The microphone disconnected. Reconnect it, then start voice again."); }; });
    context.onstatechange = () => {
      if (!closed && context.state !== "running") onFailure("Audio paused in this browser. Tap the mic to start again, or use text chat.");
    };
    if (context.state !== "running") throw new Error("Audio couldn't start in this browser.");
    return {
      warning: stream!.getAudioTracks()[0]?.getSettings().echoCancellation === true ? "" : "Echo cancellation isn't confirmed. Use headphones to prevent the agent hearing itself.",
      play: (body, turnSignal, onPlaying) => playPcmStream(context, body, turnSignal, sources, onPlaying, diagnostic),
      stopPlayback,
      close,
    };
  } catch (error) { close(); throw error; }
}
