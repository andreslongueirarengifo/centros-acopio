import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NewCenterForm } from '@/components/admin/center-form'

export const metadata = { title: 'Nuevo centro' }

export default function NewCenterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/admin/centers"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>
      <h1 className="mb-1 text-2xl font-bold">Nuevo centro</h1>
      <p className="mb-6 text-sm text-gray-600">
        Una vez creado, el manager podra acceder con magic link al email
        que indiques aqui.
      </p>
      <NewCenterForm />
    </div>
  )
}