import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/server'
import { getCenterForAdmin } from '@/lib/queries/admin'
import { EditCenterForm } from '@/components/admin/edit-center-form'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Editar centro' }

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditCenterPage({ params }: Props) {
  const { slug } = await params

  // Resolve slug to id (admin sees all centers regardless of active)
  const admin = createAdminClient()
  const { data: centerRef } = await admin
    .from('centers')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (!centerRef) notFound()

  const center = await getCenterForAdmin(centerRef.id)
  if (!center) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/admin/centers"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{center.name}</h1>
          <p className="text-sm text-gray-600">Editar datos del centro</p>
        </div>
        {center.active && (
          <Link
            href={`/centers/${center.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Ver publico
          </Link>
        )}
      </div>
      <EditCenterForm center={center} />
    </div>
  )
}