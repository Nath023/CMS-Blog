'use server';

import { createTagAdmin, updateTagAdmin, deleteTagAdmin } from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveTag(formData: FormData) {

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
    const { error } = await updateTagAdmin(id, payload);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await createTagAdmin(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/tags');
  return { success: true };
}

export async function deleteTag(id: string) {

  const { error } = await deleteTagAdmin(id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/tags');
  return { success: true };
}


export async function bulkDeleteTags(ids: string[]) {
  for (const id of ids) {
    await deleteTag(id);
  }
  revalidatePath('/admin/tags');
  return { success: true };
}
