'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createLeadMagnet } from '../actions';
import Link from 'next/link';

export default function NewLeadMagnetPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await createLeadMagnet(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">New Lead Magnet</h1>
        <Link 
          href="/admin/lead-magnets"
          className="border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
        >
          Cancel
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
          <Input name="title" required placeholder="e.g. 10 SEO Tips" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Slug</label>
          <Input name="slug" required placeholder="e.g. 10-seo-tips" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
          <textarea 
            name="description" 
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 dark:text-white min-h-[100px]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">PDF File</label>
          <Input type="file" name="file" accept="application/pdf" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Button Text</label>
          <Input name="button_text" defaultValue="Download Now" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Success Message</label>
          <Input name="success_message" defaultValue="Thanks! Your download will begin shortly." />
        </div>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked className="w-4 h-4 rounded text-primary" />
          <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Is Active</label>
        </div>
        
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Lead Magnet'}
          </Button>
        </div>
      </form>
    </div>
  );
}
