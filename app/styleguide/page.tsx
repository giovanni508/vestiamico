import type { Metadata } from 'next';
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { TagButton } from '@/components/ui/TagButton';
import { StitchLink } from '@/components/ui/StitchLink';
import { Stars } from '@/components/ui/Stars';
import { Logo } from '@/components/ui/Logo';
import { Thread } from '@/components/motion/Thread';
import { OpenNow } from '@/components/layout/OpenNow';
import { whatsappHref } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

const COLORS = [
  ['Notte', '--color-notte', '#0d1730', 'Fodera: campi dominanti, header, footer'],
  ['Notte 2', '--color-notte-2', '#15223f', 'Fodera rialzata: cornici, mappa'],
  ['Notte 3', '--color-notte-3', '#23345a', 'Impunture e linee su notte'],
  ['Avorio', '--color-avorio', '#f2eee5', 'Camiceria: pause chiare, testo su notte'],
  ['Avorio 2', '--color-avorio-2', '#e7e1d4', 'Avorio in ombra: recensioni'],
  ['Oro', '--color-oro', '#d9b66a', 'Il filo: accento su notte (9:1)'],
  ['Oro chiaro', '--color-oro-chiaro', '#ecd6a0', 'Metro da sarta, hover'],
  ['Oro scuro', '--color-oro-scuro', '#7a5713', 'Accento su avorio (testo AA)'],
  ['Ardesia', '--color-ardesia', '#4a5468', 'Testo secondario su avorio'],
  ['Nebbia', '--color-nebbia', '#aeb6c8', 'Testo secondario su notte'],
];

const TYPE = [
  ['t-mega', 'Mega', 'clamp(3.3rem, 12.2vw, 14rem)'],
  ['t-display', 'Display', 'clamp(2.7rem, 7.4vw, 8rem)'],
  ['t-h2', 'Titolo 2', 'clamp(2.15rem, 4.8vw, 5rem)'],
  ['t-h3', 'Titolo 3', 'clamp(1.5rem, 2.5vw, 2.5rem)'],
];

export default function StyleguidePage() {
  return (
    <div className="styleguide">
      <section className="theme-notte grain sg-section sg-top">
        <div className="wrap">
          <h1 className="font-display t-display">Styleguide</h1>
          <p className="t-lead muted measure">Il sistema visivo di Vestiamico: la giacca vista da dentro. Fodera blu notte, camiceria avorio, un filo d’oro che cuce le scene. Pagina interna, non indicizzata.</p>
          <Logo className="h-[48px] mt-10 text-[var(--color-oro)]" />
        </div>
      </section>

      <section className="theme-avorio sg-section">
        <div className="wrap">
          <h2 className="font-display t-h2">Colori</h2>
          <ul className="sg-colors">
            {COLORS.map(([name, token, hex, use]) => (
              <li key={token}>
                <span className="sg-swatch" style={{ background: `var(${token})` }} />
                <strong>{name}</strong>
                <code>
                  {token} {hex}
                </code>
                <span className="t-small muted">{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-notte sg-section">
        <div className="wrap">
          <h2 className="font-display t-h2">Tipografia</h2>
          <p className="muted measure">Bodoni Moda (titoli, come il wordmark del logo) e Archivo (testo; larghezza condensata per misure e cartellini). Scala fluida con clamp().</p>
          <div className="sg-type">
            {TYPE.map(([cls, name, val]) => (
              <div key={cls}>
                <p className={`font-display ${cls}`}>{name}</p>
                <code>
                  .{cls} {val}
                </code>
              </div>
            ))}
            <p className="t-lead">Lead: Dall’abito più conveniente al capo firmato.</p>
            <p>Testo: Dal capo più giornaliero e pratico al capo da cerimonia dei migliori brand, senza trascurare mai la qualità.</p>
            <p className="font-misura">Misura: 38 40 42 44 46 48 50 52 54 56 58 60</p>
          </div>
        </div>
      </section>

      <section className="theme-avorio sg-section">
        <div className="wrap sg-components">
          <h2 className="font-display t-h2">Componenti</h2>
          <div className="sg-row">
            <TagButton href={whatsappHref()} external icon={<WhatsappLogoIcon size={20} aria-hidden="true" />} cursor="Scrivici">
              Cartellino (azione principale)
            </TagButton>
            <StitchLink href="/collezioni" cursor="Scopri">
              Link cucito
            </StitchLink>
          </div>
          <div className="sg-row theme-notte sg-pad">
            <TagButton href="/contatti">Cartellino su notte</TagButton>
            <StitchLink href="/brand">Link cucito su notte</StitchLink>
            <Stars className="accent" />
            <OpenNow />
          </div>
          <div>
            <p className="t-small muted">Filo d’oro (si cuce con lo scroll)</p>
            <Thread d="M0 40 C 150 0, 250 80, 400 40 S 650 0, 800 40" viewBox="0 0 800 80" className="sg-thread accent" start="top 90%" end="top 40%" />
          </div>
        </div>
      </section>

      <section className="theme-notte sg-section">
        <div className="wrap">
          <h2 className="font-display t-h2">Motion</h2>
          <ul className="sg-motion">
            <li>
              <strong>Easing firma</strong> <code>sartoria = cubic-bezier(0.22, 1, 0.36, 1)</code> ingressi e rivelazioni
            </li>
            <li>
              <strong>Espansione</strong> <code>expo.out</code> sipari, aperture, clip-path
            </li>
            <li>
              <strong>Uscita</strong> <code>uscita = cubic-bezier(0.7, 0, 0.84, 0)</code> ciò che se ne va accelera
            </li>
            <li>
              <strong>Durate</strong> <code>0.4s / 0.8s / 1.2s</code> rapida, media, lenta
            </li>
            <li>
              <strong>Stagger</strong> <code>0.06s elementi, 0.08s righe, totale &lt; 0.5s</code>
            </li>
            <li>
              <strong>Regola</strong> si anima solo transform, opacity e clip-path; tutto si ferma con prefers-reduced-motion
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
