const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

code = code.replace(
  /!env\.NEXT_PUBLIC_SUPABASE_URL\.includes\('your-project-ref'\);/,
  "!env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') &&\n  !env.NEXT_PUBLIC_SUPABASE_URL.includes('127.0.0.1');"
);

fs.writeFileSync('lib/database.ts', code);
