import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getSettings } from '@/lib/fetch';
import { siteConfig } from '@/config/site';
import { featuresConfig } from '@/config/features';

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const siteLogoUrl = settings?.site_logo_url || '/logo.svg';
  return (
    <div className="bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-50 min-h-screen flex flex-col font-sans transition-colors duration-300">
      <div className="sticky top-4 z-50 px-4 w-full max-w-6xl mx-auto mb-4 transition-all duration-300">
        <nav className="h-16 md:h-18 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-full px-6 md:px-8 flex items-center justify-between shadow-lg shadow-black/5 dark:shadow-white/5">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image src={siteLogoUrl} alt={settings?.site_name || siteConfig.name} width={800} height={800} quality={100} className="w-auto h-7 md:h-8 object-contain transition-transform group-hover:scale-105" referrerPolicy="no-referrer" priority />
            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <span className="text-sm md:text-base font-bold tracking-tight text-slate-600 dark:text-slate-300 hidden sm:block">
              Blog
            </span>
          </Link>
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <Link href="/guides" className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
              Free Guides
            </Link>
            <Link href="/admin" className="hidden md:block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
              Admin
            </Link>
            <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
            {featuresConfig.enableDarkMode && <ThemeToggle />}
            <a href={siteConfig.url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-sm flex items-center whitespace-nowrap">
              Main Site <span className="ml-1.5 hidden sm:inline">&rarr;</span>
            </a>
          </div>
        </nav>
      </div>
      {children}
    </div>
  );
}
