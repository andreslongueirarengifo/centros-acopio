'use client'

import { useActionState, useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  sendNotification,
  type SendNotificationState,
} from '@/lib/actions/notifications'

interface Props {
  centerId: string
  centerName: string
  subscriberCount: number
  suggestedItems: string[]
}

export function NotificationComposer({
  centerId,
  centerName,
  subscriberCount,
  suggestedItems,
}: Props) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<
    SendNotificationState,
    FormData
  >(sendNotification, undefined)

  const suggestion =
    suggestedItems.length > 0
      ? `Hola,\n\nDesde ${centerName} necesitamos especialmente: ${suggestedItems.join(', ')}.\n\nSi puedes acercarte hoy, te lo agradeceremos enormemente. Recuerda confirmar el horario en la web antes de venir.\n\n¡Gracias!`
      : `Hola,\n\nDesde ${centerName} queremos avisarte de una novedad...\n\n¡Gracias por seguirnos!`

  const disabled = subscriberCount === 0

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <Send className="mr-2 h-4 w-4" />
        Enviar aviso
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar aviso a tus suscriptores</DialogTitle>
            <DialogDescription>
              Se enviará a {subscriberCount}{' '}
              {subscriberCount === 1 ? 'persona' : 'personas'}. Solo puedes
              enviar un aviso cada 6 horas, así que asegúrate de que vale
              la pena.
            </DialogDescription>
          </DialogHeader>

          {state?.ok ? (
            <div className="flex items-start gap-3 rounded-md bg-green-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <div className="text-sm text-green-900">
                <p className="font-medium">Aviso enviado</p>
                <p className="mt-1">
                  Se ha enviado a {state.recipientsCount}{' '}
                  {state.recipientsCount === 1 ? 'persona' : 'personas'}.
                </p>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="centerId" value={centerId} />

              <div className="space-y-1.5">
                <Label htmlFor="subject">Asunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  required
                  maxLength={120}
                  defaultValue={
                    suggestedItems.length > 0
                      ? `Necesitamos ayuda: ${suggestedItems[0]}`
                      : ''
                  }
                  disabled={pending}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="body">Mensaje</Label>
                <Textarea
                  id="body"
                  name="body"
                  required
                  rows={8}
                  maxLength={2000}
                  defaultValue={suggestion}
                  disabled={pending}
                />
                <p className="text-xs text-gray-500">
                  Máximo 2000 caracteres. Se añadirá automáticamente un
                  enlace para cancelar suscripción al final del correo.
                </p>
              </div>

              {state?.ok === false && (
                <p className="text-sm text-red-600">{state.error}</p>
              )}

              <Button type="submit" disabled={pending} className="w-full">
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar a {subscriberCount}{' '}
                {subscriberCount === 1 ? 'persona' : 'personas'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}