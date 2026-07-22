'use client';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CloseButton() {
  return (
    <Link 
      href="/blog"
      className="fixed top-24 right-8 lg:right-12 z-50 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      aria-label="Close post"
    >
      <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
    </Link>
  );
}
