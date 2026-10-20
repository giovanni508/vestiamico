'use client';
// Modulo contatti: validazione al blur e all'invio, errori chiari in italiano sotto ai campi,
// honeypot anti-spam, stati di invio animati (il filo si cuce mentre il messaggio parte).
import { useRef, useState, type FormEvent } from 'react';
import { validateContact, LIMITS, type ContactErrors, type ContactInput } from '@/lib/contact-validation';
import { whatsappHref } from '@/lib/site';
type Copy = (typeof import('@/content/contatti.json'))['form'];
type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm({ copy, waIcon }: { copy: Copy; waIcon: React.ReactNode }) {
  const [values, setValues] = useState<ContactInput>({ name: '', email: '', phone: '', message: '', consent: false });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string>('');
  const started = useRef(0);
  const form = useRef<HTMLFormElement>(null);

  const msg = (key?: string) => (key ? copy.errors[key as keyof Copy['errors']] : undefined);
  const update = (patch: Partial<ContactInput>) => {
    const next = { ...values, ...patch };
    setValues(next);
    if (!started.current) started.current = Date.now();
    if (Object.keys(errors).length) setErrors(pick(validateContact(next), touched));
  };
  const blur = (field: keyof ContactErrors) => {
    const t = { ...touched, [field]: true };
    setTouched(t);
    setErrors(pick(validateContact(values), t));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const all = validateContact(values);
    setTouched({ name: true, email: true, message: true, consent: true });
    setErrors(all);
    if (Object.keys(all).length) {
      const first = Object.keys(all)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    const data = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website: data.get('website') ?? '', elapsed: started.current ? Date.now() - started.current : 0 }),
      });
      if (res.ok) {
        setStatus('success');
        setValues({ name: '', email: '', phone: '', message: '', consent: false });
        setTouched({});
        return;
      }
      setServerError(res.status === 429 ? copy.errors.rate : copy.errors.server);
      setStatus('error');
    } catch {
      setServerError(copy.errors.server);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-done" role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <svg viewBox="0 0 120 120" className="form-done-mark" aria-hidden="true">
          <circle cx="60" cy="60" r="54" className="form-done-ring" pathLength={1} />
          <path d="M36 62 L53 78 L86 44" className="form-done-check" pathLength={1} />
        </svg>
        <p className="font-display t-h3">{copy.success}</p>
        <button type="button" className="stitch-link" onClick={() => setStatus('idle')}>
          <span className="stitch-link-text">Scrivi un altro messaggio</span>
        </button>
      </div>
    );
  }

  const field = (name: 'name' | 'email' | 'message') => ({
    id: `f-${name}`,
    name,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `f-${name}-err` : undefined,
    onBlur: () => blur(name),
  });

  return (
    <form ref={form} className="contact-form" noValidate onSubmit={submit} data-status={status}>
      <div className="field">
        <label htmlFor="f-name">{copy.fields.name}</label>
        <input {...field('name')} type="text" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={(e) => update({ name: e.target.value })} required />
        {errors.name && (
          <p id="f-name-err" className="field-error">
            {msg(errors.name)}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="f-email">{copy.fields.email}</label>
        <input {...field('email')} type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={(e) => update({ email: e.target.value })} required />
        {errors.email && (
          <p id="f-email-err" className="field-error">
            {msg(errors.email)}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="f-phone">{copy.fields.phone}</label>
        <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={values.phone} onChange={(e) => update({ phone: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="f-message">{copy.fields.message}</label>
        <textarea {...field('message')} rows={6} maxLength={LIMITS.message} value={values.message} onChange={(e) => update({ message: e.target.value })} required />
        {errors.message && (
          <p id="f-message-err" className="field-error">
            {msg(errors.message)}
          </p>
        )}
      </div>
      {/* honeypot: invisibile alle persone, i bot lo compilano */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Sito web</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field field--check">
        <input
          id="f-consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'f-consent-err' : undefined}
          onChange={(e) => update({ consent: e.target.checked })}
          onBlur={() => blur('consent')}
        />
        <label htmlFor="f-consent">
          {copy.fields.consent}{' '}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Leggi la Privacy Policy
          </a>
          .
        </label>
        {errors.consent && (
          <p id="f-consent-err" className="field-error">
            {msg(errors.consent)}
          </p>
        )}
      </div>

      {status === 'error' && (
        <div className="form-alert" role="alert">
          <p>{serverError}</p>
          <a href={whatsappHref(values.message ? `Ciao Vestiamico! ${values.message}` : undefined)} target="_blank" rel="noopener noreferrer" className="stitch-link">
            {waIcon}
            <span className="stitch-link-text">Scrivici su WhatsApp</span>
          </a>
        </div>
      )}

      <button type="submit" className="form-submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        <span className="form-submit-label">{status === 'sending' ? copy.sending : copy.submit}</span>
        <span className="form-submit-thread" aria-hidden="true" />
      </button>
    </form>
  );
}

function pick(all: ContactErrors, touched: Record<string, boolean>): ContactErrors {
  const out: ContactErrors = {};
  for (const [k, v] of Object.entries(all)) if (touched[k]) out[k as keyof ContactErrors] = v;
  return out;
}
