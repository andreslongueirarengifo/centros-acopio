import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type CatalogItem = Database['public']['Tables']['catalog_items']['Row']
type CenterItem = Database['public']['Tables']['center_items']['Row']

export type CenterListItem = {
  id: string
  slug: string
  name: string
  description: string | null
  address: string
  postal_code: string | null
  city: string
  public_phone: string | null
  opening_hours: string | null
  verified: boolean
  updated_at: string
  lat: number
  lng: number
  needed_preview: string[]
}

/**
 * All active centers + a preview of what each one currently needs.
 * Uses the RPC so we get lat/lng as plain floats instead of raw PostGIS.
 */
export async function getActiveCenters(): Promise<CenterListItem[]> {
  const supabase = await createClient()

  const { data: centers, error: centersError } = await supabase.rpc(
    'get_active_centers_with_coords'
  )

  if (centersError) throw centersError
  if (!centers || centers.length === 0) return []

  const centerIds = centers.map((c) => c.id)
  const { data: items, error: itemsError } = await supabase
    .from('center_items')
    .select('center_id, catalog_items(name, sort_order)')
    .in('center_id', centerIds)
    .eq('status', 'needed')

  if (itemsError) throw itemsError

  const previewByCenter = new Map<string, string[]>()
  for (const row of items ?? []) {
    const item = Array.isArray(row.catalog_items)
      ? row.catalog_items[0]
      : row.catalog_items
    if (!item) continue
    const list = previewByCenter.get(row.center_id) ?? []
    list.push(item.name)
    previewByCenter.set(row.center_id, list)
  }

  return centers.map((c) => ({
    ...c,
    needed_preview: (previewByCenter.get(c.id) ?? []).slice(0, 5),
  }))
}

/**
 * Single center by slug (only if active).
 */
export async function getCenterBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (error) throw error
  return data
}

export type CenterItemWithCatalog = CenterItem & {
  catalog_items: Pick<CatalogItem, 'id' | 'name' | 'category' | 'sort_order'> | null
}

/**
 * All items for a center, joined with the catalog.
 */
export async function getCenterItems(
  centerId: string
): Promise<CenterItemWithCatalog[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('center_items')
    .select(
      `
      *,
      catalog_items (
        id,
        name,
        category,
        sort_order
      )
    `
    )
    .eq('center_id', centerId)

  if (error) throw error
  return (data ?? []) as CenterItemWithCatalog[]
}