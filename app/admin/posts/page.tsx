import { createAdminClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage(props: { searchParams: { status?: string } }) {
  const searchParams = props.searchParams;
  const status = searchParams.status;
  const supabase = createAdminClient();

  let query = supabase
    .from('posts')
    .select(`
      id, title, slug, status, created_at, published_at,
      category:categories(name)
    `)
    .order('created_at', { ascending: false });

  if (status && ['published', 'draft', 'archived'].includes(status)) {
    query = query.eq('status', status);
  }

  let posts: any[] = [];
  try {
    const { data } = await query;
    posts = data || [];
  } catch (e: any) {
    if (e?.code !== '42P01') console.error('Error fetching admin posts:', e);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Posts</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your blog articles.</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>Write New Post</Button>
        </Link>
      </div>

      <div className="flex gap-2">
        <Link href="/admin/posts" className={`px-4 py-2 rounded-full text-sm font-medium ${!status ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          All
        </Link>
        <Link href="/admin/posts?status=published" className={`px-4 py-2 rounded-full text-sm font-medium ${status === 'published' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          Published
        </Link>
        <Link href="/admin/posts?status=draft" className={`px-4 py-2 rounded-full text-sm font-medium ${status === 'draft' ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          Drafts
        </Link>
        <Link href="/admin/posts?status=archived" className={`px-4 py-2 rounded-full text-sm font-medium ${status === 'archived' ? 'bg-slate-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          Archived
        </Link>
        <Link href="/admin/posts/scheduled" className={`px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950`}>
          Scheduled
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider">
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
                    <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-1">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md font-medium uppercase tracking-wider text-[10px] ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                      post.status === 'draft' ? 'bg-amber-100 text-amber-700' :
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
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No posts found matching your criteria.
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
