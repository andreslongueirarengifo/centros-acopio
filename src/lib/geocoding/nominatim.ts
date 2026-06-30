import 'server-only'

export type GeocodeResult = {
  lat: number
  lng: number
  displayName: string
}

/**
 * Geocode an address using OpenStreetMap's Nominatim.
 *
 * Nominatim's usage policy requires:
 *   - A descriptive User-Agent header (with contact info ideally)
 *   - At most 1 request per second
 *   - No bulk geocoding (single addresses only)
 *
 * https://operations.osmfoundation.org/policies/nominatim/
 *
 * For admin-driven center creation (a few per day), this is plenty.
 * If we ever start importing centers in bulk we'll need to either
 * self-host Nominatim or move to a paid provider.
 */
export async function geocodeAddress(
  address: string,
  city = 'Madrid',
  country = 'Spain'
): Promise<GeocodeResult | null> {
  const query = [address, city, country].filter(Boolean).join(', ')

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('addressdetails', '0')

  const userAgent =
    process.env.NOMINATIM_USER_AGENT ??
    'centros-acopio-madrid/1.0 (https://github.com/your-repo)'

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': userAgent,
        'Accept-Language': 'es',
      },
      // Don't cache geocoding results at the fetch level — we'll cache
      // them by storing lat/lng in the DB row.
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('Nominatim returned', res.status)
      return null
    }

    const data = (await res.json()) as Array<{
      lat: string
      lon: string
      display_name: string
    }>

    if (!data || data.length === 0) return null

    const first = data[0]
    return {
      lat: parseFloat(first.lat),
      lng: parseFloat(first.lon),
      displayName: first.display_name,
    }
  } catch (err) {
    console.error('Nominatim geocode failed:', err)
    return null
  }
}