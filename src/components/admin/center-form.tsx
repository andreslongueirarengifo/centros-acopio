'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  createCenter,
  type CreateCenterState,
} from '@/lib/actions/admin-centers'

export function NewCenterForm() {
  const [state, action, pending] = useActionState<CreateCenterState, FormData>(
    createCenter,
    undefined
  )

  return (
    <form action={action} className="space-y-5">
      <FieldGroup title="Datos pUblicos">
        <Field label="Nombre" name="name" required maxLength={120} />
        <Field
          label="DescripciOn"
          name="description"
          textarea
          rows={2}
          maxLength={500}
        />
        <Field label="DirecciOn" name="address" required maxLength={200} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="COdigo postal" name="postal_code" maxLength={10} />
          <Field label="Ciudad" name="city" defaultValue="Madrid" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="TelEfono pUblico" name="public_phone" />
          <Field label="Email pUblico" name="public_email" type="email" />
        </div>
        <Field
          label="Horario"
          name="opening_hours"
          placeholder="L-V 17:00-20:00, S 10:00-14:00"
        />
      </FieldGroup>

      <FieldGroup title="GestiOn">
        <Field
          label="Email del manager"
          name="manager_email"
          type="email"
          required
          help="Esta persona recibirA un magic link al iniciar sesiOn y quedarA asociada como responsable del centro."
        />
        <Checkbox
          label="Marcar como verificado"
          name="verified"
          help="SOlo activa esto si has comprobado que el centro es legItimo y estA coordinado."
        />
      </FieldGroup>

      <FieldGroup
        title="Coordenadas (opcional)"
        description="Si los dejas vacIos, las coordenadas se calcularan automAticamente a partir de la direcciOn."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Latitud manual"
            name="manual_lat"
            type="number"
            step="any"
          />
          <Field
            label="Longitud manual"
            name="manual_lng"
            type="number"
            step="any"
          />
        </div>
      </FieldGroup>

      {state?.ok === false && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear centro
        </Button>
      </div>
    </form>
  )
}

function FieldGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="rounded-md border bg-white p-4">
      <legend className="px-2 text-sm font-semibold">{title}</legend>
      {description && (
        <p className="mb-3 text-xs text-gray-500">{description}</p>
      )}
      <div className="space-y-3">{children}</div>
    </fieldset>
  )
}

function Field({
  label,
  name,
  required,
  textarea,
  rows,
  help,
  ...rest
}: {
  label: string
  name: string
  required?: boolean
  textarea?: boolean
  rows?: number
  help?: string
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </Label>
      {textarea ? (
        <Textarea id={name} name={name} required={required} rows={rows ?? 3} {...rest} />
      ) : (
        <Input id={name} name={name} required={required} {...rest} />
      )}
      {help && <p className="text-xs text-gray-500">{help}</p>}
    </div>
  )
}

function Checkbox({
  label,
  name,
  help,
  defaultChecked,
}: {
  label: string
  name: string
  help?: string
  defaultChecked?: boolean
}) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5"
      />
      <span>
        <span className="font-medium">{label}</span>
        {help && <p className="mt-0.5 text-xs text-gray-500">{help}</p>}
      </span>
    </label>
  )
}