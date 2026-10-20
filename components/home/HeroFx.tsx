'use client';
// Comportamento della hero: carica i video solo dopo il load (non rubano banda all'LCP),
// solo quelli visibili per il breakpoint, mai con reduced motion o risparmio dati;
// pausa accessibile; restringimento in cornice legato allo scroll.
import { useEffect, useRef, type ReactNode } from 'react';
import { useMotion } from '@/lib/motion';

export function HeroFx({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  // video: caricamento differito, pausa, stop fuori schermo
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const videos = Array.from(el.querySelectorAll<HTMLVideoElement>('.hero-video'));
    const pauseBtn = el.querySelector<HTMLButtonElement>('[data-hero-pause]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let userPaused = reduce;
    let visibleOnScreen = true;

    const visible = () => videos.filter((v) => v.offsetParent !== null);
    const sync = () => {
      for (const v of visible()) {
        if (!v.dataset.loaded) continue;
        if (!userPaused && visibleOnScreen) v.play().catch(() => {});
        else v.pause();
      }
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        const label = pauseBtn.querySelector('.hero-pause-label');
        if (label) label.textContent = userPaused ? 'Riproduci i video' : 'Metti in pausa i video';
      }
    };
    const load = () => {
      if (conn?.saveData) return;
      for (const v of visible()) {
        if (v.dataset.loaded) continue;
        v.dataset.loaded = '1';
        const webm = document.createElement('source');
        webm.src = v.dataset.webm!;
        webm.type = 'video/webm';
        const mp4 = document.createElement('source');
        mp4.src = v.dataset.mp4!;
        mp4.type = 'video/mp4';
        v.append(webm, mp4);
        v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
        v.load();
      }
      sync();
    };

    let idleId: number | undefined;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const schedule = () => {
      idleId = w.requestIdleCallback ? w.requestIdleCallback(load, { timeout: 2500 }) : window.setTimeout(load, 600);
    };
    if (!reduce) {
      if (document.readyState === 'complete') schedule();
      else window.addEventListener('load', schedule, { once: true });
    } else {
      pauseBtn?.setAttribute('hidden', '');
    }

    const onPause = () => {
      userPaused = !userPaused;
      if (!userPaused) load();
      sync();
    };
    pauseBtn?.addEventListener('click', onPause);
    const mqDesktop = window.matchMedia('(min-width: 48rem)');
    const onBp = () => load();
    mqDesktop.addEventListener('change', onBp);
    const io = new IntersectionObserver(([entry]) => {
      visibleOnScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);

    return () => {
      if (idleId) {
        w.cancelIdleCallback?.(idleId);
        window.clearTimeout(idleId);
      }
      window.removeEventListener('load', schedule);
      pauseBtn?.removeEventListener('click', onPause);
      mqDesktop.removeEventListener('change', onBp);
      io.disconnect();
    };
  }, []);

  // restringimento in cornice impunturata
  useMotion(
    ({ gsap }) => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: '(min-width: 48rem) and (prefers-reduced-motion: no-preference)', mobile: '(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)' },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const media = el.querySelector('[data-hero-media]');
          const frame = el.querySelector('[data-hero-frame]');
          const content = el.querySelector('[data-hero-content]');
          const pin = el.querySelector('.hero-pin');
          const inset = desktop ? 'inset(13% 9% 13% 9%)' : 'inset(14% 6% 20% 6%)';
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: pin, start: 'top top', end: desktop ? '+=75%' : '+=55%', pin: true, scrub: 0.6, anticipatePin: 1 },
          });
          tl.fromTo(media, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: inset, duration: 1 }, 0)
            .fromTo(el.querySelectorAll('.hero-slot video, .hero-slot img'), { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
            .to(content, { yPercent: -18, autoAlpha: 0, duration: 0.55 }, 0)
            .fromTo(frame, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0.5);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="hero-root">
      {children}
    </div>
  );
}
