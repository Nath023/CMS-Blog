import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { POST_STATUS } from '@/constants';

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient();
    
    // Find all drafts with a published_at date in the past
    const { data: postsToPublish } = await supabase
      .from('posts')
      .select('id, title, published_at')
      .eq('status', POST_STATUS.DRAFT)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString());

    if (!postsToPublish || postsToPublish.length === 0) {
      return NextResponse.json({ message: 'No scheduled posts to publish' });
    }

    const ids = postsToPublish.map(p => p.id);

    // Update their status to published
    await supabase
      .from('posts')
      .update({ status: POST_STATUS.PUBLISHED })
      .in('id', ids);

    return NextResponse.json({ 
      success: true, 
      message: `Published ${ids.length} scheduled posts`,
      published_ids: ids
    });
  } catch (err: any) {
    console.error('Cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
