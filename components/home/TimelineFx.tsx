'use client';
// Timeline di famiglia. Desktop: pin + scorrimento orizzontale, il filo d'oro si cuce
// e ogni tappa si "annoda" quando il filo la raggiunge. Mobile: verticale, filo verticale.
import { useRef, type ReactNode } from 'react';
import { useMotion } from '@/lib/motion';

export function TimelineFx({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useMotion(
    ({ gsap }) => {
      const el = root.current;
      if (!el) return;
      const track = el.querySelector<HTMLElement>('[data-tl-track]');
      const reveal = el.querySelector<SVGPathElement>('[data-tl-reveal]');
      const items = gsap.utils.toArray<HTMLElement>('[data-tl-item]', el);
      if (!track || !reveal) return;

      const mm = gsap.matchMedia();
      mm.add('(min-width: 48rem) and (prefers-reduced-motion: no-preference)', () => {
        el.classList.add('is-pinned');
        const distance = () => track.scrollWidth - el.clientWidth;
        // la punta del filo resta poco oltre il centro dello schermo
        const thread = el.querySelector<SVGSVGElement>('.timeline-thread');
        const lead = () => {
          const w = thread?.getBoundingClientRect().width || track.scrollWidth;
          const gutter = parseFloat(getComputedStyle(track).paddingLeft) || 0;
          return Math.min(1, Math.max(0, (el.clientWidth * 0.56 - gutter) / w));
        };
        gsap.set(reveal, { strokeDasharray: 1000 });
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        tl.to(track, { x: () => -distance(), duration: 1 }, 0).fromTo(reveal, { strokeDashoffset: () => 1000 * (1 - lead()) }, { strokeDashoffset: 0, duration: 1 }, 0);
        items.forEach((item) => {
          // le tappe già visibili quando la sezione si ferma entrano con lo scroll verticale
          const visibleAtStart = item.offsetLeft < el.clientWidth * 0.72;
          gsap.from(item.querySelectorAll('[data-tl-in]'), {
            y: 30,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 0.8,
            ease: 'sartoria',
            scrollTrigger: visibleAtStart
              ? { trigger: el, start: 'top 65%', toggleActions: 'play none none none' }
              : { trigger: item, containerAnimation: tl, start: 'left 72%', toggleActions: 'play none none none' },
          });
          gsap.fromTo(
            item.querySelector('[data-tl-knot]'),
            { scale: 0, rotate: -90 },
            { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: item, containerAnimation: tl, start: 'left 56%', toggleActions: 'play none none none' } },
          );
        });
        return () => el.classList.remove('is-pinned');
      });
      mm.add('(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)', () => {
        const vReveal = el.querySelector<SVGPathElement>('[data-tl-vreveal]');
        if (vReveal) {
          gsap.set(vReveal, { strokeDasharray: 1000, strokeDashoffset: 1000 });
          gsap.to(vReveal, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: track, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } });
        }
        items.forEach((item) => {
          gsap.from(item.querySelectorAll('[data-tl-in]'), {
            y: 24,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 0.8,
            ease: 'sartoria',
            scrollTrigger: { trigger: item, start: 'top 82%', once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="timeline">
      {children}
    </div>
  );
}
