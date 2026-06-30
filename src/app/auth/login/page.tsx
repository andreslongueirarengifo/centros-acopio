import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Acceso para responsables de centro',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">
          Acceso para centros
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Introduce el email con el que se registró tu centro. Te
          enviaremos un enlace de acceso. No necesitas contraseña.
        </p>
        <LoginForm />
        <p className="mt-6 text-xs text-gray-500">
          Solo los emails registrados previamente por la coordinación
          reciben enlace. Si crees que el tuyo debería estar y no
          recibes nada, contacta con quien te dio de alta.
        </p>
      </div>
    </div>
  )
}