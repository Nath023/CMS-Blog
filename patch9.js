const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

code = code.replace(/export async function publishScheduledPostsAdmin\(\) {\n  const supabase = createAdminClient\(\);/, `export async function publishScheduledPostsAdmin() {\n  if (!isConfigured) return [];\n  const supabase = createAdminClient();`);

fs.writeFileSync('lib/database.ts', code);
