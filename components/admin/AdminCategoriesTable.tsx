'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { bulkDeleteCategories } from '@/app/admin/categories/actions';
import { useRouter } from 'next/navigation';

export function AdminCategoriesTable({ categories }: { categories: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(categories.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) return;
    setIsDeleting(true);
    try {
      await bulkDeleteCategories(selectedIds);
      setSelectedIds([]);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to delete categories');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      {selectedIds.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {selectedIds.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkDelete} disabled={isDeleting} className="text-red-600 hover:text-red-700 dark:text-red-400">Delete</Button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold w-12">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 dark:border-slate-700"
                  checked={selectedIds.length === categories.length && categories.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Slug</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors group">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 dark:border-slate-700"
                    checked={selectedIds.includes(category.id)}
                    onChange={(e) => handleSelectOne(e, category.id)}
                  />
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {category.slug}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {category.description || '—'}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/categories/${category.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
