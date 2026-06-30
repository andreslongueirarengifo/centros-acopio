import { categoryLabels, categoryOrder } from '@/lib/labels'
import { ItemEditor } from './item-editor'
import type { ItemWithStatus } from '@/lib/queries/dashboard'
import type { Database } from '@/types/supabase'

type ItemCategory = Database['public']['Enums']['item_category']

interface Props {
  centerId: string
  items: ItemWithStatus[]
}

export function ItemsGrid({ centerId, items }: Props) {
  const byCategory = new Map<ItemCategory, ItemWithStatus[]>()
  for (const it of items) {
    const list = byCategory.get(it.category) ?? []
    list.push(it)
    byCategory.set(it.category, list)
  }

  return (
    <div className="space-y-6">
      {categoryOrder
        .filter((cat) => byCategory.has(cat))
        .map((cat) => (
          <section key={cat}>
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
              {categoryLabels[cat]}
            </h3>
            <div className="grid gap-2 md:grid-cols-2">
              {byCategory.get(cat)!.map((item) => (
                <ItemEditor
                  key={item.id}
                  centerId={centerId}
                  item={item}
                />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}