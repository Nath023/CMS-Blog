'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Main Layout Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        Oops! Something went wrong.
      </h2>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg">
        We&apos;re having trouble loading this page. Please try refreshing or check back later.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default" className="rounded-full px-8">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline" className="rounded-full px-8">
          Go Home
        </Button>
      </div>
    </div>
  );
}
