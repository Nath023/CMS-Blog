const fs = require('fs');

const files = [
  'lib/supabase/server.ts',
  'lib/supabase/client.ts',
  'lib/database.ts',
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/url && url !== 'YOUR_SUPABASE_URL' \? url : 'https:\/\/127\.0\.0\.1'/g, 
                      "url && url !== 'YOUR_SUPABASE_URL' && !url.includes('your-project-ref') ? url : 'https://127.0.0.1'");
  
  // also handle env.NEXT_PUBLIC_SUPABASE_URL || 'https://127.0.0.1' in database.ts
  if (file === 'lib/database.ts') {
    code = code.replace(/env\.NEXT_PUBLIC_SUPABASE_URL \|\| 'https:\/\/127\.0\.0\.1'/g,
                        "(env.NEXT_PUBLIC_SUPABASE_URL && !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') && env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL') ? env.NEXT_PUBLIC_SUPABASE_URL : 'https://127.0.0.1'");
  }
  
  fs.writeFileSync(file, code);
}

// middleware.ts
let mw = fs.readFileSync('lib/supabase/middleware.ts', 'utf8');
mw = mw.replace(/if \(!url \|\| url === 'YOUR_SUPABASE_URL' \|\| url === 'https:\/\/127\.0\.0\.1'\) \{/,
                "if (!url || url === 'YOUR_SUPABASE_URL' || url === 'https://127.0.0.1' || url.includes('your-project-ref')) {");
fs.writeFileSync('lib/supabase/middleware.ts', mw);

