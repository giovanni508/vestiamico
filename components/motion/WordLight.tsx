'use client';
// Frase le cui parole si "accendono" una dopo l'altra mentre scorri.
import { useRef, type ElementType } from 'react';
import { useMotion } from '@/lib/motion';

export function WordLight({ text, as: Tag = 'p', className = '', id }: { text: string; as?: ElementType; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(
    ({ gsap }) => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el.querySelectorAll('[data-word]'),
          // 0.5 mantiene il contrasto minimo dei testi grandi (3:1) anche prima di accendersi
          { opacity: 0.5 },
          { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: 0.5 } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className} id={id}>
      {words.map((w, i) => (
        <span key={i} data-word className="inline-block">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
