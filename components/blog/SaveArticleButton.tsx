'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { saveArticle, unsaveArticle, hasSavedArticle } from '@/app/(main)/dashboard/actions';

export function SaveArticleButton({ postId, userId }: { postId: string, userId?: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      hasSavedArticle(postId).then(res => {
        setSaved(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [postId, userId]);

  const toggleSave = async () => {
    if (!userId) {
      alert("Please log in to save articles.");
      return;
    }
    
    setLoading(true);
    if (saved) {
      await unsaveArticle(userId, postId);
      setSaved(false);
    } else {
      await saveArticle(postId);
      setSaved(true);
    }
    setLoading(false);
  };

  if (loading) return <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />;

  return (
    <button 
      onClick={toggleSave}
      className={`p-2 rounded-full transition-colors flex items-center justify-center ${saved ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'}`}
      title={saved ? "Remove from saved" : "Save article"}
    >
      {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
    </button>
  );
}
