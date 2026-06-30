import Link from 'next/link'
import { ExternalLink, Mail, ShieldCheck, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  getManagedCenter,
  getCatalogWithCenterStatus,
  getSubscriberStats,
  getRecentNotifications,
} from '@/lib/queries/dashboard'
import { ItemsGrid } from '@/components/dashboard/items-grid'
import { NotificationComposer } from '@/components/dashboard/notification-composer'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { relativeTime } from '@/lib/utils/relative-time'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Panel del centro',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const center = await getManagedCenter()

  if (!center) {
    return <NoCenterView />
  }

  const [items, subscribers, notifications] = await Promise.all([
    getCatalogWithCenterStatus(center.id),
    getSubscriberStats(center.id),
    getRecentNotifications(center.id),
  ])

  const neededItems = items
    .filter((i) => i.status === 'needed')
    .slice(0, 5)
    .map((i) => i.name)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold">{center.name}</h1>
            {center.verified && (
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Verificado
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {center.address}, {center.city}
          </p>
          <Link
            href={`/centers/${center.slug}`}
            target="_blank"
            className="mt-1 inline-flex items-center gap-1 text-xs text-blue-700 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Ver página pública
          </Link>
        </div>
        <SignOutButton />
      </header>

      {!center.active && (
        <div className="mb-6 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Tu centro está marcado como inactivo y no aparece en el
            listado público. Contacta con la coordinación para
            reactivarlo.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items: columna ancha */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Tus necesidades</h2>
            <p className="text-xs text-gray-500">
              Los cambios se guardan automáticamente
            </p>
          </div>
          <ItemsGrid centerId={center.id} items={items} />
        </section>

        {/* Suscriptores + historial: columna estrecha */}
        <aside className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <h3 className="font-semibold">Suscriptores</h3>
              </div>
              <p className="mb-1 text-3xl font-bold">{subscribers.verified}</p>
              <p className="mb-4 text-xs text-gray-500">
                {subscribers.pending > 0 &&
                  `${subscribers.pending} pendiente${subscribers.pending === 1 ? '' : 's'} de confirmar`}
              </p>
              <NotificationComposer
                centerId={center.id}
                centerName={center.name}
                subscriberCount={subscribers.verified}
                suggestedItems={neededItems}
              />
              {subscribers.verified === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Todavía no hay suscriptores verificados. Comparte tu
                  página pública para que la gente se apunte.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="mb-3 font-semibold">Últimos avisos enviados</h3>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No has enviado ningún aviso todavía.
                </p>
              ) : (
                <ul className="space-y-3">
                  {notifications.map((n) => (
                    <li key={n.id} className="border-l-2 border-gray-200 pl-3 text-sm">
                      <p className="font-medium leading-tight">
                        {n.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {relativeTime(n.sent_at)} · {n.recipients_count}{' '}
                        {n.recipients_count === 1 ? 'destinatario' : 'destinatarios'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function NoCenterView() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 text-center shadow-sm">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
        <h1 className="mb-2 text-xl font-semibold">
          Tu cuenta no gestiona ningún centro
        </h1>
        <p className="text-sm text-gray-700">
          Has iniciado sesión correctamente, pero tu email no está
          asociado a ningún centro de acopio. Si crees que esto es un
          error, contacta con la coordinación.
        </p>
        <div className="mt-6 flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}