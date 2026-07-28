const fs = require('fs');
const path = require('path');
const p = 'register';
const dir = path.join(__dirname, 'app', '(main)', p);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const content = `
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: \`Register | \${siteConfig.name}\`,
  description: \`Create an account on \${siteConfig.name}.\`,
};

export default function Page() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 min-h-screen relative py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6">
          Register
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Registration is currently closed. Please check back later.
        </p>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(dir, 'page.tsx'), content.trim());
