'use client';
// Desktop: la sezione si ferma e la passerella di abiti scorre di lato; dentro ogni cornice
// la foto si muove in controfase. Mobile e reduced motion: scorrimento orizzontale nativo.
import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function CeremonyFx({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>('[data-cer-track]');
      if (!el || !track) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 48rem) and (prefers-reduced-motion: no-preference)', () => {
        el.classList.add('is-pinned');
        const distance = () => track.scrollWidth - window.innerWidth;
        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>('[data-cer-item]', el).forEach((item) => {
          const inner = item.querySelector('[data-cer-inner]');
          gsap.fromTo(
            inner,
            { xPercent: -9 },
            { xPercent: 9, ease: 'none', scrollTrigger: { trigger: item, containerAnimation: pan, start: 'left right', end: 'right left', scrub: true } },
          );
          gsap.from(item, {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: item, containerAnimation: pan, start: 'left 92%', toggleActions: 'play none none reverse' },
          });
        });
        return () => el.classList.remove('is-pinned');
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="ceremony-root">
      {children}
    </div>
  );
}
