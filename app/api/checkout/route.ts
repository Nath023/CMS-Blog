import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createServerClient } from '@/lib/supabase/server';

let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return null;
    stripeClient = new Stripe(key, { apiVersion: '2026-07-29.dahlia' });
  }
  return stripeClient;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const { priceId } = await req.json();
    
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      // In a real app we might redirect to login first
      return NextResponse.json({ error: 'You must be logged in to subscribe' }, { status: 401 });
    }

    // Get origin
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID || priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      client_reference_id: session.user.id,
      customer_email: session.user.email,
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
