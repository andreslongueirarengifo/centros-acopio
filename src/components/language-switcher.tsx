'use client'

import { Languages } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  languageOptions,
  localeCookieName,
  type Locale,
} from '@/lib/i18n'

interface LanguageSwitcherProps {
  label: string
  locale: Locale
}

export function LanguageSwitcher({ label, locale }: LanguageSwitcherProps) {
  const router = useRouter()

  function changeLanguage(nextLocale: Locale) {
    if (nextLocale === locale) return

    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Languages className="h-4 w-4" aria-hidden="true" />
      <div
        role="group"
        aria-label={label}
        className="inline-flex rounded-md border border-gray-200 bg-white p-0.5"
      >
        {languageOptions.map((option) => {
          const active = option.code === locale

          return (
            <button
              key={option.code}
              type="button"
              title={option.label}
              aria-pressed={active}
              onClick={() => changeLanguage(option.code)}
              className={`h-7 min-w-8 rounded px-2 text-xs font-medium transition-colors ${
                active
                  ? 'bg-gray-950 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              {option.shortLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
