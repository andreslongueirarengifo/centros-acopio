import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

/**
 * Supabase client for use in Client Components ("use client").
 * Reads cookies from the browser, persists session in localStorage/cookies.
 *
 * Usage:
 *   const supabase = createClient()
 *   const { data } = await supabase.from('centers').select('*')
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}