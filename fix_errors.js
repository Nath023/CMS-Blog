const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

code = code.replace(
  /if \(!isConfigured\) return \{ error: 'Supabase is not configured\. Please connect to Supabase\.' \};/g,
  "if (!isConfigured) return { error: { message: 'Supabase is not configured. Please connect to Supabase.' } as any };"
);

fs.writeFileSync('lib/database.ts', code);
