import type { MetadataRoute } from 'next'
import { getActiveCenters } from '@/lib/queries/centers'

const BASE_URL = 'https://www.ubicatucentrodeacopio.com'

/**
 * Sitemap dinámico. Next.js lo sirve automáticamente en /sitemap.xml.
 * Google descubrirá esta URL desde el robots.txt.
 *
 * Cada centro activo genera una entrada. El campo `lastModified`
 * ayuda a que Google re-crawlee las páginas cuando cambian, en vez
 * de esperar al siguiente ciclo global.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/info`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic center pages
  const centers = await getActiveCenters()
  const centerPages: MetadataRoute.Sitemap = centers.map((center) => ({
    url: `${BASE_URL}/centers/${center.slug}`,
    // Fall back to `now` if updated_at is missing
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  return [...staticPages, ...centerPages]
}