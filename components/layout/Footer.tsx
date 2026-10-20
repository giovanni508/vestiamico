import { InstagramLogoIcon, FacebookLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { nav, site, whatsappHref, fullAddress } from '@/lib/content';
import { hoursRows } from '@/lib/hours';
import { TLink } from '@/components/motion/PageTransition';
import { Logo } from '@/components/ui/Logo';
import { CookieSettingsButton } from '@/components/layout/CookieSettingsButton';
import { WovenLabel } from '@/components/ui/WovenLabel';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer theme-notte grain" aria-labelledby="footer-title">
      <div className="wrap">
        <div className="footer-top">
          <h2 id="footer-title" className="sr-only">
            Vestiamico, informazioni e contatti
          </h2>
          <div className="footer-brand">
            <Logo className="h-[52px] sm:h-[72px] text-[var(--color-oro)]" title="Vestiamico" />
            <WovenLabel lines={['Fatto a Palermo', 'dal 1960, tre generazioni']} />
          </div>
          <p className="t-lead measure muted">
            Abbigliamento uomo e donna a Palermo dal {site.since}: qualità, stile e autenticità, dal capo di tutti i giorni a quello da cerimonia.
          </p>
        </div>

        <div className="stitch-x text-[var(--color-notte-3)] my-12" aria-hidden="true" />

        <div className="footer-grid">
          <div>
            <h3 className="footer-h">Vieni a trovarci</h3>
            <address className="not-italic">
              <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
                {fullAddress}
                <span className="sr-only"> (indicazioni su Google Maps, si apre in una nuova scheda)</span>
              </a>
            </address>
          </div>
          <div>
            <h3 className="footer-h">Scrivici o chiamaci</h3>
            <ul className="footer-list">
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="footer-link">
                  WhatsApp {site.whatsapp.display}
                </a>
              </li>
              {site.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="footer-link">
                    {p.label}: {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="footer-link">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="footer-h">Orari</h3>
            <dl className="footer-hours">
              {hoursRows().map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd className="muted">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="footer-h">Esplora</h3>
            <ul className="footer-list">
              {nav.slice(1).map((n) => (
                <li key={n.href}>
                  <TLink href={n.href} className="footer-link">
                    {n.label}
                  </TLink>
                </li>
              ))}
            </ul>
            <ul className="footer-social" aria-label="Social">
              {site.social.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} ${s.handle} (si apre in una nuova scheda)`}>
                    {s.name === 'Instagram' ? <InstagramLogoIcon size={22} aria-hidden="true" /> : <FacebookLogoIcon size={22} aria-hidden="true" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom t-small">
          <p>
            © {year} Vestiamico. {site.legalName}, P.IVA {site.vat}
          </p>
          <ul>
            <li>
              <TLink href="/privacy-policy" className="footer-link">
                Privacy Policy
              </TLink>
            </li>
            <li>
              <TLink href="/cookie-policy-ue" className="footer-link">
                Cookie Policy
              </TLink>
            </li>
            <li>
              <CookieSettingsButton className="footer-link" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
