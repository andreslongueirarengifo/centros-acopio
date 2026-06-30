'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uuidString } from '../validators'

const statusEnum = z.enum(['needed', 'sufficient', 'surplus'])

const setStatusSchema = z.object({
  centerId: uuidString,                    // ← antes: z.string().uuid()
  itemId: uuidString,                      // ← antes: z.string().uuid()
  status: statusEnum,
  approximateQuantity: z.string().max(80).optional().nullable(),
  notes: z.string().max(200).optional().nullable(),
})

const removeStatusSchema = z.object({
  centerId: uuidString,
  itemId: uuidString,
})

export type ItemActionResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Upsert the status of a catalog item for a center.
 *
 * RLS handles the authorization: the policy `center_items_all_manager`
 * only allows insert/update for rows where the user is the center's
 * manager_user_id. We do NOT add a manual permission check — RLS is
 * the source of truth and any divergence would be a bug.
 */
export async function setItemStatus(
  input: z.infer<typeof setStatusSchema>
): Promise<ItemActionResult> {
  const parsed = setStatusSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const supabase = await createClient()

  // updated_by is set automatically by the BEFORE trigger via auth.uid()
  const { error } = await supabase
    .from('center_items')
    .upsert(
      {
        center_id: parsed.data.centerId,
        item_id: parsed.data.itemId,
        status: parsed.data.status,
        approximate_quantity: parsed.data.approximateQuantity ?? null,
        notes: parsed.data.notes ?? null,
      },
      { onConflict: 'center_id,item_id' }
    )

  if (error) {
    console.error('setItemStatus failed:', error)
    return { ok: false, error: 'No se pudo guardar' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { ok: true }
}

/**
 * Remove an item from the center's tracked list (back to "no info").
 */
export async function removeItemStatus(
  input: z.infer<typeof removeStatusSchema>
): Promise<ItemActionResult> {
  const parsed = removeStatusSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Datos inválidos' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('center_items')
    .delete()
    .eq('center_id', parsed.data.centerId)
    .eq('item_id', parsed.data.itemId)

  if (error) {
    console.error('removeItemStatus failed:', error)
    return { ok: false, error: 'No se pudo eliminar' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/')
  return { ok: true }
}