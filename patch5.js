const fs = require('fs');
let code = fs.readFileSync('app/api/views/route.ts', 'utf8');

code = code.replace(/console\.error\('View tracking error:', error\);/, `if (error?.message !== 'fetch failed' && !error?.message?.includes('ECONNREFUSED')) console.error('View tracking error:', error);`);

fs.writeFileSync('app/api/views/route.ts', code);
