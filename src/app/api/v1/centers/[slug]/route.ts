import { getCenterBySlug, getCenterItems } from '@/lib/queries/centers'
import { jsonOk, jsonError, preflightOk } from '@/lib/api/responses'

export const revalidate = 30

export async function OPTIONS() {
  return preflightOk()
}

interface RouteContext {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/v1/centers/{slug}
 *
 * Returns a single center by slug, with its items grouped by status
 * (needed / surplus / sufficient).
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params

  try {
    const center = await getCenterBySlug(slug)
    if (!center) {
      return jsonError(404, 'not_found', `No center with slug "${slug}"`)
    }

    const items = await getCenterItems(center.id)

    // Group items by status. Each item gets a clean public shape.
    const grouped = {
      needed: [] as PublicItem[],
      surplus: [] as PublicItem[],
      sufficient: [] as PublicItem[],
    }

    for (const it of items) {
      if (!it.catalog_items) continue
      grouped[it.status].push({
        name: it.catalog_items.name,
        category: it.catalog_items.category,
        approximate_quantity: it.approximate_quantity,
        notes: it.notes,
        updated_at: it.updated_at,
      })
    }

    return jsonOk({
      id: center.id,
      slug: center.slug,
      name: center.name,
      description: center.description,
      address: center.address,
      postal_code: center.postal_code,
      city: center.city,
      public_phone: center.public_phone,
      public_email: center.public_email,
      opening_hours: center.opening_hours,
      verified: center.verified,
      // location omitted here because getCenterBySlug doesn't extract
      // lat/lng yet — see note in docs/API.md
      items: grouped,
      counts: {
        needed: grouped.needed.length,
        surplus: grouped.surplus.length,
        sufficient: grouped.sufficient.length,
      },
      updated_at: center.updated_at,
    })
  } catch (err) {
    console.error(`GET /api/v1/centers/${slug} failed:`, err)
    return jsonError(500, 'internal_error', 'Could not fetch center')
  }
}

type PublicItem = {
  name: string
  category: string
  approximate_quantity: string | null
  notes: string | null
  updated_at: string
}