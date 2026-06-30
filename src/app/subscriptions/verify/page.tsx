import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { verifySubscription } from '@/lib/actions/subscriptions'

export const metadata = {
  title: 'Confirmando suscripción',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return <Failure message="Enlace de verificación no válido." />
  }

  const result = await verifySubscription(token)

  if (!result.ok) {
    return (
      <Failure
        message="Este enlace no es válido o ya ha expirado. Vuelve a suscribirte si quieres recibir avisos."
      />
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
        <h1 className="mb-2 text-xl font-semibold">Suscripción confirmada</h1>
        <p className="text-sm text-gray-700">
          Recibirás un email cuando{' '}
          {result.centerName ? (
            <strong>{result.centerName}</strong>
          ) : (
            'este centro'
          )}{' '}
          publique un aviso importante.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-blue-700 hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

function Failure({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <XCircle className="mx-auto mb-3 h-10 w-10 text-red-600" />
        <h1 className="mb-2 text-xl font-semibold">No pudimos confirmar</h1>
        <p className="text-sm text-gray-700">{message}</p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-blue-700 hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}