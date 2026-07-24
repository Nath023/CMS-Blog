import { getMediaFilesAdmin } from '@/lib/database';
import nextDynamic from 'next/dynamic';

const MediaGrid = nextDynamic(() => import('./MediaGrid'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
});

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  let media: any[] = [];
  try {
    const data = await getMediaFilesAdmin();
    media = data.map((f: any) => ({
      id: f.name,
      file_url: f.url,
      file_name: f.name,
      created_at: f.created_at || new Date().toISOString()
    }));
    media.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (err) {
    console.error("Error fetching media:", err);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Media Library</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your uploaded images and files.</p>
        </div>
      </div>
      
      <MediaGrid initialMedia={media} />
    </div>
  );
}
