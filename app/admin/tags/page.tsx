import { getTagsAdmin } from '@/lib/database';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AdminTagsTable } from '@/components/admin/AdminTagsTable';

export const dynamic = 'force-dynamic';

export default async function AdminTagsPage() {
  let tags: any[] = [];
  try {
    const data = await getTagsAdmin();
    tags = data || [];
  } catch (e: any) {
    if (e?.message !== 'fetch failed' && !e?.message?.includes('ECONNREFUSED')) console.error('Error fetching tags:', e);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Tags</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your blog tags.</p>
        </div>
        <Link href="/admin/tags/new">
          <Button>Add Tag</Button>
        </Link>
      </div>

      <AdminTagsTable tags={tags} />
    </div>
  );
}
