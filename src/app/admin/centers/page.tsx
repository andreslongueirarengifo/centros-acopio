import Link from 'next/link'
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import { getAllCenters } from '@/lib/queries/admin'
import { relativeTime } from '@/lib/utils/relative-time'

export const dynamic = 'force-dynamic'

export default async function AdminCentersListPage() {
  const centers = await getAllCenters()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Centros</h1>
          <p className="text-sm text-gray-600">
            {centers.length}{' '}
            {centers.length === 1 ? 'centro registrado' : 'centros registrados'}
          </p>
        </div>
        <Link
          href="/admin/centers/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo centro
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Manager</th>
              <th className="px-4 py-3 font-medium">Activo</th>
              <th className="px-4 py-3 font-medium">Verificado</th>
              <th className="px-4 py-3 font-medium">Actualizado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {centers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay centros todavía.{' '}
                  <Link href="/admin/centers/new" className="text-blue-700 hover:underline">
                    Crea el primero
                  </Link>
                  .
                </td>
              </tr>
            ) : (
              centers.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.city}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {c.manager_email ?? '—'}
                    {c.manager_email && !c.manager_user_id && (
                      <div className="text-xs text-amber-600">Sin login aún</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.active ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.verified ? (
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {relativeTime(c.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/centers/${c.slug}`}
                        target="_blank"
                        className="text-xs text-gray-500 hover:text-gray-800"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/centers/${c.slug}/edit`}
                        className="text-xs font-medium text-blue-700 hover:underline"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}