import Image from 'next/image';
import type { ReactNode } from 'react';
import { img, video } from '@/lib/content';
import { LoopVideo } from '@/components/ui/LoopVideo';

type Props = {
  title: string;
  subtitle?: string;
  lead?: string;
  body?: string;
  videoKey?: string;
  videoLabel?: string;
  imageKey?: string;
  imageAlt?: string;
  children?: ReactNode;
};

/** Apertura delle pagine interne: titolo Bodoni a maschera, testo, e un capo in cornice impunturata. */
export function PageHero({ title, subtitle, lead, body, videoKey, videoLabel, imageKey, imageAlt, children }: Props) {
  const hasMedia = Boolean(videoKey || imageKey);
  const image = imageKey ? img(imageKey) : null;
  return (
    <section className="page-hero theme-notte grain" data-has-media={hasMedia}>
      <div className="wrap page-hero-grid">
        <div className="page-hero-copy">
          <h1 className="page-hero-title font-display t-display">
            <span className="mask-rise">
              <span>{title}</span>
            </span>
          </h1>
          {subtitle && <p className="page-hero-sub font-display">{subtitle}</p>}
          {(lead || body || children) && (
            <div className="page-hero-text">
              {lead && <p className="t-lead measure">{lead}</p>}
              {body && <p className="measure muted">{body}</p>}
              {children && <div>{children}</div>}
            </div>
          )}
        </div>
        {hasMedia && (
          <div className="page-hero-media">
            <div className="page-hero-frame">
              {videoKey ? (
                <LoopVideo video={video(videoKey)} label={videoLabel ?? ''} />
              ) : (
                image && (
                  <Image src={image.src} alt={imageAlt ?? ''} fill priority sizes="(min-width: 64rem) 34vw, 90vw" placeholder="blur" blurDataURL={image.blur} quality={75} className="object-cover" />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
