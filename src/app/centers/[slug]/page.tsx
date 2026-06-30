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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getCenterBySlug, getCenterItems } from '@/lib/queries/centers'
import { CenterItemsList } from '@/components/center-items-list'
import { relativeTime, isStale } from '@/lib/utils/relative-time'
import { createClient } from '@/lib/supabase/server'
import { SubscribeButton } from '@/components/subscriptions/subscribe-button'


export const revalidate = 30

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const center = await getCenterBySlug(slug)
  if (!center) return { title: 'Centro no encontrado' }
  return {
    title: center.name,
    description:
      center.description ??
      `Centro de acopio en ${center.city}. Consulta qué necesita ahora.`,
  }
}

export default async function CenterDetailPage({ params }: PageProps) {
  const { slug } = await params
  const center = await getCenterBySlug(slug)
  const supabase = await createClient()


  if (!center) {
    notFound()
  }

  const items = await getCenterItems(center.id)
  const stale = isStale(center.updated_at, 48)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <header className="mb-6">
        <div className="mb-2 flex items-start gap-3">
          <h1 className="text-2xl font-bold md:text-3xl">
            {center.name}
          </h1>
          
          <div className="mb-4 flex items-center justify-between">
            <div>{/* nombre, badges, etc */}</div>
            <SubscribeButton centerId={center.id} centerName={center.name} />
          </div>

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
          <p className="text-gray-700">{center.description}</p>
        )}

        {stale && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              La información de este centro no se actualiza desde hace
              más de 48 horas. Antes de desplazarte, confirma por
              teléfono que sigue activo y que las necesidades son
              correctas.
            </p>
          </div>
        )}
      </header>

      <Card className="mb-8">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <ContactRow icon={<MapPin className="h-4 w-4" />} label="Dirección">
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
            <ContactRow icon={<Phone className="h-4 w-4" />} label="Teléfono">
              <a
                href={`tel:${center.public_phone}`}
                className="text-blue-700 hover:underline"
              >
                {center.public_phone}
              </a>
            </ContactRow>
          )}

          {center.public_email && (
            <ContactRow icon={<Mail className="h-4 w-4" />} label="Email">
              <a
                href={`mailto:${center.public_email}`}
                className="text-blue-700 hover:underline"
              >
                {center.public_email}
              </a>
            </ContactRow>
          )}
        </CardContent>
      </Card>

      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Necesidades actuales</h2>
          <p className="text-xs text-gray-500">
            Última actualización del centro {relativeTime(center.updated_at)}
          </p>
        </div>
        <CenterItemsList items={items} />
      </section>
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
      <div className="mt-0.5 text-gray-400">{icon}</div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="text-sm text-gray-900">{children}</p>
      </div>
    </div>
  )
}