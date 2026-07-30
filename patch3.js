const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');
code = code.replace(/    \}\n  \);\n\}\);/, '    }\n  );\n};');
fs.writeFileSync('lib/database.ts', code);
