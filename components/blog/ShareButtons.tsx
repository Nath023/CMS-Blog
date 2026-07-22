'use client';

import { Link as LinkIcon, Check, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setCanShare(true);
    }
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleNativeShare = async () => {
    try {
      if (!!navigator.share) {
        await !!navigator.share({
          title: title,
          url: url
        });
      }
    } catch (err) {
      console.error('Error sharing', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">Share:</span>
      
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-[#25D366] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.65.86 5.111 2.308 7.15l-1.528 5.578 5.703-1.498a11.96 11.96 0 005.548 1.37h.005c6.645 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.062a9.94 9.94 0 01-5.068-1.37l-.363-.215-3.77 1.002.99-3.676-.236-.375a9.92 9.92 0 01-1.497-5.397c0-5.498 4.475-9.973 9.974-9.973s9.974 4.475 9.974 9.973-4.476 9.974-9.974 9.974zm5.484-7.496c-.302-.15-1.782-.88-2.057-.98-.276-.1-.476-.15-.677.15-.202.301-.777.98-.953 1.18-.176.2-.352.226-.653.076-1.554-.77-2.613-1.435-3.64-3.21-.212-.365-.015-.55.132-.705.135-.143.302-.352.453-.527.15-.176.201-.301.302-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.23-.245-.586-.495-.506-.677-.516-.175-.01-.376-.01-.577-.01-.2 0-.527.076-.803.377-.276.3-1.054 1.03-1.054 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.122 3.238 5.142 4.54.718.31 1.278.496 1.716.634.72.23 1.375.197 1.892.12.58-.086 1.782-.728 2.033-1.43.251-.703.251-1.306.176-1.432-.075-.126-.276-.2-.578-.352z"/>
        </svg>
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-[#1877F2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Share on Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-[#1DA1F2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Share on Twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.004 3.985H5.078z"/>
        </svg>
      </a>
      
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-[#0A66C2] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      </a>

      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? <Check className="w-5 h-5 text-green-600" /> : <LinkIcon className="w-5 h-5" />}
      </button>

      {canShare && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Share via device"
          title="Share via device"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
