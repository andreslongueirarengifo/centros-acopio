import type { Metadata } from 'next'
import { PasswordLoginForm } from '@/components/auth/password-login-form'

export const metadata: Metadata = {
  title: 'Acceso admin',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">Acceso administracion</h1>
        <p className="mb-6 text-sm text-gray-600">
          Introduce tu email y contrasena de administrador.
        </p>
        <PasswordLoginForm />
      </div>
    </div>
  )
}