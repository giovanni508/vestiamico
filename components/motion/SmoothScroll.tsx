'use client';
// Lenis sincronizzato con GSAP ScrollTrigger su un unico ticker, caricati in differita.
// Disattivato con prefers-reduced-motion (scroll nativo).
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadMotion, getMotion, prefersReducedMotion } from '@/lib/motion';
import { getLenis, setLenis, scrollToTarget } from '@/lib/lenis';

// navigazione con indietro/avanti: il browser ripristina la posizione, non la forziamo in cima
let fromHistory = false;
if (typeof window !== 'undefined') window.addEventListener('popstate', () => (fromHistory = true));

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let teardown: (() => void) | undefined;
    loadMotion()
      .then((m) => Promise.all([m, import('lenis')]))
      .then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95, anchors: { offset: -80 } });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      teardown = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    });
    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  // cambio pagina: in cima, oppure all'ancora richiesta; poi ricalcolo dei trigger
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const lenis = getLenis();
    const restoring = fromHistory;
    fromHistory = false;
    if (!hash && !restoring) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => {
      getMotion()?.ScrollTrigger.refresh();
      // dopo il ricalcolo dei pin, Lenis riparte dalla posizione ripristinata dal browser
      if (restoring) lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
      if (hash) {
        const el = document.getElementById(decodeURIComponent(hash));
        if (el) scrollToTarget(el, { immediate: true, offset: -72 });
      }
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
