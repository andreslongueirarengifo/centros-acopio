import { categoryLabels, categoryOrder } from '@/lib/labels'
import { relativeTime } from '@/lib/utils/relative-time'
import type { CenterItemWithCatalog } from '@/lib/queries/centers'
import type { Database } from '@/types/supabase'

type ItemStatus = Database['public']['Enums']['item_status']
type ItemCategory = Database['public']['Enums']['item_category']

interface Props {
  items: CenterItemWithCatalog[]
}

export function CenterItemsList({ items }: Props) {
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
    return (
      <p className="text-sm text-gray-500">
        Este centro todavía no ha publicado sus necesidades.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <StatusSection
        title="Necesita"
        description="Estos artículos hacen falta ahora. Si puedes traerlos, este es el centro."
        items={byStatus.needed}
        accent="red"
      />
      <StatusSection
        title="Le sobra"
        description="Este centro tiene de más estos artículos — mejor llevarlos a otro."
        items={byStatus.surplus}
        accent="green"
      />
      <StatusSection
        title="Suficiente"
        description="Cubierto por ahora, no urge."
        items={byStatus.sufficient}
        accent="gray"
      />
    </div>
  )
}

function StatusSection({
  title,
  description,
  items,
  accent,
}: {
  title: string
  description: string
  items: CenterItemWithCatalog[]
  accent: 'red' | 'green' | 'gray'
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
    red: 'text-red-800',
    green: 'text-green-800',
    gray: 'text-gray-700',
  }[accent]

  const itemBadgeClasses = {
    red: 'border-red-200 bg-red-50 text-red-900',
    green: 'border-green-200 bg-green-50 text-green-900',
    gray: 'border-gray-200 bg-gray-50 text-gray-700',
  }[accent]

  return (
    <section>
      <div className="mb-3">
        <h2 className={`text-lg font-semibold ${headerClasses}`}>
          {title}{' '}
          <span className="text-sm font-normal text-gray-500">
            ({items.length})
          </span>
        </h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="space-y-4">
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
                <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
                  {categoryLabels[cat]}
                </h3>
                <ul className="space-y-2">
                  {catItems.map((item) => (
                    <li
                      key={`${item.center_id}-${item.item_id}`}
                      className={`flex flex-wrap items-center gap-2 rounded-md border p-2 text-sm ${itemBadgeClasses}`}
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
                        {relativeTime(item.updated_at)}
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