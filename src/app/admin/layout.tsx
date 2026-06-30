import Link from 'next/link'
import { Shield, LayoutGrid, Building2 } from 'lucide-react'
import { getAdminUser } from '@/lib/auth/admin'
import { SignOutButton } from '@/components/auth/sign-out-button'

export const metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware already gated, but we double-check here so the layout
  // can safely show admin-only chrome
  const user = await getAdminUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <Shield className="h-5 w-5 text-blue-600" />
              Panel admin
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900"
              >
                <LayoutGrid className="h-4 w-4" />
                Resumen
              </Link>
              <Link
                href="/admin/centers"
                className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900"
              >
                <Building2 className="h-4 w-4" />
                Centros
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="hidden sm:inline">{user?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}