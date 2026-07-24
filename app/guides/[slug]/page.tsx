import { getLeadMagnetBySlug } from '@/lib/database';
import DownloadForm from './DownloadForm';
import NotFound from '@/app/not-found';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export default async function LeadMagnetPage({ params }: { params: { slug: string } }) {
  const magnet = await getLeadMagnetBySlug(params.slug);

  if (!magnet) {
    return <NotFound />;
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">{magnet.title}</h1>
        {magnet.description && (
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {magnet.description}
          </p>
        )}
        
        <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <DownloadForm magnet={magnet} />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const magnet = await getLeadMagnetBySlug(params.slug);
  
  if (!magnet) {
    return { title: 'Not Found' };
  }
  
  return {
    title: `${magnet.title} | Guides`,
    description: magnet.description,
  };
}
