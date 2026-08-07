export const dynamic = 'force-dynamic';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { SavedArticles } from './SavedArticles';

export const metadata = {
  title: 'My Dashboard',
  description: 'Manage your profile, subscriptions, and saved articles.',
};

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/admin/login?next=/dashboard');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
  const isPremium = profile?.subscription_status === 'active';
  const role = profile?.role || 'reader';

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2">My Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Welcome back, {profile?.first_name || session.user.email}</p>
          </div>
          <div className="flex gap-4">
            {role !== 'reader' && (
              <Link href="/admin">
                <Button variant="outline">Admin Panel</Button>
              </Link>
            )}
            <form action="/api/auth/signout" method="POST">
              <Button type="submit" variant="outline">Sign Out</Button>
            </form>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Subscription</h3>
              <div className="mb-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPremium ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'}`}>
                  {isPremium ? 'Premium Active' : 'Free Plan'}
                </span>
              </div>
              {!isPremium ? (
                <Link href="/pricing">
                  <Button className="w-full">Upgrade to Premium</Button>
                </Link>
              ) : (
                <p className="text-sm text-slate-500">Thanks for supporting us! You have full access to all premium articles.</p>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[400px]">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Saved Articles</h3>
              <SavedArticles userId={session.user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
