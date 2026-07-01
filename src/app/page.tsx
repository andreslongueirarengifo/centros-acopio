import type { Metadata } from 'next'
import { getActiveCenters } from '@/lib/queries/centers'
import { CenterCard } from '@/components/center-card'
import { CentersMap } from '@/components/map/centers-map'
import { JsonLd } from '@/components/seo/json-ld'

export const revalidate = 60

export const metadata: Metadata = {
  // Título más orientado a búsqueda que solo "Centros de Acopio"
  title:
    'Centros de acopio activos · Ayuda al terremoto de Venezuela',
  description:
    'Mapa actualizado de centros de acopio en España e Italia con destino a las víctimas del terremoto de Venezuela. Ve qué necesita cada centro antes de llevar tu donación.',
  alternates: {
    canonical: 'https://www.ubicatucentrodeacopio.com',
  },
}

export default async function HomePage() {
  const centers = await getActiveCenters()

  // JSON-LD específico de la home: colección de lugares que refuerza
  // la intención de "encontrar un centro de acopio cerca"
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: centers.map((center, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: center.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: center.address,
          addressLocality: center.city,
          postalCode: center.postal_code ?? undefined,
          addressCountry: 'ES',
        },
        url: `https://www.ubicatucentrodeacopio.com/centers/${center.slug}`,
      },
    })),
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-red-700">
          Ayuda desde Europa a Venezuela
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
          Centros de acopio activos
        </h1>
        <p className="mt-3 text-stone-700">
          Puntos de recogida en España e Italia donde se organiza la
          ayuda humanitaria a las víctimas de los terremotos del 24 de
          junio de 2026. Cada centro publica lo que necesita y lo que
          le sobra para que tu donación llegue donde más hace falta.
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Antes de desplazarte, confirma horario y necesidades por
          teléfono. Las necesidades cambian a lo largo del día.
        </p>
      </section>

      {centers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-stone-600">
            Todavía no hay centros activos registrados. Estamos
            coordinando con las primeras organizaciones en España e
            Italia.
          </p>
        </div>
      ) : (
        <>
          <section className="relative mb-8">
            <CentersMap centers={centers} />
          </section>

          <div className="mb-4 text-sm text-stone-600">
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

      {centers.length > 0 && <JsonLd data={itemListJsonLd} />}
    </div>
  )
}