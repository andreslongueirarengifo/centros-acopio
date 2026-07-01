import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
          <div>
            <p className="font-semibold text-stone-900">
              Centros de Acopio
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Iniciativa ciudadana independiente para coordinar centros
              de acopio en Europa con ayuda a las víctimas del terremoto
              de Venezuela. La información de cada centro la facilita
              el propio centro; antes de desplazarte, confirma horario
              y necesidades por teléfono.
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm font-semibold text-stone-900">
              ¿Gestionas un centro?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Si tu iniciativa está recibiendo donaciones en cualquier
              ciudad de España, Italia u otro país europeo que quiera
              sumarse, escríbenos a{' '}
              <a
                href="mailto:ubicatucentrodeacopio@gmail.com"
                className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
              >
                ubicatucentrodeacopio@gmail.com
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/info" className="hover:text-stone-800">
              Cómo ayudar
            </Link>
            <Link href="/privacidad" className="hover:text-stone-800">
              Privacidad
            </Link>
            <a
              href="mailto:ubicatucentrodeacopio@gmail.com"
              className="hover:text-stone-800"
            >
              Contacto
            </a>
          </div>
          <p>
            © {new Date().getFullYear()} Centros de Acopio · Proyecto
            de Genius Connection Holding Capital S.L.
          </p>
        </div>
      </div>
    </footer>
  )
}