import { NextRequest, NextResponse } from 'next/server';
import { recordPostView } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();
    if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });

    const sessionId = req.headers.get('x-forwarded-for') || req.ip || 'anonymous';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || req.headers.get('referrer') || undefined;
    
    // Vercel and similar edge providers send these headers
    const country = req.headers.get('x-vercel-ip-country') || undefined;
    const city = req.headers.get('x-vercel-ip-city') || undefined;

    await recordPostView(postId, sessionId, userAgent, referrer, country, city);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message !== 'fetch failed' && !error?.message?.includes('ECONNREFUSED')) console.error('View tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
