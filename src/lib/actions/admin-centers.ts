'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { geocodeAddress } from '@/lib/geocoding/nominatim'
import { uuidString } from '@/lib/validators'
import type { Database } from '@/types/supabase'

type CenterInsert = Database['public']['Tables']['centers']['Insert']
type CenterUpdate = Database['public']['Tables']['centers']['Update']

// =====================================================================
// CREATE
// =====================================================================

const createCenterSchema = z.object({
  name: z.string().min(3, 'Nombre muy corto').max(120),
  description: z.string().max(500).optional().nullable(),
  address: z.string().min(5, 'Direccion requerida').max(200),
  postal_code: z.string().max(10).optional().nullable(),
  city: z.string().min(1).max(80).default('Madrid'),
  public_phone: z.string().max(40).optional().nullable(),
  public_email: z
    .string()
    .email('Email no valido')
    .optional()
    .or(z.literal(''))
    .nullable(),
  opening_hours: z.string().max(200).optional().nullable(),
  manager_email: z
    .string()
    .email('Email del manager no valido')
    .toLowerCase(),
  verified: z.coerce.boolean().default(false),
  manual_lat: z.coerce.number().min(-90).max(90).optional().nullable(),
  manual_lng: z.coerce.number().min(-180).max(180).optional().nullable(),
})

export type CreateCenterState =
  | { ok: true; slug: string }
  | { ok: false; error: string }
  | undefined

export async function createCenter(
  _prev: CreateCenterState,
  formData: FormData
): Promise<CreateCenterState> {
  await requireAdmin()

  const parsed = createCenterSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || null,
    address: formData.get('address'),
    postal_code: formData.get('postal_code') || null,
    city: formData.get('city') || 'Madrid',
    public_phone: formData.get('public_phone') || null,
    public_email: formData.get('public_email') || null,
    opening_hours: formData.get('opening_hours') || null,
    manager_email: formData.get('manager_email'),
    verified: formData.get('verified') === 'on',
    manual_lat: formData.get('manual_lat') || null,
    manual_lng: formData.get('manual_lng') || null,
  })

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' }
  }

  const data = parsed.data

  let lat: number | null = data.manual_lat ?? null
  let lng: number | null = data.manual_lng ?? null

  if (lat === null || lng === null) {
    const result = await geocodeAddress(data.address, data.city)
    if (!result) {
      return {
        ok: false,
        error:
          'No se pudo geocodificar la direccion. Introducela con mas detalle o usa los campos de latitud/longitud manuales.',
      }
    }
    lat = result.lat
    lng = result.lng
  }

  const supabase = createAdminClient()

  const insert: CenterInsert = {
    name: data.name,
    slug: '',
    description: data.description,
    address: data.address,
    postal_code: data.postal_code,
    city: data.city,
    location: `POINT(${lng} ${lat})` as unknown as CenterInsert['location'],
    public_phone: data.public_phone,
    public_email: data.public_email || null,
    opening_hours: data.opening_hours,
    manager_email: data.manager_email,
    verified: data.verified,
    active: true,
  }

  const { data: inserted, error } = await supabase
    .from('centers')
    .insert(insert)
    .select('slug')
    .single()

  if (error || !inserted) {
    console.error('createCenter insert failed:', error)
    if (error?.code === '23505') {
      return {
        ok: false,
        error: 'Ese email de manager ya esta asignado a otro centro.',
      }
    }
    return { ok: false, error: 'No se pudo crear el centro.' }
  }

  revalidatePath('/admin/centers')
  revalidatePath('/')

  redirect(`/admin/centers/${inserted.slug}/edit`)
}


// =====================================================================
// UPDATE
// =====================================================================

const updateCenterSchema = z.object({
  id: uuidString,
  name: z.string().min(3).max(120),
  description: z.string().max(500).optional().nullable(),
  address: z.string().min(5).max(200),
  postal_code: z.string().max(10).optional().nullable(),
  city: z.string().min(1).max(80),
  public_phone: z.string().max(40).optional().nullable(),
  public_email: z
    .string()
    .email()
    .optional()
    .or(z.literal(''))
    .nullable(),
  opening_hours: z.string().max(200).optional().nullable(),
  manager_email: z.string().email().toLowerCase(),
  verified: z.coerce.boolean(),
  active: z.coerce.boolean(),
  regeocode: z.coerce.boolean().default(false),
})

export type UpdateCenterState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined

export async function updateCenter(
  _prev: UpdateCenterState,
  formData: FormData
): Promise<UpdateCenterState> {
  await requireAdmin()

  const parsed = updateCenterSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description') || null,
    address: formData.get('address'),
    postal_code: formData.get('postal_code') || null,
    city: formData.get('city'),
    public_phone: formData.get('public_phone') || null,
    public_email: formData.get('public_email') || null,
    opening_hours: formData.get('opening_hours') || null,
    manager_email: formData.get('manager_email'),
    verified: formData.get('verified') === 'on',
    active: formData.get('active') === 'on',
    regeocode: formData.get('regeocode') === 'on',
  })

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' }
  }

  const data = parsed.data
  const supabase = createAdminClient()

  const update: CenterUpdate = {
    name: data.name,
    description: data.description,
    address: data.address,
    postal_code: data.postal_code,
    city: data.city,
    public_phone: data.public_phone,
    public_email: data.public_email || null,
    opening_hours: data.opening_hours,
    manager_email: data.manager_email,
    verified: data.verified,
    active: data.active,
  }

  if (data.regeocode) {
    const result = await geocodeAddress(data.address, data.city)
    if (!result) {
      return {
        ok: false,
        error: 'No se pudo geocodificar la nueva direccion.',
      }
    }
    update.location = `POINT(${result.lng} ${result.lat})` as unknown as CenterUpdate['location']
  }

  const { error } = await supabase
    .from('centers')
    .update(update)
    .eq('id', data.id)

  if (error) {
    console.error('updateCenter failed:', error)
    if (error.code === '23505') {
      return {
        ok: false,
        error: 'Ese email de manager ya esta asignado a otro centro.',
      }
    }
    return { ok: false, error: 'No se pudo guardar.' }
  }

  revalidatePath('/admin/centers')
  revalidatePath('/')

  return { ok: true }
}