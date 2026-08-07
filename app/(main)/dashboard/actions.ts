'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';

export async function getSavedArticles(userId: string) {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from('saved_articles')
      .select('id, post:posts(id, title, slug, author_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function unsaveArticle(userId: string, postId: string) {
  try {
    const supabase = await createServerClient();
    await supabase.from('saved_articles').delete().match({ user_id: userId, post_id: postId });
    return { success: true };
  } catch (err) {
    return { error: 'Failed to unsave' };
  }
}

export async function saveArticle(postId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { error: 'Not logged in' };
    
    await supabase.from('saved_articles').insert({
      user_id: session.user.id,
      post_id: postId
    });
    return { success: true };
  } catch (err) {
    return { error: 'Failed to save' };
  }
}

export async function hasSavedArticle(postId: string) {
  try {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    
    const { data } = await supabase.from('saved_articles').select('id').match({ user_id: session.user.id, post_id: postId }).single();
    return !!data;
  } catch (err) {
    return false;
  }
}
