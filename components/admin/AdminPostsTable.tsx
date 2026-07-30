'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { POST_STATUS } from '@/constants';
import { bulkDeletePosts, bulkUpdatePostStatus } from '@/app/admin/posts/actions';
import { useRouter } from 'next/navigation';

export function AdminPostsTable({ posts }: { posts: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const router = useRouter();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(posts.map(p => p.id));
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
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} posts?`)) return;
    setIsDeleting(true);
    try {
      await bulkDeletePosts(selectedIds);
      setSelectedIds([]);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to delete posts');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkStatus = async (status: string) => {
    if (!confirm(`Are you sure you want to change the status of ${selectedIds.length} posts to ${status}?`)) return;
    setIsUpdatingStatus(true);
    try {
      await bulkUpdatePostStatus(selectedIds, status);
      setSelectedIds([]);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
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
            <Button variant="outline" size="sm" onClick={() => handleBulkStatus(POST_STATUS.PUBLISHED)} disabled={isUpdatingStatus}>Publish</Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkStatus(POST_STATUS.DRAFT)} disabled={isUpdatingStatus}>Draft</Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkStatus(POST_STATUS.ARCHIVED)} disabled={isUpdatingStatus}>Archive</Button>
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
                  checked={selectedIds.length === posts.length && posts.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {posts?.map((post: any) => (
              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors group">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 dark:border-slate-700"
                    checked={selectedIds.includes(post.id)}
                    onChange={(e) => handleSelectOne(e, post.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{post.title}</div>
                  <div className="text-xs text-slate-400 mt-1">/{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md font-medium uppercase tracking-wider text-[10px] ${
                    post.status === POST_STATUS.PUBLISHED ? 'bg-emerald-100 text-emerald-700' :
                    post.status === POST_STATUS.DRAFT ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700 dark:text-slate-300'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {post.category?.name || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {post.published_at ? post.published_at.split('T')[0] : post.created_at.split('T')[0]}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  No posts found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
