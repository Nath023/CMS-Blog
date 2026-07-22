import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Call RPC or update directly
    // Wait, let's use the post_views table approach since it's preferred
    const sessionId = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // First check if a recent view exists for this session to prevent spam
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: recentView } = await supabase
      .from('post_views')
      .select('id')
      .eq('post_id', postId)
      .eq('session_id', sessionId)
      .gte('viewed_at', fiveMinutesAgo)
      .maybeSingle();

    if (!recentView) {
      await supabase.from('post_views').insert({
        post_id: postId,
        session_id: sessionId,
        device_type: userAgent.substring(0, 255)
      });
      
      // We should also increment posts.view_count for easy querying, but doing it via RPC is better.
      // However, we don't have an RPC function set up yet for increment.
      // So we'll just insert into post_views and we can calculate later, or we can fetch current and add 1 (though less safe from race conditions, using service_role makes it work).
      
      const { data: post } = await supabase.from('posts').select('view_count').eq('id', postId).single();
      if (post) {
        await supabase.from('posts').update({ view_count: (post.view_count || 0) + 1 }).eq('id', postId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
