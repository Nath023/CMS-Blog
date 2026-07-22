'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { saveCategory, deleteCategory } from '@/app/admin/categories/actions';

export function CategoryForm({ category }: { category?: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await saveCategory(new FormData(e.currentTarget));
      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT') throw err;
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category || !confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      const result = await deleteCategory(category.id);
      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT') throw err;
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col gap-6 max-w-2xl">
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      
      {category && <input type="hidden" name="id" value={category.id} />}

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
        <Input id="name" name="name" defaultValue={category?.name || ''} required />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="slug" className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
        <Input id="slug" name="slug" defaultValue={category?.slug || ''} required pattern="^[a-z0-9-]+$" title="Only lowercase letters, numbers, and hyphens" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Must be unique and URL-friendly.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</label>
        <Textarea id="description" name="description" defaultValue={category?.description || ''} rows={4} />
      </div>

      <div className="flex gap-4 justify-between mt-4 pt-6 border-t border-slate-100">
        <div>
          {category && (
            <Button type="button" variant="outline" onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Category'}
          </Button>
        </div>
      </div>
    </form>
  );
}
