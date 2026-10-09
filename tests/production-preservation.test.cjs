const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const root = path.join(__dirname, '..');
// Approved production baseline: main at 3369efa40ee81433933a3ba3674b01cff4697842.
// These files contain marketing metadata, analytics, article content, routing,
// newsletter integrations and navigation fixes absent from the incoming repo.
const protectedFiles = {
  'index.html': '521686cbd19ec98c2d29e193140f9efe9ccc04bef22a8bb10c353d4a44ec4537',
  'public/.htaccess': 'c8731907c1ce4bd102e70a45b2f156e426975f7a2a85fd64cbeda3f076879fa2',
  'public/_redirects': '66584af744075248a042165adbdbd6a0551fa708a85650ea1e3e777eee17080c',
  'public/robots.txt': '22f37be39395ac020fa83f04a1c6c61b38a749365dd287baf6d27b6e3d12f43a',
  'public/sitemap.xml': '75bbc44fdb3cb11b3a162dc38038461510aac39f083388633098c56eddeb2344',
  'public/small-business-automation-ideas/index.html': 'dba45172ee5b41b89546129cd1dfaf394205cd8fe0df7e1c75a55dd1f80a2a35',
  'public/api/subscribe.php': 'f8c2d8460143dc30eafe868bb89f05a644f95ec37e4cc753dcc9c6214ef19ff1',
  'src/components/sections/Footer.tsx': '39e3d996430fdf93f866e9f25cee55c2aba849a89ae62e89ef96dd80893f0ea6',
  'src/components/sections/Navbar.tsx': '7b5068c5b287f3f9fa28697233e2946245a4fd8c630d4caf95791d64d92c066c',
  'src/lib/newsletter.ts': '06a039310f214f8bd6892070eb489262fa6324ba4b6adb3f25a71553033e55a3',
};

test('integration preserves production SEO, analytics, PHP newsletter and navigation files', () => {
  for (const [file, expected] of Object.entries(protectedFiles)) {
    const bytes = fs.readFileSync(path.join(root, file));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, file);
  }
});

test('Hostinger publishing job runs only from main, including manual dispatches', () => {
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/deploy.yml'), 'utf8');
  assert.match(workflow, /build-and-deploy:\s*\n\s+if: github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /clean: false/);
  assert.match(workflow, /node-version: 24/);
});

test('PR validation uses read-only permissions and never writes the deploy branch', () => {
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/validate.yml'), 'utf8');
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /npm run check:production-assets/);
  assert.doesNotMatch(workflow, /contents: write|github-pages-deploy-action|git push/);
});
