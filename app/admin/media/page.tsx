import { createAdminClient } from '@/lib/supabase/server';
import MediaGrid from './MediaGrid';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const supabase = createAdminClient();
  
  let media: any[] = [];
  try {
    const { data, error } = await supabase.storage.from('blog-images').list();
    if (data) {
      media = data
        .filter((f: any) => f.name !== '.emptyFolderPlaceholder' && f.metadata)
        .map((f: any) => {
          const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(f.name);
          return {
            id: f.id,
            file_url: publicUrl,
            file_name: f.name,
            created_at: f.created_at,
            size: f.metadata?.size
          };
        });
      media.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
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
