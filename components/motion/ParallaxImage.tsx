'use client';
// Immagine con parallasse interna: la cornice resta ferma, la foto scorre al suo interno.
import { useRef } from 'react';
import Image from 'next/image';
import { LazyImage } from '@/components/ui/LazyImage';
import { useMotion } from '@/lib/motion';
import type { ImageAsset } from '@/lib/content';

type Props = {
  image: ImageAsset;
  alt: string;
  sizes: string;
  className?: string;
  /** escursione in percentuale dell'altezza (default 12) */
  amount?: number;
  priority?: boolean;
  /** asse della parallasse: verticale (default) o orizzontale per gallerie che scorrono di lato */
  axis?: 'y' | 'x';
  imgClassName?: string;
};

export function ParallaxImage({ image, alt, sizes, className = '', amount = 12, priority, axis = 'y', imgClassName = '' }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useMotion(
    ({ gsap }) => {
      if (!frame.current || !inner.current || axis === 'x') return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: 'none',
            scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  const pad = `${amount}%`;
  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div
        ref={inner}
        data-parallax-inner
        className="absolute"
        style={axis === 'y' ? { inset: `-${pad} 0` } : { inset: `0 -${pad}` }}
      >
        {priority ? (
          <Image src={image.src} alt={alt} fill sizes={sizes} priority quality={75} className={`object-cover ${imgClassName}`} />
        ) : (
          <LazyImage src={image.src} alt={alt} fill sizes={sizes} quality={75} className={`object-cover ${imgClassName}`} />
        )}
      </div>
    </div>
  );
}
