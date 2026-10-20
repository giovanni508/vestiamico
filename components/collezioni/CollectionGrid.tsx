'use client';
// Griglia asimmetrica filtrabile per categoria (categorie reali del negozio). Il cambio filtro
// usa GSAP Flip: i capi rimasti scivolano al loro posto, gli altri escono. Nessun prezzo.
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { gsap } from '@/lib/gsap';
import type { ImageAsset } from '@/lib/content';

gsap.registerPlugin(Flip);

type Item = { key: string; category: string; alt: string; image: ImageAsset; href: string };

export function CollectionGrid({ id, categories, items }: { id: string; categories: string[]; items: Item[] }) {
  const [active, setActive] = useState<string>('Tutto');
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const select = (cat: string) => {
    if (cat === active) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll('[data-flip]'));
    setActive(cat);
  };

  // dopo il render: anima il passaggio dallo stato precedente
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state || !grid.current) return;
      flipState.current = null;
      Flip.from(state, {
        duration: 0.8,
        ease: 'sartoria',
        absolute: true,
        scale: true,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'sartoria' }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: 'uscita' }),
      });
    },
    { dependencies: [active], scope: grid },
  );

  // ingresso a cascata quando la griglia entra nello schermo
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-flip]', grid.current).forEach((el) => {
          gsap.from(el, {
            clipPath: 'inset(100% 0% 0% 0%)',
            y: 40,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: grid },
  );

  const visible = items.filter((it) => active === 'Tutto' || it.category === active);
  const count = visible.length;

  return (
    <div className="collection">
      <div className="collection-filter" role="group" aria-label="Filtra per categoria">
        {['Tutto', ...categories].map((c) => (
          <button key={c} type="button" className="filter-chip" aria-pressed={active === c} onClick={() => select(c)}>
            {c}
          </button>
        ))}
        <p className="collection-count t-small muted" aria-live="polite">
          {count} {count === 1 ? 'capo' : 'capi'}
        </p>
      </div>
      <ul ref={grid} className="collection-grid" id={`${id}-griglia`}>
        {items.map((it, i) => {
          const shown = active === 'Tutto' || it.category === active;
          return (
            <li key={it.key} data-flip className={`collection-item ci-${i % 7}`} hidden={!shown}>
              <a href={it.href} target="_blank" rel="noopener noreferrer" className="collection-link" data-cursor="Scrivici">
                <span className="collection-frame">
                  <Image
                    src={it.image.src}
                    alt={it.alt}
                    fill
                    sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={it.image.blur}
                    quality={75}
                    className="object-cover"
                  />
                </span>
                <span className="collection-meta">
                  <span className="collection-cat font-misura">{it.category}</span>
                  <span className="collection-ask">Chiedi su WhatsApp</span>
                </span>
                <span className="sr-only"> (si apre WhatsApp in una nuova scheda)</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
