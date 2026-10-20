import Image from 'next/image';
import { home, img, site } from '@/lib/content';
import { TLink } from '@/components/motion/PageTransition';
import { SplitFx } from './SplitFx';

/**
 * Scena 3. Donna / Uomo: due pannelli a tutta altezza. Su desktop quello sotto il puntatore
 * (o con il focus) si apre al 65%; su mobile si impilano e si aprono dal centro scorrendo.
 */
export function Split() {
  const panels = [home.split.donna, home.split.uomo];
  return (
    <section id="collezioni" className="split theme-avorio" aria-labelledby="split-title">
      <h2 id="split-title" className="sr-only">
        Le collezioni donna e uomo
      </h2>
      <SplitFx>
        <div className="split-panels">
          {panels.map((p) => {
            const image = img(p.image);
            return (
              <article key={p.title} className="split-panel theme-notte" data-split-panel>
                <div className="split-media" data-split-media>
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="(min-width: 48rem) 65vw, 100vw"
                    placeholder="blur"
                    blurDataURL={image.blur}
                    quality={75}
                    className="object-cover"
                  />
                </div>
                <div className="split-veil" aria-hidden="true" />
                <div className="split-copy">
                  <h3 className="split-title font-display">{p.title}</h3>
                  <div className="split-more">
                    <p className="split-heading font-display">{p.heading}</p>
                    <p className="split-text">{p.text}</p>
                  </div>
                  <TLink href={p.href} className="split-cta stitch-link" data-cursor="Scopri">
                    <span className="stitch-link-text">{p.cta}</span>
                  </TLink>
                </div>
              </article>
            );
          })}
        </div>
      </SplitFx>
      <div className="wrap split-klarna">
        <span className="stitch-x split-klarna-line" aria-hidden="true" />
        <p className="t-small">{site.payments.klarna}</p>
        <span className="stitch-x split-klarna-line" aria-hidden="true" />
      </div>
    </section>
  );
}
