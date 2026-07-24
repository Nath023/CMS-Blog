import { NextResponse } from 'next/server';
import { publishScheduledPostsAdmin } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scheduledPosts = await publishScheduledPostsAdmin();

    if (scheduledPosts.length === 0) {
      return NextResponse.json({ message: 'No scheduled posts to publish.' });
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
