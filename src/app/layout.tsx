import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StickyHeader } from '@/components/sticky-header'
import { JsonLd } from '@/components/seo/json-ld'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
})

const SITE_URL = 'https://www.ubicatucentrodeacopio.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ubica tu Centro de Acopio · Ayuda a Venezuela',
    template: '%s | Ubica tu Centro de Acopio',
  },
  description:
    'Encuentra centros de acopio activos en España e Italia para enviar ayuda humanitaria a las víctimas del terremoto de Venezuela. Consulta qué necesita cada centro antes de llevar tu donación.',
  applicationName: 'Ubica tu Centro de Acopio',
  authors: [
    {
      name: 'Genius Connection Holding Capital S.L.',
      url: SITE_URL,
    },
  ],
  keywords: [
    'centros de acopio',
    'ayuda Venezuela',
    'terremoto Venezuela',
    'donaciones Venezuela',
    'centros de acopio Venezuela',
    'ayuda humanitaria Venezuela',
    'donar Venezuela España',
    'donar Venezuela Italia',
    'punto de recogida ayuda Venezuela',
    'terremoto 24 junio 2026',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Ubica tu Centro de Acopio · Ayuda a Venezuela',
    description:
      'Mapa de centros de acopio activos en España e Italia. Consulta qué necesita cada centro antes de llevar tu donación al terremoto de Venezuela.',
    url: SITE_URL,
    siteName: 'Ubica tu Centro de Acopio',
    locale: 'es_ES',
    type: 'website',
    // OG image is auto-generated from src/app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubica tu Centro de Acopio · Ayuda a Venezuela',
    description:
      'Mapa de centros de acopio activos en España e Italia para la ayuda al terremoto de Venezuela.',
    // Twitter card image is auto-generated from opengraph-image.tsx as well
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Icons auto-generated from src/app/icon.tsx and src/app/apple-icon.tsx
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: 'Ubica tu Centro de Acopio',
  alternateName: 'Centros de Acopio',
  url: SITE_URL,
  description:
    'Plataforma abierta para coordinar centros de acopio en Europa con ayuda humanitaria a Venezuela tras los terremotos de 2026.',
  areaServed: [
    { '@type': 'Country', name: 'España' },
    { '@type': 'Country', name: 'Italia' },
  ],
  email: 'info@geniusconnection.es',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Genius Connection Holding Capital S.L.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body
        className={`${manrope.className} flex min-h-screen flex-col bg-stone-50`}
      >
        <StickyHeader>
          <SiteHeader />
        </StickyHeader>
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster />
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  )
}