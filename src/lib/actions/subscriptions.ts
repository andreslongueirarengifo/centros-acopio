'use server'

import { z } from 'zod'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { resend, emailFrom } from '@/lib/email/client'
import { verifyEmailTemplate } from '@/lib/email/templates'
import { uuidString } from '@/lib/validators'

// Zod v4: pass `error` (string) for custom messages. errorMap is gone.
const subscribeSchema = z.object({
    centerId: uuidString,                    // ← antes: z.string().uuid()
    email: z.string().email('Email no válido').toLowerCase(),
    consent: z
        .string({ error: 'Debes aceptar el aviso de privacidad' })
        .refine((v) => v === 'on', 'Debes aceptar el aviso de privacidad'),
})

export type SubscribeState = {
    ok?: boolean
    error?: string
} | undefined

/**
 * Public Server Action: a donor subscribes to a center.
 *
 * Always returns a generic "check your email" outcome regardless of
 * whether the email was new, already subscribed, or already
 * unsubscribed. Prevents enumeration of who's subscribed to what.
 */
export async function subscribeToCenter(
    _prevState: SubscribeState,
    formData: FormData
): Promise<SubscribeState> {
    const parsed = subscribeSchema.safeParse({
        centerId: formData.get('centerId'),
        email: formData.get('email'),
        consent: formData.get('consent'),
    })

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
    }

    const supabase = await createClient()

    const { data: center } = await supabase
        .from('centers')
        .select('name')
        .eq('id', parsed.data.centerId)
        .eq('active', true)
        .maybeSingle()

    if (!center) {
        // Generic response — don't leak which centers exist
        return { ok: true }
    }

    // Upsert via service_role so we can handle "already exists" cleanly
    const admin = createAdminClient()
    const { data: existing } = await admin
        .from('subscriptions')
        .select('id, verification_token, verified_at, unsubscribed_at')
        .eq('center_id', parsed.data.centerId)
        .ilike('email', parsed.data.email)
        .maybeSingle()

    let tokenToSend: string

    if (existing) {
        if (existing.verified_at && !existing.unsubscribed_at) {
            // Already active subscriber — generic ok, no email re-sent
            return { ok: true }
        }
        // Reactivate / re-send verification
        const { data: updated } = await admin
            .from('subscriptions')
            .update({ unsubscribed_at: null })
            .eq('id', existing.id)
            .select('verification_token')
            .single()
        tokenToSend = updated?.verification_token ?? existing.verification_token
    } else {
        const { data: created, error } = await admin
            .from('subscriptions')
            .insert({
                center_id: parsed.data.centerId,
                email: parsed.data.email,
            })
            .select('verification_token')
            .single()

        if (error || !created) {
            console.error('Subscription insert failed:', error)
            return { error: 'No se pudo procesar la suscripción' }
        }
        tokenToSend = created.verification_token
    }

    const tmpl = verifyEmailTemplate({
        centerName: center.name,
        verificationToken: tokenToSend,
    })

    try {
        await resend().emails.send({
            from: emailFrom(),
            to: parsed.data.email,
            subject: tmpl.subject,
            text: tmpl.text,
            html: tmpl.html,
        })
    } catch (err) {
        console.error('Failed to send verification email:', err)
        // Still return ok — the row exists, user can re-request
        return { ok: true }
    }

    return { ok: true }
}

/**
 * Public: verify a subscription via the token in the magic link.
 */
export async function verifySubscription(token: string): Promise<{
    ok: boolean
    centerName?: string
}> {
    const admin = createAdminClient()

    const { data: sub } = await admin
        .from('subscriptions')
        .select('id, center_id, verified_at')
        .eq('verification_token', token)
        .maybeSingle()

    if (!sub) return { ok: false }

    if (!sub.verified_at) {
        await admin
            .from('subscriptions')
            .update({ verified_at: new Date().toISOString() })
            .eq('id', sub.id)
    }

    const { data: center } = await admin
        .from('centers')
        .select('name')
        .eq('id', sub.center_id)
        .maybeSingle()

    return { ok: true, centerName: center?.name }
}

/**
 * Public: unsubscribe via the token included in every notification.
 */
export async function unsubscribeByToken(token: string): Promise<{
    ok: boolean
    centerName?: string
}> {
    const admin = createAdminClient()

    const { data: sub } = await admin
        .from('subscriptions')
        .select('id, center_id, unsubscribed_at')
        .eq('unsubscribe_token', token)
        .maybeSingle()

    if (!sub) return { ok: false }

    if (!sub.unsubscribed_at) {
        await admin
            .from('subscriptions')
            .update({ unsubscribed_at: new Date().toISOString() })
            .eq('id', sub.id)
    }

    const { data: center } = await admin
        .from('centers')
        .select('name')
        .eq('id', sub.center_id)
        .maybeSingle()

    return { ok: true, centerName: center?.name }
}

/**
 * Used by the dashboard to display subscriber counts.
 * Implements the contract `getActiveSubscribersForCenter` /
 * `getSubscriberCountsForCenter` that notifications.ts and
 * dashboard.ts depend on.
 */
export type ActiveSubscriber = {
    email: string
    unsubscribeToken: string
}