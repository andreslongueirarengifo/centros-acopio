import { NextResponse } from "next/server"
import { z } from "zod"
import { getCenterBySlug } from "@/lib/queries/centers"
import { createClient } from "@/lib/supabase/server"

interface RouteContext {
  params: Promise<{ slug: string }>
}

const followCenterSchema = z.object({
  email: z
    .string()
    .email("Escribe un email válido.")
    .max(254, "El email es demasiado largo."),
})

export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params
  const body = await parseJsonObject(request)

  if (!body) {
    return jsonError(400, "invalid_json", "El cuerpo de la petición no es válido.")
  }

  const parsed = followCenterSchema.safeParse({
    email: normalizeInput(body.email),
  })

  if (!parsed.success) {
    return jsonError(
      400,
      "invalid_contact",
      parsed.error.issues[0]?.message ?? "Indica un email válido."
    )
  }

  try {
    const center = await getCenterBySlug(slug)
    if (!center) {
      return jsonError(404, "not_found", `No existe un centro activo con slug "${slug}".`)
    }

    const supabase = await createClient()
    const { error } = await supabase.from("subscriptions").insert({
      center_id: center.id,
      email: parsed.data.email.toLowerCase(),
    })

    if (error) {
      if (error.code === "23505") {
        return jsonOk({ status: "already_subscribed" })
      }

      logSupabaseError(slug, error)

      if (error.code === "PGRST205" || error.code === "42P01") {
        return jsonError(
          503,
          "subscriptions_not_configured",
          "El seguimiento todavía no está activado. Falta aplicar la migración de subscriptions."
        )
      }

      return jsonError(
        500,
        "insert_failed",
        "No pudimos guardar el seguimiento ahora."
      )
    }

    return jsonOk({ status: "created" }, 201)
  } catch (error) {
    console.error(`POST /api/centers/${slug}/followers failed:`, error)
    return jsonError(
      500,
      "internal_error",
      "No pudimos guardar el seguimiento ahora."
    )
  }
}

function logSupabaseError(
  slug: string,
  error: { code?: string; message?: string; details?: string | null; hint?: string | null }
) {
  console.error(`POST /api/centers/${slug}/followers failed`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  })
}

async function parseJsonObject(request: Request) {
  try {
    const body = (await request.json()) as unknown
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return null
    }
    return body as Record<string, unknown>
  } catch {
    return null
  }
}

function normalizeInput(value: unknown) {
  if (typeof value !== "string") return value
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function jsonOk(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(
    { data },
    { status, headers: { "Cache-Control": "no-store" } }
  )
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } }
  )
}
