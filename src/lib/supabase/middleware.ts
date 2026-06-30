import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

/**
 * Refreshes the user's auth session on every request and protects
 * /dashboard and /admin routes.
 *
 * IMPORTANT: do NOT add logic between `createServerClient` and
 * `supabase.auth.getUser()`. That ordering is required for the
 * cookie refresh to work correctly.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // /dashboard: any logged-in user (manager check happens in the page)
  if (!user && path.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // /admin: must be logged in AND email in ADMIN_EMAILS
  if (path.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('next', path)
      return NextResponse.redirect(url)
    }

    // Admin check duplicated here as fast-fail. The Server Action
    // double-checks too via requireAdmin() — that's the authoritative
    // gate. This middleware check just avoids rendering the page shell.
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)

    if (
      !user.email ||
      !adminEmails.includes(user.email.toLowerCase())
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/forbidden'
      return NextResponse.rewrite(url)
    }
  }

  // Don't show login form to already-authenticated users
  if (user && path.startsWith('/auth/login')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}