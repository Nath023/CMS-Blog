const fs = require('fs');
let code = fs.readFileSync('components/layout/MobileMenu.tsx', 'utf8');
if (code.includes('if (typeof window !== \\'undefined\\')')) {
  console.log('Found problematic code');
}
