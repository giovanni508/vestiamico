'use client';
// Rivela un testo riga per riga da una maschera (le righe salgono dal "rovescio" del tessuto).
// Il testo resta visibile senza JS, con prefers-reduced-motion e se è già sullo schermo.
import { useRef, type ElementType, type ReactNode } from 'react';
import { useMotion, inView, DUR, STAGGER } from '@/lib/motion';
import { onIntroDone } from '@/lib/intro';

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** scroll: quando entra nel viewport. intro: dopo il preloader. */
  trigger?: 'scroll' | 'intro';
  delay?: number;
  start?: string;
};

export function SplitReveal({ as: Tag = 'div', children, className, id, trigger = 'scroll', delay = 0, start = 'top 85%' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(
    ({ gsap, SplitText }) => {
      const el = ref.current;
      if (!el || (trigger === 'scroll' && inView(el))) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let cancelIntro: (() => void) | undefined;
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            const tween = gsap.from(self.lines, {
              yPercent: 112,
              duration: DUR.lenta,
              stagger: STAGGER.righe,
              delay,
              ease: 'sartoria',
              paused: trigger === 'intro',
              scrollTrigger: trigger === 'scroll' ? { trigger: el, start, once: true } : undefined,
            });
            if (trigger === 'intro') {
              cancelIntro?.();
              cancelIntro = onIntroDone(() => tween.play());
            }
            return tween;
          },
        });
        return () => {
          cancelIntro?.();
          split.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
