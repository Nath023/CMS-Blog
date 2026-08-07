'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function TTSPlayer({ title, content, language = 'en' }: { title: string, content: string, language?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const prepareText = () => {
    // Strip simple markdown and html
    const cleanContent = content.replace(/<[^>]+>/g, '').replace(/[#*`_]/g, '');
    return `${title}. \n\n ${cleanContent}`;
  };

  const handlePlay = () => {
    if (!synthRef.current) return;
    
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(prepareText());
    utterance.lang = language || 'en';
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (synthRef.current) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8">
      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
        <Volume2 className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Listen to this article</h4>
        <p className="text-xs text-slate-500">Audio generated in browser</p>
      </div>
      <div className="flex gap-2">
        {!isPlaying ? (
          <Button variant="outline" size="sm" onClick={handlePlay} className="h-9 w-9 p-0 rounded-full">
            <Play className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handlePause} className="h-9 w-9 p-0 rounded-full">
            <Pause className="w-4 h-4" />
          </Button>
        )}
        {(isPlaying || isPaused) && (
          <Button variant="outline" size="sm" onClick={handleStop} className="h-9 w-9 p-0 rounded-full text-slate-500 hover:text-red-500">
            <Square className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
