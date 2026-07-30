const fs = require('fs');
let code = fs.readFileSync('lib/database.ts', 'utf8');
code = code.replace(/import { cache } from "react";/, '');
fs.writeFileSync('lib/database.ts', code);
