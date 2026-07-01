import { ImageResponse } from 'next/og'

export const alt =
  'Ubica tu Centro de Acopio — Ayuda desde Europa a Venezuela'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Load a Google Font as an ArrayBuffer for use inside ImageResponse.
 *
 * Satori (the engine behind ImageResponse) cannot parse WOFF2.
 * Google Fonts serves WOFF2 by default when the User-Agent is a
 * modern browser. We spoof an IE11 User-Agent to force Google
 * to serve the TTF version, which satori accepts.
 */
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (
    await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
      },
    })
  ).text()

  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  )
  if (resource) {
    const response = await fetch(resource[1])
    if (response.status === 200) return await response.arrayBuffer()
  }
  throw new Error('Failed to load font from Google Fonts')
}

export default async function OpenGraphImage() {
  const text =
    'Ubica tu Centro de Acopio Ayuda desde Europa a Venezuela ubicatucentrodeacopio.com'

  const [manropeBold, manropeMedium] = await Promise.all([
    loadGoogleFont('Manrope:wght@800', text),
    loadGoogleFont('Manrope:wght@500', text),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          background: '#fafaf9',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'Manrope',
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

        <div
          style={{
            marginTop: 48,
            fontSize: 92,
            fontWeight: 800,
            color: '#1c1917',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          Ubica tu Centro
          <br />
          de Acopio
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 42,
            fontWeight: 500,
            color: '#57534e',
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
            color: '#a8a29e',
          }}
        >
          ubicatucentrodeacopio.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Manrope',
          data: manropeBold,
          style: 'normal',
          weight: 800,
        },
        {
          name: 'Manrope',
          data: manropeMedium,
          style: 'normal',
          weight: 500,
        },
      ],
    }
  )
}