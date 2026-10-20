'use client';
// Preloader "filo e ago": un filo d'oro cuce il contorno del monogramma VA, il logo si riempie,
// compare "Dal 1960", poi due pannelli si aprono come il sipario di una passerella.
// Tutta l'animazione è CSS (parte al primo paint, non aspetta React) e dura 2,2 s.
// Saltabile con un clic o un tasto; non riappare nella stessa sessione (script in <head>).
import { useEffect, useRef } from 'react';
import { finishIntro } from '@/lib/intro';

// contorno del monogramma nel sistema di coordinate del logo originale (1200×1200)
const MONO =
  'M0 205H250V220H200L413 792L610 220H570V205H713V220H672L940 978H995V994H745V978H790L596 422L385 994H341L48 220H0Z';
const SWOOSH = 'M462 905C540 800 620 735 760 690C900 648 1060 655 1185 775';

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || document.documentElement.dataset.intro !== 'play') return;
    const skip = () => {
      el.classList.add('is-skipped');
      finishIntro();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip();
    };
    el.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', onKey, { once: true });
    const end = window.setTimeout(() => {
      el.classList.add('is-done');
      window.removeEventListener('keydown', onKey);
    }, 2300);
    return () => {
      el.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(end);
    };
  }, []);

  return (
    <div ref={ref} className="preloader" aria-hidden="true">
      <div className="preloader-panel preloader-panel--l" />
      <div className="preloader-panel preloader-panel--r" />
      <div className="preloader-center">
        <svg className="preloader-mono" viewBox="-30 180 1260 840" focusable="false">
          <defs>
            <mask id="pl-mask" maskUnits="userSpaceOnUse" x="-30" y="180" width="1260" height="840">
              <path className="pl-reveal" d={MONO} pathLength={1} />
              <path className="pl-reveal pl-reveal--swoosh" d={SWOOSH} pathLength={1} />
            </mask>
          </defs>
          <image className="pl-gold" href="/brand/monogramma-oro.webp" x="0" y="0" width="1200" height="1200" />
          <g mask="url(#pl-mask)" className="pl-stitch">
            <path d={MONO} />
            <path d={SWOOSH} />
          </g>
        </svg>
        <p className="preloader-since font-display">
          <span>Dal 1960</span>
        </p>
      </div>
      <p className="preloader-hint t-micro">Tocca per entrare</p>
    </div>
  );
}
