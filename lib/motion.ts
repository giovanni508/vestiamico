'use client';
// Motion layer caricato in differita: GSAP, i suoi plugin e Lenis non sono nel JS iniziale
// (non rallentano il primo disegno), arrivano subito dopo l'idratazione con un'unica richiesta.
// Tutte le animazioni partono da contenuti già visibili: senza JS il sito è completo.
import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';

export type Motion = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
};

let promise: Promise<Motion> | null = null;
let ready: Motion | null = null;

/** Durate coerenti: rapida / media / lenta. */
export const DUR = { rapida: 0.4, media: 0.8, lenta: 1.2 } as const;
/** Stagger standard (righe, elementi). Totale sempre < 0.5s. */
export const STAGGER = { righe: 0.08, elementi: 0.06 } as const;

/** Attende il momento giusto: dopo il load della pagina (con una breve pausa) o alla prima interazione. */
function whenCalm(): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, go));
      resolve();
    };
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    const afterLoad = () => window.setTimeout(go, 450);
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
  });
}

export function loadMotion(): Promise<Motion> {
  if (!promise) {
    promise = whenCalm()
      .then(() => import('./motion-core'))
      .then((m) => {
        ready = m.motion;
        return m.motion;
      });
  }
  return promise;
}

export const getMotion = () => ready;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** L'elemento è già (almeno in parte) nello schermo? Serve a non nascondere ciò che il visitatore sta già leggendo. */
export function inView(el: Element | null) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

type Setup = (m: Motion) => void | (() => void);

/**
 * Come useGSAP, ma con GSAP caricato in differita. Il setup gira dentro un gsap.context
 * limitato a `scope`; alla pulizia (smontaggio o cambio dipendenze) tutto viene annullato.
 */
export function useMotion(setup: Setup, { scope, dependencies = [] }: { scope?: RefObject<Element | null>; dependencies?: DependencyList } = {}) {
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });
  useEffect(() => {
    let cancelled = false;
    let ctx: ReturnType<Motion['gsap']['context']> | null = null;
    let cleanup: void | (() => void);
    loadMotion().then((m) => {
      if (cancelled) return;
      ctx = m.gsap.context(() => {
        cleanup = setupRef.current(m);
      }, scope?.current ?? undefined);
    });
    return () => {
      cancelled = true;
      if (typeof cleanup === 'function') cleanup();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- le dipendenze sono quelle dichiarate dal chiamante
  }, dependencies);
}
