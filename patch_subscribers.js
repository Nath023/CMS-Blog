const fs = require('fs');
let code = fs.readFileSync('components/admin/SubscribersTable.tsx', 'utf8');

code = code.replace(
  /if \(result\.csv\) \{/,
  "if (result.csv && typeof result.csv === 'string') {"
);

fs.writeFileSync('components/admin/SubscribersTable.tsx', code);
