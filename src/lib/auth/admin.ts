import 'server-only'
import { createClient } from '@/lib/supabase/server'

/**
 * Parse the ADMIN_EMAILS env var into a lowercased Set for fast lookup.
 * Computed once per request — env vars don't change mid-request.
 */
function adminEmailSet(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  )
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return adminEmailSet().has(email.toLowerCase())
}

/**
 * Returns the current admin user, or null if no session / not an admin.
 * The single source of truth for "am I admin" everywhere in the codebase.
 */
export async function getAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminEmail(user.email)) return null
  return user
}

/**
 * Throws if the current user is not admin.
 * Use at the top of every admin Server Action.
 */
export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) {
    throw new Error('Forbidden: admin access required')
  }
  return user
}