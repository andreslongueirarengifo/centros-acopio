import { getActiveCenters } from '@/lib/queries/centers'
import { CenterCard } from '@/components/center-card'
import { CentersMap } from '@/components/map/centers-map'

export const revalidate = 60

export default async function HomePage() {
  const centers = await getActiveCenters()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
          Centros de acopio en Madrid
        </h1>
        <p className="text-gray-700">
          Puntos de recogida activos para enviar ayuda humanitaria a
          Venezuela tras los terremotos del 24 de junio. Cada centro
          publica lo que necesita y lo que le sobra para que tu
          donación llegue donde más hace falta.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Antes de desplazarte, confirma horario y necesidades por
          teléfono. Las necesidades cambian a lo largo del día.
        </p>
      </section>

      {centers.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-12 text-center">
          <p className="text-gray-600">
            Todavía no hay centros activos registrados. Estamos
            coordinando con las primeras organizaciones.
          </p>
        </div>
      ) : (
        <>
          <section className="relative mb-8">
            <CentersMap centers={centers} />
          </section>

          <div className="mb-4 text-sm text-gray-600">
            {centers.length}{' '}
            {centers.length === 1 ? 'centro activo' : 'centros activos'}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {centers.map((center) => (
              <CenterCard key={center.id} center={center} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}