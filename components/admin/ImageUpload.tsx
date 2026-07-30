'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { MediaLibrary } from './MediaLibrary';

export function ImageUpload({ value, onChange }: { value?: string, onChange: (url: string) => void }) {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <Image src={value} alt="Preview" fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowLibrary(true)}>
              Change
            </Button>
            <Button size="sm" variant="danger" type="button" onClick={() => onChange('')}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="w-full h-48 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950"
        >
          <div className="flex flex-col items-center gap-1">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">No Image Selected</span>
          </div>
          <Button type="button" onClick={() => setShowLibrary(true)}>
            Select from Media Library
          </Button>
        </div>
      )}

      {showLibrary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl w-full">
            <MediaLibrary 
              onSelect={(url) => {
                onChange(url);
                setShowLibrary(false);
              }}
              onCancel={() => setShowLibrary(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
