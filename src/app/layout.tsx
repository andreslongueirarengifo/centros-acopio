import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { StickyHeader } from '@/components/sticky-header'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Centros de Acopio Madrid',
    template: '%s | Centros de Acopio Madrid',
  },
  description:
    'Coordinación de centros de acopio en la comunidad de Madrid para la ayuda a las víctimas del terremoto de Venezuela.',
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
      </body>
    </html>
  )
}