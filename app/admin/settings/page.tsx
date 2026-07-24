import { getSettings } from '@/lib/fetch';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { saveGlobalSettings } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export default async function SettingsPage() {
  const settings = await getSettings();

  async function saveSettings(newSettings: Record<string, any>) {
    'use server';
    
    try {
      await saveGlobalSettings(newSettings);
      revalidatePath('/', 'layout');
      return { success: true };
    } catch (e: any) {
      console.error('Save settings error:', e);
      return { success: false, error: e.message || 'Failed to save settings' };
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Global Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage site-wide configurations and default values.</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <SettingsForm initialSettings={settings} onSave={saveSettings} />
      </div>
    </div>
  );
}
