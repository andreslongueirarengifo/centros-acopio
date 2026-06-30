import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { unsubscribeByToken } from '@/lib/actions/subscriptions'

export const metadata = {
  title: 'Cancelando suscripción',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-lg bg-white p-6 text-center shadow-sm">
          <XCircle className="mx-auto mb-3 h-10 w-10 text-red-600" />
          <h1 className="mb-2 text-xl font-semibold">Enlace no válido</h1>
        </div>
      </div>
    )
  }

  const result = await unsubscribeByToken(token)

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        {result.ok ? (
          <>
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
            <h1 className="mb-2 text-xl font-semibold">
              Suscripción cancelada
            </h1>
            <p className="text-sm text-gray-700">
              No volverás a recibir emails de{' '}
              {result.centerName ? (
                <strong>{result.centerName}</strong>
              ) : (
                'este centro'
              )}
              . Si quieres volver a suscribirte más adelante, puedes
              hacerlo desde la página del centro.
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-3 h-10 w-10 text-red-600" />
            <h1 className="mb-2 text-xl font-semibold">Enlace no válido</h1>
            <p className="text-sm text-gray-700">
              No hemos encontrado tu suscripción. Es posible que ya
              estuviera cancelada.
            </p>
          </>
        )}
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