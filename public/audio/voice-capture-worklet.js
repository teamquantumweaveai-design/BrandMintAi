/* Continuous microphone capture. Downsample once to 24 kHz; never gate the
   microphone during playback. Messages contain 20 ms of audio; delivery latency depends on the browser. */
class VoiceCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.frame = new Float32Array(480);
    this.position = 0;
    this.phase = 0;
    this.sum = 0;
    this.count = 0;
  }
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    for (const sample of channel) {
      this.sum += sample;
      this.count++;
      this.phase += 24000;
      if (this.phase >= sampleRate) {
        this.phase -= sampleRate;
        this.frame[this.position++] = this.sum / this.count;
        this.sum = this.count = 0;
        if (this.position === this.frame.length) {
          this.port.postMessage(this.frame, [this.frame.buffer]);
          this.frame = new Float32Array(480);
          this.position = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor('voice-capture', VoiceCapture);
