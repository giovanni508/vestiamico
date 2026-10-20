'use client';
// Banner cookie conforme GDPR: "Rifiuta" ha lo stesso peso di "Accetta", scelte per categoria,
// consenso salvato 12 mesi in localStorage. Nessuno script di tracciamento è attivo senza consenso:
// gli script futuri devono leggere window.vestiamicoConsent o ascoltare l'evento "vestiamico:consent".
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const KEY = 'vestiamico-consent';
const OPEN_EVENT = 'vestiamico:cookie-open';
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;

export type Consent = { v: 1; date: number; statistics: boolean; marketing: boolean };

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== 1 || Date.now() - c.date > MAX_AGE) return null;
    return c;
  } catch {
    return null;
  }
}

function publish(c: Consent) {
  (window as unknown as { vestiamicoConsent?: Consent }).vestiamicoConsent = c;
  window.dispatchEvent(new CustomEvent('vestiamico:consent', { detail: c }));
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [stats, setStats] = useState(false);
  const [mkt, setMkt] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = read();
    // la lettura di localStorage è possibile solo nel browser: lo stato si allinea dopo il montaggio
    const id = window.setTimeout(() => {
      if (existing) publish(existing);
      else setOpen(true);
    }, 0);
    const reopen = () => {
      const c = read();
      setStats(c?.statistics ?? false);
      setMkt(c?.marketing ?? false);
      setCustom(true);
      setOpen(true);
      window.setTimeout(() => panel.current?.querySelector<HTMLElement>('input, button')?.focus(), 50);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(OPEN_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    document.documentElement.toggleAttribute('data-cookie-open', open);
  }, [open]);

  const save = (statistics: boolean, marketing: boolean) => {
    const c: Consent = { v: 1, date: Date.now(), statistics, marketing };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* memoria non disponibile: la scelta vale per questa visita */
    }
    publish(c);
    setOpen(false);
    setCustom(false);
  };

  if (!open) return null;

  return (
    <div ref={panel} className="cookie theme-avorio" role="region" aria-labelledby="cookie-title">
      <span className="cookie-hole" aria-hidden="true" />
      <h2 id="cookie-title" className="font-display cookie-title">
        Due parole sui cookie
      </h2>
      <p className="t-small">
        Usiamo solo strumenti tecnici, necessari a far funzionare il sito. Statistiche e marketing restano spenti finché non scegli tu. Dettagli nella{' '}
        <Link href="/cookie-policy-ue" className="underline underline-offset-2">
          Cookie Policy
        </Link>
        .
      </p>

      {custom && (
        <fieldset className="cookie-options">
          <legend className="sr-only">Scegli le categorie</legend>
          <label className="cookie-option">
            <input type="checkbox" checked disabled />
            <span>
              <strong>Tecnici</strong>
              <span className="block t-micro muted">Sempre attivi: ricordano le tue scelte.</span>
            </span>
          </label>
          <label className="cookie-option">
            <input type="checkbox" checked={stats} onChange={(e) => setStats(e.target.checked)} />
            <span>
              <strong>Statistiche</strong>
              <span className="block t-micro muted">Ci aiutano a capire come viene usato il sito.</span>
            </span>
          </label>
          <label className="cookie-option">
            <input type="checkbox" checked={mkt} onChange={(e) => setMkt(e.target.checked)} />
            <span>
              <strong>Marketing</strong>
              <span className="block t-micro muted">Per mostrarti pubblicità pertinenti su altri siti.</span>
            </span>
          </label>
        </fieldset>
      )}

      <div className="cookie-actions">
        <button type="button" className="cookie-btn" onClick={() => save(false, false)}>
          Rifiuta
        </button>
        <button type="button" className="cookie-btn" onClick={() => save(true, true)}>
          Accetta tutti
        </button>
        {custom ? (
          <button type="button" className="cookie-btn cookie-btn--wide" onClick={() => save(stats, mkt)}>
            Salva le mie scelte
          </button>
        ) : (
          <button type="button" className="cookie-more" onClick={() => setCustom(true)}>
            Scegli le categorie
          </button>
        )}
      </div>
    </div>
  );
}

/** Pulsante del footer per riaprire le preferenze. */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Gestisci cookie
    </button>
  );
}
