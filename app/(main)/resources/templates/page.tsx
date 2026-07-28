import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `Templates | ${siteConfig.name}`,
  description: `Templates resources.`,
};

export default function Page() {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 min-h-screen relative py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6 capitalize">
          templates
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Explore our collection of templates. Content coming soon.
        </p>
      </div>
    </div>
  );
}