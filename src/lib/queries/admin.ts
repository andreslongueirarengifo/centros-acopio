import 'server-only'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'

export type AdminCenterRow = {
  id: string
  slug: string
  name: string
  city: string
  manager_email: string | null
  manager_user_id: string | null
  verified: boolean
  active: boolean
  created_at: string
  updated_at: string
}

/**
 * All centers (including inactive). Admin-only.
 * Uses service_role so RLS doesn't filter anything.
 */
export async function getAllCenters(): Promise<AdminCenterRow[]> {
  await requireAdmin()
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('centers')
    .select(
      'id, slug, name, city, manager_email, manager_user_id, verified, active, created_at, updated_at'
    )
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export type AdminCenterDetail = {
  id: string
  slug: string
  name: string
  description: string | null
  address: string
  postal_code: string | null
  city: string
  public_phone: string | null
  public_email: string | null
  opening_hours: string | null
  manager_email: string | null
  manager_user_id: string | null
  verified: boolean
  active: boolean
}

export async function getCenterForAdmin(
  id: string
): Promise<AdminCenterDetail | null> {
  await requireAdmin()
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('centers')
    .select(
      'id, slug, name, description, address, postal_code, city, public_phone, public_email, opening_hours, manager_email, manager_user_id, verified, active'
    )
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export type AdminStats = {
  total: number
  active: number
  verified: number
  totalSubscribers: number
  totalNotifications: number
}

export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin()
  const admin = createAdminClient()

  // Run in parallel — independent queries
  const [
    centersTotal,
    centersActive,
    centersVerified,
    subscribers,
    notifications,
  ] = await Promise.all([
    admin.from('centers').select('id', { count: 'exact', head: true }),
    admin
      .from('centers')
      .select('id', { count: 'exact', head: true })
      .eq('active', true),
    admin
      .from('centers')
      .select('id', { count: 'exact', head: true })
      .eq('verified', true),
    admin
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .not('verified_at', 'is', null)
      .is('unsubscribed_at', null),
    admin.from('notifications').select('id', { count: 'exact', head: true }),
  ])

  return {
    total: centersTotal.count ?? 0,
    active: centersActive.count ?? 0,
    verified: centersVerified.count ?? 0,
    totalSubscribers: subscribers.count ?? 0,
    totalNotifications: notifications.count ?? 0,
  }
}