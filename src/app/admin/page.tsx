import { getAdminStats } from '@/lib/queries/admin'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AdminHomePage() {
  const stats = await getAdminStats()

  const tiles = [
    { label: 'Centros totales', value: stats.total },
    { label: 'Centros activos', value: stats.active },
    { label: 'Centros verificados', value: stats.verified },
    { label: 'Suscriptores totales', value: stats.totalSubscribers },
    { label: 'Avisos enviados', value: stats.totalNotifications },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Resumen</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardContent className="p-4">
              <p className="text-xs text-stone-500">{t.label}</p>
              <p className="mt-1 text-2xl font-bold">{t.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}