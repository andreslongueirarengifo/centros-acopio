'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Menu, X, LayoutDashboard } from 'lucide-react'

interface Props {
  loggedIn: boolean
}

// Stable subscribe function for useSyncExternalStore. Defined at module
// scope so its reference never changes across renders (a requirement).
const subscribe = () => () => {}

/**
 * Returns true only after client-side hydration has finished.
 * On the server (and during the initial client render that must match
 * SSR output), returns false. This lets us conditionally use APIs like
 * document.body that don't exist server-side.
 */
function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

export function MobileNav({ loggedIn }: Props) {
  const [open, setOpen] = useState(false)
  const isClient = useIsClient()

  const closeMenu = () => setOpen(false)

  // Lock body scroll while menu is open
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

  // The drawer is portaled into document.body so it isn't constrained
  // by the sticky header's transform-based containing block.
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

        <nav className="flex flex-col gap-1 p-4 text-base">
          <MobileLink href="/" onClick={closeMenu}>
            Centros
          </MobileLink>
          <MobileLink href="/info" onClick={closeMenu}>
            Cómo ayudar
          </MobileLink>
          <MobileLink href="/privacidad" onClick={closeMenu}>
            Privacidad
          </MobileLink>

          <div className="my-2 h-px bg-stone-200" />

          {loggedIn ? (
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-md bg-stone-100 px-3 py-3 font-medium text-stone-900"
            >
              <LayoutDashboard className="h-4 w-4" />
              Mi panel
            </Link>
          ) : (
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="rounded-md border border-stone-300 px-3 py-3 text-center font-medium text-stone-900"
            >
              Acceso centros
            </Link>
          )}
        </nav>
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

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-md px-3 py-3 text-stone-800 hover:bg-stone-100"
    >
      {children}
    </Link>
  )
}