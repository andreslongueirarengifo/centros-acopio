/**
 * Renderiza un bloque JSON-LD para datos estructurados de Schema.org.
 * Google los usa para rich results (mapas, horarios, sitelinks, etc.).
 *
 * Uso:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "..." }} />
 *
 * dangerouslySetInnerHTML es seguro aquí porque el contenido lo
 * generamos nosotros desde datos que ya validamos (BD), no viene
 * de input externo.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}