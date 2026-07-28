const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');

code = code.replace(/if \(error && error\.code !== '42P01'\) console\.error\('Error fetching posts:', error\)/, `if (error && error.code !== '42P01' && error.message !== 'fetch failed') console.error('Error fetching posts:', error)`);

fs.writeFileSync('lib/database.ts', code);
