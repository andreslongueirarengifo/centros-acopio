import { ImageResponse } from 'next/og'

// Standard OG image dimensions accepted by Twitter, LinkedIn, WhatsApp, etc.
export const alt =
  'Ubica tu Centro de Acopio — Ayuda desde Europa a Venezuela'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Load a Google Font as ArrayBuffer for use inside ImageResponse.
 * ImageResponse is powered by satori under the hood, which needs
 * the raw font bytes to render text.
 *
 * We ask Google only for the glyphs we actually need (via `text`
 * param) to keep the download small.
 */
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (
    await fetch(url, {
      // Google returns different formats depending on User-Agent.
      // Modern UA gets woff2 which satori supports.
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      },
    })
  ).text()

  const resource = css.match(
    /src: url\((.+?)\) format\('(woff2?|opentype|truetype)'\)/
  )
  if (resource) {
    const response = await fetch(resource[1])
    if (response.status === 200) return await response.arrayBuffer()
  }
  throw new Error('Failed to load font from Google Fonts')
}

export default async function OpenGraphImage() {
  // Every character that appears in the image, so Google returns
  // only the glyphs we need
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
          background: '#fafaf9', // stone-50
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'Manrope',
        }}
      >
        {/* HeartHandshake icon */}
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

        {/* Title */}
        <div
          style={{
            marginTop: 48,
            fontSize: 92,
            fontWeight: 800,
            color: '#1c1917', // stone-900
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}
        >
          Ubica tu Centro
          <br />
          de Acopio
        </div>

        {/* Subtitle */}
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

        {/* Domain pinned to the bottom */}
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