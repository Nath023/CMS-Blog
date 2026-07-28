const fs = require('fs');
let code = fs.readFileSync('app/sitemap.ts', 'utf8');

code = code.replace(/console\.error\('Error generating sitemap:', error\);/, `if (error?.message !== 'fetch failed' && !error?.message?.includes('ECONNREFUSED')) console.error('Error generating sitemap:', error);`);

fs.writeFileSync('app/sitemap.ts', code);
