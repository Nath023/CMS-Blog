const fs = require('fs');
const glob = require('glob');

glob.sync('app/admin/**/page.tsx').forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // match things like console.error('Error fetching categories:', e);
  code = code.replace(/console\.error\('Error fetching [^']+', ([a-zA-Z]+)\);/g, (match, errVar) => {
    return `if (${errVar}?.message !== 'fetch failed' && !${errVar}?.message?.includes('ECONNREFUSED')) ${match}`;
  });
  
  // match things like if (e?.code !== '42P01') console.error('Error fetching admin posts:', e);
  code = code.replace(/if \([a-zA-Z]+\?\.code !== '42P01'\) console\.error\('Error fetching [^']+', ([a-zA-Z]+)\);/g, (match, errVar) => {
    return match.replace(/if \(/, `if (${errVar}?.message !== 'fetch failed' && !${errVar}?.message?.includes('ECONNREFUSED') && `);
  });
  
  fs.writeFileSync(file, code);
});
