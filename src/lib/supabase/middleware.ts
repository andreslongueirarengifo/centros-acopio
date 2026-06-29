import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

/**
 * Refreshes the user's auth session on every request.
 * Without this, Server Components would see stale auth state.
 *
 * IMPORTANT: do NOT add custom logic between `createServerClient`
 * and `supabase.auth.getUser()`. That ordering is required for
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

  // This call refreshes the session and revalidates the cookie.
  // Don't remove it.
  const { data: { user } } = await supabase.auth.getUser()

  // Example: protect manager routes (uncomment when you have /dashboard)
  //
  // if (
  //   !user &&
  //   request.nextUrl.pathname.startsWith('/dashboard')
  // ) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/auth/login'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}