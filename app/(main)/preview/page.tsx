'use client';

import { useEffect, useState } from 'react';
import { StaticPageContent } from '@/components/StaticPageContent';
import { ArrowLeft } from 'lucide-react';

export default function PreviewPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Preview');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const previewContent = localStorage.getItem('preview_page_content') || '';
    const previewTitle = localStorage.getItem('preview_page_title') || 'Preview';
    setContent(previewContent);
    setTitle(previewTitle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 px-4 py-3 text-center text-sm font-medium flex items-center justify-center gap-4 fixed top-0 w-full z-50">
        <span>⚠️ This is a live preview of the page content</span>
        <button onClick={() => window.close()} className="bg-amber-200 dark:bg-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors">Close Preview</button>
      </div>
      <div className="pt-12">
        <StaticPageContent content={content} defaultTitle={title} />
      </div>
    </div>
  );
}
