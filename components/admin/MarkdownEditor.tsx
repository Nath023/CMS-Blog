'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MediaLibrary } from './MediaLibrary';

export function MarkdownEditor({
  name,
  defaultValue,
  value: controlledValue,
  onChange,
}: {
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const [showMedia, setShowMedia] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertMedia = (url: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
    const fileName = url.split('/').pop() || 'Download';
    const mediaMarkdown = isImage ? `\n![Image](${url})\n` : `\n[Download ${fileName}](${url})\n`;
    
    const newText = text.substring(0, start) + mediaMarkdown + text.substring(end);
    
    if (controlledValue === undefined) {
      setInternalValue(newText);
    }
    if (onChange) {
      onChange(newText);
    }
    setShowMedia(false);
    
    // Set cursor position after inserted markdown
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + mediaMarkdown.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="flex flex-col h-[500px] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Markdown Content
        </span>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setShowMedia(true)}
        >
          Insert File or Image
        </Button>
      </div>
      <textarea 
        ref={textareaRef}
        name={name} 
        value={value} 
        onChange={handleChange} 
        className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
        placeholder="Write your content in Markdown..."
      />
      {showMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl w-full">
            <MediaLibrary 
              onSelect={insertMedia}
              onCancel={() => setShowMedia(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
