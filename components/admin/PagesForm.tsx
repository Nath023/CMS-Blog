'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MarkdownEditor } from './MarkdownEditor';

interface PagesFormProps {
  pages: string[];
  initialSettings: Record<string, any>;
  onSave: (key: string, content: string) => Promise<{ success: boolean; error?: string }>;
}

export function PagesForm({ pages, initialSettings, onSave }: PagesFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [content, setContent] = useState(initialSettings[`page_${pages[0]}`] || '');

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPage = e.target.value;
    setSelectedPage(newPage);
    setContent(initialSettings[`page_${newPage}`] || '');
    setError(null);
    setSuccess(null);
  };

  const handlePreview = () => {
    localStorage.setItem('preview_page_content', content);
    localStorage.setItem('preview_page_title', selectedPage);
    window.open('/preview', '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    startTransition(() => {
      onSave(`page_${selectedPage}`, content).then(result => {
        if (!result.success) {
          setError(result.error || 'Failed to save page content');
        } else {
          setSuccess('Page content saved successfully.');
          router.refresh();
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="pageSelect" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Select Page
          </label>
          <select
            id="pageSelect"
            value={selectedPage}
            onChange={handlePageChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          >
            {pages.map(page => (
              <option key={page} value={page}>{page.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Markdown Content
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={handlePreview}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mr-3"
        >
          Preview
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isPending ? 'Saving...' : 'Save Content'}
        </button>
      </div>
    </form>
  );
}
