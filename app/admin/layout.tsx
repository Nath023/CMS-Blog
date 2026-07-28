import Link from 'next/link';
import Image from 'next/image';
import { AdminNav } from '@/components/admin/AdminNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getSettings } from '@/lib/fetch';
import { siteConfig } from '@/config/site';
import { featuresConfig } from '@/config/features';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const siteLogoUrl = settings?.site_logo_url || '/logo.svg';

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-50 min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-300">
      <aside className="w-full md:w-64 shrink-0 bg-white dark:bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 p-4 md:p-6 md:min-h-screen flex flex-col z-50 sticky top-0 md:static">
        <div className="flex items-center justify-between md:justify-start gap-4 md:mb-8">
          <Link href="/admin" className="flex items-center gap-3 group">
            <Image src={siteLogoUrl} alt={settings?.site_name || siteConfig.name} width={800} height={800} quality={100} className="w-auto h-7 md:h-8 object-contain transition-transform group-hover:scale-105" referrerPolicy="no-referrer" priority />
            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
            <span className="text-sm md:text-base font-bold tracking-tight text-slate-600 dark:text-slate-300 hidden md:inline-block">
              Admin
            </span>
          </Link>
          <div className="flex md:hidden items-center gap-2">
             {featuresConfig.enableDarkMode && <ThemeToggle />}
             <a href="/blog" target="_blank" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
               View Site &rarr;
             </a>
          </div>
        </div>
        
        <div className="md:flex-1 mt-4 md:mt-0 overflow-x-auto md:overflow-visible">
          <AdminNav />
        </div>

        <div className="hidden md:flex flex-col gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Theme</span>
            {featuresConfig.enableDarkMode && <ThemeToggle />}
          </div>
          <a href="/blog" target="_blank" className="text-sm text-center font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
            View Live Site &rarr;
          </a>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto md:overflow-y-auto min-h-[calc(100vh-140px)] md:min-h-screen">
        <AdminHeader />
        {children}
      </main>
    </div>
  );
}
