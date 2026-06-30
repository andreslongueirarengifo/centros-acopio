'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { resend, emailFrom } from '@/lib/email/client'
import { notificationTemplate } from '@/lib/email/templates'
import { getActiveSubscribersForCenter } from '@/lib/queries/subscriptions'
import { uuidString } from '@/lib/validators'

const COOLDOWN_HOURS = 6
const MAX_BODY_LENGTH = 2000
const MAX_SUBJECT_LENGTH = 120

const sendSchema = z.object({
  centerId: uuidString,                    
  subject: z.string().min(5, 'Asunto demasiado corto').max(MAX_SUBJECT_LENGTH, `Asunto demasiado largo (max ${MAX_SUBJECT_LENGTH} caracteres)`),
  body: z.string().min(20, 'Cuerpo demasiado corto').max(MAX_BODY_LENGTH, `Cuerpo demasiado largo (max ${MAX_BODY_LENGTH} caracteres)`),
})

export type SendNotificationState =
  | { ok: true; recipientsCount: number }
  | { ok: false; error: string }
  | undefined

/**
 * Manager sends a notification to all active subscribers of their center.
 *
 * Authorization:
 *  - Must be authenticated (Supabase session)
 *  - Must be the manager_user_id of the target center
 *
 * Behavior:
 *  - Enforces a per-center cooldown (6h) to prevent abuse
 *  - Sends in parallel via Promise.allSettled — one failed delivery
 *    doesn't abort the rest
 *  - Logs the send in `notifications` for audit
 *  - Adds RFC 8058 List-Unsubscribe headers for one-click unsubscribe
 */
export async function sendNotification(
  _prevState: SendNotificationState,
  formData: FormData
): Promise<SendNotificationState> {
  const parsed = sendSchema.safeParse({
    centerId: formData.get('centerId'),
    subject: formData.get('subject'),
    body: formData.get('body'),
  })

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'No autenticado' }
  }

  // Manager check: defense in depth, since we'll use service_role below
  const { data: center } = await supabase
    .from('centers')
    .select('id, name, manager_user_id')
    .eq('id', parsed.data.centerId)
    .maybeSingle()

  if (!center || center.manager_user_id !== user.id) {
    return { ok: false, error: 'No tienes permiso para este centro' }
  }

  // Cooldown
  const admin = createAdminClient()
  const { data: lastNotification } = await admin
    .from('notifications')
    .select('sent_at')
    .eq('center_id', center.id)
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lastNotification) {
    const ageMs = Date.now() - new Date(lastNotification.sent_at).getTime()
    const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000
    if (ageMs < cooldownMs) {
      const hoursLeft = Math.ceil((cooldownMs - ageMs) / (60 * 60 * 1000))
      return {
        ok: false,
        error: `Has enviado un aviso recientemente. Espera ${hoursLeft}h antes del próximo.`,
      }
    }
  }

  // Subscribers via the subscriptions feature's query layer
  const subscribers = await getActiveSubscribersForCenter(center.id)

  if (subscribers.length === 0) {
    return { ok: false, error: 'No tienes suscriptores activos todavía' }
  }

  let successCount = 0
  await Promise.allSettled(
    subscribers.map(async (sub) => {
      const tmpl = notificationTemplate({
        centerName: center.name,
        subject: parsed.data.subject,
        body: parsed.data.body,
        unsubscribeToken: sub.unsubscribeToken,
      })

      try {
        await resend().emails.send({
          from: emailFrom(),
          to: sub.email,
          subject: tmpl.subject,
          text: tmpl.text,
          html: tmpl.html,
          headers: {
            'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_SITE_URL}/subscriptions/unsubscribe?token=${sub.unsubscribeToken}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })
        successCount += 1
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err)
      }
    })
  )

  await admin.from('notifications').insert({
    center_id: center.id,
    sent_by: user.id,
    subject: parsed.data.subject,
    body: parsed.data.body,
    recipients_count: successCount,
  })

  revalidatePath('/dashboard')

  return { ok: true, recipientsCount: successCount }
}