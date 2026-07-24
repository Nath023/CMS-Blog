'use client';

import { featuresConfig } from '@/config/features';

export function Comments({ postId }: { postId: string }) {
  if (!featuresConfig.enableComments) return null;

  return (
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Comments</h3>
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-slate-500">
        Comments section is enabled. You can integrate a service like Giscus, Disqus, or a custom Supabase comments table here.
      </div>
    </div>
  );
}
