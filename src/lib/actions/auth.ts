'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/auth/admin'

// =====================================================================
// MAGIC LINK (managers de centro)
// =====================================================================

const requestLinkSchema = z.object({
  email: z.string().email('Email no valido').toLowerCase(),
})

export type RequestLinkState =
  | { error?: string }
  | undefined

export async function requestMagicLink(
  _prevState: RequestLinkState,
  formData: FormData
): Promise<RequestLinkState> {
  const parsed = requestLinkSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Email no valido' }
  }

  const supabase = await createClient()

  await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
      shouldCreateUser: false,
    },
  })

  redirect('/auth/check-email')
}


// =====================================================================
// PASSWORD (admins)
// =====================================================================

const passwordLoginSchema = z.object({
  email: z.string().email('Email no valido').toLowerCase(),
  password: z.string().min(1, 'Introduce tu contrasena'),
})

export type PasswordLoginState =
  | { error?: string }
  | undefined

/**
 * Password login for admins only.
 *
 * We check ADMIN_EMAILS BEFORE attempting to sign in, to avoid
 * revealing to the client whether a non-admin email exists in the
 * system. Non-admins get the same generic error whether their email
 * exists or not.
 */
export async function loginWithPassword(
  _prev: PasswordLoginState,
  formData: FormData
): Promise<PasswordLoginState> {
  const parsed = passwordLoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Datos invalidos' }
  }

  // Reject non-admin emails at the door
  if (!isAdminEmail(parsed.data.email)) {
    return { error: 'Credenciales incorrectas' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    // Same generic message whether email exists, password is wrong,
    // or anything else. Don't leak which case it is.
    return { error: 'Credenciales incorrectas' }
  }

  redirect('/admin')
}


// =====================================================================
// SIGN OUT
// =====================================================================

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}