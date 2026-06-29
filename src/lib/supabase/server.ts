import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

/**
 * Supabase client for use in Server Components, Server Actions,
 * and Route Handlers.
 *
 * Next 15 made cookies() async — note the `await` here.
 *
 * Usage (Server Component):
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('centers').select('*')
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // `setAll` was called from a Server Component, which cannot
            // write cookies. Safe to ignore because middleware refreshes
            // the session on every request.
          }
        },
      },
    }
  )
}

/**
 * Admin client using the SERVICE_ROLE key.
 * Bypasses Row Level Security — use ONLY in Server Actions for
 * operations that require admin privileges (creating centers,
 * verifying centers, managing the catalog).
 *
 * NEVER import this from a Client Component.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // no-op: admin client doesn't need to set cookies
        },
      },
    }
  )
}