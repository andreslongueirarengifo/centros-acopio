import { getActiveCenters } from '@/lib/queries/centers'
import { CenterCard } from '@/components/center-card'
import { CentersMap } from '@/components/map/centers-map'
import { getDictionary } from '@/lib/i18n'
import { getLocale } from '@/lib/i18n-server'

export const revalidate = 60

export default async function HomePage() {
  const locale = await getLocale()
  const t = getDictionary(locale)
  const centers = await getActiveCenters()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <section className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          {t.home.title}
        </h1>
        <p className="mt-3 text-base leading-7 text-gray-600">
          {t.home.description}
        </p>
      </section>

      {centers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-600">{t.home.emptyCenters}</p>
        </div>
      ) : (
        <>
          <section className="mb-8">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium text-gray-950">
                {t.home.mapTitle}
              </h2>
              <p className="text-xs text-gray-500">
                {centers.length}{' '}
                {centers.length === 1
                  ? t.home.activeCenterSingular
                  : t.home.activeCenterPlural}
              </p>
            </div>
            <CentersMap centers={centers} locale={locale} />
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-medium text-gray-950">
                {t.home.centersTitle}
              </h2>
              <p className="text-xs text-gray-500">
                {t.home.confirmBeforeGoing}
              </p>
            </div>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {centers.map((center) => (
                <CenterCard key={center.id} center={center} locale={locale} />
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-500">
              {t.home.note}
            </p>
          </section>
        </>
      )}
    </div>
  )
}
