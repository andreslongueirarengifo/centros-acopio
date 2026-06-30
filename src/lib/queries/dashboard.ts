import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { getSubscriberCountsForCenter } from '@/lib/queries/subscriptions'
import type { Database } from '@/types/supabase'

type ItemCategory = Database['public']['Enums']['item_category']
type ItemStatus = Database['public']['Enums']['item_status']

export type ManagedCenter = {
  id: string
  slug: string
  name: string
  address: string
  city: string
  active: boolean
  verified: boolean
  updated_at: string
}

/**
 * Returns the center managed by the currently authenticated user,
 * or null if none.
 */
export async function getManagedCenter(): Promise<ManagedCenter | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('centers')
    .select('id, slug, name, address, city, active, verified, updated_at')
    .eq('manager_user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('getManagedCenter failed:', error)
    return null
  }
  return data
}

export type CatalogItemRow = {
  id: string
  name: string
  category: ItemCategory
  sort_order: number
}

export type ItemWithStatus = CatalogItemRow & {
  status: ItemStatus | null
  approximate_quantity: string | null
  notes: string | null
  updated_at: string | null
}

export async function getCatalogWithCenterStatus(
  centerId: string
): Promise<ItemWithStatus[]> {
  const supabase = await createClient()

  const [catalogRes, itemsRes] = await Promise.all([
    supabase
      .from('catalog_items')
      .select('id, name, category, sort_order')
      .eq('active', true)
      .order('category')
      .order('sort_order'),
    supabase
      .from('center_items')
      .select('item_id, status, approximate_quantity, notes, updated_at')
      .eq('center_id', centerId),
  ])

  if (catalogRes.error) throw catalogRes.error
  if (itemsRes.error) throw itemsRes.error

  const statusByItem = new Map(
    (itemsRes.data ?? []).map((row) => [row.item_id, row])
  )

  return (catalogRes.data ?? []).map((cat) => {
    const ci = statusByItem.get(cat.id)
    return {
      ...cat,
      status: ci?.status ?? null,
      approximate_quantity: ci?.approximate_quantity ?? null,
      notes: ci?.notes ?? null,
      updated_at: ci?.updated_at ?? null,
    }
  })
}

/**
 * Delegated to the subscriptions feature's query layer.
 * Do NOT query the subscriptions table directly here — that's the
 * subscriptions feature's responsibility.
 */
export type SubscriberStats = {
  verified: number
  pending: number
}

export async function getSubscriberStats(
  centerId: string
): Promise<SubscriberStats> {
  return getSubscriberCountsForCenter(centerId)
}

export type NotificationSummary = {
  id: string
  subject: string
  sent_at: string
  recipients_count: number
}

export async function getRecentNotifications(
  centerId: string,
  limit = 5
): Promise<NotificationSummary[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('id, subject, sent_at, recipients_count')
    .eq('center_id', centerId)
    .order('sent_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getRecentNotifications failed:', error)
    return []
  }
  return data ?? []
}