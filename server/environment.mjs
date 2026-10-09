import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { join } from 'node:path';

// This file is intentionally outside src/ and is only used by Node/Vite config.
// Do not rename the file to a Vite client env file or use a VITE_ secret.
export function loadServerEnvironment(root = process.cwd(), processEnvironment = process.env) {
  let file = {};
  try { file = parseEnv(readFileSync(join(root, '.env.server.local'), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  return { ...file, ...processEnvironment };
}
