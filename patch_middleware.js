const fs = require('fs');
let code = fs.readFileSync('lib/supabase/middleware.ts', 'utf8');

code = code.replace(
  /const {\n\s*data: { user },\n\s*} = await supabase\.auth\.getUser\(\)/,
  `  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err: any) {
    if (err?.message !== 'fetch failed' && !err?.message?.includes('ECONNREFUSED')) {
      console.error('Middleware getUser error:', err);
    }
  }`
);

fs.writeFileSync('lib/supabase/middleware.ts', code);
