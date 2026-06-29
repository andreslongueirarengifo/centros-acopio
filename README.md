# Centros de Acopio Madrid

Plataforma abierta para coordinar puntos de recogida de ayuda
humanitaria en Madrid destinada a Venezuela tras los terremotos del
24 de junio de 2026.

Cada centro publica qué necesita y qué le sobra para que las
donaciones lleguen donde más hacen falta, en lugar de fragmentarse.

> **Estado:** desarrollo activo (MVP). El esquema de BD y la API
> pueden cambiar sin aviso hasta la versión 1.0.

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **Supabase** (PostgreSQL + PostGIS + Auth + Row Level Security)
- **MapLibre GL** + tiles de OpenFreeMap
- **TypeScript**, Tailwind CSS, shadcn/ui

## Puesta en marcha local

Requisitos: Node 20+, una cuenta de Supabase (free tier sirve).

```bash
git clone https://github.com/<tu-usuario>/centros-acopio.git
cd centros-acopio
npm install
cp .env.local.example .env.local
# Rellena .env.local con tus claves de Supabase
```

Aplica el esquema en el SQL Editor de Supabase en este orden:

1. `supabase/migrations/01_schema.sql`
2. `supabase/migrations/02_grants.sql`
3. `supabase/migrations/03_slug.sql`
4. `supabase/migrations/04_centers_rpc.sql`
5. `supabase/migrations/05_subscriptions_notifications.sql`
6. (opcional) `supabase/seed/test_centers.sql` para datos de prueba

Genera los tipos TypeScript desde tu proyecto:

```bash
npm run types:gen
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## API pública

El proyecto expone endpoints de solo lectura sin autenticación para
que otras webs, asistentes, bots o agentes humanitarios consuman los
datos. Documentación completa en [`docs/API.md`](docs/API.md).

Rápido:

```bash
curl https://<tu-dominio>/api/v1/centers
curl https://<tu-dominio>/api/v1/centers/parroquia-san-antonio-tetuan
```

## Seguimiento de centros

El botón **Recibir avisos** guarda el email en Supabase.
Para activarlo en una instancia nueva, aplica primero
`supabase/migrations/05_subscriptions_notifications.sql` en el SQL Editor de
Supabase. Si falta esa migración, el endpoint responderá
`subscriptions_not_configured`.

## Contribuir

Lee [`CONTRIBUTING.md`](CONTRIBUTING.md). Resumen:

- Todo cambio va por Pull Request a `main`.
- Los PRs requieren aprobación de un mantenedor (definido en
  [`.github/CODEOWNERS`](.github/CODEOWNERS)) y que pasen los checks
  de CI (typecheck + lint + build).
- Issues bienvenidas: bugs, propuestas, traducciones.

## Aviso sobre los datos

El código de este repositorio es open source bajo licencia MIT. Los
datos de cada despliegue (centros reales, teléfonos, necesidades) son
responsabilidad del operador de esa instancia y NO están cubiertos
por esta licencia. Si despliegas tu propia instancia, verifica con
cada centro antes de publicar su información.

## Licencia

[MIT](LICENSE) © 2026 Andrés Hernández y colaboradores.
