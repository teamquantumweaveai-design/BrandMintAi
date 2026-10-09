// Explicit, user-run provider check. No live call happens without --live.
// Uses the exact shipped input/readout adapters, not a substitute API client.
import { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadServerEnvironment } from '../server/environment.mjs';
import { bindInputSession } from '../server/realtime-input.mjs';
import { renderOpenAiReadout, READOUT_MODEL, READOUT_VOICES } from '../server/realtime-readout.mjs';
import { createVoiceDiagnostics, safeVoiceCode } from '../server/voice-diagnostics.mjs';
import { sanitizeSpeechText } from '../server/generated-speech-text.mjs';
import replies from '../server/generated-replies.mjs';

export function probeInput({ key, connect, sink = console.log } = {}) {
  return new Promise((resolve, reject) => {
    class Client extends EventEmitter {
      readyState = 1;
      send(value) {
        const event = JSON.parse(value);
        if (event.type === 'ready') { resolve(); this.close(); }
        else if (event.type === 'error') { const error = new Error('Input setup failed.'); error.code = safeVoiceCode(event.code); reject(error); }
      }
      close() { if (this.readyState !== 1) return; this.readyState = 3; this.emit('close'); }
    }
    bindInputSession(new Client(), { key, connect, diagnostics: createVoiceDiagnostics('input', { enabled: true, sink }) });
  });
}
export async function runProviderSmoke({ env, connect, sink = console.log } = {}) {
  const key = (env.OPENAI_API_KEY || '').trim(), voice = (env.OPENAI_VOICE || 'cedar').trim();
  if (!/^[\x21-\x7E]+$/.test(key) || !READOUT_VOICES.includes(voice)) {
    sink('FAIL local_configuration: add a valid server key and supported voice, then restart. No provider request was made.'); return false;
  }
  sink(`LIVE check: input configuration + one existing public reply readout; model ${READOUT_MODEL}, voice ${voice}. API charges may apply.`);
  try {
    await probeInput({ key, connect, sink });
    sink('PASS input_configuration: provider accepted the transcription session. No microphone/audio was sent; transcription itself is not tested.');
  } catch (error) {
    sink(`FAIL input_configuration: ${safeVoiceCode(error.code)}. No raw provider error was logged.`); return false;
  }
  const reply = [...replies].filter(text => !/\d/.test(text)).sort((a, b) => a.length - b.length)[0];
  try {
    const audio = await renderOpenAiReadout(sanitizeSpeechText(reply), { key, voice, connect, diagnostics: createVoiceDiagnostics('readout', { enabled: true, sink }) });
    sink(`PASS readout: ${audio.byteLength} verified PCM bytes. No audio or transcript was saved. Use the local diagnostic page to confirm audible playback.`);
    return true;
  } catch (error) {
    sink(`FAIL readout: ${safeVoiceCode(error.code)}. Original answer text and strict verification are unchanged.`); return false;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.argv.includes('--live')) {
    console.log('No provider calls made. For an explicit paid API check, run npm run voice:smoke -- --live after configuring your own .env.server.local. This checks transcription-session setup and one allowlisted readout, without recording your microphone. Use /voice-diagnostics.html for speaker and microphone checks.');
  } else {
    try {
      const env = loadServerEnvironment(fileURLToPath(new URL('../', import.meta.url)));
      process.exitCode = await runProviderSmoke({ env }) ? 0 : 1;
    } catch { console.error('FAIL local_configuration: check Node 24 and your UTF-8 server environment file. No key was printed.'); process.exitCode = 1; }
  }
}
