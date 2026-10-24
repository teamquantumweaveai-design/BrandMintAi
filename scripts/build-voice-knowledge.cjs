// Run with: node scripts/build-voice-knowledge.cjs
// Reads public marketing copy only. Never indexes env files, leads, or workflows.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const chunks = [];
const constants = fs.readFileSync(path.join(root, 'src/lib/constants.ts'), 'utf8');
const exported = {};
vm.runInNewContext(ts.transpileModule(constants, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  { exports: exported }, { timeout: 2000 });
const routes = {
  ABOUT_COPY: '/about', WHY_BRANDMINT_COPY: '/about', SOLUTIONS_COPY: '/solutions',
  BUSINESS_GROWTH_COPY: '/business-growth', AI_BUSINESS_PARTNER_COPY: '/business-growth',
  QUANTUM_WEAVE_COPY: '/quantum-weave', ACADEMY_COPY: '/academy',
  VENTURES_COPY: '/ventures', CONTACT_COPY: '/contact', BRANDMINT_PROGRAMS: '/academy',
};
function flatten(value) {
  if (Array.isArray(value)) return value.map(flatten).filter(Boolean).join('\n');
  if (value && typeof value === 'object') return Object.entries(value)
    .filter(([key]) => !['icon', 'id', 'image', 'isExternal'].includes(key))
    .map(([key, item]) => `${key}: ${flatten(item)}`).join('\n');
  return String(value ?? '');
}
function add(title, url, text) {
  const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
  let current = '';
  for (const line of lines) {
    // Preserve whole lines so a price stays associated with its plan description.
    if (current && current.length + line.length > 2200) {
      chunks.push({ title, url, text: current });
      current = '';
    }
    current += (current ? '\n' : '') + line;
  }
  if (current) chunks.push({ title, url, text: current });
}
for (const [name, value] of Object.entries(exported)) {
  add(name.replace(/_/g, ' '), routes[name] || '/', flatten(value));
}
function decode(text) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', bull: '•', copy: '©', trade: '™', rupee: '₹' };
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, value) => {
    if (value.startsWith('#')) {
      const code = value[1].toLowerCase() === 'x' ? parseInt(value.slice(2), 16) : parseInt(value.slice(1), 10);
      return code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return entities[value] || match;
  });
}
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory() && !['api', 'voice-insights'].includes(entry.name)) walk(full);
    else if (entry.name === 'index.html') {
      const html = fs.readFileSync(full, 'utf8');
      const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || path.basename(directory));
      const text = decode(html.replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<(script|style|svg|head|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<\/(h[1-6]|p|li|section|div|tr|article|header)>/gi, '\n')
        .replace(/<[^>]+>/g, ' ').replace(/[\t \r]+/g, ' '));
      add(title, '/' + path.relative(path.join(root, 'public'), directory).split(path.sep).join('/') + '/', text);
    }
  }
}
walk(path.join(root, 'public'));
// Include visible page-specific copy that is written directly in TSX rather than constants.
const pageRoutes = { Home: '/', About: '/about', Solutions: '/solutions', BusinessGrowth: '/business-growth',
  QuantumWeave: '/quantum-weave', Ventures: '/ventures', Academy: '/academy', Contact: '/contact' };
for (const [page, route] of Object.entries(pageRoutes)) {
  const file = path.join(root, 'src/pages', page + '.tsx');
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const lines = [];
  function visit(node) {
    if (ts.isJsxText(node) && node.text.trim()) lines.push(node.text.replace(/\s+/g, ' ').trim());
    if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.initializer)
      && /^(title|desc|description|question|answer|price|name|label|subtitle|headline|text|content|value)$/.test(node.name.getText(source))) {
      lines.push(node.name.getText(source) + ': ' + node.initializer.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  add(page + ' page visible copy', route, lines.join('\n'));
}
const revision = createHash('sha256').update(JSON.stringify(chunks)).digest('hex');
const sourceFiles = [];
function fingerprint(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory() && !['api', 'voice-insights'].includes(entry.name)) fingerprint(full);
    else if (entry.name === 'index.html') sourceFiles.push({
      path: path.relative(path.join(root, 'public'), full).split(path.sep).join('/'),
      sha256: createHash('sha256').update(fs.readFileSync(full)).digest('hex'),
    });
  }
}
fingerprint(path.join(root, 'public'));
const output = { source_revision: revision, generated_at: new Date().toISOString(), source_files: sourceFiles, chunks };
fs.writeFileSync(path.join(root, 'public/api/voice/knowledge.json'), JSON.stringify(output, null, 2) + '\n');
console.log(`Indexed ${chunks.length} public website excerpts from marketing constants and static pages.`);
