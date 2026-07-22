import { getSettings } from '@/lib/blog/queries';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export default async function SettingsPage() {
  const settings = await getSettings();

  async function saveSettings(newSettings: Record<string, any>) {
    'use server';
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    try {
      const keys = Object.keys(newSettings);
      
      for (const key of keys) {
        const { error } = await supabase
          .from('settings')
          .upsert({ 
            key, 
            value: newSettings[key] 
          }, { onConflict: 'key' });
          
        if (error) throw error;
      }

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
