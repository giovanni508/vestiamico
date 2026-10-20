'use client';
// Il filo d'oro: una cucitura tratteggiata che si "cuce" seguendo lo scroll.
// Tecnica: un tracciato pieno animato (stroke-dashoffset) fa da maschera a un tracciato tratteggiato.
import { useId, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

type Props = {
  d: string;
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  /** trigger e intervallo di scroll; default: l'svg stesso */
  start?: string;
  end?: string;
  trigger?: string;
  scrub?: boolean | number;
  preserveAspectRatio?: string;
  /** tratteggio della cucitura */
  dash?: string;
  /** spessore della maschera in unità del viewBox: deve coprire il filo */
  revealWidth?: number;
};

export function Thread({
  d,
  viewBox,
  className = '',
  strokeWidth = 1.5,
  start = 'top 80%',
  end = 'bottom 30%',
  trigger,
  scrub = 0.8,
  preserveAspectRatio = 'none',
  dash = '7 6',
  revealWidth = 40,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, '');

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const reveal = svg.querySelector<SVGPathElement>('[data-reveal]');
      if (!reveal) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(reveal, { strokeDasharray: 1000, strokeDashoffset: 1000 });
        gsap.to(reveal, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: trigger ?? svg, start, end, scrub },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio} className={`pointer-events-none ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse">
          <path data-reveal d={d} pathLength={1000} fill="none" stroke="#fff" strokeWidth={revealWidth} strokeLinecap="butt" />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={dash}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        mask={`url(#m${id})`}
      />
    </svg>
  );
}
