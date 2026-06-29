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
import { getCenterBySlug, getCenterItems } from '@/lib/queries/centers'
import { CenterItemsList } from '@/components/center-items-list'
import { FollowCenterDialog } from '@/components/follow-center-dialog'
import { relativeTime, isStale } from '@/lib/utils/relative-time'
import { getDictionary } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

export const revalidate = 30

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = getDictionary(locale)
  const center = await getCenterBySlug(slug)
  if (!center) return { title: t.metadata.centerNotFound }
  return {
    title: center.name,
    description:
      center.description ??
      t.metadata.centerFallbackDescription.replace('{city}', center.city ?? ''),
  }
}

export default async function CenterDetailPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = getDictionary(locale)
  const center = await getCenterBySlug(slug)

  if (!center) {
    notFound()
  }

  const items = await getCenterItems(center.id)
  const stale = isStale(center.updated_at, 48)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.centerDetail.back}
      </Link>

      <header className="mb-8 border-b border-gray-200 pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
                {center.name}
              </h1>
              {center.verified && (
                <Badge
                  variant="outline"
                  className="border-blue-100 bg-blue-50 text-blue-700"
                >
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {t.centerDetail.verified}
                </Badge>
              )}
            </div>

            {center.description && (
              <p className="max-w-2xl text-base leading-7 text-gray-600">
                {center.description}
              </p>
            )}
          </div>

          <div className="shrink-0">
            <FollowCenterDialog
              centerName={center.name}
              centerSlug={center.slug}
              locale={locale}
            />
          </div>
        </div>

        {stale && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{t.centerDetail.staleWarning}</p>
          </div>
        )}
      </header>

      <section className="mb-10 grid gap-5 border-b border-gray-200 pb-8 sm:grid-cols-2">
        <ContactRow
          icon={<MapPin className="h-4 w-4" />}
          label={t.centerDetail.address}
        >
          {center.address}
          {center.postal_code && `, ${center.postal_code}`}
          {center.city && `, ${center.city}`}
        </ContactRow>

        {center.opening_hours && (
          <ContactRow
            icon={<Clock className="h-4 w-4" />}
            label={t.centerDetail.openingHours}
          >
            {center.opening_hours}
          </ContactRow>
        )}

        {center.public_phone && (
          <ContactRow
            icon={<Phone className="h-4 w-4" />}
            label={t.centerDetail.phone}
          >
            <a
              href={`tel:${center.public_phone}`}
              className="text-gray-950 underline underline-offset-4"
            >
              {center.public_phone}
            </a>
          </ContactRow>
        )}

        {center.public_email && (
          <ContactRow
            icon={<Mail className="h-4 w-4" />}
            label={t.centerDetail.email}
          >
            <a
              href={`mailto:${center.public_email}`}
              className="text-gray-950 underline underline-offset-4"
            >
              {center.public_email}
            </a>
          </ContactRow>
        )}
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-lg font-medium text-gray-950">
            {t.centerDetail.currentNeeds}
          </h2>
          <p className="text-xs text-gray-500">
            {t.centerDetail.updated} {relativeTime(center.updated_at, locale)}
          </p>
        </div>
        <CenterItemsList items={items} locale={locale} />
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
        <p className="text-xs text-gray-500">
          {label}
        </p>
        <p className="mt-1 text-sm leading-6 text-gray-900">{children}</p>
      </div>
    </div>
  )
}
