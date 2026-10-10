import { createVoiceBackend } from './backend.mjs';
import { loadServerEnvironment } from './environment.mjs';

const env = loadServerEnvironment();
const port = Number(env.PORT || env.VOICE_PORT || 10000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid backend listening port.');
const app = createVoiceBackend({ env });
app.server.listen(port, '0.0.0.0', () => {
  console.log(`BrandMint voice backend listening on port ${port}; health check /healthz.`);
  console.log('Startup does not validate OpenAI account access, credit, or microphone/audio behavior.');
});
let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  const deadline = setTimeout(() => process.exit(1), 10000);
  deadline.unref();
  app.close(() => { clearTimeout(deadline); process.exit(0); });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
