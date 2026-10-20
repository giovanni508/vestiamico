'use client';
// La via del negozio si cuce in oro quando la mappa entra nello schermo, poi il pin si appoggia.
import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function StoreMapFx({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const street = el.querySelectorAll('[data-map-street] path');
        const pin = el.querySelector('[data-map-pin]');
        gsap.set(street, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 75%', once: true } })
          .from(el.querySelectorAll('.map-major path, .map-minor path'), { opacity: 0, duration: 1, stagger: 0.002, ease: 'none' })
          .to(street, { strokeDashoffset: 0, duration: 1.4, ease: 'sartoria', stagger: 0.1 }, 0.3)
          .from(pin, { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.2)' }, 1.1);
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="store-map-frame">
      {children}
    </div>
  );
}
