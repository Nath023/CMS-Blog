const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

code = code.replace(/export async function getAdminPosts\(\) {\n  if \(\!isConfigured\) return \[\];/, `export async function getAdminPosts(status?: string) {\n  if (!isConfigured) return [];`);

fs.writeFileSync('lib/database.ts', code);
