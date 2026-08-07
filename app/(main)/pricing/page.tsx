import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { CheckoutButton } from './CheckoutButton';

export const metadata = {
  title: 'Pricing - Upgrade to Premium',
  description: 'Get access to premium articles and exclusive content.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16">Unlock all premium articles, support the authors, and join our growing community.</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm text-left relative overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free Reader</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Perfect for casual readers</p>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">$0</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Access to all free articles', 'Subscribe to newsletter', 'Basic community access'].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full h-12 rounded-xl text-base font-bold">Current Plan</Button>
          </div>

          {/* Premium Tier */}
          <div className="bg-slate-900 dark:bg-indigo-950 rounded-3xl p-8 border border-slate-800 dark:border-indigo-800 flex flex-col shadow-xl text-left relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="absolute top-6 right-6">
              <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-slate-400 mb-6">For power readers and supporters</p>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-white">$9</span>
              <span className="text-slate-400 font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Access to all premium articles', 
                'Exclusive deep dives & tutorials', 
                'Ad-free reading experience', 
                'Save favorite articles',
                'Priority support'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-slate-300 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <CheckoutButton priceId="price_default" />
          </div>
        </div>
        
        <div className="mt-16 text-sm text-slate-500 dark:text-slate-400">
          <p>Need to configure Stripe? Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file.</p>
        </div>
      </div>
    </div>
  );
}
