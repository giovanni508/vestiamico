import Image from 'next/image';
import { MapPinIcon, PhoneIcon, EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/ssr';
import { home, img, site, fullAddress } from '@/lib/content';
import { hoursRows } from '@/lib/hours';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FadeUp } from '@/components/motion/FadeUp';
import { TagButton } from '@/components/ui/TagButton';
import { StoreMap } from '@/components/ui/StoreMap';
import { OpenNow } from '@/components/layout/OpenNow';

/** Scena 8. Dove siamo: mappa cucita, indirizzo, orari con "Aperto ora", telefoni ed email. */
export function Visit() {
  const { visit } = home;
  const photo = img(visit.image);
  return (
    <section id="dove" className="visit theme-notte" aria-labelledby="visit-title">
      <div className="wrap visit-grid">
        <div className="visit-info">
          <SplitReveal as="h2" id="visit-title" className="font-display t-display visit-title">
            {visit.title}
          </SplitReveal>
          <FadeUp className="visit-details">
            <p className="t-lead muted measure" data-fade>
              {visit.body}
            </p>
            <OpenNow className="visit-open" />
            <address className="visit-address not-italic" data-fade>
              <MapPinIcon size={22} aria-hidden="true" className="accent shrink-0" />
              <span className="font-display">{fullAddress}</span>
            </address>
            <dl className="visit-hours" data-fade>
              {hoursRows().map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd className="muted">{r.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="visit-contacts" data-fade>
              {site.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="visit-contact">
                    <PhoneIcon size={20} aria-hidden="true" />
                    <span>
                      <span className="block t-micro muted">{p.label}</span>
                      {p.display}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="visit-contact">
                  <EnvelopeSimpleIcon size={20} aria-hidden="true" />
                  <span>
                    <span className="block t-micro muted">Email</span>
                    {site.email}
                  </span>
                </a>
              </li>
            </ul>
            <div data-fade>
              <TagButton href={site.address.mapsUrl} external cursor="Guarda" srSuffix="con Google Maps (si apre in una nuova scheda)">
                Portami lì
              </TagButton>
            </div>
          </FadeUp>
        </div>
        <div className="visit-visual">
          <StoreMap className="visit-map" />
          <div className="visit-photo">
            <Image src={photo.src} alt="La facciata del negozio Vestiamico in Via dell’Orsa Minore, con le vetrine illuminate" fill sizes="(min-width: 64rem) 22vw, 50vw" placeholder="blur" blurDataURL={photo.blur} quality={75} className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
