import { NextResponse } from 'next/server'

/**
 * CORS headers for public read-only endpoints.
 * Anyone can call these from any origin.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

/**
 * Cache hint for CDNs and clients.
 * - 60s fresh
 * - up to 5min stale while revalidating in background
 * The actual freshness in Vercel/CF is governed by the route's
 * `revalidate` export combined with these headers.
 */
const cacheHeaders = {
  'Cache-Control':
    'public, s-maxage=60, stale-while-revalidate=300',
}

export function jsonOk<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json(
    { data, meta: { generated_at: new Date().toISOString(), ...meta } },
    {
      status: 200,
      headers: { ...corsHeaders, ...cacheHeaders },
    }
  )
}

export function jsonError(
  status: number,
  code: string,
  message: string
) {
  return NextResponse.json(
    { error: { code, message } },
    {
      status,
      headers: corsHeaders, // no cache for errors
    }
  )
}

export function preflightOk() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}