'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  LayoutGrid,
  LogOut,
} from 'lucide-react'
import { signOut } from '@/lib/actions/auth'

interface Props {
  loggedIn: boolean
  isAdmin: boolean
  userEmail: string | null
}

const subscribe = () => () => {}

function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

export function MobileNav({ loggedIn, isAdmin, userEmail }: Props) {
  const [open, setOpen] = useState(false)
  const isClient = useIsClient()

  const closeMenu = () => setOpen(false)

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [open])

  // ESC key closes the drawer
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const drawer = (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      aria-hidden={!open}
      inert={!open}
    >
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        className={`
          absolute inset-0 bg-stone-900/50 backdrop-blur-sm
          transition-opacity duration-300 ease-out
          motion-reduce:transition-none
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}
        `}
      />

      {/* Panel */}
      <div
        className={`
          absolute inset-y-0 right-0 flex w-full max-w-xs flex-col
          bg-white shadow-xl
          transition-transform duration-300 ease-out
          motion-reduce:transition-none
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
          <span className="text-sm font-semibold text-stone-700">Menú</span>
          <button
            type="button"
            onClick={closeMenu}
            className="rounded-md p-2 text-stone-700 hover:bg-stone-100"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 text-base">
          {/* Public section */}
          <MobileLink href="/" onClick={closeMenu}>
            Centros
          </MobileLink>
          <MobileLink href="/info" onClick={closeMenu}>
            Cómo ayudar
          </MobileLink>
          <MobileLink href="/privacidad" onClick={closeMenu}>
            Privacidad
          </MobileLink>

          {/* Admin section: only when the user is an admin */}
          {isAdmin && (
            <>
              <SectionLabel>Administración</SectionLabel>
              <MobileLink
                href="/admin"
                onClick={closeMenu}
                icon={<LayoutGrid className="h-4 w-4" />}
                accent
              >
                Resumen
              </MobileLink>
              <MobileLink
                href="/admin/centers"
                onClick={closeMenu}
                icon={<Building2 className="h-4 w-4" />}
                accent
              >
                Gestionar centros
              </MobileLink>
            </>
          )}

          {/* Manager (logged in, not admin): dashboard link */}
          {loggedIn && !isAdmin && (
            <>
              <div className="my-2 h-px bg-stone-200" />
              <MobileLink
                href="/dashboard"
                onClick={closeMenu}
                icon={<LayoutDashboard className="h-4 w-4" />}
              >
                Mi panel
              </MobileLink>
            </>
          )}
        </nav>

        {/* Account section at the bottom */}
        <div className="border-t border-stone-200 p-4">
          {loggedIn ? (
            <>
              {userEmail && (
                <p className="mb-3 truncate text-xs text-stone-500">
                  Sesión iniciada como{' '}
                  <span className="font-medium text-stone-700">
                    {userEmail}
                  </span>
                </p>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Acceso centros
            </Link>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-2 text-stone-700 hover:bg-stone-100"
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {isClient && createPortal(drawer, document.body)}
    </>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
      {children}
    </div>
  )
}

function MobileLink({
  href,
  children,
  onClick,
  icon,
  accent,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  accent?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-2 rounded-md px-3 py-3
        hover:bg-stone-100
        ${accent ? 'text-red-700' : 'text-stone-800'}
      `}
    >
      {icon}
      {children}
    </Link>
  )
}