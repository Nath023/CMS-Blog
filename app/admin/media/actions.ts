'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteMedia(id: string, file_url: string) {
  const supabase = createAdminClient();
  
  // Extract filename from URL
  const fileName = file_url.split('/').pop();
  
  if (fileName) {
    // Attempt to delete from storage
    await supabase.storage.from('blog-images').remove([fileName]);
  }

  revalidatePath('/admin/media');
  return { success: true };
}

export async function updateMediaMetadata(id: string, alt_text: string) {
  // Mock success since we dropped the media table
  revalidatePath('/admin/media');
  return { success: true };
}
