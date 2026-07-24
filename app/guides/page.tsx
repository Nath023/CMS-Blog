import { getLeadMagnetsForGuides } from '@/lib/database';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Card } from '@/components/ui/Card';

export const revalidate = 60;

export const metadata = {
  title: `Free Guides | ${siteConfig.name}`,
  description: 'Download our free guides and resources.',
};

export default async function GuidesPage() {
  const magnets = await getLeadMagnetsForGuides();

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Free Resources & Guides
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Actionable strategies and expert insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {magnets?.map((magnet) => (
          <Card key={magnet.id} className="p-8 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 flex flex-col h-full">
            <h2 className="text-2xl font-serif text-slate-900 dark:text-white mb-3">{magnet.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1">
              {magnet.description || 'Download this comprehensive guide to learn more.'}
            </p>
            <Link 
              href={`/guides/${magnet.slug}`}
              className="bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl py-3 px-4 text-center transition-colors"
            >
              Get Free Guide
            </Link>
          </Card>
        ))}
        {(!magnets || magnets.length === 0) && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Check back soon for new guides!
          </div>
        )}
      </div>
    </div>
  );
}
