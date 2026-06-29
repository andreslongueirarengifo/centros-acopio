"use client"

import * as React from "react"
import {
  Bell,
  CheckCircle2,
  X,
  Loader2,
  Mail,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { defaultLocale, getDictionary, type Locale } from "@/lib/i18n"

type FollowCenterDialogProps = {
  centerName: string
  centerSlug: string
  locale?: Locale
}

export function FollowCenterDialog({
  centerName,
  centerSlug,
  locale = defaultLocale,
}: FollowCenterDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const inputId = React.useId()
  const t = getDictionary(locale).follow

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setEmail("")
      setError(null)
      setSuccess(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError(t.errors.emptyEmail)
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/centers/${encodeURIComponent(centerSlug)}/followers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        }
      )
      const payload = (await response.json().catch(() => null)) as {
        error?: { code?: string; message?: string }
      } | null

      if (!response.ok) {
        const code = payload?.error?.code
        setError(
          code && code in t.errors
            ? t.errors[code as keyof typeof t.errors]
            : t.errors.generic
        )
        return
      }

      setSuccess(true)
      setEmail("")
    } catch {
      setError(t.errors.network)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 sm:w-auto"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-4 w-4" />
        {t.trigger}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleOpenChange(false)
            }
          }}
        >
          <div
            aria-modal="true"
            role="dialog"
            aria-labelledby={`${inputId}-title`}
            aria-describedby={`${inputId}-description`}
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl ring-1 ring-black/10"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id={`${inputId}-title`}
                  className="text-base font-semibold text-gray-950"
                >
                  {t.titlePrefix} {centerName}
                </h2>
                <p
                  id={`${inputId}-description`}
                  className="mt-1 text-sm leading-6 text-gray-600"
                >
                  {t.description}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.close}
                className="-mr-1 -mt-1 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{t.success}</p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-9 w-full items-center justify-center rounded-md bg-gray-950 px-3 text-sm font-medium text-white hover:bg-gray-800"
                  onClick={() => handleOpenChange(false)}
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor={inputId}>{t.emailLabel}</Label>
                  <Input
                    id={inputId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p id={`${inputId}-error`} className="text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => handleOpenChange(false)}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-gray-950 px-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {t.save}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
