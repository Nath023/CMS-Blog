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

  const [heroBadge, setHeroBadge] = useState(initialSettings.hero_badge || 'Our Newsletter');
  const [heroTitle, setHeroTitle] = useState(initialSettings.hero_title || 'Scale Your Brand with Digital Insights');
  const [heroDescription, setHeroDescription] = useState(initialSettings.hero_description || 'Actionable strategies, expert tutorials, and proven frameworks on web design, SEO, and digital growth delivered straight to your inbox.');

  const [heroCard1Icon, setHeroCard1Icon] = useState(initialSettings.hero_card_1_icon || 'AL');
  const [heroCard1Title, setHeroCard1Title] = useState(initialSettings.hero_card_1_title || 'New Strategy Guide');
  const [heroCard1Subtitle, setHeroCard1Subtitle] = useState(initialSettings.hero_card_1_subtitle || 'Just sent to your inbox');

  const [heroCard2Icon, setHeroCard2Icon] = useState(initialSettings.hero_card_2_icon || 'SEO');
  const [heroCard2Title, setHeroCard2Title] = useState(initialSettings.hero_card_2_title || 'Local SEO Checklist');
  const [heroCard2Subtitle, setHeroCard2Subtitle] = useState(initialSettings.hero_card_2_subtitle || 'Attachment included');

  const [heroCard3Icon, setHeroCard3Icon] = useState(initialSettings.hero_card_3_icon || 'CRO');
  const [heroCard3Title, setHeroCard3Title] = useState(initialSettings.hero_card_3_title || 'Conversion Tips');
  const [heroCard3Subtitle, setHeroCard3Subtitle] = useState(initialSettings.hero_card_3_subtitle || 'Read in 3 mins');

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
        hero_badge: heroBadge,
        hero_title: heroTitle,
        hero_description: heroDescription,
        hero_card_1_icon: heroCard1Icon,
        hero_card_1_title: heroCard1Title,
        hero_card_1_subtitle: heroCard1Subtitle,
        hero_card_2_icon: heroCard2Icon,
        hero_card_2_title: heroCard2Title,
        hero_card_2_subtitle: heroCard2Subtitle,
        hero_card_3_icon: heroCard3Icon,
        hero_card_3_title: heroCard3Title,
        hero_card_3_subtitle: heroCard3Subtitle,
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

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Blog Hero Section</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="heroBadge" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Hero Badge Text
              </label>
              <input
                type="text"
                id="heroBadge"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Our Newsletter"
              />
            </div>
            
            <div>
              <label htmlFor="heroTitle" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                id="heroTitle"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Scale Your Brand with Digital Insights"
              />
            </div>

            <div>
              <label htmlFor="heroDescription" className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Hero Description
              </label>
              <textarea
                id="heroDescription"
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Actionable strategies, expert tutorials..."
              />
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-md font-bold text-slate-900 dark:text-slate-100 mb-4">Hero Cards</h3>
              
              {/* Card 1 */}
              <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="text-sm font-semibold mb-3">Card 1</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Icon Text</label>
                    <input type="text" value={heroCard1Icon} onChange={e => setHeroCard1Icon(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Title</label>
                    <input type="text" value={heroCard1Title} onChange={e => setHeroCard1Title(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Subtitle</label>
                    <input type="text" value={heroCard1Subtitle} onChange={e => setHeroCard1Subtitle(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="text-sm font-semibold mb-3">Card 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Icon Text</label>
                    <input type="text" value={heroCard2Icon} onChange={e => setHeroCard2Icon(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Title</label>
                    <input type="text" value={heroCard2Title} onChange={e => setHeroCard2Title(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Subtitle</label>
                    <input type="text" value={heroCard2Subtitle} onChange={e => setHeroCard2Subtitle(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="text-sm font-semibold mb-3">Card 3</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Icon Text</label>
                    <input type="text" value={heroCard3Icon} onChange={e => setHeroCard3Icon(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Title</label>
                    <input type="text" value={heroCard3Title} onChange={e => setHeroCard3Title(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Subtitle</label>
                    <input type="text" value={heroCard3Subtitle} onChange={e => setHeroCard3Subtitle(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
