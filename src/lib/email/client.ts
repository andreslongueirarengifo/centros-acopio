import 'server-only'
import { Resend } from 'resend'

let _resend: Resend | null = null

/**
 * Lazy Resend client. We don't instantiate at module load because
 * during `next build` the env vars may not be set, which would crash
 * the build. By instantiating on first call, only request paths that
 * actually send email need the key to exist.
 */
export function resend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key) {
      throw new Error('RESEND_API_KEY is not set')
    }
    _resend = new Resend(key)
  }
  return _resend
}

/**
 * The "From" address used for all outgoing email.
 * Configurable per-environment.
 *
 * In dev / before domain verification:
 *   EMAIL_FROM=onboarding@resend.dev
 * In prod with verified domain:
 *   EMAIL_FROM="Centros de Acopio <avisos@your-domain.org>"
 */
export function emailFrom(): string {
  return process.env.EMAIL_FROM ?? 'onboarding@resend.dev'
}