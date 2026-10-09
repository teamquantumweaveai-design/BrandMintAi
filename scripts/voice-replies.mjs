import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const replySource = new URL('../src/components/floating/CustomAiAgentModal.tsx', import.meta.url);
export const replyOutput = new URL('../server/generated-replies.mjs', import.meta.url);

// Read the existing UI's literals. There is deliberately no second answer engine,
// maintained copy of the knowledge base, evaluation, or user-defined expression.
export function extractReplies(source) {
  const tree = ts.createSourceFile('CustomAiAgentModal.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const replies = [];
  let knowledgeFound = false;
  let fallbackFound = false;
  const literal = (node) => {
    if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node)) {
      throw new Error('Voice replies must remain static string literals. Update the extractor if their structure changes.');
    }
    return node.text;
  };
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) === 'KNOWLEDGE_RESPONSES') {
      knowledgeFound = true;
      if (!node.initializer || !ts.isArrayLiteralExpression(node.initializer)) throw new Error('Expected a literal KNOWLEDGE_RESPONSES array.');
      for (const item of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(item)) throw new Error('Expected a literal knowledge response.');
        const reply = item.properties.find((property) => ts.isPropertyAssignment(property) && property.name.getText(tree) === 'reply');
        if (!reply) throw new Error('Knowledge response is missing its reply.');
        replies.push(literal(reply.initializer));
      }
    }
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && node.left.getText(tree) === 'replyText' && (ts.isStringLiteral(node.right) || ts.isNoSubstitutionTemplateLiteral(node.right)) && node.right.text) {
      replies.push(literal(node.right));
      fallbackFound = true;
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  if (!knowledgeFound || !fallbackFound || replies.length < 2) throw new Error('Voice reply extraction failed closed: knowledge responses or fallback missing.');
  return [...new Set(replies)];
}

export async function readReplies() {
  return extractReplies(await readFile(replySource, 'utf8'));
}

export async function generateReplies() {
  const replies = await readReplies();
  await mkdir(new URL('../server/', import.meta.url), { recursive: true });
  await writeFile(replyOutput, `// Generated from CustomAiAgentModal.tsx by npm run voice:prepare. Do not edit.\nexport default Object.freeze(${JSON.stringify(replies, null, 2)});\n`);
  const sanitizer = await readFile(new URL('../src/components/floating/speechText.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(sanitizer, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } });
  await writeFile(new URL('../server/generated-speech-text.mjs', import.meta.url), '// Generated from speechText.ts. Do not edit.\n' + compiled.outputText);
  return replies;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateReplies().then((replies) => {
    console.log(`Prepared ${replies.length} existing voice replies.`);
  }).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
