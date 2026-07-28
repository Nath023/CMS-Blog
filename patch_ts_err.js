const fs = require('fs');
let code = fs.readFileSync('lib/supabase/middleware.ts', 'utf8');

code = code.replace(/let user = null;/, `let user: any = null;`);

fs.writeFileSync('lib/supabase/middleware.ts', code);
