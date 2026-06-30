'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { setItemStatus, removeItemStatus } from '@/lib/actions/center-items'
import { relativeTime } from '@/lib/utils/relative-time'
import type { ItemWithStatus } from '@/lib/queries/dashboard'
import type { Database } from '@/types/supabase'

type ItemStatus = Database['public']['Enums']['item_status']

const STATUS_OPTIONS: { value: ItemStatus | 'none'; label: string }[] = [
  { value: 'none', label: '—' },
  { value: 'needed', label: 'Necesita' },
  { value: 'sufficient', label: 'Suficiente' },
  { value: 'surplus', label: 'Le sobra' },
]

interface Props {
  centerId: string
  item: ItemWithStatus
}

export function ItemEditor({ centerId, item }: Props) {
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [quantity, setQuantity] = useState(item.approximate_quantity ?? '')
  const [notes, setNotes] = useState(item.notes ?? '')

  // Optimistic UI: changes appear instantly, sync in background
  const [optimisticItem, setOptimisticItem] = useOptimistic(
    item,
    (current, patch: Partial<ItemWithStatus>) => ({ ...current, ...patch })
  )

  const handleStatusChange = (value: ItemStatus | 'none') => {
    if (value === 'none') {
      startTransition(async () => {
        setOptimisticItem({
          status: null,
          approximate_quantity: null,
          notes: null,
        })
        await removeItemStatus({ centerId, itemId: item.id })
      })
      return
    }

    startTransition(async () => {
      setOptimisticItem({ status: value })
      await setItemStatus({
        centerId,
        itemId: item.id,
        status: value,
        approximateQuantity: optimisticItem.approximate_quantity,
        notes: optimisticItem.notes,
      })
    })
  }

  const handleSaveDetails = () => {
    if (!optimisticItem.status) return
    startTransition(async () => {
      setOptimisticItem({
        approximate_quantity: quantity || null,
        notes: notes || null,
      })
      await setItemStatus({
        centerId,
        itemId: item.id,
        status: optimisticItem.status!,
        approximateQuantity: quantity || null,
        notes: notes || null,
      })
      setEditing(false)
    })
  }

  return (
    <div className="rounded-md border bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex-1 font-medium text-sm">{item.name}</span>

        {pending && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
        )}

        <select
          value={optimisticItem.status ?? 'none'}
          onChange={(e) =>
            handleStatusChange(e.target.value as ItemStatus | 'none')
          }
          disabled={pending}
          className={`rounded-md border px-2 py-1 text-sm ${statusBg(
            optimisticItem.status
          )}`}
          aria-label={`Estado de ${item.name}`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {optimisticItem.status && (
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="text-xs text-blue-700 hover:underline"
          >
            {editing ? 'Cerrar' : 'Detalles'}
          </button>
        )}
      </div>

      {editing && optimisticItem.status && (
        <div className="mt-3 space-y-2 border-t pt-3">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Cantidad aproximada
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder='ej. "5 cajas"'
              maxLength={80}
              className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Notas
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='ej. "preferible sin gluten"'
              maxLength={200}
              className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveDetails}
            disabled={pending}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-3 w-3" />
            Guardar
          </button>
        </div>
      )}

      {!editing &&
        optimisticItem.status &&
        (optimisticItem.approximate_quantity || optimisticItem.notes) && (
          <div className="mt-1.5 text-xs text-gray-600">
            {optimisticItem.approximate_quantity && (
              <span>{optimisticItem.approximate_quantity}</span>
            )}
            {optimisticItem.approximate_quantity && optimisticItem.notes && ' · '}
            {optimisticItem.notes && (
              <span className="italic">{optimisticItem.notes}</span>
            )}
          </div>
        )}

      {item.updated_at && (
        <p className="mt-1 text-xs text-gray-400">
          Actualizado {relativeTime(item.updated_at)}
        </p>
      )}
    </div>
  )
}

function statusBg(status: ItemStatus | null): string {
  switch (status) {
    case 'needed':
      return 'bg-red-50 border-red-300 text-red-900'
    case 'surplus':
      return 'bg-green-50 border-green-300 text-green-900'
    case 'sufficient':
      return 'bg-gray-100 border-gray-300 text-gray-700'
    default:
      return 'bg-white border-gray-300 text-gray-500'
  }
}