import 'server-only'
import { createAdminClient } from '@/lib/supabase/server'

export type ActiveSubscriber = {
  email: string
  unsubscribeToken: string
}

/**
 * Active = verified AND not unsubscribed.
 * Uses service_role because the RLS policy on subscriptions only
 * grants SELECT to the center's manager, and this function is called
 * from a Server Action context where we've already verified ownership.
 */
export async function getActiveSubscribersForCenter(
  centerId: string
): Promise<ActiveSubscriber[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('subscriptions')
    .select('email, unsubscribe_token')
    .eq('center_id', centerId)
    .not('verified_at', 'is', null)
    .is('unsubscribed_at', null)

  if (error) {
    console.error('getActiveSubscribersForCenter failed:', error)
    return []
  }
  return (data ?? []).map((row) => ({
    email: row.email,
    unsubscribeToken: row.unsubscribe_token,
  }))
}

export async function getSubscriberCountsForCenter(
  centerId: string
): Promise<{ verified: number; pending: number }> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('subscriptions')
    .select('verified_at, unsubscribed_at')
    .eq('center_id', centerId)
    .is('unsubscribed_at', null)

  if (error) {
    console.error('getSubscriberCountsForCenter failed:', error)
    return { verified: 0, pending: 0 }
  }

  let verified = 0
  let pending = 0
  for (const row of data ?? []) {
    if (row.verified_at) verified += 1
    else pending += 1
  }
  return { verified, pending }
}