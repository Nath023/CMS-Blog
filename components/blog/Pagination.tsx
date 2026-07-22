'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function Pagination({ currentPage, totalItems, itemsPerPage = 9 }: { currentPage: number, totalItems: number, itemsPerPage?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams || undefined);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 py-6 font-sans">
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-full hover:border-primary hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md">
          &larr; Previous
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-gray-300 dark:text-gray-700 bg-transparent cursor-not-allowed">
          &larr; Previous
        </span>
      )}

      <span className="text-sm font-bold uppercase tracking-wider text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-full hover:border-primary hover:text-primary transition-all duration-300 shadow-sm hover:shadow-md">
          Next &rarr;
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-gray-300 dark:text-gray-700 bg-transparent cursor-not-allowed">
          Next &rarr;
        </span>
      )}
    </div>
  );
}
