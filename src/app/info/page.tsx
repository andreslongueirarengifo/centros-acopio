import type { Metadata } from 'next'
import Link from 'next/link'
import {
  MapPin,
  Bell,
  Package,
  Heart,
  ExternalLink,
  Smartphone,
  Phone,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cómo ayudar',
  description:
    'Guía práctica para donar a los afectados por los terremotos de Venezuela: cómo funcionan los centros de acopio en Madrid y qué organizaciones canalizan ayuda económica desde España.',
}

export default function InfoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-wider text-stone-500">
        Guía para donantes
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Cómo ayudar
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-stone-700">
        Los terremotos del 24 de junio de 2026 en Venezuela han dejado
        más de mil fallecidos y miles de familias sin hogar. Desde
        Madrid puedes ayudar de dos formas: llevando material a un
        centro de acopio o donando económicamente a una organización.
        Ambas cuentan.
      </p>

      {/* ================================================================ */}
      {/* Cómo funciona la plataforma */}
      {/* ================================================================ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-stone-900">
          Qué es esta plataforma
        </h2>
        <p className="mt-3 leading-relaxed text-stone-800">
          Centros de Acopio Madrid nació con un objetivo concreto:
          centralizar información sobre los puntos físicos de recogida
          en la comunidad de Madrid y mantener a los donantes al día de
          qué necesita realmente cada centro. Sin este tipo de
          coordinación, los centros terminan llenos de cosas que no
          necesitan y les faltan las que sí. Eso es lo que intentamos
          evitar.
        </p>
        <p className="mt-3 leading-relaxed text-stone-800">
          Nosotros no recogemos donaciones ni gestionamos logística. Cada
          centro es autónomo y lo lleva una organización, parroquia,
          asociación o local comercial. Nuestra función es que sea fácil
          para ti saber a dónde ir y con qué.
        </p>
      </section>

      {/* ================================================================ */}
      {/* Pasos para donar material */}
      {/* ================================================================ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-stone-900">
          Donar material físico
        </h2>
        <p className="mt-3 leading-relaxed text-stone-800">
          Si prefieres traer productos concretos, sigue estos tres pasos.
          Comprobar antes qué se necesita ahorra viajes en falso y
          asegura que la ayuda llega donde hace falta.
        </p>

        <ol className="mt-6 space-y-6">
          <Step
            n={1}
            icon={<MapPin className="h-5 w-5" />}
            title="Elige un centro cercano"
          >
            En la{' '}
            <Link
              href="/"
              className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              página principal
            </Link>{' '}
            tienes el mapa con todos los centros activos en Madrid.
            Elige el que te venga mejor por cercanía u horario.
          </Step>
          <Step
            n={2}
            icon={<Package className="h-5 w-5" />}
            title="Revisa qué necesita ahora mismo"
          >
            Cada centro publica en tiempo real qué le hace falta y qué
            ya tiene de sobra. Trae solo lo primero. Llevar cosas que
            ya no necesitan es contraproducente: ocupan espacio y
            complican el reparto.
          </Step>
          <Step
            n={3}
            icon={<Bell className="h-5 w-5" />}
            title="Suscríbete a avisos (opcional)"
          >
            Si prefieres no comprobar la web cada vez, deja tu correo
            en el centro que elijas. Solo te escribiremos cuando esa
            organización tenga una necesidad nueva que consideren
            urgente. Puedes darte de baja con un click en cualquier
            momento.
          </Step>
        </ol>
      </section>

      {/* ================================================================ */}
      {/* Donación económica */}
      {/* ================================================================ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-stone-900">
          Donar dinero a organizaciones
        </h2>
        <p className="mt-3 leading-relaxed text-stone-800">
          Los propios equipos humanitarios en Venezuela repiten un
          mensaje: cuando no se piden insumos específicos, la donación
          económica suele ser la forma más eficaz de ayudar. Permite
          comprar exactamente lo que hace falta en cada momento sobre
          el terreno, y dinamiza el comercio local en las zonas
          afectadas.
        </p>
        <p className="mt-3 leading-relaxed text-stone-800">
          Estas son organizaciones consolidadas que están canalizando
          ayuda a los afectados por el terremoto. Todas emiten
          certificado de donación con desgravación fiscal para
          personas físicas y jurídicas en España.
        </p>

        <div className="mt-8 space-y-4">
          <Org
            name="Comité de Emergencia Español"
            summary="Alianza de 8 grandes ONG (Acción contra el Hambre, Aldeas Infantiles SOS, Educo, Entreculturas, Médicos del Mundo, Oxfam Intermón, Plan International y World Vision) que reparte los fondos entre las organizaciones que actúan sobre el terreno."
            actions={[
              {
                label: 'Donar en comiteemergencia.org',
                href: 'https://www.comiteemergencia.org/emergencias/terremoto-venezuela/',
                icon: 'link',
              },
            ]}
          />
          <Org
            name="Save the Children"
            summary="Enfocada en menores y familias afectadas. Ha activado equipos en las zonas de La Guaira y Caracas."
            actions={[
              {
                label: 'Bizum al 13132 (concepto: Terremoto Venezuela)',
                icon: 'bizum',
              },
              {
                label: '900 37 37 15 (gratuito, L-V 9-21h)',
                href: 'tel:900373715',
                icon: 'phone',
              },
              {
                label: 'savethechildren.es',
                href: 'https://www.savethechildren.es/donacion-ong/terremoto-en-venezuela-2026',
                icon: 'link',
              },
            ]}
          />
          <Org
            name="Cáritas Española"
            summary="Trabaja con Cáritas Venezuela y las Cáritas diocesanas de los estados afectados. Ha movilizado 300.000€ iniciales para la respuesta."
            actions={[
              {
                label: 'Bizum al 0089',
                icon: 'bizum',
              },
              {
                label: 'caritas.es',
                href: 'https://www.caritas.es',
                icon: 'link',
              },
            ]}
          />
          <Org
            name="Cruz Roja Española"
            summary="Coordina con la Federación Internacional (IFRC) y con la Cruz Roja Venezolana los equipos de emergencia sobre el terreno."
            actions={[
              {
                label: 'cruzroja.es',
                href: 'https://www.cruzroja.es',
                icon: 'link',
              },
            ]}
          />
          <Org
            name="UNICEF"
            summary="Interviene en las áreas afectadas priorizando refugio, agua potable, salud y protección infantil."
            actions={[
              {
                label: 'unicef.es',
                href: 'https://www.unicef.es',
                icon: 'link',
              },
            ]}
          />
          <Org
            name="Cáritas Venezuela"
            summary="Si prefieres donar directamente al país, Cáritas Venezuela ha publicado cuentas en euros y dólares a nombre de 'A.C. Cáritas de Venezuela'. Consulta los datos actualizados en su web oficial."
            actions={[
              {
                label: 'caritas.org.ve',
                href: 'https://caritas.org.ve',
                icon: 'link',
              },
            ]}
          />
        </div>

        <p className="mt-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>Cuidado con las estafas.</strong> Tras cualquier
          desastre proliferan las campañas falsas por WhatsApp y redes.
          Dona siempre a través de la web oficial de la organización o
          por los canales verificados que aparecen en su propia página.
          Si tienes dudas sobre una organización, comprueba antes en
          Charity Navigator o consulta su registro oficial.
        </p>
      </section>

      {/* ================================================================ */}
      {/* Otras formas de ayudar */}
      {/* ================================================================ */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-stone-900">
          Otras formas de ayudar sin donar
        </h2>
        <p className="mt-3 leading-relaxed text-stone-800">
          Si ahora mismo no puedes aportar material ni dinero, hay
          otras cosas útiles:
        </p>
        <ul className="mt-4 space-y-3 text-stone-800">
          <li className="flex gap-3">
            <Heart className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <span>
              <strong>Comparte esta página</strong> con quien pueda
              donar o coordinar un centro. Cuanta más gente sepa qué se
              necesita, mejor.
            </span>
          </li>
          <li className="flex gap-3">
            <Heart className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <span>
              <strong>Ofrece transporte</strong> a un centro cercano si
              tienes vehículo y disponibilidad. Escríbeles directamente
              al teléfono público que tiene cada centro en su ficha.
            </span>
          </li>
          <li className="flex gap-3">
            <Heart className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <span>
              <strong>Si tienes contactos en Venezuela</strong>, difunde
              información verificada. Muchas familias siguen buscando a
              sus allegados a través de webs como Desaparecidos
              Terremoto Venezuela.
            </span>
          </li>
        </ul>
      </section>

      {/* ================================================================ */}
      {/* Cierre */}
      {/* ================================================================ */}
      <div className="mt-14 rounded-md border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">
          ¿Gestionas un centro de acopio?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-700">
          Si tu asociación, parroquia o comercio está recibiendo
          donaciones y quieres aparecer en la plataforma para que la
          gente sepa exactamente qué necesitas, escríbenos a{' '}
          <a
            href="mailto:ubicatucentrodeacopio@gmail.com"
            className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
          >
            ubicatucentrodeacopio@gmail.com
          </a>{' '}
          y te damos de alta.
        </p>
      </div>
    </div>
  )
}

// ================================================================
// Small components used only in this page
// ================================================================

function Step({
  n,
  icon,
  title,
  children,
}: {
  n: number
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
          {n}
        </div>
      </div>
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-stone-600">{icon}</span>
          <h3 className="font-semibold text-stone-900">{title}</h3>
        </div>
        <p className="mt-2 leading-relaxed text-stone-700">{children}</p>
      </div>
    </li>
  )
}

type OrgAction = {
  label: string
  href?: string
  icon: 'link' | 'bizum' | 'phone'
}

function Org({
  name,
  summary,
  actions,
}: {
  name: string
  summary: string
  actions: OrgAction[]
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="text-base font-semibold text-stone-900">{name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
        {summary}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((a, i) => {
          const Icon =
            a.icon === 'bizum'
              ? Smartphone
              : a.icon === 'phone'
                ? Phone
                : ExternalLink

          if (a.href) {
            const external = a.href.startsWith('http')
            return (
              <a
                key={i}
                href={a.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-100"
              >
                <Icon className="h-3.5 w-3.5" />
                {a.label}
              </a>
            )
          }
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-800"
            >
              <Icon className="h-3.5 w-3.5" />
              {a.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}