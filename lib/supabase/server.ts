import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
  
  const cookieStore = cookies()

  return createServerClient(
    url && url !== 'YOUR_SUPABASE_URL' && !url.includes('your-project-ref') ? url : 'https://127.0.0.1',
    key || 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, { ...options, sameSite: 'none', secure: true })
            })
          } catch {
          }
        },
      },
    }
  )
}

export function createAdminClient() {
  const isConfigured = !!env.NEXT_PUBLIC_SUPABASE_URL && 
    env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL' && 
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref') &&
    !env.NEXT_PUBLIC_SUPABASE_URL.includes('127.0.0.1');
    
  if (!isConfigured) {
    throw new Error('Supabase is not configured. Please connect to Supabase to enable this feature.');
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  
  return createServerClient(
    url && url !== 'YOUR_SUPABASE_URL' && !url.includes('your-project-ref') ? url : 'https://127.0.0.1',
    key || 'placeholder',
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      }
    }
  )
}
