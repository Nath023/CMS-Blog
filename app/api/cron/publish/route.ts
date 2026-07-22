import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Optional: you can secure this via a secret cron key
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Find all draft posts where published_at is in the past
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, published_at')
      .eq('status', 'draft')
      .lte('published_at', now);

    if (fetchError) {
      console.error('Fetch scheduled posts error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({ message: 'No scheduled posts to publish.' });
    }

    const postIds = scheduledPosts.map(p => p.id);

    // Update status to 'published'
    const { error: updateError } = await supabase
      .from('posts')
      .update({ status: 'published', updated_at: now })
      .in('id', postIds);

    if (updateError) {
      console.error('Publish scheduled posts error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Successfully published ${scheduledPosts.length} posts.`,
      posts: scheduledPosts
    });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
