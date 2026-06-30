import Link from 'next/link'
import { HeartHandshake, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-red-600" />
          <span className="text-lg font-semibold">
            Centros de Acopio Madrid
          </span>
          <span className="hidden text-sm text-gray-500 sm:inline">
            · Ayuda a Venezuela
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Centros
          </Link>
          <Link href="/info" className="text-gray-700 hover:text-gray-900">
            Cómo ayudar
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Mi panel
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md border px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            >
              Acceso centros
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}