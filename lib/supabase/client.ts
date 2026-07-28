import { createBrowserClient } from '@supabase/ssr'

import { env } from '@/config/env';

export function createClient() {
  const isConfigured = !!env.NEXT_PUBLIC_SUPABASE_URL && 
    env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') &&
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('127.0.0.1');
    
  if (!isConfigured) {
    throw new Error('Supabase is not configured. Please connect to Supabase to enable this feature.');
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createBrowserClient(
    url && url !== 'YOUR_SUPABASE_URL' && !url.includes('your-project-ref') ? url : 'https://127.0.0.1',
    key || 'placeholder',
    {
      cookieOptions: {
        path: '/',
        sameSite: 'none',
        secure: true,
      }
    }
  )
}
