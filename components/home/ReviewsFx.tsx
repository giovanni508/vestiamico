'use client';
// Desktop: la sezione si ferma e le citazioni si avvicendano (riga per riga) con lo scroll.
// Mobile e reduced motion: le recensioni sono una sotto l'altra.
import { useRef, type ReactNode } from 'react';
import { useMotion } from '@/lib/motion';

export function ReviewsFx({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useMotion(
    ({ gsap }) => {
      const el = root.current;
      if (!el) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-rv-item]', el);
      const dots = gsap.utils.toArray<HTMLElement>('[data-rv-dot]', el);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
        el.classList.add('is-stacked');
        const setActive = (i: number) => dots.forEach((d, j) => d.classList.toggle('is-active', j === i));
        gsap.set(items, { autoAlpha: 0 });
        gsap.set(items[0], { autoAlpha: 1 });
        setActive(0);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${window.innerHeight * 1.6}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999))),
          },
        });
        items.forEach((item, i) => {
          if (i === 0) return;
          const prev = items[i - 1];
          tl.to(prev, { autoAlpha: 0, y: -40, duration: 0.3, ease: 'uscita' }).fromTo(
            item,
            { autoAlpha: 0, y: 60, clipPath: 'inset(0% 0% 100% 0%)' },
            { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'sartoria' },
          );
          tl.to({}, { duration: 0.5 });
        });
        return () => el.classList.remove('is-stacked');
      });
      mm.add('(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)', () => {
        items.forEach((item) => {
          gsap.from(item, { y: 40, autoAlpha: 0, duration: 0.9, ease: 'sartoria', scrollTrigger: { trigger: item, start: 'top 85%', once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="reviews-root">
      {children}
    </div>
  );
}
