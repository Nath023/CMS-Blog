'use server';

import { deletePost, updatePost } from '@/lib/database';
import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { POST_STATUS } from '@/constants';

export async function bulkDeletePosts(ids: string[]) {
  for (const id of ids) {
    await deletePost(id);
  }
  revalidatePath('/admin/posts');
  return { success: true };
}

export async function bulkUpdatePostStatus(ids: string[], status: string) {
  const supabase = await createServerClient();
  
  for (const id of ids) {
    const payload: any = { status };
    if (status === POST_STATUS.PUBLISHED) {
      payload.published_at = new Date().toISOString();
    }
    await supabase.from('posts').update(payload).eq('id', id);
  }
  revalidatePath('/admin/posts');
  return { success: true };
}
