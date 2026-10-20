'use client';
// Frase le cui parole si "accendono" una dopo l'altra mentre scorri.
import { useRef, type ElementType } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

export function WordLight({ text, as: Tag = 'p', className = '', id }: { text: string; as?: ElementType; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el.querySelectorAll('[data-word]'),
          { opacity: 0.16 },
          { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: 0.5 } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className} id={id} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} data-word aria-hidden="true" className="inline-block">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
