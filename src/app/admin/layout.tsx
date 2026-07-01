import Link from 'next/link'
import { LayoutGrid, Building2 } from 'lucide-react'
import { getAdminUser } from '@/lib/auth/admin'

export const metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await getAdminUser()

  return (
    <div>
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="flex gap-1 overflow-x-auto text-sm">
            <AdminTab href="/admin" icon={<LayoutGrid className="h-4 w-4" />}>
              Resumen
            </AdminTab>
            <AdminTab
              href="/admin/centers"
              icon={<Building2 className="h-4 w-4" />}
            >
              Centros
            </AdminTab>
          </nav>
        </div>
      </div>
      {children}
    </div>
  )
}

function AdminTab({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1.5 border-b-2 border-transparent px-4 py-3 text-stone-700 hover:border-stone-300 hover:text-stone-900"
    >
      {icon}
      {children}
    </Link>
  )
}