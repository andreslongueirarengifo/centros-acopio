import Link from 'next/link'
import { MapPin, Phone, Clock, ShieldCheck, AlertCircle } from 'lucide-react'
import { relativeTime, isStale } from '@/lib/utils/relative-time'
import { defaultLocale, getDictionary, type Locale } from '@/lib/i18n'
import type { CenterListItem } from '@/lib/queries/centers'

export function CenterCard({
  center,
  locale = defaultLocale,
}: {
  center: CenterListItem
  locale?: Locale
}) {
  const t = getDictionary(locale).centerCard
  const stale = isStale(center.updated_at, 48)

  return (
    <Link href={`/centers/${center.slug}`} className="block">
      <article className="py-4 transition-colors hover:bg-gray-50">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-base font-medium leading-6 text-gray-950">
            {center.name}
          </h3>
          {center.verified && (
            <span className="mt-0.5 shrink-0 text-blue-600" title={t.verified}>
              <ShieldCheck className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span>
              {center.address}
              {center.postal_code && `, ${center.postal_code}`}
            </span>
          </div>
          {center.public_phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span>{center.public_phone}</span>
            </div>
          )}
          {center.opening_hours && (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span>{center.opening_hours}</span>
            </div>
          )}
        </div>

        {center.needed_preview.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {center.needed_preview.slice(0, 3).map((name) => (
              <span
                key={name}
                className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700"
              >
                {name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
          <span>{relativeTime(center.updated_at, locale)}</span>
          {stale && (
            <span className="flex items-center gap-1 text-amber-600">
              <AlertCircle className="h-3 w-3" />
              {t.confirm}
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}
