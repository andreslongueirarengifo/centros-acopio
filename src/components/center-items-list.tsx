import { categoryOrder } from '@/lib/labels'
import { defaultLocale, getDictionary, type Locale } from '@/lib/i18n'
import { relativeTime } from '@/lib/utils/relative-time'
import type { CenterItemWithCatalog } from '@/lib/queries/centers'
import type { Database } from '@/types/supabase'

type ItemStatus = Database['public']['Enums']['item_status']
type ItemCategory = Database['public']['Enums']['item_category']

interface Props {
  items: CenterItemWithCatalog[]
  locale?: Locale
}

export function CenterItemsList({ items, locale = defaultLocale }: Props) {
  const t = getDictionary(locale).items

  // Split by status, then group each one by category
  const byStatus: Record<ItemStatus, CenterItemWithCatalog[]> = {
    needed: [],
    surplus: [],
    sufficient: [],
  }
  for (const it of items) {
    byStatus[it.status].push(it)
  }

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">{t.empty}</p>
  }

  return (
    <div className="space-y-8">
      <StatusSection
        title={t.statuses.needed.title}
        description={t.statuses.needed.description}
        items={byStatus.needed}
        accent="red"
        categoryLabels={t.categories}
        locale={locale}
      />
      <StatusSection
        title={t.statuses.surplus.title}
        description={t.statuses.surplus.description}
        items={byStatus.surplus}
        accent="green"
        categoryLabels={t.categories}
        locale={locale}
      />
      <StatusSection
        title={t.statuses.sufficient.title}
        description={t.statuses.sufficient.description}
        items={byStatus.sufficient}
        accent="gray"
        categoryLabels={t.categories}
        locale={locale}
      />
    </div>
  )
}

function StatusSection({
  title,
  description,
  items,
  accent,
  categoryLabels,
  locale,
}: {
  title: string
  description: string
  items: CenterItemWithCatalog[]
  accent: 'red' | 'green' | 'gray'
  categoryLabels: Record<ItemCategory, string>
  locale: Locale
}) {
  if (items.length === 0) return null

  // Group by category
  const byCategory = new Map<ItemCategory, CenterItemWithCatalog[]>()
  for (const it of items) {
    const cat = it.catalog_items?.category
    if (!cat) continue
    const list = byCategory.get(cat) ?? []
    list.push(it)
    byCategory.set(cat, list)
  }

  const headerClasses = {
    red: 'text-gray-950',
    green: 'text-gray-950',
    gray: 'text-gray-700',
  }[accent]

  const itemBadgeClasses = {
    red: 'border-l-red-500',
    green: 'border-l-green-500',
    gray: 'border-l-gray-300',
  }[accent]

  return (
    <section>
      <div className="mb-4">
        <h2 className={`text-base font-medium ${headerClasses}`}>
          {title}{' '}
          <span className="text-sm font-normal text-gray-400">
            ({items.length})
          </span>
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      </div>

      <div className="space-y-5">
        {categoryOrder
          .filter((cat) => byCategory.has(cat))
          .map((cat) => {
            const catItems = byCategory.get(cat)!
            // Sort by catalog sort_order
            catItems.sort(
              (a, b) =>
                (a.catalog_items?.sort_order ?? 0) -
                (b.catalog_items?.sort_order ?? 0)
            )
            return (
              <div key={cat}>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  {categoryLabels[cat]}
                </h3>
                <ul className="divide-y divide-gray-100 border-y border-gray-100">
                  {catItems.map((item) => (
                    <li
                      key={`${item.center_id}-${item.item_id}`}
                      className={`flex flex-wrap items-center gap-x-2 gap-y-1 border-l-2 py-3 pl-3 text-sm ${itemBadgeClasses}`}
                    >
                      <span className="font-medium">
                        {item.catalog_items?.name}
                      </span>
                      {item.approximate_quantity && (
                        <span className="text-gray-600">
                          · {item.approximate_quantity}
                        </span>
                      )}
                      {item.notes && (
                        <span className="text-gray-600 italic">
                          · {item.notes}
                        </span>
                      )}
                      <span className="ml-auto text-xs text-gray-500">
                        {relativeTime(item.updated_at, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
      </div>
    </section>
  )
}
