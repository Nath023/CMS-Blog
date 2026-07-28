import { Header } from '@/components/layout/Header';
import { getSettings } from '@/lib/fetch';

export default async function GuidesLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen flex flex-col font-sans transition-colors duration-300">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary to-secondary"></div>
      {children}
    </div>
  );
}
