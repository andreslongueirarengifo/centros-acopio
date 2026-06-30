'use client'

import { useActionState, useEffect, useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  updateCenter,
  type UpdateCenterState,
} from '@/lib/actions/admin-centers'
import type { AdminCenterDetail } from '@/lib/queries/admin'

interface Props {
  center: AdminCenterDetail
}

// Shape of the controlled form state. All strings (HTML form values
// are strings); nullables become empty strings for the UI and we
// convert back to null in the Server Action.
type FormState = {
  name: string
  description: string
  address: string
  postal_code: string
  city: string
  public_phone: string
  public_email: string
  opening_hours: string
  manager_email: string
  verified: boolean
  active: boolean
  regeocode: boolean
}

function buildInitialState(center: AdminCenterDetail): FormState {
  return {
    name: center.name,
    description: center.description ?? '',
    address: center.address,
    postal_code: center.postal_code ?? '',
    city: center.city,
    public_phone: center.public_phone ?? '',
    public_email: center.public_email ?? '',
    opening_hours: center.opening_hours ?? '',
    manager_email: center.manager_email ?? '',
    verified: center.verified,
    active: center.active,
    regeocode: false,
  }
}

export function EditCenterForm({ center }: Props) {
  const [state, action, pending] = useActionState<UpdateCenterState, FormData>(
    updateCenter,
    undefined
  )
  const [form, setForm] = useState<FormState>(() => buildInitialState(center))

  // After a successful save, sync the form to whatever the server
  // returned. This catches any normalization (lowercased emails, etc.)
  // and resets the regeocode checkbox.
  useEffect(() => {
    if (state?.ok) {
      setForm(buildInitialState(center))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const set =
    <K extends keyof FormState>(field: K) =>
    (value: FormState[K]) =>
      setForm((f) => ({ ...f, [field]: value }))

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={center.id} />

      <fieldset className="rounded-md border bg-white p-4">
        <legend className="px-2 text-sm font-semibold">Datos publicos</legend>
        <div className="space-y-3">
          <Row>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={(e) => set('name')(e.target.value)}
            />
          </Row>
          <Row>
            <Label htmlFor="description">Descripcion</Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              value={form.description}
              onChange={(e) => set('description')(e.target.value)}
            />
          </Row>
          <Row>
            <Label htmlFor="address">Direccion *</Label>
            <Input
              id="address"
              name="address"
              required
              value={form.address}
              onChange={(e) => set('address')(e.target.value)}
            />
          </Row>
          <div className="grid gap-3 sm:grid-cols-2">
            <Row>
              <Label htmlFor="postal_code">Codigo postal</Label>
              <Input
                id="postal_code"
                name="postal_code"
                value={form.postal_code}
                onChange={(e) => set('postal_code')(e.target.value)}
              />
            </Row>
            <Row>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                name="city"
                required
                value={form.city}
                onChange={(e) => set('city')(e.target.value)}
              />
            </Row>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Row>
              <Label htmlFor="public_phone">Telefono</Label>
              <Input
                id="public_phone"
                name="public_phone"
                value={form.public_phone}
                onChange={(e) => set('public_phone')(e.target.value)}
              />
            </Row>
            <Row>
              <Label htmlFor="public_email">Email publico</Label>
              <Input
                id="public_email"
                name="public_email"
                type="email"
                value={form.public_email}
                onChange={(e) => set('public_email')(e.target.value)}
              />
            </Row>
          </div>
          <Row>
            <Label htmlFor="opening_hours">Horario</Label>
            <Input
              id="opening_hours"
              name="opening_hours"
              value={form.opening_hours}
              onChange={(e) => set('opening_hours')(e.target.value)}
            />
          </Row>
        </div>
      </fieldset>

      <fieldset className="rounded-md border bg-white p-4">
        <legend className="px-2 text-sm font-semibold">Gestion</legend>
        <div className="space-y-3">
          <Row>
            <Label htmlFor="manager_email">Email del manager *</Label>
            <Input
              id="manager_email"
              name="manager_email"
              type="email"
              required
              value={form.manager_email}
              onChange={(e) => set('manager_email')(e.target.value)}
            />
            {center.manager_user_id ? (
              <p className="text-xs text-green-700">
                Manager activo (ya ha iniciado sesion).
              </p>
            ) : (
              <p className="text-xs text-amber-700">
                Pendiente de primer login. En cuanto el manager use el
                magic link, quedara asociado.
              </p>
            )}
          </Row>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="verified"
              checked={form.verified}
              onChange={(e) => set('verified')(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-medium">Verificado</span>
              <p className="text-xs text-gray-500">
                Aparece con badge azul en el listado publico.
              </p>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={(e) => set('active')(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-medium">Activo</span>
              <p className="text-xs text-gray-500">
                Si lo desactivas, deja de aparecer en la web publica
                pero los datos se conservan.
              </p>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="regeocode"
              checked={form.regeocode}
              onChange={(e) => set('regeocode')(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-medium">Recalcular coordenadas</span>
              <p className="text-xs text-gray-500">
                Marca esta opcion si has cambiado la direccion. Si no,
                las coordenadas actuales se mantienen.
              </p>
            </span>
          </label>
        </div>
      </fieldset>

      {state?.ok === false && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          Cambios guardados.
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}