'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { siteConfig } from '@/config/site';
import { Check } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: Record<string, any>;
  onSave: (settings: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
}

const COLOR_PRESETS = [
  { name: "Coral (Default)", value: "default", hex: "#FF6B6B" },
  { name: "Rose", value: "rose", hex: "#e11d48" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Green", value: "green", hex: "#10b981" },
  { name: "Violet", value: "violet", hex: "#8b5cf6" },
  { name: "Orange", value: "orange", hex: "#f97316" },
];

export function SettingsForm({ initialSettings, onSave }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [siteName, setSiteName] = useState(initialSettings.site_name || siteConfig.name);
  const [siteDescription, setSiteDescription] = useState(initialSettings.site_description || siteConfig.description);
  const [siteLogoUrl, setSiteLogoUrl] = useState(initialSettings.site_logo_url || '');
  const [defaultAuthor, setDefaultAuthor] = useState(initialSettings.default_author || siteConfig.authorBio.name);
  const [defaultMetaImage, setDefaultMetaImage] = useState(initialSettings.default_meta_image || siteConfig.authorBio.imageUrl);
  const [colorTheme, setColorTheme] = useState(initialSettings.color_theme || 'default');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(() => {
      onSave({
        site_name: siteName,
        site_description: siteDescription,
        site_logo_url: siteLogoUrl,
        default_author: defaultAuthor,
        default_meta_image: defaultMetaImage,
        color_theme: colorTheme,
      }).then(result => {
        if (!result.success) {
          setError(result.error || 'Failed to save settings');
        } else {
          router.refresh();
        }
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Site Logo
          </label>
          <ImageUpload value={siteLogoUrl} onChange={setSiteLogoUrl} />
        </div>
        <div>
          <label htmlFor="siteName" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Site Name
          </label>
          <input
            type="text"
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder={`e.g. ${siteConfig.name}`}
          />
        </div>

        <div>
          <label htmlFor="siteDescription" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Site Description
          </label>
          <textarea
            id="siteDescription"
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="Short description of the site"
          />
        </div>

        <div>
          <label htmlFor="defaultAuthor" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Default Author Name
          </label>
          <input
            type="text"
            id="defaultAuthor"
            value={defaultAuthor}
            onChange={(e) => setDefaultAuthor(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder={`e.g. ${siteConfig.authorBio.name}`}
          />
        </div>

        <div>
          <label htmlFor="defaultMetaImage" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            Default Meta Image URL
          </label>
          <input
            type="text"
            id="defaultMetaImage"
            value={defaultMetaImage}
            onChange={(e) => setDefaultMetaImage(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
            Site Color Theme
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setColorTheme(preset.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  colorTheme === preset.value 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: preset.hex }}
                >
                  {colorTheme === preset.value && (
                    <Check className="w-5 h-5 text-white drop-shadow-md" />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {preset.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            This will change the primary brand color across the entire site.
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
