import Image from 'next/image';
import { WhatsappLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { home, video, whatsappHref } from '@/lib/content';
import { StitchLink } from '@/components/ui/StitchLink';
import { TagButton } from '@/components/ui/TagButton';
import { HeroFx } from './HeroFx';

/**
 * Scena 1. Trittico di passerella (un solo video su mobile), titolo gigante rivelato per righe,
 * poi scorrendo il video si stringe in una cornice impunturata e lascia entrare il 1960.
 */
export function Hero() {
  const { hero } = home;
  const clips = hero.videos.map((k) => ({ key: k, ...video(k) }));
  return (
    <section id="hero" className="hero theme-notte" aria-labelledby="hero-title">
      <HeroFx>
        <div className="hero-pin">
          <div className="hero-media" data-hero-media>
            {clips.map((c, i) => (
              <div key={c.key} className={`hero-slot hero-slot--${i}`} data-hero-slot>
                <Image
                  src={c.poster}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 34vw, 100vw"
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  loading={i === 0 ? undefined : 'lazy'}
                  quality={60}
                  className="hero-poster"
                />
                <video
                  className="hero-video"
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                  data-webm={c.webm}
                  data-mp4={c.mp4}
                />
              </div>
            ))}
            <div className="hero-veil" />
          </div>
          <div className="hero-frame" data-hero-frame aria-hidden="true" />

          <div className="hero-content wrap" data-hero-content>
            <h1 id="hero-title" className="hero-title font-display">
              {hero.titleLines.map((l, i) => (
                <span key={l} className={`hero-line hero-line--${i}`}>
                  {i > 0 && <br />}
                  <span className="hero-line-text">{l}</span>
                </span>
              ))}
            </h1>
            <div className="hero-foot">
              <p className="hero-sub t-lead">{hero.subtitle}</p>
              <div className="hero-actions">
                <StitchLink href={hero.ctaPrimary.href} cursor="Scopri" className="hero-link">
                  {hero.ctaPrimary.label}
                </StitchLink>
                <TagButton
                  href={whatsappHref(hero.ctaWhatsapp.message)}
                  external
                  cursor="Scrivici"
                  icon={<WhatsappLogoIcon size={20} aria-hidden="true" />}
                  srSuffix="(si apre in una nuova scheda)"
                >
                  {hero.ctaWhatsapp.label}
                </TagButton>
              </div>
            </div>
          </div>

          <button type="button" className="hero-pause" data-hero-pause aria-pressed="false">
            <span className="hero-pause-icon" aria-hidden="true" />
            <span className="hero-pause-label">Metti in pausa i video</span>
          </button>
        </div>
      </HeroFx>
    </section>
  );
}
