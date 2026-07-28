const fs = require('fs');
let code = fs.readFileSync('lib/supabase/middleware.ts', 'utf8');

code = code.replace(
  /if \(!url \|\| url === 'YOUR_SUPABASE_URL' \|\| url === 'https:\/\/127\.0\.0\.1' \|\| url\.includes\('your-project-ref'\)\) \{/,
  "if (!url || url === 'YOUR_SUPABASE_URL' || url.includes('127.0.0.1') || url.includes('your-project-ref')) {"
);

fs.writeFileSync('lib/supabase/middleware.ts', code);
