'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { subscribeToNewsletter } from '@/lib/newsletter/actions';

interface NewsletterFormProps {
  source?: string;
  postId?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function NewsletterForm({ 
  source = 'website', 
  postId, 
  title = 'Join our newsletter',
  description = 'Get the latest insights on web design, SEO, and digital growth directly in your inbox.',
  className = ''
}: NewsletterFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);
    
    if (result.error) {
      setMessage({ text: result.error, type: 'error' });
    } else if (result.success) {
      setMessage({ text: result.success, type: 'success' });
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  return (
    <div className={`bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 ${className}`}>
      <h3 className="text-3xl font-serif text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 font-sans">{description}</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="hidden" name="source" value={source} />
        {postId && <input type="hidden" name="post_id" value={postId} />}
        
        {/* Honeypot field for spam protection */}
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <input type="text" name="b_name" tabIndex={-1} autoComplete="off" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Input 
            name="first_name" 
            placeholder="First Name (optional)" 
            className="flex-1 font-sans"
          />
          <Input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            required 
            className="flex-[2] font-sans"
          />
          <Button type="submit" disabled={loading} className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl">
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 font-sans mt-2">
          By subscribing, you agree to our privacy policy and consent to receive emails.
        </p>
        
        {message.text && (
          <div className={`p-3 rounded-lg text-sm mt-2 font-sans border ${
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
