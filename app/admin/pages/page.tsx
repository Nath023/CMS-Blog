import { getSettings } from '@/lib/fetch';
import { PagesForm } from '@/components/admin/PagesForm';
import { saveGlobalSettings } from '@/lib/database';
import { revalidatePath } from 'next/cache';

const PAGES = [
  'status', 'cookie-policy', 'accessibility',
  'careers', 'changelog', 'help', 'licenses', 'partners', 'press',
  'docs', 'topics', 'coming-soon', 'authors', 'categories', 'faq',
  'newsletter', 'resources', 'tutorials', 'checklists',
  'tools', 'downloads', 'templates', 'freebies'
];

export default async function AdminPagesPage() {
  const settings = await getSettings();

  async function savePageContent(key: string, content: string) {
    'use server';
    try {
      await saveGlobalSettings({ [key]: content });
      revalidatePath('/', 'layout');
      return { success: true };
    } catch (e: any) {
      console.error('Save page content error:', e);
      return { success: false, error: e.message || 'Failed to save content' };
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Static Pages</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage content for static pages like status, privacy, etc.</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <PagesForm pages={PAGES} initialSettings={settings} onSave={savePageContent} />
      </div>
    </div>
  );
}
