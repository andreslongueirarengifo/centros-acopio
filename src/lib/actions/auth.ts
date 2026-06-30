'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const requestLinkSchema = z.object({
  email: z.string().email('Email no válido').toLowerCase(),
})

export type RequestLinkState = {
  error?: string
} | undefined

/**
 * Server Action: sends a magic link to the given email.
 *
 * We never reveal whether the email is registered or not — both
 * paths lead to /auth/check-email. This prevents email enumeration
 * (an attacker can't probe which emails are valid managers).
 */
export async function requestMagicLink(
  _prevState: RequestLinkState,
  formData: FormData
): Promise<RequestLinkState> {
  const parsed = requestLinkSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Email no válido' }
  }

  const supabase = await createClient()

  // We intentionally don't check if the email belongs to a registered
  // manager before sending. Supabase's signInWithOtp with
  // `shouldCreateUser: true` only sends the email to allowed addresses
  // when the schema-side check (manager_email allowlist) is in place,
  // because the auth trigger only links existing centers.
  //
  // Note: signInWithOtp will create an auth.users row regardless.
  // If you want to enforce strict allowlist BEFORE creating the user,
  // add a pre-check here that queries `centers` for manager_email.
  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
      shouldCreateUser: true,
    },
  })

  redirect('/auth/check-email')
}

/**
 * Server Action: sign out and clear cookies.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}