'use client';
import { useState, useEffect } from 'react';
import { Search, Bell, User, Bookmark } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { featuresConfig } from '@/config/features';

export function AdminHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex items-center justify-end gap-2 mb-8 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm w-full">
        {/* Search */}
        <button onClick={() => setSearchOpen(true)} className="p-2 flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group" aria-label="Search (Ctrl+K)">
          <Search className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
        </button>

        {/* Bookmarks */}
        <button className="hidden sm:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group" aria-label="Bookmarks">
          <Bookmark className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
        </button>

        {/* Notifications */}
        <button className="hidden sm:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group relative" aria-label="Notifications">
          <Bell className="w-5 h-5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>

        <div className="hidden sm:block h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        {/* Theme Toggle */}
        <div className="flex items-center">
          {featuresConfig.enableDarkMode && <ThemeToggle />}
        </div>
        
        {/* User Profile */}
        <div className="flex items-center ml-2">
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
