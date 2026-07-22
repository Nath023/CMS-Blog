'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteSubscriber(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath('/admin/subscribers');
  return { success: true };
}

export async function exportSubscribersCsv() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('subscribers')
    .select('email,first_name,status,source,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) return { csv: 'email,first_name,status,source,created_at\n' };

  const header = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).map(v => `"${v || ''}"`).join(',')).join('\n');
  return { csv: `${header}\n${rows}` };
}
