'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Folder, User } from 'lucide-react';

export function SearchDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K to open (handled in HeaderNav) and Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleSearch} className="relative flex items-center border-b border-slate-100 dark:border-slate-800/50">
          <Search className="absolute left-6 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            autoFocus
            className="w-full bg-transparent pl-14 pr-16 py-5 text-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none" 
            placeholder="Search articles, categories, authors..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-6 flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded text-xs font-medium text-slate-500 dark:text-slate-400">ESC</kbd>
            <button type="button" onClick={onClose} className="p-1 sm:hidden text-slate-400 hover:text-slate-600 focus:outline-none">
              <X className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="p-6 overflow-y-auto max-h-[60vh] hide-scrollbar">
          {!query ? (
            <div className="space-y-8">
              {/* Popular Searches */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Next.js 14', 'React Server Components', 'Tailwind CSS', 'Supabase Auth', 'SEO Optimization'].map(term => (
                    <button 
                      key={term}
                      onClick={() => { setQuery(term); router.push(`/blog/search?q=${encodeURIComponent(term)}`); onClose(); }}
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Folder className="w-4 h-4" /> Categories
                  </h3>
                  <ul className="space-y-2">
                    {['Technology', 'Business', 'Marketing'].map(cat => (
                      <li key={cat}>
                        <button onClick={() => { router.push(`/blog/category/${cat.toLowerCase()}`); onClose(); }} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors focus:outline-none">
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Authors
                  </h3>
                  <ul className="space-y-2">
                    {['Admin User', 'Jane Doe'].map(author => (
                      <li key={author}>
                        <button onClick={() => { router.push(`/blog/author/${author.toLowerCase().replace(' ', '-')}`); onClose(); }} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors focus:outline-none">
                          {author}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Press Enter to search
              </h3>
              <button 
                onClick={handleSearch}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <span className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-900 dark:text-slate-100 font-medium">Search for &quot;{query}&quot;</span>
                </span>
                <Search className="w-4 h-4 text-primary" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
