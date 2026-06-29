import { getActiveCenters } from '@/lib/queries/centers'
import { jsonOk, jsonError, preflightOk } from '@/lib/api/responses'

// Match the home page revalidation cadence
export const revalidate = 60

export async function OPTIONS() {
  return preflightOk()
}

/**
 * GET /api/v1/centers
 *
 * Returns all active collection centers with their location and a
 * preview of items currently needed.
 */
export async function GET() {
  try {
    const centers = await getActiveCenters()

    // Shape the public response intentionally — do NOT just spread DB rows.
    // This is our API contract: every field here is something we commit
    // to keep stable across versions.
    const data = centers.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      address: c.address,
      postal_code: c.postal_code,
      city: c.city,
      public_phone: c.public_phone,
      opening_hours: c.opening_hours,
      verified: c.verified,
      location: { lat: c.lat, lng: c.lng },
      needs_preview: c.needed_preview,
      updated_at: c.updated_at,
    }))

    return jsonOk(data, { total: data.length })
  } catch (err) {
    console.error('GET /api/v1/centers failed:', err)
    return jsonError(500, 'internal_error', 'Could not fetch centers')
  }
}