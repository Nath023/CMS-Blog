'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { submitPostFeedback } from '@/app/(main)/blog/actions';

export function PostFeedback({ postId }: { postId: string }) {
  const [voted, setVoted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVote = async (isHelpful: boolean) => {
    if (voted !== null) return;
    setLoading(true);
    try {
      await submitPostFeedback(postId, isHelpful);
      setVoted(isHelpful);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 my-12">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        {voted !== null ? "Thanks for your feedback!" : "Was this article helpful?"}
      </h3>
      {voted === null ? (
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => handleVote(true)}
            disabled={loading}
            className="rounded-full px-6 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Yes
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleVote(false)}
            disabled={loading}
            className="rounded-full px-6 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            No
          </Button>
        </div>
      ) : (
        <div className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
          {voted 
            ? "We're glad you found it useful! Consider subscribing to our newsletter below." 
            : "We're sorry it didn't help. We'll use this feedback to improve our content."}
        </div>
      )}
    </div>
  );
}
