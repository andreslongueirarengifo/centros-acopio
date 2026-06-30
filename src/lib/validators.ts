import { z } from 'zod'

/**
 * Permissive UUID validator: any version, not strictly v4.
 *
 * Why not z.string().uuid() / z.uuid() ?
 *   Zod v4 requires the actual v4 format (version bit = 4, variant
 *   bit = 8/9/a/b). Test fixtures like '11111111-1111-1111-1111-111111111111'
 *   look like UUIDs but fail v4 validation.
 *
 * Why is this still safe?
 *   The destination column in PostgreSQL is `uuid`, which validates the
 *   format strictly on INSERT/UPDATE. The only purpose of validating
 *   here is to fail fast on obvious junk (empty string, random text)
 *   before doing a round-trip to the DB. PostgreSQL is the source of
 *   truth for UUID format.
 */
export const uuidString = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    'Identificador no válido'
  )