const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

code = code.replace(
  / console\.log\('IS_CONFIGURED:', isConfigured, 'URL:', env\.NEXT_PUBLIC_SUPABASE_URL\);/,
  ""
);

fs.writeFileSync('lib/database.ts', code);
