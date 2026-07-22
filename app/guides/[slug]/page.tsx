import { createAdminClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import DownloadForm from './DownloadForm';

export default async function LeadMagnetPage({ params }: { params: { slug: string } }) {
  const supabase = createAdminClient();
  
  const { data: magnet } = await supabase
    .from('lead_magnets')
    .select('*')
    .eq('slug', params.slug)
    .single();
    
  if (!magnet || !magnet.is_active) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          {magnet.title}
        </h1>
        {magnet.description && (
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {magnet.description}
          </p>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <DownloadForm magnet={magnet} />
      </div>
    </div>
  );
}
