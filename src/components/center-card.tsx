import Link from 'next/link'
import { MapPin, Phone, Clock, ShieldCheck, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { relativeTime, isStale } from '@/lib/utils/relative-time'
import type { CenterListItem } from '@/lib/queries/centers'
import { SubscribeButton } from '@/components/subscriptions/subscribe-button'

export function CenterCard({ center }: { center: CenterListItem }) {
  const stale = isStale(center.updated_at, 48)

  return (
    <Link href={`/centers/${center.slug}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-tight">
              {center.name}
            </h3>
            {center.verified && (
              <Badge
                variant="outline"
                className="shrink-0 border-blue-200 bg-blue-50 text-blue-700"
              >
                <ShieldCheck className="mr-1 h-3 w-3" />
                Verificado
              </Badge>
            )}
          </div>

          {center.description && (
            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
              {center.description}
            </p>
          )}

          <div className="space-y-1.5 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span>
                {center.address}
                {center.postal_code && `, ${center.postal_code}`}
              </span>
            </div>
            {center.public_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{center.public_phone}</span>
              </div>
            )}
            {center.opening_hours && (
              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>{center.opening_hours}</span>
              </div>
            )}
          </div>

          {center.needed_preview.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Necesita ahora
              </p>
              <div className="flex flex-wrap gap-1.5">
                {center.needed_preview.map((name) => (
                  <Badge
                    key={name}
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-800"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Actualizado {relativeTime(center.updated_at)}</span>
            {stale && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                Pendiente de confirmar
              </span>
            )}
          </div>

          <SubscribeButton
            centerId={center.id}
            centerName={center.name}
            variant="ghost"
            size="sm"
          />
          
        </CardContent>
      </Card>
    </Link>
  )
}