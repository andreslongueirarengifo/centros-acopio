import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Magic link callback.
 *
 * Supabase redirects here after the user clicks the link in their
 * email. We exchange the `code` for a session, set the cookies,
 * and redirect them to the dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Magic link exchange failed:', error)
    return NextResponse.redirect(`${origin}/auth/login?error=invalid_link`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}