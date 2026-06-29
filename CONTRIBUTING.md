# Cómo contribuir

Gracias por tu interés en ayudar a este proyecto. Las contribuciones
son bienvenidas: código, documentación, traducciones, reportes de
bugs, propuestas de funcionalidad.

## Flujo de trabajo

1. **Abre un issue antes de empezar** si vas a hacer un cambio
   sustancial (nueva feature, refactor grande, cambio de schema). Para
   correcciones pequeñas, ve directo al PR.
2. Haz fork del repositorio y crea una rama con un nombre descriptivo:
   - `feat/<corta-descripcion>` para nuevas funcionalidades
   - `fix/<corta-descripcion>` para correcciones
   - `docs/<corta-descripcion>` para documentación
   - `chore/<corta-descripcion>` para tareas internas
3. Haz commits pequeños y descriptivos. Mensajes en español o inglés
   (consistente dentro de un mismo PR).
4. Asegúrate de que todo pasa antes de abrir el PR:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
5. Abre el PR contra `main`. Rellena la plantilla. Vincula el issue
   relacionado con `Closes #<n>`.
6. Espera revisión. Los cambios solicitados van como nuevos commits a
   la rama del PR (no fuerces push si ya hay revisiones).

## Qué se acepta

- Correcciones de bugs con prueba clara del problema y la solución.
- Mejoras de accesibilidad, rendimiento, SEO.
- Traducciones (español → otras lenguas) cuando llegue el momento.
- Documentación.

## Qué se evalúa con cuidado y puede no aceptarse

- Cambios al esquema de base de datos (revisión obligatoria del owner).
- Dependencias nuevas (justifica por qué no se puede hacer sin).
- Cambios en RLS, GRANTs o cualquier cosa que afecte seguridad.
- Cambios de stack o arquitectura sin issue previo.

## Estilo de código

- TypeScript estricto. No `any` salvo justificación.
- Componentes funcionales, hooks.
- Server Components por defecto; `'use client'` solo cuando necesario.
- Queries a BD centralizadas en `src/lib/queries/`.
- Strings de cara al usuario en español (la UX es para Madrid).
- Identificadores de código (variables, funciones, tablas, columnas)
  en inglés.

## Reportar vulnerabilidades de seguridad

**No abras issues públicas para vulnerabilidades.** Escribe
directamente a `<email-de-contacto-del-maintainer>` con detalles. Te
responderemos en 48h.

## Código de conducta

Sé respetuoso. Este proyecto sirve a personas en situación de
emergencia; el tono entre colaboradores debe estar a la altura.