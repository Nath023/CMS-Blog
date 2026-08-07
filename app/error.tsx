'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-9xl font-serif text-slate-200 dark:text-slate-800 font-bold mb-4">500</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Something went wrong!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          An unexpected error has occurred. Please try again or contact support if the issue persists.
        </p>
        <Button onClick={() => reset()} className="w-full sm:w-auto">
          Try again
        </Button>
      </div>
    </div>
  );
}
