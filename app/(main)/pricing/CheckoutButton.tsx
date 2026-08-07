'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

export function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId && stripePromise) {
        const stripe = await stripePromise;
        await (stripe as any)?.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert(data.error || 'Checkout not configured in this environment. Add Stripe API keys.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full h-12 rounded-xl text-base font-bold bg-indigo-500 hover:bg-indigo-600 text-white border-0"
    >
      {loading ? 'Processing...' : 'Subscribe Now'}
    </Button>
  );
}
