'use client';
// Nastro che scorre all'infinito. Rallenta al passaggio del mouse e quando riceve il focus,
// si ferma fuori schermo. Con prefers-reduced-motion resta fermo e va a capo.
import { useRef, type ReactNode } from 'react';
import { useMotion } from '@/lib/motion';

type Props = {
  children: ReactNode;
  /** secondi per un giro completo */
  duration?: number;
  reverse?: boolean;
  className?: string;
  label?: string;
};

export function Marquee({ children, duration = 40, reverse = false, className = '', label }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const el = track.current;
      const wrap = root.current;
      if (!el || !wrap) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          el,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 },
        );
        const slow = () => gsap.to(tween, { timeScale: 0.18, duration: 0.6, ease: 'sartoria', overwrite: true });
        const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.8, ease: 'sartoria', overwrite: true });
        wrap.addEventListener('pointerenter', slow);
        wrap.addEventListener('pointerleave', fast);
        wrap.addEventListener('focusin', slow);
        wrap.addEventListener('focusout', fast);
        const st = ScrollTrigger.create({
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
        });
        return () => {
          wrap.removeEventListener('pointerenter', slow);
          wrap.removeEventListener('pointerleave', fast);
          wrap.removeEventListener('focusin', slow);
          wrap.removeEventListener('focusout', fast);
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`marquee overflow-hidden ${className}`} aria-label={label} role={label ? 'region' : undefined}>
      <div ref={track} className="marquee-track flex w-max">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
