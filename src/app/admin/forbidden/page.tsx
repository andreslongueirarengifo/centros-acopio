import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export const metadata = { title: 'Acceso denegado' }

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-amber-500" />
        <h1 className="mb-2 text-xl font-semibold">Acceso denegado</h1>
        <p className="text-sm text-gray-700">
          Tu cuenta no tiene permisos de administracion. Si crees que
          deberias, contacta con el responsable del proyecto.
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