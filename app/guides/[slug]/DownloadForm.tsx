'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { downloadLeadMagnet } from './actions';

export default function DownloadForm({ magnet }: { magnet: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    const formData = new FormData(e.currentTarget);
    const result = await downloadLeadMagnet(formData);
    
    if (result?.error) {
      setMessage({ text: result.error, type: 'error' });
      setLoading(false);
    } else if (result?.success) {
      setMessage({ text: result.success, type: 'success' });
      (e.target as HTMLFormElement).reset();
      setLoading(false);
      
      // Trigger download
      if (result.fileUrl) {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = result.fileUrl;
          a.download = magnet.title + '.pdf';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, 1000);
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="hidden" name="lead_magnet_id" value={magnet.id} />
        
        {/* Honeypot field for spam protection */}
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <input type="text" name="b_name" tabIndex={-1} autoComplete="off" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name (Optional)</label>
          <Input name="first_name" placeholder="Your name" className="font-sans" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
          <Input name="email" type="email" required placeholder="you@example.com" className="font-sans" />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full mt-2 text-base h-12">
          {loading ? 'Processing...' : (magnet.button_text || 'Download Now')}
        </Button>
        
        <p className="text-xs text-center text-slate-500 mt-2">
          By downloading, you agree to our privacy policy and consent to receive our newsletter.
        </p>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm mt-2 font-medium text-center border ${
            message.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' 
              : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
