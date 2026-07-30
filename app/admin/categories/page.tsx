import { getCategoriesAdmin } from '@/lib/database';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AdminCategoriesTable } from '@/components/admin/AdminCategoriesTable';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    const data = await getCategoriesAdmin();
    categories = data || [];
  } catch (e: any) {
    if (e?.message !== 'fetch failed' && !e?.message?.includes('ECONNREFUSED')) console.error('Error fetching categories:', e);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Categories</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your blog categories.</p>
        </div>
        <Link href="/admin/categories/new">
          <Button>Add Category</Button>
        </Link>
      </div>

      <AdminCategoriesTable categories={categories} />
    </div>
  );
}
