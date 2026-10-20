'use client';
// Mobile: ogni pannello si apre dal centro (clip-path) mentre entra nello schermo.
// Desktop: l'espansione è CSS (hover e focus), qui solo una leggera deriva della foto.
import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function SplitFx({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const panels = gsap.utils.toArray<HTMLElement>('[data-split-panel]', el);
      const mm = gsap.matchMedia();
      mm.add('(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)', () => {
        panels.forEach((p) => {
          gsap.fromTo(
            p,
            { clipPath: 'inset(12% 9% 12% 9%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: p, start: 'top 95%', end: 'top 25%', scrub: 0.5 } },
          );
          gsap.fromTo(
            p.querySelector('[data-split-media]'),
            { scale: 1.18 },
            { scale: 1, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } },
          );
        });
      });
      mm.add('(min-width: 48rem) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el.querySelectorAll('[data-split-media]'),
          { yPercent: -6 },
          { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
        gsap.from(el.querySelectorAll('.split-title'), {
          yPercent: 40,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'sartoria',
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
