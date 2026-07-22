'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export function MediaLibrary({ onSelect, onCancel }: { onSelect: (url: string) => void, onCancel: () => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const supabase = createClient();

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('blog-images').list();
      if (data) {
        let files = data
          .filter((f: any) => f.name !== '.emptyFolderPlaceholder' && f.metadata)
          .map((f: any) => {
            const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(f.name);
            return {
              id: f.id,
              file_url: publicUrl,
              file_name: f.name,
              created_at: f.created_at
            };
          });
        
        files.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        if (search) {
          files = files.filter(f => f.file_name.toLowerCase().includes(search.toLowerCase()));
        }
        setMedia(files);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('saveToMedia', 'true');
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchMedia();
      } else {
        const errorData = await res.json();
        alert(`Upload failed: ${errorData.error || res.statusText}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg max-h-[80vh]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Media Library</h2>
        <Button variant="outline" size="sm" onClick={onCancel}>Close</Button>
      </div>
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-4">
        <Input 
          placeholder="Search media..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            id="media-upload" 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload}
            disabled={uploading}
          />
          <label 
            htmlFor="media-upload" 
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-slate-950 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 h-9 px-3 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Upload New'}
          </label>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : media.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No media found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item) => (
              <div 
                key={item.id} 
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary transition-colors"
                onClick={() => onSelect(item.file_url)}
              >
                <Image src={item.file_url} alt={item.alt_text || item.file_name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <span className="text-white text-xs truncate" title={item.file_name}>{item.file_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
