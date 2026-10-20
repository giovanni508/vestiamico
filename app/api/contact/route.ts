// Riceve i messaggi del modulo contatti.
// Destinatario e mittente arrivano SOLO da variabili d'ambiente (mai scritti nel codice):
//   CONTACT_TO_EMAIL   casella che riceve i messaggi
//   CONTACT_FROM_EMAIL mittente verificato presso il servizio di invio
//   RESEND_API_KEY     chiave del servizio Resend (https://resend.com); senza chiave:
//                      in sviluppo il messaggio viene scritto in console, in produzione si risponde 503.
import { NextResponse } from 'next/server';
import { validateContact, LIMITS } from '@/lib/contact-validation';

export const runtime = 'nodejs';

const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX;
}

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  // honeypot o invio troppo veloce: rispondiamo "ok" senza inviare nulla
  if (clip(body.website, 200) || (typeof body.elapsed === 'number' && body.elapsed > 0 && body.elapsed < 1500)) {
    return NextResponse.json({ ok: true });
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'local';
  if (limited(ip)) return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });

  const input = {
    name: clip(body.name, LIMITS.name),
    email: clip(body.email, LIMITS.email),
    phone: clip(body.phone, LIMITS.phone),
    message: clip(body.message, LIMITS.message),
    consent: body.consent === true,
  };
  const errors = validateContact(input);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, error: 'invalid', fields: errors }, { status: 422 });

  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const key = process.env.RESEND_API_KEY;
  const subject = `Nuovo messaggio dal sito da ${input.name}`;
  const text = `Nome: ${input.name}\nEmail: ${input.email}\nTelefono: ${input.phone || '-'}\nConsenso privacy: sì\n\n${input.message}`;

  if (!to || !from || !key) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[contatti] (sviluppo, nessun invio reale)\n' + `A: ${to ?? '(CONTACT_TO_EMAIL non impostata)'}\nOggetto: ${subject}\n${text}`);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error('[contatti] invio non configurato: impostare CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL e RESEND_API_KEY');
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject,
        text,
        html: `<p><strong>Nome:</strong> ${escape(input.name)}<br><strong>Email:</strong> ${escape(input.email)}<br><strong>Telefono:</strong> ${escape(input.phone || '-')}</p><p>${escape(input.message).replace(/\n/g, '<br>')}</p>`,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contatti] invio fallito', err);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
