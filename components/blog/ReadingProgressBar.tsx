'use client';

import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;
      
      const { top, bottom, height } = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (top > windowHeight) {
        setProgress(0);
      } else if (bottom < 0) {
        setProgress(100);
      } else {
        const scrolled = windowHeight - top;
        const total = height;
        const p = (scrolled / total) * 100;
        setProgress(Math.min(Math.max(p, 0), 100));
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
      <div 
        className="h-full bg-blue-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
