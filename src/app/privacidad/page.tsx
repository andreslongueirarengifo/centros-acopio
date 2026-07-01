import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Cómo trata Centros de Acopio Madrid los datos personales de donantes y gestores de centros, conforme al RGPD.',
}

// Update this when you materially change the policy so users can see it.
const LAST_UPDATED = '30 de junio de 2026'

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-xs uppercase tracking-wider text-stone-500">
        Información legal
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Política de privacidad
      </h1>
      <p className="mt-3 text-sm text-stone-600">
        Última actualización: {LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-10 text-stone-800 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stone-900 [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        <section>
          <p>
            Esta política describe cómo tratamos los datos personales que
            recogemos cuando usas Centros de Acopio, una plataforma sin
            ánimo de lucro para coordinar la ayuda humanitaria a las
            personas afectadas por los terremotos del 24 de junio de 2026
            en Venezuela. La plataforma opera actualmente en España e
            Italia, con vocación de crecer a otros países europeos donde
            se estén organizando iniciativas similares.
          </p>
          <p>
            Nos tomamos la privacidad en serio y hemos diseñado el
            servicio pidiendo el mínimo de datos posible. Si tienes
            cualquier duda tras leer esto, escríbenos.
          </p>
        </section>

        <section>
          <h2>Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de tus datos es{' '}
            <strong>Genius Connection Holding Capital, S.L.</strong>,
            sociedad constituida en España.
          </p>
          <p>
            Para cualquier cuestión relacionada con esta política o con
            tus derechos, puedes escribir a{' '}
            <a
              href="mailto:info@geniusconnection.es"
              className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              info@geniusconnection.es
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Qué datos recogemos y para qué</h2>
          <p>
            Solo recogemos datos cuando decides participar activamente
            en la plataforma. Concretamente:
          </p>
          <ul>
            <li>
              <strong>Si eres donante y te suscribes a un centro:</strong>{' '}
              tu correo electrónico, para enviarte los avisos que el
              propio centro te haga llegar (nuevas necesidades,
              confirmación de recepción, etc.).
            </li>
            <li>
              <strong>Si gestionas un centro de acopio:</strong> tu
              correo electrónico, necesario para acceder al panel y
              publicar actualizaciones sobre las necesidades del centro.
            </li>
          </ul>
          <p>
            No pedimos ni almacenamos nombre, dirección postal, teléfono
            ni ningún otro dato identificativo de donantes. Los datos
            públicos de los centros de acopio (dirección, horario,
            teléfono de contacto) los publican los propios gestores.
          </p>
        </section>

        <section>
          <h2>Base legal</h2>
          <ul>
            <li>
              <strong>Consentimiento:</strong> cuando te suscribes a
              recibir avisos de un centro, marcas expresamente que
              aceptas esta política. Puedes retirar el consentimiento en
              cualquier momento con un solo click en el enlace de baja
              incluido en cada correo.
            </li>
            <li>
              <strong>Interés legítimo:</strong> los datos de gestores
              de centros se tratan por el interés legítimo de coordinar
              la ayuda humanitaria y hacer que la plataforma funcione.
            </li>
          </ul>
        </section>

        <section>
          <h2>Con quién compartimos tus datos</h2>
          <p>
            <strong>No cedemos datos a terceros con fines comerciales.</strong>{' '}
            Nunca. Este es un proyecto caritativo, no un negocio.
          </p>
          <p>
            Sí trabajamos con dos proveedores tecnológicos que son
            necesarios para que el servicio funcione. Ambos actúan como
            encargados del tratamiento y solo procesan datos por
            instrucción nuestra:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> aloja la base de datos y gestiona
              la autenticación. Servidores localizados en la Unión
              Europea (Fráncfort).
            </li>
            <li>
              <strong>Resend</strong> envía los correos de verificación
              y los avisos de los centros. Servidores en Estados Unidos;
              la transferencia se ampara en las cláusulas contractuales
              tipo aprobadas por la Comisión Europea.
            </li>
          </ul>
          <p>
            No utilizamos servicios de analítica, publicidad ni
            seguimiento de terceros. No hay Google Analytics, ni Meta
            Pixel, ni herramientas similares.
          </p>
        </section>

        <section>
          <h2>Cuánto tiempo conservamos tus datos</h2>
          <ul>
            <li>
              <strong>Suscripciones de donante:</strong> mientras
              mantengas la suscripción activa. Al darte de baja, tu
              correo se elimina de la base de datos en un plazo máximo
              de 30 días.
            </li>
            <li>
              <strong>Cuentas de gestor de centro:</strong> mientras el
              centro esté activo en la plataforma. Al cesar la actividad,
              los datos personales del gestor se eliminan y la ficha
              histórica del centro puede conservarse anonimizada.
            </li>
            <li>
              <strong>Logs técnicos:</strong> los registros de acceso al
              sistema se conservan durante un máximo de 90 días para
              fines de seguridad.
            </li>
          </ul>
        </section>

        <section>
          <h2>Tus derechos</h2>
          <p>
            Tienes derecho, en cualquier momento, a:
          </p>
          <ul>
            <li>Acceder a los datos personales que tenemos sobre ti.</li>
            <li>Rectificarlos si son inexactos.</li>
            <li>Suprimirlos (derecho al olvido).</li>
            <li>Oponerte a su tratamiento.</li>
            <li>Solicitar la portabilidad a otro proveedor.</li>
            <li>Limitar el tratamiento en determinados supuestos.</li>
          </ul>
          <p>
            Para ejercerlos, escribe a{' '}
            <a
              href="mailto:info@geniusconnection.es"
              className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              info@geniusconnection.es
            </a>{' '}
            indicando el derecho que quieres ejercer. Te responderemos
            en un plazo máximo de 30 días.
          </p>
          <p>
            Si consideras que no hemos tratado correctamente tus datos,
            puedes reclamar ante la{' '}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              Agencia Española de Protección de Datos
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            No usamos cookies de publicidad, analítica ni seguimiento.
            La plataforma solo utiliza cookies técnicas estrictamente
            necesarias para mantener tu sesión iniciada cuando accedes
            como gestor de centro. Estas cookies se eliminan cuando
            cierras sesión.
          </p>
        </section>

        <section>
          <h2>Cambios en esta política</h2>
          <p>
            Si actualizamos esta política, publicaremos la nueva versión
            aquí con la fecha correspondiente. Cuando el cambio afecte
            materialmente a tus derechos, además te avisaremos por
            correo si estás suscrito.
          </p>
        </section>

        <div className="mt-12 rounded-md border border-stone-200 bg-stone-100 p-5">
          <p className="text-sm text-stone-700">
            ¿Prefieres darte de baja o borrar tus datos ahora mismo?
            Puedes hacerlo con un click desde el enlace incluido en
            cualquier correo, o volver a la{' '}
            <Link
              href="/"
              className="font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
            >
              página principal
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}