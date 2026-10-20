'use client';
// Ingresso morbido dal basso per blocchi secondari (paragrafi, liste, azioni).
// I figli diretti con [data-fade] entrano in sequenza. Ciò che è già sullo schermo resta fermo.
import { useRef, type ElementType, type ReactNode } from 'react';
import { useMotion, inView, DUR, STAGGER } from '@/lib/motion';

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
  id?: string;
};

export function FadeUp({ as: Tag = 'div', children, className, delay = 0, y = 28, start = 'top 88%', id }: Props) {
  const ref = useRef<HTMLElement>(null);
  useMotion(
    ({ gsap }) => {
      const el = ref.current;
      if (!el || inView(el)) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = el.querySelectorAll<HTMLElement>('[data-fade]');
        const targets = items.length ? Array.from(items) : [el];
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: DUR.media,
          stagger: STAGGER.elementi,
          delay,
          ease: 'sartoria',
          scrollTrigger: { trigger: el, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
