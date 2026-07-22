'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="search"
        placeholder="Search articles..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full bg-[#FAFAFA] dark:bg-[#050505] border-none rounded-[1.5rem] px-6 py-4 text-sm font-sans text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary transition-colors">
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
