import { formatDistanceToNow } from 'date-fns'
import { enUS, es, it } from 'date-fns/locale'
import { defaultLocale, type Locale as AppLocale } from '@/lib/i18n'

const dateFnsLocales = {
  es,
  it,
  en: enUS,
}

/**
 * "hace 2 horas", "hace 3 días"
 */
export function relativeTime(
  date: string | Date,
  locale: AppLocale = defaultLocale
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, {
    addSuffix: true,
    locale: dateFnsLocales[locale],
  })
}

/**
 * True if the date is older than `hours` hours.
 * Used to flag stale center data.
 */
export function isStale(date: string | Date, hours = 48): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const ageMs = Date.now() - d.getTime()
  return ageMs > hours * 60 * 60 * 1000
}
