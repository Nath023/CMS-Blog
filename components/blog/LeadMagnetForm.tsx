'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { downloadLeadMagnet } from '@/lib/newsletter/leadMagnetActions';
import Image from 'next/image';

interface LeadMagnetFormProps {
  magnet: {
    id: string;
    title: string;
    description?: string;
    cover_image_url?: string;
    button_text?: string;
  };
  postId?: string;
}

export function LeadMagnetForm({ magnet, postId }: LeadMagnetFormProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; type: string; url?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await downloadLeadMagnet(formData);
    
    if (res.error) {
      setResult({ text: res.error, type: 'error' });
    } else if (res.success && res.file_url) {
      setResult({ text: res.message || 'Ready to download!', type: 'success', url: res.file_url });
      
      // Auto trigger download for ease
      const link = document.createElement('a');
      link.href = res.file_url;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 my-10 flex flex-col sm:flex-row gap-8 items-center max-w-4xl mx-auto shadow-sm">
      {magnet.cover_image_url && (
        <div className="w-full sm:w-1/3 aspect-[3/4] relative shrink-0 rounded-2xl overflow-hidden shadow-md">
          <Image src={magnet.cover_image_url} alt={magnet.title} fill className="object-cover" />
        </div>
      )}
      
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">{magnet.title}</h3>
        {magnet.description && (
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{magnet.description}</p>
        )}
        
        {result?.type === 'success' && result.url ? (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 p-6 rounded-xl flex flex-col items-center text-center">
            <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-bold mb-4">{result.text}</p>
            <a href={result.url} target="_blank" rel="noopener noreferrer" download>
              <Button>Download Again</Button>
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="hidden" name="lead_magnet_id" value={magnet.id} />
            {postId && <input type="hidden" name="post_id" value={postId} />}
            
            {/* Honeypot field for spam protection */}
            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
              <input type="text" name="b_name" tabIndex={-1} autoComplete="off" />
            </div>
            
            <div>
              <Input name="first_name" placeholder="First Name" className="bg-white dark:bg-slate-950" required />
            </div>
            <div>
              <Input name="email" type="email" placeholder="Email Address" className="bg-white dark:bg-slate-950" required />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? 'Processing...' : (magnet.button_text || 'Download Now')}
            </Button>
            
            {result?.type === 'error' && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{result.text}</p>
            )}
            
            <p className="text-xs text-slate-500 text-center mt-2">
              By downloading, you agree to receive our newsletter. You can unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
