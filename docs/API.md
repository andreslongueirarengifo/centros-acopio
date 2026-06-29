# API pública

API REST de solo lectura para consultar centros de acopio. Sin
autenticación, abierta a cualquier origen, pensada para que otras
webs, mapas, asistentes o bots puedan integrar la información.

> **Estabilidad:** la versión `v1` es estable en cuanto a campos
> existentes — no se eliminarán ni renombrarán. Se podrán añadir
> campos nuevos (no breaking) en cualquier momento. Cambios breaking
> irían a `v2`.

## Base URL

```
https://<tu-dominio>/api/v1
```

## Respuesta estándar

Éxito:

```json
{
  "data": { ... },
  "meta": { "generated_at": "2026-06-29T10:00:00.000Z", ... }
}
```

Error:

```json
{
  "error": {
    "code": "not_found",
    "message": "No center with slug \"foo\""
  }
}
```

## Endpoints

### `GET /api/v1/centers`

Lista todos los centros activos.

**Respuesta** `200 OK`:

```json
{
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "slug": "asociacion-vecinal-mostoles-centro",
      "name": "Asociación Vecinal Móstoles Centro",
      "description": "Punto de recogida coordinado con...",
      "address": "Calle del Pintor Velázquez, 22",
      "postal_code": "28933",
      "city": "Móstoles",
      "public_phone": "+34 916 64 12 34",
      "opening_hours": "L-V 17:00-20:00, S 10:00-14:00",
      "verified": true,
      "location": { "lat": 40.3225, "lng": -3.8650 },
      "needs_preview": ["Agua embotellada", "Pañales", "..."],
      "updated_at": "2026-06-29T10:00:00.000Z"
    }
  ],
  "meta": { "generated_at": "...", "total": 4 }
}
```

### `GET /api/v1/centers/{slug}`

Detalle de un centro y sus items agrupados por estado.

**Respuesta** `200 OK`:

```json
{
  "data": {
    "id": "...",
    "slug": "asociacion-vecinal-mostoles-centro",
    "name": "Asociación Vecinal Móstoles Centro",
    "description": "...",
    "address": "Calle del Pintor Velázquez, 22",
    "postal_code": "28933",
    "city": "Móstoles",
    "public_phone": "+34 916 64 12 34",
    "public_email": "acopio@avmostoles.example",
    "opening_hours": "L-V 17:00-20:00, S 10:00-14:00",
    "verified": true,
    "items": {
      "needed": [
        {
          "name": "Agua embotellada",
          "category": "water",
          "approximate_quantity": "50 garrafas de 5L",
          "notes": null,
          "updated_at": "2026-06-29T09:30:00.000Z"
        }
      ],
      "surplus": [...],
      "sufficient": [...]
    },
    "counts": { "needed": 4, "surplus": 1, "sufficient": 1 },
    "updated_at": "..."
  },
  "meta": { "generated_at": "..." }
}
```

**Respuesta** `404 Not Found`:

```json
{ "error": { "code": "not_found", "message": "No center with slug \"foo\"" } }
```

## Caché

Las respuestas llevan `Cache-Control: public, s-maxage=60,
stale-while-revalidate=300`. Cualquier CDN intermedio respeta esto.
Tu cliente puede asumir frescura de hasta 60 segundos.

## CORS

Todos los endpoints aceptan `Access-Control-Allow-Origin: *`. Se
puede llamar desde cualquier dominio sin proxy.

## Rate limiting

Actualmente no hay límite a nivel de aplicación. La protección de
DDoS la cubre el host (Vercel/Cloudflare). Si abusas, podemos añadir
límites por IP o por API key. Sé razonable.

## Ejemplos

```bash
# Listado
curl https://<dominio>/api/v1/centers | jq

# Detalle
curl https://<dominio>/api/v1/centers/parroquia-san-antonio-tetuan | jq

# Solo centros verificados (cliente filtra)
curl https://<dominio>/api/v1/centers \
  | jq '.data[] | select(.verified == true)'
```

```javascript
// JavaScript en el navegador
const res = await fetch('https://<dominio>/api/v1/centers')
const { data } = await res.json()
console.log(`${data.length} centros activos`)
```

## Reportar problemas

Issues sobre la API: https://github.com/<usuario>/centros-acopio/issues
con la etiqueta `api`.