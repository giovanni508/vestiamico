'use client';
// Numero che conta da `from` a `to` legato allo scroll (il tempo che passa mentre scorri).
import { useRef } from 'react';
import { useMotion } from '@/lib/motion';

type Props = {
  from: number;
  to: number;
  className?: string;
  start?: string;
  end?: string;
  /** testo accessibile completo (lo screen reader legge solo questo) */
  label: string;
};

export function CountUp({ from, to, className, start = 'top 75%', end = 'top 20%', label }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotion(
    ({ gsap }) => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const state = { v: from };
        el.textContent = String(from);
        gsap.to(state, {
          v: to,
          ease: 'none',
          scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
          onUpdate: () => {
            el.textContent = String(Math.round(state.v));
          },
        });
        return () => {
          el.textContent = String(to);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">
        {to}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
