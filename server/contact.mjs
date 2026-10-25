const json = (status, message, extra = {}) =>
  Response.json(
    { message, ...extra },
    {
      status,
      headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    }
  );
const unavailable = () => json(503, 'El formulario no está disponible ahora. Inténtalo más tarde.');

// Both Pages and the local Astro route use this handler. Never trust client recipients.
export async function contact(request, env, fetcher = fetch) {
  const url = new URL(request.url);
  const configured =
    env.RESEND_API_KEY &&
    env.TURNSTILE_SECRET_KEY &&
    env.TURNSTILE_SITE_KEY &&
    env.CONTACT_TO_EMAIL &&
    env.CONTACT_FROM_EMAIL &&
    env.CONTACT_HOSTNAME === url.hostname;
  if (request.method === 'GET') {
    return configured ? json(200, '', { siteKey: env.TURNSTILE_SITE_KEY }) : unavailable();
  }
  if (request.method !== 'POST') return json(405, 'Método no permitido.');
  if (request.headers.get('origin') !== url.origin) return json(403, 'Solicitud no permitida.');
  if (!configured) return unavailable();
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return json(415, 'Formato no válido.');
  if (Number(request.headers.get('content-length')) > 24000)
    return json(413, 'El mensaje es demasiado largo.');
  let data;
  try {
    // Limit the streamed body as well: Content-Length is optional and untrusted.
    const reader = request.body?.getReader();
    if (!reader) return json(400, 'Completa el formulario.');
    let length = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 24000) {
        await reader.cancel();
        return json(413, 'El mensaje es demasiado largo.');
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json(400, 'Completa el formulario.');
  }
  if (!data || typeof data !== 'object' || Array.isArray(data))
    return json(400, 'Completa el formulario.');
  if (data.website) return json(400, 'No se pudo validar el formulario.');
  const field = (key, max) =>
    typeof data[key] === 'string' && data[key].trim().length <= max ? data[key].trim() : '';
  const name = field('name', 120),
    email = field('email', 200),
    service = field('service', 200);
  const message = field('message', 5000),
    token = field('token', 2048);
  if (
    !name ||
    /[\r\n\x00]/.test(name) ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
    !message
  )
    return json(400, 'Revisa tu nombre, correo y mensaje.');
  if (!token) return json(400, 'Completa la verificación de seguridad.');
  try {
    const verification = await fetcher(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: request.headers.get('CF-Connecting-IP') || undefined,
        }),
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!verification.ok) return unavailable();
    const result = await verification.json();
    if (!result.success || result.hostname !== env.CONTACT_HOSTNAME || result.action !== 'contact')
      return json(400, 'La verificación venció o no es válida. Inténtalo de nuevo.');
    const sent = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `contact-${await tokenHash(token)}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: 'Nuevo proyecto — Mizradev',
        text: `Nombre: ${name}\nCorreo: ${email}\nServicio: ${
          service || 'Por definir'
        }\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!sent.ok || !(await sent.json()).id) return unavailable();
    return json(200, 'Tu mensaje se ha enviado. Gracias por contarme tu idea.');
  } catch {
    return unavailable();
  }
}
async function tokenHash(token) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
