import 'server-only'

const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/**
 * Templates return both HTML and plain text. Gmail and many other
 * clients use the plain text fallback for previews; some users have
 * HTML disabled entirely. Always provide both.
 *
 * Templates are intentionally simple inline HTML — no images, no
 * trackers, no fancy CSS. Maximizes deliverability and works in
 * every email client.
 */

export function verifyEmailTemplate(args: {
  centerName: string
  verificationToken: string
}) {
  const url = `${siteUrl()}/subscriptions/verify?token=${args.verificationToken}`
  const subject = `Confirma tu suscripción a ${args.centerName}`

  const text = `
Para terminar de suscribirte a las notificaciones de
"${args.centerName}", confirma tu email haciendo click en este enlace:

${url}

Si no has solicitado esto, ignora este correo. El enlace expira en
24 horas.

— Centros de Acopio Madrid
`.trim()

  const html = `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
  <h2 style="font-size: 18px; margin: 0 0 16px;">Confirma tu suscripción</h2>
  <p>Para terminar de suscribirte a las notificaciones de
     <strong>${escapeHtml(args.centerName)}</strong>, confirma tu email:</p>
  <p style="margin: 24px 0;">
    <a href="${url}"
       style="display: inline-block; padding: 10px 16px; background: #2563eb;
              color: #fff; text-decoration: none; border-radius: 6px;">
      Confirmar suscripción
    </a>
  </p>
  <p style="font-size: 13px; color: #666;">
    O copia este enlace: ${url}
  </p>
  <p style="font-size: 13px; color: #666;">
    Si no has solicitado esto, ignora este correo. El enlace expira en 24 horas.
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #999;">Centros de Acopio Madrid</p>
</div>
`.trim()

  return { subject, text, html }
}

export function notificationTemplate(args: {
  centerName: string
  subject: string
  body: string
  unsubscribeToken: string
}) {
  const unsubscribeUrl = `${siteUrl()}/subscriptions/unsubscribe?token=${args.unsubscribeToken}`
  const centerUrl = `${siteUrl()}/`

  const text = `
${args.body}

---
Recibes este correo porque te suscribiste a las notificaciones de
"${args.centerName}".

Cancelar suscripción: ${unsubscribeUrl}
Ver el centro: ${centerUrl}
`.trim()

  const html = `
<div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
  <div style="white-space: pre-wrap; line-height: 1.5;">${escapeHtml(args.body)}</div>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #666;">
    Recibes este correo porque te suscribiste a las notificaciones de
    <strong>${escapeHtml(args.centerName)}</strong>.
  </p>
  <p style="font-size: 12px; color: #666;">
    <a href="${unsubscribeUrl}" style="color: #666;">Cancelar suscripción</a>
    &nbsp;·&nbsp;
    <a href="${centerUrl}" style="color: #666;">Ver centros</a>
  </p>
</div>
`.trim()

  return { subject: args.subject, text, html }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}