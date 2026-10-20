import type { Metadata } from 'next';
import Image from 'next/image';
import { puntoVendita, img, video, site, fullAddress } from '@/lib/content';
import { hoursRows } from '@/lib/hours';
import { PageHero } from '@/components/ui/PageHero';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FadeUp } from '@/components/motion/FadeUp';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { WordLight } from '@/components/motion/WordLight';
import { TagButton } from '@/components/ui/TagButton';
import { StoreMap } from '@/components/ui/StoreMap';
import { LoopVideo } from '@/components/ui/LoopVideo';
import { OpenNow } from '@/components/layout/OpenNow';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: puntoVendita.meta.title,
  description: puntoVendita.meta.description,
  alternates: { canonical: '/punto-vendita' },
  openGraph: { title: `${puntoVendita.meta.title} | Vestiamico`, description: puntoVendita.meta.description, url: '/punto-vendita' },
};

export default function PuntoVenditaPage() {
  const { intro, floors, gallery, goal, directions } = puntoVendita;
  return (
    <>
      <PageHero title={intro.title} subtitle={intro.subtitle} lead={intro.lead} videoKey={intro.video} videoLabel="Ingresso del negozio Vestiamico, con la reception e il monogramma in oro">
        <p className="page-hero-note font-display">{intro.heading}</p>
      </PageHero>

      <section className="floors theme-avorio" aria-labelledby="floors-title">
        <div className="wrap">
          <SplitReveal as="h2" id="floors-title" className="font-display t-h2 floors-title">
            Cosa troverete all’interno
          </SplitReveal>
          <p className="t-lead measure muted floors-lead">{intro.body}</p>
          <ol className="floors-list">
            {floors.map((f, i) => {
              const image = img(f.image);
              return (
                <li key={f.id} className={`floor floor-${i}`}>
                  <div className="floor-copy">
                    <p className="floor-label font-misura">{f.label}</p>
                    <h3 className="floor-title font-display">{f.title}</h3>
                    <p className="measure muted">{f.text}</p>
                  </div>
                  <div className="floor-media">
                    <Image src={image.src} alt="" fill sizes="(min-width: 48rem) 40vw, 100vw" placeholder="blur" blurDataURL={image.blur} quality={75} className="object-cover" />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="store-gallery theme-notte grain" aria-labelledby="gallery-title">
        <div className="wrap">
          <SplitReveal as="h2" id="gallery-title" className="font-display t-h2 store-gallery-title">
            Luce, volumi, dettagli
          </SplitReveal>
          <ul className="store-gallery-grid">
            {gallery.map((g, i) => (
              <li key={g.key} className={`sg sg-${i}`}>
                <ParallaxImage image={img(g.key)} alt={g.alt} sizes="(min-width: 64rem) 33vw, 50vw" amount={i % 3 === 1 ? 18 : 10} className="sg-frame" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="goal theme-avorio" aria-labelledby="goal-title">
        <div className="wrap goal-inner">
          <h2 id="goal-title" className="goal-label font-display">
            {goal.title}
          </h2>
          <WordLight text={goal.heading} className="goal-heading font-display t-h2" />
          <FadeUp>
            <p className="t-lead measure muted">{goal.text}</p>
          </FadeUp>
        </div>
      </section>

      <section className="directions theme-notte" aria-labelledby="dir-title">
        <div className="wrap directions-grid">
          <div className="directions-copy">
            <SplitReveal as="h2" id="dir-title" className="font-display t-h2">
              {directions.title}
            </SplitReveal>
            <FadeUp className="directions-text">
              <p className="t-lead muted measure" data-fade>
                {directions.text}
              </p>
              <OpenNow />
              <p className="font-display directions-address" data-fade>
                {fullAddress}
              </p>
              <dl className="visit-hours" data-fade>
                {hoursRows().map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd className="muted">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <div data-fade>
                <TagButton href={site.address.mapsUrl} external cursor="Guarda" srSuffix="con Google Maps (si apre in una nuova scheda)">
                  Portami lì
                </TagButton>
              </div>
            </FadeUp>
          </div>
          <div className="directions-media">
            <StoreMap />
            <div className="directions-video">
              <LoopVideo video={video(directions.video)} label="La facciata del negozio Vestiamico vista dalla strada" />
            </div>
          </div>
        </div>
      </section>
      <BreadcrumbJsonLd items={[{ name: 'Punto vendita', path: '/punto-vendita' }]} />
    </>
  );
}
