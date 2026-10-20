import type { Metadata } from 'next';
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { collezioni, img, whatsappHref } from '@/lib/content';
import { PageHero } from '@/components/ui/PageHero';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FadeUp } from '@/components/motion/FadeUp';
import { TagButton } from '@/components/ui/TagButton';
import { CollectionGrid } from '@/components/collezioni/CollectionGrid';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: collezioni.meta.title,
  description: collezioni.meta.description,
  alternates: { canonical: '/collezioni' },
  openGraph: { title: `${collezioni.meta.title} | Vestiamico Palermo`, description: collezioni.meta.description, url: '/collezioni' },
};

export default function CollezioniPage() {
  return (
    <>
      <PageHero title={collezioni.intro.title} lead={collezioni.intro.lead} videoKey={collezioni.intro.video} videoLabel="Modella in tailleur giallo con giacca e pantaloni" />

      {collezioni.sections.map((s, idx) => (
        <section key={s.id} id={s.id} className={`collection-section ${idx % 2 ? 'theme-notte grain' : 'theme-avorio'}`} aria-labelledby={`${s.id}-title`}>
          <div className="wrap">
            <div className="collection-intro">
              <div className="collection-heading">
                <SplitReveal as="h2" id={`${s.id}-title`} className="font-display t-h2 collection-title">
                  {s.title}
                </SplitReveal>
                <p className="collection-subtitle font-display">{s.subtitle}</p>
              </div>
              <FadeUp className="collection-intro-text">
                <p className="collection-quote font-display" data-fade>
                  {s.quote}
                </p>
                <p className="measure muted" data-fade>
                  {s.text}
                </p>
              </FadeUp>
            </div>
            <CollectionGrid
              id={s.id}
              categories={s.categories}
              items={s.items.map((it) => ({
                ...it,
                image: img(it.key),
                href: whatsappHref(`Ciao Vestiamico! Ho visto sul sito questo capo (${s.id}, ${it.category.toLowerCase()}): "${it.alt}". È disponibile nella mia taglia?`),
              }))}
            />
          </div>
        </section>
      ))}

      <section className="closing theme-avorio" aria-labelledby="closing-title">
        <div className="wrap closing-inner">
          <SplitReveal as="h2" id="closing-title" className="font-display t-display closing-title">
            {collezioni.closing.title}
          </SplitReveal>
          <FadeUp className="closing-text">
            <p className="t-lead measure muted" data-fade>
              {collezioni.closing.text}
            </p>
            <div data-fade>
              <TagButton href={whatsappHref('Ciao Vestiamico! Vorrei un consiglio sulle vostre collezioni.')} external cursor="Scrivici" icon={<WhatsappLogoIcon size={20} aria-hidden="true" />} srSuffix="su WhatsApp (si apre in una nuova scheda)">
                {collezioni.closing.cta}
              </TagButton>
            </div>
          </FadeUp>
        </div>
      </section>
      <BreadcrumbJsonLd items={[{ name: 'Collezioni', path: '/collezioni' }]} />
    </>
  );
}
