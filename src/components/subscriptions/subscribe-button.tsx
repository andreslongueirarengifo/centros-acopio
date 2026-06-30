'use client'

import { useActionState, useState, type MouseEvent } from 'react'
import { Bell, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  subscribeToCenter,
  type SubscribeState,
} from '@/lib/actions/subscriptions'

interface Props {
  centerId: string
  centerName: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm'
}

export function SubscribeButton({
  centerId,
  centerName,
  variant = 'outline',
  size = 'default',
}: Props) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<
    SubscribeState,
    FormData
  >(subscribeToCenter, undefined)

  // The button may live inside a parent <Link>, so stop click and
  // prevent default to avoid navigating to the center detail.
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setOpen(true)
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        variant={variant}
        size={size}
      >
        <Bell className="mr-2 h-4 w-4" />
        Recibir avisos
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recibir avisos de {centerName}</DialogTitle>
            <DialogDescription>
              Te avisaremos por email cuando este centro necesite algo
              urgente. Puedes cancelar la suscripción en cualquier momento
              con un click.
            </DialogDescription>
          </DialogHeader>

          {state?.ok ? (
            <div className="flex items-start gap-3 rounded-md bg-green-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <div className="text-sm text-green-900">
                <p className="font-medium">Revisa tu correo</p>
                <p className="mt-1">
                  Te hemos enviado un enlace para confirmar tu suscripción.
                  Si no lo recibes en unos minutos, mira en spam.
                </p>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="centerId" value={centerId} />

              <div className="space-y-1.5">
                <Label htmlFor={`sub-email-${centerId}`}>Tu email</Label>
                <Input
                  id={`sub-email-${centerId}`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  disabled={pending}
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  disabled={pending}
                  className="mt-0.5"
                />
                <span>
                  Acepto recibir notificaciones de este centro. Consulta la{' '}
                  <a
                    href="/privacidad"
                    target="_blank"
                    className="text-blue-700 underline"
                  >
                    política de privacidad
                  </a>
                  .
                </span>
              </label>

              {state?.error && (
                <p className="text-sm text-red-600">{state.error}</p>
              )}

              <Button type="submit" disabled={pending} className="w-full">
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Suscribirme
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}