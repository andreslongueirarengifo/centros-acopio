import Link from 'next/link'
import { HeartHandshake, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { MobileNav } from '@/components/mobile-nav'

export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const loggedIn = !!user

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-red-600" />
          <span className="text-lg font-semibold">
            Centros de Acopio Madrid
          </span>
          <span className="hidden text-sm text-stone-500 sm:inline">
            · Ayuda a Venezuela
          </span>
        </Link>

        {/* Desktop nav: visible en md y superior */}
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/" className="text-stone-700 hover:text-stone-900">
            Centros
          </Link>
          <Link href="/info" className="text-stone-700 hover:text-stone-900">
            Cómo ayudar
          </Link>
          <Link href="/privacidad" className="text-stone-700 hover:text-stone-900">
            Privacidad
          </Link>
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Mi panel
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-50"
            >
              Acceso centros
            </Link>
          )}
        </nav>

        {/* Mobile nav: hamburguesa, oculta en md y superior */}
        <div className="md:hidden">
          <MobileNav loggedIn={loggedIn} />
        </div>
      </div>
    </header>
  )
}