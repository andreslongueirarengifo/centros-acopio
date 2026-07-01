import Link from 'next/link'
import { CheckCircle2, XCircle, ExternalLink, Plus } from 'lucide-react'
import { getAllCenters } from '@/lib/queries/admin'
import { relativeTime } from '@/lib/utils/relative-time'

export const dynamic = 'force-dynamic'

export default async function AdminCentersListPage() {
  const centers = await getAllCenters()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Centros</h1>
          <p className="text-sm text-stone-600">
            {centers.length}{' '}
            {centers.length === 1 ? 'centro registrado' : 'centros registrados'}
          </p>
        </div>
        <Link
          href="/admin/centers/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo centro
        </Link>
      </div>

      {centers.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-500">
          No hay centros todavía.{' '}
          <Link
            href="/admin/centers/new"
            className="font-medium text-red-700 hover:underline"
          >
            Crea el primero
          </Link>
          .
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="space-y-3 md:hidden">
            {centers.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-stone-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold text-stone-900">
                      {c.name}
                    </h2>
                    <p className="text-xs text-stone-500">{c.city}</p>
                  </div>
                  <Link
                    href={`/admin/centers/${c.slug}/edit`}
                    className="shrink-0 text-sm font-medium text-red-700 hover:underline"
                  >
                    Editar
                  </Link>
                </div>

                <div className="mt-3 space-y-1 text-xs text-stone-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Manager:</span>
                    <span className="truncate">
                      {c.manager_email ?? '—'}
                    </span>
                    {c.manager_email && !c.manager_user_id && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                        sin login
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <StatusPill active={c.active} label="Activo" />
                    <StatusPill active={c.verified} label="Verificado" />
                    <span className="text-stone-500">
                      Actualizado {relativeTime(c.updated_at)}
                    </span>
                  </div>
                </div>

                {c.active && (
                  <div className="mt-3 border-t border-stone-100 pt-3">
                    <Link
                      href={`/centers/${c.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ver ficha pública
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-lg border border-stone-200 bg-white md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
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
                {centers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">
                        {c.name}
                      </div>
                      <div className="text-xs text-stone-500">{c.city}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {c.manager_email ?? '—'}
                      {c.manager_email && !c.manager_user_id && (
                        <div className="text-xs text-amber-700">
                          Sin login aún
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.active ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-stone-400" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.verified ? (
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-stone-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500">
                      {relativeTime(c.updated_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {c.active && (
                          <Link
                            href={`/centers/${c.slug}`}
                            target="_blank"
                            className="text-stone-500 hover:text-stone-800"
                            aria-label="Ver ficha pública"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/centers/${c.slug}/edit`}
                          className="text-xs font-medium text-red-700 hover:underline"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function StatusPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {active ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-stone-400" />
      )}
      <span className={active ? 'text-stone-700' : 'text-stone-500'}>
        {label}
      </span>
    </span>
  )
}