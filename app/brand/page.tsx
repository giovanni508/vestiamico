import type { Metadata } from 'next';
import { LazyImage } from '@/components/ui/LazyImage';
import { brand, img } from '@/lib/content';
import { PageHero } from '@/components/ui/PageHero';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FadeUp } from '@/components/motion/FadeUp';
import { StitchLink } from '@/components/ui/StitchLink';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: brand.meta.title,
  description: brand.meta.description,
  alternates: { canonical: '/brand' },
  openGraph: { title: `${brand.meta.title} | Vestiamico Palermo`, description: brand.meta.description, url: '/brand' },
};

export default function BrandPage() {
  const { intro, groups } = brand;
  return (
    <>
      <PageHero title={intro.title} subtitle={intro.subtitle} lead={intro.lead}>
        <div className="brand-intro-paras">
          {intro.paragraphs.map((p) => (
            <p key={p} className="measure muted">
              {p}
            </p>
          ))}
        </div>
      </PageHero>

      {groups.map((g, gi) => (
        <section key={g.id} id={g.id} className={`brand-group ${gi % 2 ? 'theme-notte grain' : 'theme-avorio'}`} aria-labelledby={`${g.id}-title`}>
          <div className="wrap">
            <div className="brand-group-head">
              <SplitReveal as="h2" id={`${g.id}-title`} className="font-display t-h2">
                {g.title}
              </SplitReveal>
              <FadeUp className="brand-group-text">
                <p className="font-display brand-group-sub" data-fade>
                  {g.subtitle}
                </p>
                <p className="measure muted" data-fade>
                  {g.text}
                </p>
              </FadeUp>
            </div>
            <p className="brand-among t-small muted">{gi === 0 ? 'Tra i marchi più amati' : 'Tra i brand presenti in negozio'}</p>
            <FadeUp as="ul" className="brand-rows">
              {g.brands.map((b) => {
                const tile = img(b.logo);
                return (
                  <li key={b.name} className="brand-row" data-fade>
                    <h3 className="brand-row-name font-display">{b.name}</h3>
                    <p className="brand-row-note t-small muted">{b.note}</p>
                    <span className="brand-row-logo" aria-hidden="true">
                      <span className="brand-mono">
                        <BrandLogo logo={b.logo} tone={gi % 2 ? 'avorio' : 'notte'} area={9000} maxWidth={220} />
                      </span>
                      <span className="brand-color">
                        <LazyImage src={tile.src} alt="" width={180} height={180} sizes="180px" quality={75} />
                      </span>
                    </span>
                  </li>
                );
              })}
            </FadeUp>
          </div>
        </section>
      ))}

      <section className="closing theme-avorio" aria-labelledby="brand-closing">
        <div className="wrap closing-inner">
          <h2 id="brand-closing" className="font-display t-h2 closing-title">
            Vuoi sapere se un capo è disponibile?
          </h2>
          <p className="t-lead measure muted">Chiedici modello, colore e taglia: ti rispondiamo noi, oppure passa in negozio a provarlo.</p>
          <StitchLink href="/contatti" cursor="Scrivici">
            Contattaci
          </StitchLink>
        </div>
      </section>
      <BreadcrumbJsonLd items={[{ name: 'Brand', path: '/brand' }]} />
    </>
  );
}
