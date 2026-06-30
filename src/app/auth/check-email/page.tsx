import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Revisa tu email',
  robots: { index: false, follow: false },
}

export default function CheckEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <Mail className="mx-auto mb-3 h-10 w-10 text-blue-600" />
        <h1 className="mb-2 text-xl font-semibold">
          Revisa tu correo
        </h1>
        <p className="text-sm text-gray-700">
          Si el email que has introducido está registrado como
          responsable de un centro, recibirás un enlace de acceso en
          los próximos minutos.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          El enlace expira en 1 hora. Si no lo encuentras, revisa la
          carpeta de spam.
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