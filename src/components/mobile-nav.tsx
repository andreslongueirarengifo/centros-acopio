'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard } from 'lucide-react'

interface Props {
  loggedIn: boolean
}

export function MobileNav({ loggedIn }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const lastPathname = useRef(pathname)

  // Close menu on route change. Comparing the previous pathname (kept in
  // a ref) against the current one during render lets us update state
  // without a useEffect, avoiding the react-hooks/set-state-in-effect
  // lint rule and one extra render cycle.
  if (lastPathname.current !== pathname) {
    lastPathname.current = pathname
    if (open) setOpen(false)
  }

  // Portal target only exists after hydration. On SSR, document is
  // undefined, so we defer creating the portal until we've mounted.
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // The drawer is rendered via a Portal into document.body so it isn't
  // constrained by the sticky header's transform-based containing block.
  // Otherwise `fixed inset-0` would only fill the header, not the viewport.
  const drawer = (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      aria-hidden={!open}
      inert={!open}
    >
      {/* Backdrop: fades in/out */}
      <div
        onClick={() => setOpen(false)}
        className={`
          absolute inset-0 bg-stone-900/50 backdrop-blur-sm
          transition-opacity duration-300 ease-out
          motion-reduce:transition-none
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}
        `}
      />

      {/* Panel: slides in from the right */}
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
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-stone-700 hover:bg-stone-100"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4 text-base">
          <MobileLink href="/">Centros</MobileLink>
          <MobileLink href="/info">Cómo ayudar</MobileLink>
          <MobileLink href="/privacidad">Privacidad</MobileLink>

          <div className="my-2 h-px bg-stone-200" />

          {loggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-md bg-stone-100 px-3 py-3 font-medium text-stone-900"
            >
              <LayoutDashboard className="h-4 w-4" />
              Mi panel
            </Link>
          ) : (
            <Link
              href="/auth/login"
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

      {mounted && createPortal(drawer, document.body)}
    </>
  )
}

function MobileLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-3 text-stone-800 hover:bg-stone-100"
    >
      {children}
    </Link>
  )
}