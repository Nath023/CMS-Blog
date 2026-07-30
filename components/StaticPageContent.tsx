import Markdown from 'react-markdown';
import Link from 'next/link';

interface StaticPageContentProps {
  content?: string;
  defaultTitle: string;
}

export function StaticPageContent({ content, defaultTitle }: StaticPageContentProps) {
  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#050505] min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-sm">
          <header className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4 capitalize">
              {defaultTitle}
            </h1>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {content ? (
              <Markdown>{content}</Markdown>
            ) : (
              <p className="text-lg text-slate-600 dark:text-slate-400">
                This is the {defaultTitle.toLowerCase()} page. Content coming soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
