import { ImageResponse } from 'next/og'

export const alt =
  'Ubica tu Centro de Acopio — Ayuda desde Europa a Venezuela'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * OG image sin carga externa de fuentes. Usa la fuente por defecto
 * de next/og. Si en el futuro quieres Manrope exacto, bundle el TTF
 * localmente y pasalo en `fonts`.
 *
 * Nota importante: satori (el motor detras de ImageResponse) es
 * estricto y exige que todo <div> con mas de un hijo declare
 * `display: flex` (o `contents`/`none`) explicitamente. No acepta
 * el `display: block` implicito del navegador.
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fafaf9', // stone-50
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
          <path d="m18 15-2-2" />
          <path d="m15 18-2-2" />
        </svg>

        {/* Titulo: dos lineas en dos divs para no depender de <br /> */}
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
            fontSize: 92,
            fontWeight: 800,
            color: '#1c1917', // stone-900
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          <div>Ubica tu Centro</div>
          <div>de Acopio</div>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 42,
            fontWeight: 500,
            color: '#57534e', // stone-600
            lineHeight: 1.3,
          }}
        >
          Ayuda desde Europa a Venezuela
        </div>

        <div
          style={{
            marginTop: 'auto',
            fontSize: 24,
            fontWeight: 500,
            color: '#a8a29e', // stone-400
          }}
        >
          ubicatucentrodeacopio.com
        </div>
      </div>
    ),
    { ...size }
  )
}