'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { bulkDeleteTags } from '@/app/admin/tags/actions';
import { useRouter } from 'next/navigation';

export function AdminTagsTable({ tags }: { tags: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(tags.map(t => t.id));
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
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} tags?`)) return;
    setIsDeleting(true);
    try {
      await bulkDeleteTags(selectedIds);
      setSelectedIds([]);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to delete tags');
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
                  checked={selectedIds.length === tags.length && tags.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Slug</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors group">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 dark:border-slate-700"
                    checked={selectedIds.includes(tag.id)}
                    onChange={(e) => handleSelectOne(e, tag.id)}
                  />
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                  {tag.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {tag.slug}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/tags/${tag.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  No tags found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
