import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getCenterBySlug, getCenterItems } from '@/lib/queries/centers'
import { CenterItemsList } from '@/components/center-items-list'
import { relativeTime, isStale } from '@/lib/utils/relative-time'
import { SubscribeButton } from '@/components/subscriptions/subscribe-button'
import { JsonLd } from '@/components/seo/json-ld'

export const revalidate = 30

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const center = await getCenterBySlug(slug)

  if (!center) return { title: 'Centro no encontrado' }

  return {
    title: `${center.name} · Centro de acopio en ${center.city}`,
    description: `${center.name} en ${center.city}: punto de recogida activo para ayuda al terremoto de Venezuela. Consulta qué necesita antes de llevar tu donación.${center.public_phone ? ` Tel: ${center.public_phone}.` : ''}`,
    alternates: {
      canonical: `https://www.ubicatucentrodeacopio.com/centers/${slug}`,
    },
    openGraph: {
      title: `${center.name} · Centro de acopio`,
      description: `Punto de recogida en ${center.city} para ayuda al terremoto de Venezuela.`,
      url: `https://www.ubicatucentrodeacopio.com/centers/${slug}`,
      type: 'website',
    },
  }
}

export default async function CenterDetailPage({ params }: Props) {
  const { slug } = await params
  const center = await getCenterBySlug(slug)

  if (!center) {
    notFound()
  }

  const items = await getCenterItems(center.id)
  const stale = isStale(center.updated_at, 48)

  const centerJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: center.name,
    description: center.description ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: center.address,
      addressLocality: center.city,
      postalCode: center.postal_code ?? undefined,
      addressCountry: 'ES', // TODO: usar 'IT' cuando anadas centros italianos
    },
    telephone: center.public_phone ?? undefined,
    email: center.public_email ?? undefined,
    openingHours: center.opening_hours ?? undefined,
    geo:
      center.lat && center.lng
        ? {
            '@type': 'GeoCoordinates',
            latitude: center.lat,
            longitude: center.lng,
          }
        : undefined,
    url: `https://www.ubicatucentrodeacopio.com/centers/${center.slug}`,
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900 md:text-3xl">
                {center.name}
              </h1>
              {center.verified && (
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Verificado
                </Badge>
              )}
            </div>
            {center.description && (
              <p className="mt-2 text-stone-700">{center.description}</p>
            )}
          </div>

          <SubscribeButton centerId={center.id} centerName={center.name} />
        </div>

        {stale && (
          <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              La informacion de este centro no se actualiza desde hace
              mas de 48 horas. Antes de desplazarte, confirma por
              telefono que sigue activo y que las necesidades son
              correctas.
            </p>
          </div>
        )}
      </header>

      <Card className="mb-8">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <ContactRow icon={<MapPin className="h-4 w-4" />} label="Direccion">
            {center.address}
            {center.postal_code && `, ${center.postal_code}`}
            {center.city && `, ${center.city}`}
          </ContactRow>

          {center.opening_hours && (
            <ContactRow icon={<Clock className="h-4 w-4" />} label="Horario">
              {center.opening_hours}
            </ContactRow>
          )}

          {center.public_phone && (
            <ContactRow icon={<Phone className="h-4 w-4" />} label="Telefono">
              <a
                href={`tel:${center.public_phone}`}
                className="text-red-700 hover:underline"
              >
                {center.public_phone}
              </a>
            </ContactRow>
          )}

          {center.public_email && (
            <ContactRow icon={<Mail className="h-4 w-4" />} label="Email">
              <a
                href={`mailto:${center.public_email}`}
                className="text-red-700 hover:underline"
              >
                {center.public_email}
              </a>
            </ContactRow>
          )}
        </CardContent>
      </Card>

      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold text-stone-900">
            Necesidades actuales
          </h2>
          <p className="text-xs text-stone-500">
            Ultima actualizacion del centro {relativeTime(center.updated_at)}
          </p>
        </div>
        <CenterItemsList items={items} />
      </section>

      <JsonLd data={centerJsonLd} />
    </div>
  )
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-stone-400">{icon}</div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          {label}
        </p>
        <p className="text-sm text-stone-900">{children}</p>
      </div>
    </div>
  )
}