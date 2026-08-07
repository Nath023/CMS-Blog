'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function submitPostFeedback(postId: string, isHelpful: boolean) {
  try {
    const supabase = await createServerClient();
    
    // get simple session id (fallback to IP or random if not using real sessions)
    const cookieStore = cookies();
    let sessionId = cookieStore.get('anon_session_id')?.value;
    
    await supabase.from('post_feedback').insert({
      post_id: postId,
      is_helpful: isHelpful,
      session_id: sessionId || 'anonymous'
    });
    
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to submit feedback' };
  }
}
