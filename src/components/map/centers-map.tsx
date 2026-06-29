'use client'

import { useEffect, useRef, useState } from 'react'
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type MapRef,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import Link from 'next/link'
import { MapPin, ShieldCheck } from 'lucide-react'
import { defaultLocale, getDictionary, type Locale } from '@/lib/i18n'
import type { CenterListItem } from '@/lib/queries/centers'

interface CentersMapProps {
  centers: CenterListItem[]
  locale?: Locale
}

export function CentersMap({ centers, locale = defaultLocale }: CentersMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const t = getDictionary(locale).map

  const selected = centers.find((c) => c.id === selectedId) ?? null

  // Fit bounds to all markers once the map is loaded
  useEffect(() => {
    if (!mapRef.current || centers.length === 0) return

    if (centers.length === 1) {
      mapRef.current.flyTo({
        center: [centers[0].lng, centers[0].lat],
        zoom: 13,
        duration: 0,
      })
      return
    }

    const lngs = centers.map((c) => c.lng)
    const lats = centers.map((c) => c.lat)
    mapRef.current.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 60, duration: 0, maxZoom: 13 }
    )
  }, [centers])

  return (
    <div className="relative h-[340px] w-full overflow-hidden rounded-lg border border-gray-200 md:h-[460px]">
      <Map
        ref={mapRef}
        initialViewState={{
          // Default: center of Madrid metro area
          longitude: -3.7038,
          latitude: 40.4168,
          zoom: 10,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
        style={{ width: '100%', height: '100%' }}
        onClick={() => setSelectedId(null)}
      >
        <NavigationControl position="top-right" />

        {centers.map((center) => (
          <Marker
            key={center.id}
            longitude={center.lng}
            latitude={center.lat}
            anchor="bottom"
            onClick={(e) => {
              // Stop the map click handler from immediately closing the popup
              e.originalEvent.stopPropagation()
              setSelectedId(center.id)
            }}
          >
            <div
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 ${
                center.verified ? 'bg-blue-600' : 'bg-red-600'
              }`}
              aria-label={center.name}
            >
              <MapPin className="h-3.5 w-3.5 text-white" />
            </div>
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="top"
            offset={28}
            onClose={() => setSelectedId(null)}
            closeOnClick={false}
            maxWidth="260px"
          >
            <div className="space-y-1.5 p-1">
              <div className="flex items-start gap-1.5">
                <h3 className="text-sm font-semibold leading-tight">
                  {selected.name}
                </h3>
                {selected.verified && (
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-gray-600">{selected.address}</p>
              {selected.needed_preview.length > 0 && (
                <p className="text-xs text-gray-700">
                  {t.needs}:{' '}
                  <span className="text-gray-900">
                    {selected.needed_preview.slice(0, 3).join(', ')}
                  </span>
                </p>
              )}
              <Link
                href={`/centers/${selected.slug}`}
                className="mt-1 inline-block text-xs font-medium text-blue-700 hover:underline"
              >
                {t.details} →
              </Link>
            </div>
          </Popup>
        )}
      </Map>

      <MapLegend
        verified={t.verified}
        pendingVerification={t.pendingVerification}
      />
    </div>
  )
}

function MapLegend({
  verified,
  pendingVerification,
}: {
  verified: string
  pendingVerification: string
}) {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-md bg-white/90 px-3 py-2 text-xs text-gray-600 ring-1 ring-black/10 backdrop-blur">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
        {verified}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-full bg-red-600" />
        {pendingVerification}
      </span>
    </div>
  )
}
