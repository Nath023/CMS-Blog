import { getAdminPosts } from '@/lib/database';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { POST_STATUS, ROUTES } from '@/constants';
import { AdminPostsTable } from '@/components/admin/AdminPostsTable';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage(props: { searchParams: { status?: string } }) {
  const searchParams = props.searchParams;
  const status = searchParams.status;
  
  let posts: any[] = [];
  try {
    const data = await getAdminPosts(status);
    posts = data || [];
  } catch (e: any) {
    if (e?.code !== '42P01') if (e?.message !== 'fetch failed' && !e?.message?.includes('ECONNREFUSED')) console.error('Error fetching admin posts:', e);
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
        <Link href={ROUTES.ADMIN.POSTS} className={`px-4 py-2 rounded-full text-sm font-medium ${!status ? 'bg-slate-800 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          All
        </Link>
        <Link href={`${ROUTES.ADMIN.POSTS}?status=${POST_STATUS.PUBLISHED}`} className={`px-4 py-2 rounded-full text-sm font-medium ${status === POST_STATUS.PUBLISHED ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          Published
        </Link>
        <Link href={`${ROUTES.ADMIN.POSTS}?status=${POST_STATUS.DRAFT}`} className={`px-4 py-2 rounded-full text-sm font-medium ${status === POST_STATUS.DRAFT ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          Drafts
        </Link>
        <Link href={`${ROUTES.ADMIN.POSTS}?status=${POST_STATUS.ARCHIVED}`} className={`px-4 py-2 rounded-full text-sm font-medium ${status === POST_STATUS.ARCHIVED ? 'bg-slate-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950'}`}>
          Archived
        </Link>
        <Link href="/admin/posts/scheduled" className={`px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950`}>
          Scheduled
        </Link>
      </div>

      <AdminPostsTable posts={posts} />
    </div>
  );
}
