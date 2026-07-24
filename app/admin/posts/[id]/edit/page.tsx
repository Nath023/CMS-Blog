import { getCategories } from '@/lib/database';
import { PostForm } from '@/components/admin/PostForm';
import Link from 'next/link';
import { getPostForEdit } from '@/lib/database';
import NotFound from '@/app/not-found';

export default async function EditPostPage(props: { params: { id: string } }) {
  const params = props.params;
  const categories = await getCategories();
  const result = await getPostForEdit(params.id);
  const post = result?.post;
  const initialTags = result?.tags || '';

  if (!post) return <NotFound />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/posts" className="text-slate-400 hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Edit Post</h1>
          <p className="text-slate-500 dark:text-slate-400">Update your article.</p>
        </div>
      </div>

      <PostForm post={post} categories={categories} initialTags={initialTags} />
    </div>
  );
}
