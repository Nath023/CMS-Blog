const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('app/(main)/**/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('${p.charAt')) {
    // Extract the title or directory name
    const match = file.match(/app\/\(main\)\/(.*)\/page\.tsx/);
    if (match) {
      let p = match[1].split('/').pop();
      const capitalized = p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ');
      
      content = content.replace(/\$\{p\.charAt\(0\)\.toUpperCase\(\) \+ p\.slice\(1\)\.replace\('-', ' '\)\}/g, capitalized);
      fs.writeFileSync(file, content);
      console.log('Fixed', file);
    }
  }
});
