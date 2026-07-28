import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/config/env'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || url === 'YOUR_SUPABASE_URL' || url.includes('127.0.0.1') || url.includes('your-project-ref')) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    url,
    key || 'placeholder',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, { ...options, sameSite: 'none', secure: true })
          })
        },
      },
    }
  )

    let user: any = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err: any) {
    if (err?.message !== 'fetch failed' && !err?.message?.includes('ECONNREFUSED')) {
      console.error('Middleware getUser error:', err);
    }
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'

  // Important: If we create a NEW response for redirect, we MUST copy the cookies over!
  // This was the bug causing the infinite loop or missing cookies during redirects!

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/login'
    const newRes = NextResponse.redirect(redirectUrl)
    // Copy cookies from supabaseResponse to newRes
    supabaseResponse.cookies.getAll().forEach(cookie => {
      newRes.cookies.set(cookie.name, cookie.value, { ...cookie, sameSite: 'none', secure: true })
    })
    return newRes
  }

  if (isLoginRoute && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    const newRes = NextResponse.redirect(redirectUrl)
    // Copy cookies from supabaseResponse to newRes
    supabaseResponse.cookies.getAll().forEach(cookie => {
      newRes.cookies.set(cookie.name, cookie.value, { ...cookie, sameSite: 'none', secure: true })
    })
    return newRes
  }

  return supabaseResponse
}
