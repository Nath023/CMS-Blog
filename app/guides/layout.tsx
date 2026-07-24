import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getSettings } from '@/lib/fetch';
import { siteConfig } from '@/config/site';
import { featuresConfig } from '@/config/features';

export default async function GuidesLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const siteLogoUrl = settings?.site_logo_url || '/logo.svg';
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen flex flex-col font-sans transition-colors duration-300">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary to-secondary"></div>
      <nav className="h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-50 transition-colors duration-300 shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src={siteLogoUrl} alt={settings?.site_name || siteConfig.name} width={800} height={800} quality={100} className="w-auto h-12 object-contain" referrerPolicy="no-referrer" priority />
          <span className="text-xl font-bold tracking-tight text-slate-500 dark:text-slate-400">
            Guides
          </span>
        </Link>
        <div className="flex items-center gap-6 md:gap-8">
          {featuresConfig.enableDarkMode && <ThemeToggle />}
          <Link href="/blog" className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-secondary transition-colors">
            Blog
          </Link>
          <Link href="/admin" className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-secondary transition-colors">
            Admin
          </Link>
          <a href={siteConfig.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2.5 rounded-full hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-sm">
            Main Site &rarr;
          </a>
        </div>
      </nav>
      {children}
    </div>
  );
}
