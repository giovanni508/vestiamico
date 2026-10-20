'use client';
// Il metro scorre all'infinito: una deriva lenta più la velocità dello scroll.
// La taglia che passa sotto l'ago si accende d'oro. Fermo con prefers-reduced-motion.
import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function RulerFx({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>('[data-ruler-track]');
      if (!el || !track) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const seq = track.firstElementChild as HTMLElement;
        const segs = Array.from(track.querySelectorAll<HTMLElement>('[data-size]'));
        const perSeq = segs.length / 3;
        let seqW = seq.offsetWidth;
        let segW = seqW / perSeq;
        let x = -seqW * 0.5;
        let active = -1;
        let running = false;
        const setX = gsap.quickSetter(track, 'x', 'px');
        const onResize = () => {
          seqW = seq.offsetWidth;
          segW = seqW / perSeq;
        };
        const tick = (_t: number, delta: number) => {
          const v = ScrollTrigger.getById('ruler')?.getVelocity() ?? 0;
          x -= ((26 + v * 0.3) * delta) / 1000;
          if (x <= -seqW * 2) x += seqW;
          if (x > -seqW * 0.25) x -= seqW;
          setX(x);
          // segmento sotto l'ago (al centro della viewport)
          const center = el.clientWidth / 2;
          const idx = Math.floor((center - x) / segW);
          if (idx !== active) {
            segs[active]?.classList.remove('is-active');
            segs[idx]?.classList.add('is-active');
            active = idx;
          }
        };
        const st = ScrollTrigger.create({
          id: 'ruler',
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            if (self.isActive && !running) {
              gsap.ticker.add(tick);
              running = true;
            } else if (!self.isActive && running) {
              gsap.ticker.remove(tick);
              running = false;
            }
          },
        });
        window.addEventListener('resize', onResize);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          window.removeEventListener('resize', onResize);
          segs.forEach((s) => s.classList.remove('is-active'));
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
