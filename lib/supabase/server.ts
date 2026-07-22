import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const cookieStore = cookies()

  return createServerClient(
    url && url !== 'YOUR_SUPABASE_URL' ? url : 'https://127.0.0.1',
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  return createServerClient(
    url && url !== 'YOUR_SUPABASE_URL' ? url : 'https://127.0.0.1',
    key || 'placeholder',
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      }
    }
  )
}
