import type { Metadata } from 'next';
import { WhatsappLogoIcon, PhoneIcon } from '@phosphor-icons/react/dist/ssr';
import { cerimonia, img, site, whatsappHref } from '@/lib/content';
import { PageHero } from '@/components/ui/PageHero';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FadeUp } from '@/components/motion/FadeUp';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { Thread } from '@/components/motion/Thread';
import { TagButton } from '@/components/ui/TagButton';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: cerimonia.meta.title,
  description: cerimonia.meta.description,
  alternates: { canonical: '/abiti-da-cerimonia' },
  openGraph: { title: `${cerimonia.meta.title} | Vestiamico`, description: cerimonia.meta.description, url: '/abiti-da-cerimonia' },
};

export default function CerimoniaPage() {
  const { intro, chapters, reasons, steps, closing } = cerimonia;
  return (
    <>
      <PageHero title={intro.title} subtitle={intro.subtitle} lead={intro.lead} body={intro.body} videoKey={intro.video} videoLabel="Modella in abito lungo da cerimonia verde smeraldo in raso" />

      {chapters.map((ch, idx) => (
        <section key={ch.id} id={ch.id} className={`chapter ${idx % 2 ? 'theme-notte grain' : 'theme-avorio'}`} aria-labelledby={`${ch.id}-title`}>
          <div className="wrap chapter-grid" data-flip-side={idx % 2 ? 'right' : 'left'}>
            <div className="chapter-copy">
              <SplitReveal as="h2" id={`${ch.id}-title`} className="font-display t-h2">
                {ch.title}
              </SplitReveal>
              <p className="chapter-subtitle font-display">{ch.subtitle}</p>
              <FadeUp className="chapter-text">
                <p className="chapter-quote font-display" data-fade>
                  {ch.quote}
                </p>
                {ch.paragraphs.map((p) => (
                  <p key={p} className="measure muted" data-fade>
                    {p}
                  </p>
                ))}
              </FadeUp>
            </div>
            <ul className="chapter-gallery" aria-label={`Galleria: ${ch.title.toLowerCase()}`}>
              {ch.images.map((im, i) => (
                <li key={im.key} className={`chapter-shot cs-${i}`}>
                  <ParallaxImage image={img(im.key)} alt={im.alt} sizes="(min-width: 64rem) 26vw, 50vw" amount={i % 2 ? 16 : 10} className="chapter-frame" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="reasons theme-avorio" aria-labelledby="reasons-title">
        <div className="wrap reasons-grid">
          <SplitReveal as="h2" id="reasons-title" className="font-display t-h2 reasons-title">
            {reasons.title}
          </SplitReveal>
          <FadeUp as="ul" className="reasons-list">
            {reasons.items.map((r) => (
              <li key={r} data-fade className="reason">
                <span className="reason-stitch" aria-hidden="true" />
                <span className="font-display">{r}</span>
              </li>
            ))}
          </FadeUp>
        </div>
      </section>

      <section className="steps theme-notte grain" aria-labelledby="steps-title">
        <div className="wrap">
          <SplitReveal as="h2" id="steps-title" className="font-display t-h2 steps-title">
            {steps.title}
          </SplitReveal>
          <div className="steps-body">
            <Thread d="M0 50 C 200 10, 300 90, 500 50 S 800 10, 1000 50" viewBox="0 0 1000 100" className="steps-thread accent" start="top 80%" end="bottom 50%" />
            <ol className="steps-list">
              {steps.items.map((s, i) => (
                <li key={s.title} className="step">
                  <span className="step-num font-display" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="font-display t-h3">{s.title}</h3>
                  <p className="muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="closing theme-avorio" aria-labelledby="cer-closing-title">
        <div className="wrap closing-inner">
          <SplitReveal as="h2" id="cer-closing-title" className="font-display t-display closing-title">
            {closing.title}
          </SplitReveal>
          <FadeUp className="closing-text">
            <p className="t-lead measure muted" data-fade>
              {closing.text}
            </p>
            <div className="closing-actions" data-fade>
              <TagButton href={whatsappHref(closing.message)} external cursor="Scrivici" icon={<WhatsappLogoIcon size={20} aria-hidden="true" />} srSuffix="(si apre in una nuova scheda)">
                {closing.ctaWhatsapp}
              </TagButton>
              <a href={site.phones[0].href} className="stitch-link closing-phone">
                <PhoneIcon size={18} aria-hidden="true" />
                <span className="stitch-link-text">
                  {closing.ctaPhone}, {site.phones[0].display}
                </span>
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
      <BreadcrumbJsonLd items={[{ name: 'Abiti da cerimonia', path: '/abiti-da-cerimonia' }]} />
    </>
  );
}
