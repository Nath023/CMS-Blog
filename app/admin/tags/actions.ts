'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveTag(formData: FormData) {
  const supabase = createClient();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;

  if (!name || !slug) {
    throw new Error('Name and slug are required');
  }

  const payload = {
    name,
    slug,
  };

  if (id) {
    const { error } = await supabase.from('tags').update(payload).eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('tags').insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/tags');
  return { success: true };
}

export async function deleteTag(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/tags');
  return { success: true };
}
