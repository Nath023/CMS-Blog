const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

const funcsToPatch = [
  'signOut',
  'uploadMediaFile',
  'createTagAdmin',
  'updateTagAdmin',
  'deleteTagAdmin',
  'createCategoryAdmin',
  'updateCategoryAdmin',
  'deleteCategoryAdmin',
  'deleteMediaFileAdmin',
  'deleteSubscriberAdmin',
  'updateSubscriberStatusAdmin',
  'saveGlobalSettings',
  'loginAdmin',
  'createPost',
  'updatePost',
  'deletePost',
  'subscribeToNewsletter',
  'downloadLeadMagnet',
  'createLeadMagnetAdmin',
  'uploadLeadMagnetFile',
  'updateLeadMagnetAdmin',
  'deleteLeadMagnetAdmin',
  'exportSubscribersCsvAdmin'
];

for (const fn of funcsToPatch) {
  const regex = new RegExp(`(export async function ${fn}\\([^)]*\\) \\{)`);
  if (code.match(regex)) {
    code = code.replace(regex, `$1\n  if (!isConfigured) return { error: 'Supabase is not configured. Please connect to Supabase.' };`);
  }
}

fs.writeFileSync('lib/database.ts', code);
