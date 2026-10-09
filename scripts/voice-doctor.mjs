// Offline only: never validates credentials or contacts an API.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadServerEnvironment } from '../server/environment.mjs';
import { createVoiceHandler } from '../server/voice-proxy.mjs';
import { readReplies } from './voice-replies.mjs';
import { READOUT_MODEL, READOUT_VOICES } from '../server/realtime-readout.mjs';
export async function diagnoseVoice(root, processEnvironment = process.env) {
  const env = loadServerEnvironment(root, processEnvironment);
  const key = (env.OPENAI_API_KEY || '').trim(), voice = (env.OPENAI_VOICE || 'cedar').trim();
  const handler = createVoiceHandler({ env, renderImpl: async () => { throw new Error('Offline check.'); } });
  const availability = await (await handler(new Request('http://localhost/api/voice/status'))).json();
  return {
    mode: 'offline', node: process.version,
    env_file_found: existsSync(join(root, '.env.server.local')),
    windows_txt_file_found: existsSync(join(root, '.env.server.local.txt')),
    api_key_present: Boolean(key), api_key_format_valid: /^[\x21-\x7E]+$/.test(key),
    api_key_from_os_environment: Object.hasOwn(processEnvironment, 'OPENAI_API_KEY'),
    approved_voice: READOUT_VOICES.includes(voice) ? voice : 'invalid',
    safe_stage_diagnostics: env.VOICE_DEBUG === 'true',
    built_site_found: existsSync(join(root, 'dist/index.html')),
    standalone_port: /^\d+$/.test(env.VOICE_PORT || '8787') ? Number(env.VOICE_PORT || 8787) : 'invalid',
    standalone_browser_url: `http://127.0.0.1:${/^\d+$/.test(env.VOICE_PORT || '8787') ? env.VOICE_PORT || 8787 : 'INVALID_PORT'}`,
    frontend_voice_routing: 'Same origin as the browser tab: /api/voice/status, /api/voice/realtime, /api/voice/speak. No automatic cross-port forwarding.',
    input_model: 'gpt-live-transcribe', output_model: READOUT_MODEL,
    ...availability, static_replies: (await readReplies()).length, provider_requests: 0,
    note: 'Local format/configuration check only. No key validity, model access, credit, microphone or acoustic test. Restart the server after configuration changes.',
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(await diagnoseVoice(fileURLToPath(new URL('../', import.meta.url))), null, 2)); }
  catch { console.error('Offline voice check failed. Use Node 24 and save .env.server.local as UTF-8.'); process.exitCode = 1; }
}
