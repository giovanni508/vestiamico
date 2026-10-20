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
// pennellata piena (assottigliata alle estremità) per il riempimento in oro
const BRUSH =
  'M455 915C505 830 575 745 690 700C815 650 960 640 1065 672C1120 690 1160 722 1195 782C1150 760 1100 748 1040 744C940 740 835 772 745 828C690 862 650 895 618 915C600 893 575 890 548 902C520 914 488 918 455 915Z';

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
            <linearGradient id="pl-oro" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f3d88f" />
              <stop offset="0.18" stopColor="#a5701a" />
              <stop offset="0.36" stopColor="#8c5a00" />
              <stop offset="0.6" stopColor="#d9b66a" />
              <stop offset="0.78" stopColor="#fde89a" />
              <stop offset="1" stopColor="#e9c46f" />
            </linearGradient>
            <mask id="pl-mask" maskUnits="userSpaceOnUse" x="-30" y="180" width="1260" height="840">
              <path className="pl-reveal" d={MONO} pathLength={1} />
              <path className="pl-reveal pl-reveal--swoosh" d={SWOOSH} pathLength={1} />
            </mask>
          </defs>
          <g className="pl-gold">
            <path d={MONO} fill="url(#pl-oro)" />
            <path d={BRUSH} fill="url(#pl-oro)" />
          </g>
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
