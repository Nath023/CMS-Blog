import { Header } from '@/components/layout/Header';
import { getSettings } from '@/lib/fetch';

export default async function ContactLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-50 min-h-screen flex flex-col font-sans transition-colors duration-300">
      {children}
    </div>
  );
}
