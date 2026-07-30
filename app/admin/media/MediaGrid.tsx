'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { deleteMedia, updateMediaMetadata } from './actions';
import { useRouter } from 'next/navigation';
import { File as FileIcon } from 'lucide-react';

export default function MediaGrid({ initialMedia }: { initialMedia: any[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('saveToMedia', 'true');
      
      try {
        await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.error(err);
      }
    }
    setUploading(false);
    router.refresh(); // Refresh the page to get the latest media
  };

  const filteredMedia = media.filter((item) => 
    item.file_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.alt_text?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <Input 
          placeholder="Search media..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            id="media-upload-grid" 
            className="hidden" 
            multiple
            onChange={handleUpload}
            disabled={uploading}
          />
          <Button disabled={uploading} className="relative">
            <label htmlFor="media-upload-grid" className="absolute inset-0 cursor-pointer flex items-center justify-center">
              {uploading ? 'Uploading...' : 'Upload Files'}
            </label>
            <span className="opacity-0">{uploading ? 'Uploading...' : 'Upload Files'}</span>
          </Button>
        </div>
      </div>
      
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500">No media found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer"
              onClick={() => setEditingItem(item)}
            >
              <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-950">
                {item.file_name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <Image 
                    src={item.file_url} 
                    alt={item.alt_text || item.file_name} 
                    fill 
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-950 group-hover:text-primary transition-colors">
                    <FileIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={item.file_name}>
                  {item.file_name}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {item.size ? Math.round(item.size / 1024) + ' KB' : 'Unknown size'} • {item.created_at.split('T')[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-6 shadow-2xl">
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                {editingItem.file_name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <Image src={editingItem.file_url} alt={editingItem.alt_text || 'Preview'} fill sizes="(max-width: 768px) 100vw, 500px" className="object-contain" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-400 gap-3">
                    <FileIcon className="w-16 h-16" />
                    <span className="text-sm font-medium">{editingItem.file_name.split('.').pop()?.toUpperCase()} File</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 break-all bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="font-semibold mb-1 text-slate-900 dark:text-slate-100">File URL:</p>
                <a href={editingItem.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {editingItem.file_url}
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Media Details</h3>
                <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>Close</Button>
              </div>
              
              <form 
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  await updateMediaMetadata(editingItem.id, formData.get('alt_text') as string);
                  setEditingItem(null);
                  router.refresh();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">File Name</label>
                  <Input defaultValue={editingItem.file_name} readOnly className="bg-slate-50 dark:bg-slate-950 text-slate-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Alt Text</label>
                  <Input name="alt_text" defaultValue={editingItem.alt_text || ''} placeholder="Describe the image for screen readers" />
                  <p className="text-xs text-slate-500 mt-1">Important for SEO and accessibility.</p>
                </div>
                
                <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                  <Button 
                    type="button" 
                    variant="danger" 
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this media? This may break images in posts.')) {
                        await deleteMedia(editingItem.id, editingItem.file_url);
                        setEditingItem(null);
                        router.refresh();
                      }
                    }}
                  >
                    Delete Permanently
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
