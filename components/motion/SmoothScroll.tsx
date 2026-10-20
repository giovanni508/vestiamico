'use client';
// Lenis sincronizzato con GSAP ScrollTrigger su un unico ticker.
// Disattivato con prefers-reduced-motion (scroll nativo).
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { getLenis, setLenis, scrollToTarget } from '@/lib/lenis';

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95, anchors: { offset: -80 } });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // cambio pagina: in cima, oppure all'ancora richiesta; poi ricalcolo dei trigger
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const lenis = getLenis();
    if (!hash) lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (hash) {
        const el = document.getElementById(decodeURIComponent(hash));
        if (el) scrollToTarget(el, { immediate: true, offset: -72 });
      }
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
