'use client';
// "Il filo non si spezza": un unico filo d'oro corre nel margine sinistro della home, dalla storia
// fino a "Vieni a trovarci", e si cuce con lo scroll (la punta resta a metà schermo). A ogni scena
// fa un nodo. Passa sotto le scene agganciate (hanno uno sfondo pieno) e riappare dopo.
import { useEffect, useRef, useState } from 'react';
import { loadMotion, prefersReducedMotion } from '@/lib/motion';

const SCENES = ['#storia', '#collezioni', '#taglie', '#cerimonia', '#brand', '#recensioni', '#dove'];

type Geometry = { top: number; height: number; d: string; knots: number[] };

function buildPath(height: number) {
  // ondulazione lenta, un'ansa ogni ~420px, come un filo lasciato cadere lungo la cucitura
  let d = 'M10 0';
  const step = 420;
  for (let y = 0; y < height; y += step) {
    const y1 = Math.min(height, y + step);
    const mid = (y + y1) / 2;
    const dir = (y / step) % 2 === 0 ? 1 : -1;
    d += ` Q ${10 + 7 * dir} ${mid.toFixed(0)} 10 ${y1.toFixed(0)}`;
  }
  return d;
}

export function HomeThread() {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);

  // misura: dall'inizio della storia alla scena finale, nodi all'inizio di ogni scena
  useEffect(() => {
    const el = ref.current;
    const root = el?.parentElement;
    if (!el || !root) return;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rootTop = root.getBoundingClientRect().top + window.scrollY;
        const tops = SCENES.map((s) => document.querySelector<HTMLElement>(s))
          .filter((n): n is HTMLElement => Boolean(n))
          .map((n) => n.getBoundingClientRect().top + window.scrollY - rootTop);
        if (tops.length < 2) return;
        const last = document.querySelector<HTMLElement>('#dove .visit-title') ?? document.querySelector<HTMLElement>('#dove');
        const end = last ? last.getBoundingClientRect().top + window.scrollY - rootTop + 40 : tops[tops.length - 1];
        const top = tops[0];
        const height = Math.max(200, end - top);
        setGeo({ top, height, d: buildPath(height), knots: tops.map((t) => t - top + 4) });
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    let offRefresh: (() => void) | undefined;
    loadMotion().then(({ ScrollTrigger }) => {
      ScrollTrigger.addEventListener('refresh', measure);
      offRefresh = () => ScrollTrigger.removeEventListener('refresh', measure);
      measure();
    });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      offRefresh?.();
    };
  }, []);

  // cucitura legata allo scroll
  useEffect(() => {
    const el = ref.current;
    if (!el || !geo || prefersReducedMotion()) return;
    let kill: (() => void) | undefined;
    let cancelled = false;
    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const reveal = el.querySelector('[data-reveal]');
      const knots = el.querySelectorAll<HTMLElement>('[data-knot]');
      gsap.set(reveal, { strokeDasharray: 1000, strokeDashoffset: 1000 });
      const tween = gsap.to(reveal, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 55%', end: 'bottom 55%', scrub: 0.6 },
      });
      const knotTriggers = Array.from(knots).map((k) =>
        ScrollTrigger.create({
          trigger: k,
          start: 'top 56%',
          onEnter: () => k.classList.add('is-tied'),
          onLeaveBack: () => k.classList.remove('is-tied'),
        }),
      );
      kill = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        knotTriggers.forEach((t) => t.kill());
      };
    });
    return () => {
      cancelled = true;
      kill?.();
    };
  }, [geo]);

  return (
    <div
      ref={ref}
      className="home-thread"
      aria-hidden="true"
      style={geo ? { top: geo.top, height: geo.height } : { display: 'none' }}
    >
      {geo && (
        <>
          <svg viewBox={`0 0 20 ${geo.height}`} preserveAspectRatio="none" focusable="false">
            <defs>
              <mask id="home-thread-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height={geo.height}>
                <path data-reveal d={geo.d} pathLength={1000} fill="none" stroke="#fff" strokeWidth="20" />
              </mask>
            </defs>
            <path d={geo.d} className="home-thread-path" mask="url(#home-thread-mask)" />
          </svg>
          {geo.knots.map((y) => (
            <span key={y} className="home-thread-knot" data-knot style={{ top: y }} />
          ))}
        </>
      )}
    </div>
  );
}
