'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookmarkMinus } from 'lucide-react';
import { getSavedArticles, unsaveArticle } from './actions';

export function SavedArticles({ userId }: { userId: string }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      const data = await getSavedArticles(userId);
      setArticles(data);
      setLoading(false);
    };
    fetchSaved();
  }, [userId]);

  const fetchSavedRefresh = async () => {
    const data = await getSavedArticles(userId);
    setArticles(data);
  };

  const handleUnsave = async (postId: string) => {
    await unsaveArticle(userId, postId);
    fetchSavedRefresh();
  };

  if (loading) return <div className="animate-pulse flex flex-col gap-4">
    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
  </div>;

  if (articles.length === 0) return <div className="text-center py-12 text-slate-500">You have not saved any articles yet.</div>;

  return (
    <div className="flex flex-col gap-4">
      {articles.map((item) => {
        const post = item.post;
        return (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <Link href={`/blog/${post.slug}`} className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {post.title}
              </Link>
              <div className="text-sm text-slate-500 mt-1">By {post.author_name}</div>
            </div>
            <button onClick={() => handleUnsave(post.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Remove from saved">
              <BookmarkMinus className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
