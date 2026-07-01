import Link from 'next/link'
import { HeartHandshake, LayoutDashboard, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/auth/admin'
import { signOut } from '@/lib/actions/auth'
import { MobileNav } from '@/components/mobile-nav'

export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const loggedIn = !!user
  const isAdmin = loggedIn && isAdminEmail(user?.email)

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 shrink-0 text-red-600" />
          <span className="text-base font-semibold sm:text-lg">
            Centros de Acopio Madrid
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/" className="text-stone-700 hover:text-stone-900">
            Centros
          </Link>
          <Link href="/info" className="text-stone-700 hover:text-stone-900">
            Cómo ayudar
          </Link>
          <Link
            href="/privacidad"
            className="text-stone-700 hover:text-stone-900"
          >
            Privacidad
          </Link>

          {isAdmin ? (
            <>
              <div className="h-4 w-px bg-stone-300" />
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
              >
                <Shield className="h-4 w-4" />
                Panel admin
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-stone-600 hover:text-stone-900"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                Mi panel
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-stone-600 hover:text-stone-900"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-50"
            >
              Acceso centros
            </Link>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden">
          <MobileNav
            loggedIn={loggedIn}
            isAdmin={isAdmin}
            userEmail={user?.email ?? null}
          />
        </div>
      </div>
    </header>
  )
}