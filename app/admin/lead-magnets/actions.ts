'use server';

import { createLeadMagnetAdmin, uploadLeadMagnetFile, updateLeadMagnetAdmin, deleteLeadMagnetAdmin } from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

export async function createLeadMagnet(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const button_text = formData.get('button_text') as string;
  const success_message = formData.get('success_message') as string;
  const is_active = formData.get('is_active') === 'on';
  
  const file = formData.get('file') as File;
  let file_url = '';
  
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const result = await uploadLeadMagnetFile(fileName, file);
    if (result.error) return { error: 'Failed to upload file' };
    if (result.publicUrl) file_url = result.publicUrl;
  }
  
  const { error } = await createLeadMagnetAdmin({
    title, slug, description, button_text, success_message, file_url, is_active
  });
  
  if (error) return { error: error.message };
  
  revalidatePath(ROUTES.GUIDES); 
  revalidatePath(ROUTES.ADMIN.LEAD_MAGNETS);
  redirect(ROUTES.ADMIN.LEAD_MAGNETS);
}

export async function updateLeadMagnet(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const button_text = formData.get('button_text') as string;
  const success_message = formData.get('success_message') as string;
  const is_active = formData.get('is_active') === 'on';
  
  const updates: any = {
    title, slug, description, button_text, success_message, is_active,
    updated_at: new Date().toISOString(),
  };
  const file = formData.get('file') as File;
  
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const result = await uploadLeadMagnetFile(fileName, file);
    if (result.error) return { error: 'Failed to upload file' };
    if (result.publicUrl) updates.file_url = result.publicUrl;
  }
  
  const { error } = await updateLeadMagnetAdmin(id, updates);
  
  if (error) return { error: error.message };
  
  revalidatePath(ROUTES.GUIDES); 
  revalidatePath(ROUTES.ADMIN.LEAD_MAGNETS);
  redirect(ROUTES.ADMIN.LEAD_MAGNETS);
}

export async function deleteLeadMagnet(id: string) {
  const { error } = await deleteLeadMagnetAdmin(id);
  if (error) return { error: error.message };
  revalidatePath(ROUTES.GUIDES); 
  revalidatePath(ROUTES.ADMIN.LEAD_MAGNETS);
  redirect(ROUTES.ADMIN.LEAD_MAGNETS);
}
