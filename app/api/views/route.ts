import { NextRequest, NextResponse } from 'next/server';
import { recordPostView } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });

    const sessionId = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await recordPostView(postId, sessionId, userAgent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
