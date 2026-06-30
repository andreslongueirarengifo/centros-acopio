'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestMagicLink, type RequestLinkState } from '@/lib/actions/auth'

export function LoginForm() {
  const [state, formAction, pending] = useActionState<
    RequestLinkState,
    FormData
  >(requestMagicLink, undefined)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email del responsable</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="responsable@tu-centro.org"
          disabled={pending}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enviarme el enlace
      </Button>
    </form>
  )
}