import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createBrowserClient(
    url && url !== 'YOUR_SUPABASE_URL' ? url : 'https://127.0.0.1',
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
