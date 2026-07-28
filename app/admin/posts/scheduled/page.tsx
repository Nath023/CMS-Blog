import { getScheduledPosts } from '@/lib/database';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function AdminScheduledPostsPage() {
  let posts: any[] = [];
  try {
    const data = await getScheduledPosts();
    posts = data || [];
  } catch (e: any) {
    if (e?.code !== '42P01') if (e?.message !== 'fetch failed' && !e?.message?.includes('ECONNREFUSED')) console.error('Error fetching scheduled posts:', e);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Scheduled Posts</h1>
          <p className="text-slate-500 dark:text-slate-400">View posts scheduled to be published automatically.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="outline">Back to Posts</Button>
          </Link>
          <Link href="/admin/posts/new">
            <Button>Write New Post</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Scheduled For</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {posts?.map((post: any) => (
                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-1">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-amber-600 dark:text-amber-500 font-medium">
                    {new Date(post.published_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {post.category?.name || '—'}
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
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No scheduled posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
