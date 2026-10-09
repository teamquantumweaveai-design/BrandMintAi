// Run after npm run build. No network requests or provider credentials required.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => readFileSync(join(root, file), 'utf8');
const original = read('index.html');
const built = read('dist/index.html');

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => {
    const attrs = [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)]
      .map(([, key, value]) => [key.toLowerCase(), value]).sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify(attrs);
  });
}

assert.equal(built.match(/<title>([\s\S]*?)<\/title>/i)?.[1], original.match(/<title>([\s\S]*?)<\/title>/i)?.[1], 'Homepage title');
for (const tag of [...tags(original, 'meta'), ...tags(original, 'link')]) {
  assert.ok([...tags(built, 'meta'), ...tags(built, 'link')].includes(tag), `Missing metadata: ${tag}`);
}

const structuredData = html => [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map(([, body]) => JSON.stringify(JSON.parse(body)));
const schemas = structuredData(original);
assert.equal(schemas.length, 3, 'Production homepage has three JSON-LD blocks');
assert.deepEqual(structuredData(built), schemas, 'Organization, WebSite and WebPage schemas');
assert.ok(built.includes("gtag('config', 'G-Z1HB1R50YF')"), 'Production analytics measurement ID');
assert.ok(built.includes('https://www.googletagmanager.com/gtag/js?id=G-Z1HB1R50YF'), 'Analytics loader');

let count = 0;
function checkPublic(directory = 'public') {
  for (const name of readdirSync(join(root, directory))) {
    const file = join(directory, name);
    if (statSync(join(root, file)).isDirectory()) { checkPublic(file); continue; }
    const output = join('dist', file.slice('public/'.length));
    assert.deepEqual(readFileSync(join(root, output)), readFileSync(join(root, file)), `Public asset: ${file}`);
    count++;
  }
}
checkPublic();
for (const [, src] of built.matchAll(/<script[^>]*src=["'](\/[^"']+)["']/g)) {
  assert.ok(readFileSync(join(root, 'dist', src.slice(1))).length, `Built entry: ${src}`);
}
console.log(`Verified homepage SEO, three JSON-LD schemas, analytics and ${count} public assets (including PHP, redirects, robots, sitemap and article).`);
