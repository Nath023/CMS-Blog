const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

const funcsToPatchWithNull = [
  'getTagById',
  'getCategoryById',
  'getPostForEdit'
];

funcsToPatchWithNull.forEach(fn => {
  const regex = new RegExp(`export async function ${fn}\\(id: string\\) {`);
  code = code.replace(regex, `export async function ${fn}(id: string) {\n  if (!isConfigured) return null;`);
});

fs.writeFileSync('lib/database.ts', code);
