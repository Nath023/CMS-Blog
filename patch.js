const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

const funcsToPatchWithArray = [
  'getLeadMagnetsAdmin',
  'getTagsAdmin',
  'getCategoriesAdmin',
  'getMediaFilesClient',
  'getMediaFilesAdmin',
  'getAdminPosts',
  'getScheduledPosts',
  'getSubscribersAdmin'
];

funcsToPatchWithArray.forEach(fn => {
  const regex = new RegExp(`export async function ${fn}\\([^)]*\\) {`);
  code = code.replace(regex, `export async function ${fn}() {\n  if (!isConfigured) return [];`);
});

// For getAdminPosts which has arguments
code = code.replace(/export async function getAdminPosts\(status\?: string\) {/, `export async function getAdminPosts(status?: string) {\n  if (!isConfigured) return [];`);

fs.writeFileSync('lib/database.ts', code);
