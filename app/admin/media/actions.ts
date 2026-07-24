'use server';

import { deleteMediaFileAdmin } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function deleteMedia(id: string, file_url: string) {

  
  // Extract filename from URL
  const fileName = file_url.split('/').pop();
  
  if (fileName) {
    // Attempt to delete from storage
    await deleteMediaFileAdmin(fileName);
  }

  revalidatePath('/admin/media');
  return { success: true };
}

export async function updateMediaMetadata(id: string, alt_text: string) {
  // Mock success since we dropped the media table
  revalidatePath('/admin/media');
  return { success: true };
}
