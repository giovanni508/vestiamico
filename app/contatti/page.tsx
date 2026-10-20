import type { Metadata } from 'next';
import { WhatsappLogoIcon, PhoneIcon, EnvelopeSimpleIcon, MapPinIcon, InstagramLogoIcon, FacebookLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { contatti, site, whatsappHref, fullAddress } from '@/lib/content';
import { hoursRows } from '@/lib/hours';
import { PageHero } from '@/components/ui/PageHero';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { StoreMap } from '@/components/ui/StoreMap';
import { OpenNow } from '@/components/layout/OpenNow';
import { ContactForm } from '@/components/contatti/ContactForm';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: contatti.meta.title,
  description: contatti.meta.description,
  alternates: { canonical: '/contatti' },
  openGraph: { title: `${contatti.meta.title} | Vestiamico Palermo`, description: contatti.meta.description, url: '/contatti' },
};

export default function ContattiPage() {
  const { intro, form } = contatti;
  return (
    <>
      <PageHero title={intro.title} subtitle={intro.subtitle} lead={intro.lead} body={intro.body} />

      <section className="channels theme-notte" aria-labelledby="channels-title">
        <div className="wrap channels-grid">
          <h2 id="channels-title" className="sr-only">
            Come contattarci
          </h2>
          <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="channel channel--wa" data-cursor="Scrivici">
            <WhatsappLogoIcon size={34} aria-hidden="true" />
            <span className="channel-kind">WhatsApp, il modo più veloce</span>
            <span className="channel-value font-display">{site.whatsapp.display}</span>
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </a>
          <a href={site.phones[0].href} className="channel">
            <PhoneIcon size={30} aria-hidden="true" />
            <span className="channel-kind">Telefono del negozio</span>
            <span className="channel-value font-display">{site.phones[0].display}</span>
          </a>
          <a href={`mailto:${site.email}`} className="channel">
            <EnvelopeSimpleIcon size={30} aria-hidden="true" />
            <span className="channel-kind">Email</span>
            <span className="channel-value font-display">{site.email}</span>
          </a>
          <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="channel" data-cursor="Guarda">
            <MapPinIcon size={30} aria-hidden="true" />
            <span className="channel-kind">Punto vendita, Portami lì</span>
            <span className="channel-value font-display">{fullAddress}</span>
            <span className="sr-only"> (indicazioni su Google Maps, si apre in una nuova scheda)</span>
          </a>
        </div>
        <div className="wrap channels-more">
          <div>
            <h3 className="footer-h">Orari di apertura</h3>
            <OpenNow className="channels-open" />
            <dl className="visit-hours">
              {hoursRows().map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  <dd className="muted">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="footer-h">Seguici</h3>
            <ul className="channels-social">
              {site.social.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="stitch-link">
                    {s.name === 'Instagram' ? <InstagramLogoIcon size={20} aria-hidden="true" /> : <FacebookLogoIcon size={20} aria-hidden="true" />}
                    <span className="stitch-link-text">
                      {s.name} {s.handle}
                    </span>
                    <span className="sr-only"> (si apre in una nuova scheda)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="form-section theme-avorio" aria-labelledby="form-title">
        <div className="wrap form-grid">
          <div className="form-intro">
            <SplitReveal as="h2" id="form-title" className="font-display t-h2">
              {form.title}
            </SplitReveal>
            <p className="t-lead muted measure">{form.lead}</p>
            <div className="form-map">
              <StoreMap />
            </div>
          </div>
          <ContactForm copy={form} />
        </div>
      </section>
      <BreadcrumbJsonLd items={[{ name: 'Contatti', path: '/contatti' }]} />
    </>
  );
}
