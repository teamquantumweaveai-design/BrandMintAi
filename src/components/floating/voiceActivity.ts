export const CAPTURE_RATE = 24000;
const FRAME_MS = 20;
const PREROLL_FRAMES = 16; // 320 ms includes the onset debounce / first syllable.
const END_SILENCE_FRAMES = 38; // 760 ms lets a short natural pause stay in one turn.
const MAX_FRAMES = 700; // 14 s, including pre-roll; server accepts at most 15 s.

/** Endpoint hint ONLY. Never use this amplitude detector to interrupt playback.
 * Recognized OpenAI transcript evidence owns speech confirmation.
 * Conservative adaptive energy detector, not a semantic speech classifier.
 * Microphone AEC and a headset remain important in noisy/echoey environments. */
export class VoiceActivityDetector {
  private preRoll: Float32Array[] = [];
  private recording: Float32Array[] = [];
  private onset = 0;
  private silence = 0;
  private noise = 0.002;
  private active = false;
  private waitForSilence = false;
  constructor(
    private onStart: () => void,
    private onEnd: (samples: Float32Array, limited: boolean) => void,
  ) {}
  push(frame: Float32Array) {
    if (frame.length !== CAPTURE_RATE * FRAME_MS / 1000) return;
    let power = 0;
    for (const sample of frame) power += sample * sample;
    const rms = Math.sqrt(power / frame.length);
    const threshold = Math.max(0.012, Math.min(this.noise * 3.2, 0.08));
    const loud = rms >= (this.active ? threshold * 0.65 : threshold);
    if (!this.active) {
      // Learn only likely background. Never calibrate on the opening word.
      if (rms < threshold) this.noise = this.noise * 0.98 + rms * 0.02;
      this.preRoll.push(frame.slice());
      if (this.preRoll.length > PREROLL_FRAMES) this.preRoll.shift();
      if (this.waitForSilence) {
        this.silence = loud ? 0 : this.silence + 1;
        if (this.silence >= END_SILENCE_FRAMES) { this.waitForSilence = false; this.silence = 0; this.preRoll = []; }
        return;
      }
      this.onset = loud ? this.onset + 1 : 0;
      if (this.onset < 4) return; // 80 ms debounce rejects a brief click/pop.
      this.active = true;
      this.recording = this.preRoll;
      this.preRoll = [];
      this.onset = this.silence = 0;
      this.onStart();
      return;
    }
    this.recording.push(frame.slice());
    this.silence = loud ? 0 : this.silence + 1;
    const limited = this.recording.length >= MAX_FRAMES;
    if (!limited && this.silence < END_SILENCE_FRAMES) return;
    const samples = new Float32Array(this.recording.length * frame.length);
    this.recording.forEach((part, index) => samples.set(part, index * frame.length));
    this.recording = [];
    this.active = false;
    this.silence = 0;
    this.waitForSilence = limited;
    this.onEnd(samples, limited);
  }
  reset() {
    this.preRoll = []; this.recording = [];
    this.onset = this.silence = 0;
    this.active = this.waitForSilence = false;
  }
}
