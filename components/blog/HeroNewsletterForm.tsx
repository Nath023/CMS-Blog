'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { subscribeToNewsletter } from '@/lib/newsletter/actions';

export function HeroNewsletterForm() {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10 max-w-xl">
      <input type="hidden" name="source" value="hero" />
      
      {/* Honeypot field for spam protection */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <input type="text" name="b_name" tabIndex={-1} autoComplete="off" />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Input 
          name="first_name" 
          placeholder="First Name (optional)" 
          className="flex-1 font-sans h-14 text-base bg-white dark:bg-[#0a0a0a] rounded-xl border-gray-200 dark:border-white/10"
        />
        <Input 
          name="email" 
          type="email" 
          placeholder="Email Address" 
          required 
          className="flex-[2] font-sans h-14 text-base bg-white dark:bg-[#0a0a0a] rounded-xl border-gray-200 dark:border-white/10"
        />
        <Button type="submit" disabled={loading} className="whitespace-nowrap h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white font-bold tracking-wide rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5">
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      
      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400 font-sans">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-[#FAFAFA] dark:border-[#050505] flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
               <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Subscriber" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <p>Join over <strong>755+</strong> forward-thinking founders.</p>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-sans border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' 
            : 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'
        }`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
