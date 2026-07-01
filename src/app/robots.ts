import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.ubicatucentrodeacopio.com'

/**
 * robots.txt dinámico. Next.js lo sirve en /robots.txt.
 * Permite indexar páginas públicas y bloquea el panel admin, el
 * dashboard de managers y las rutas de auth (login, callback, etc.).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/auth/',
          '/subscriptions/verify',
          '/subscriptions/unsubscribe',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}