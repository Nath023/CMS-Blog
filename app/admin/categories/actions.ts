'use server';

import { createCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin } from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveCategory(formData: FormData) {

  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  if (!name || !slug) {
    throw new Error('Name and slug are required');
  }

  const payload = {
    name,
    slug,
    description: description || null,
  };

  if (id) {
    const { error } = await updateCategoryAdmin(id, payload);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await createCategoryAdmin(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/categories');
  return { success: true };
}

export async function deleteCategory(id: string) {

  const { error } = await deleteCategoryAdmin(id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/categories');
  return { success: true };
}
