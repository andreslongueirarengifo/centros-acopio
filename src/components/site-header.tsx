import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-sm font-medium text-gray-950">
          Centros de acopio para Venezuela
        </Link>

        <nav className="flex items-center gap-4 text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-gray-950"
          >
            Centros
          </Link>
          <Link
            href="/info"
            className="hover:text-gray-950"
          >
            Cómo ayudar
          </Link>
          <Link
            href="/auth/login"
            className="hover:text-gray-950"
          >
            Acceso centros
          </Link>
        </nav>
      </div>
    </header>
  )
}
