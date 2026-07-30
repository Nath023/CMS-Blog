'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getMediaFilesClient } from '@/lib/database';
import { FileIcon, Link as LinkIcon } from 'lucide-react';

export function MediaLibrary({ onSelect, onCancel }: { onSelect: (url: string) => void, onCancel: () => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  
  const fetchMedia = async () => {
    setLoading(true);
    try {
      let files = await getMediaFilesClient();
      files = files.filter((f: any) => search ? f.name.toLowerCase().includes(search.toLowerCase()) : true);
      setMedia(files.map((f: any) => ({
        id: f.name,
        file_url: f.url,
        file_name: f.name,
        created_at: new Date().toISOString()
      })));
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

  const handleExternalInsert = () => {
    if (externalUrl.trim()) {
      onSelect(externalUrl.trim());
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg max-h-[80vh]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 shrink-0">Media & Files</h2>
        
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Input 
            placeholder="Paste external link (e.g. Google Drive)..." 
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="flex-1 sm:w-[250px]"
          />
          <Button variant="default" size="sm" onClick={handleExternalInsert} disabled={!externalUrl.trim()}>
            <LinkIcon className="w-4 h-4 mr-2" />
            Insert
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel} className="ml-2">Close</Button>
        </div>
      </div>

      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-4 bg-slate-50 dark:bg-slate-950/50">
        <Input 
          placeholder="Search files..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-white dark:bg-slate-900"
        />
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            id="media-upload" 
            className="hidden" 
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
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary transition-colors bg-slate-50 dark:bg-slate-950"
                onClick={() => onSelect(item.file_url)}
              >
                {item.file_name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <Image src={item.file_url} alt={item.alt_text || item.file_name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <FileIcon className="w-10 h-10 mb-2" />
                    <span className="text-xs px-2 truncate max-w-full font-medium" title={item.file_name}>{item.file_name.split('.').pop()?.toUpperCase()}</span>
                  </div>
                )}
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
