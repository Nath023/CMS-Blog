import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Paywall() {
  return (
    <div className="mx-auto w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl z-10 relative">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 shadow-indigo-500/30">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Unlock Premium Content</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">Subscribe to read this full article and get access to all our exclusive insights, tutorials, and deep dives.</p>
      
      <div className="flex flex-col gap-3">
        <Link href="/pricing" className="w-full">
          <Button className="w-full h-12 text-base font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:scale-[1.02] transition-transform">
            View Subscription Plans
          </Button>
        </Link>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">
          Already a subscriber? <Link href="/admin/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
