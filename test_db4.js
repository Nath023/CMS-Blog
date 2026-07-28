const fs = require('fs');
const code = fs.readFileSync('lib/database.ts', 'utf8');

const regex = /export async function ([a-zA-Z0-9_]+)\([^)]*\) {/g;
let match;
while ((match = regex.exec(code)) !== null) {
  const funcName = match[1];
  const bodyStart = match.index + match[0].length;
  const body = code.substring(bodyStart, bodyStart + 100);
  if (!body.includes('if (!isConfigured)')) {
    console.log(funcName);
  }
}
