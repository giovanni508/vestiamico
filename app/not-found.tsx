import type { Metadata } from 'next';
import { nav, whatsappHref } from '@/lib/content';
import { TLink } from '@/components/motion/PageTransition';
import { StitchLink } from '@/components/ui/StitchLink';

export const metadata: Metadata = {
  title: 'Pagina non trovata',
  robots: { index: false, follow: true },
};

/** 404: il filo si spezza e, un attimo dopo, qualcuno lo ricuce. */
export default function NotFound() {
  return (
    <section className="nf theme-notte grain" aria-labelledby="nf-title">
      <div className="wrap nf-inner">
        <svg className="nf-thread" viewBox="0 0 1000 200" aria-hidden="true" focusable="false">
          <path className="nf-left" d="M0 110 C 120 40, 240 170, 360 100 S 450 70, 488 96" />
          <path className="nf-right" d="M512 104 C 560 130, 640 40, 760 100 S 900 160, 1000 90" />
          <path className="nf-stitch" d="M478 92 L522 108 M480 112 L520 88" />
          <circle className="nf-needle-eye" cx="912" cy="70" r="7" />
          <path className="nf-needle" d="M905 64 L 980 14" />
        </svg>
        <p className="nf-code font-display" aria-hidden="true">
          404
        </p>
        <h1 id="nf-title" className="font-display t-h2 nf-title">
          Questo filo si è spezzato
        </h1>
        <p className="t-lead muted measure nf-text">La pagina che cerchi non c’è più, oppure l’indirizzo è cambiato con il nuovo sito. Ricuciamo da qui:</p>
        <ul className="nf-links">
          {nav.map((n) => (
            <li key={n.href}>
              <TLink href={n.href} className="nf-link font-display">
                {n.label}
              </TLink>
            </li>
          ))}
        </ul>
        <StitchLink href={whatsappHref()} external cursor="Scrivici">
          Oppure scrivici su WhatsApp
        </StitchLink>
      </div>
    </section>
  );
}
