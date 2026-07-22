'use client';

import { useEffect, useState } from 'react';
import GithubSlugger from 'github-slugger';

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const slugger = new GithubSlugger();
    const extractHeadingsFromMarkdown = (markdown: string) => {
      const headingRegex = /^(##)\s+(.+)$/gm;
      let match;
      const extracted: any[] = [];
      while ((match = headingRegex.exec(markdown)) !== null) {
        const text = match[2];
        const id = slugger.slug(text);
        extracted.push({ id, text, level: 2 });
      }
      return extracted;
    };
    setHeadings(extractHeadingsFromMarkdown(content));
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    setTimeout(() => {
      const domHeadings = document.querySelectorAll('.prose h2');
      domHeadings.forEach((h) => observer.observe(h));
    }, 200);

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Table of Contents</h4>
      <nav className="flex flex-col gap-2.5">
        {headings.map(h => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`text-sm transition-colors ${activeId === h.id ? 'text-blue-600 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
