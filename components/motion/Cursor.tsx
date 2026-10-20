'use client';
// Cursore sartoriale: un punto d'oro che diventa un'etichetta ("Scopri", "Guarda", "Scrivici")
// sopra gli elementi con [data-cursor]. Solo con hover e puntatore fine, mai con reduced motion
// o contrasto forzato. Il cursore di sistema resta sui campi di testo.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { loadMotion, type Motion } from '@/lib/motion';

function startCursor(gsap: Motion['gsap'], el: HTMLDivElement, text: HTMLSpanElement) {
  const html = document.documentElement;
  html.classList.add('has-cursor');
  gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
  let current = '';
  let visible = false;

  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    xTo(e.clientX);
    yTo(e.clientY);
    if (!visible) {
      visible = true;
      gsap.to(el, { autoAlpha: 1, duration: 0.3 });
    }
    const target = e.target as HTMLElement | null;
    const labelled = target?.closest<HTMLElement>('[data-cursor]');
    const interactive = target?.closest('a, button, [role="button"], summary, label, select');
    const textField = target?.closest('input, textarea, [contenteditable="true"]');
    const next = textField ? 'text' : labelled ? `label:${labelled.dataset.cursor}` : interactive ? 'link' : 'idle';
    if (next === current) return;
    current = next;
    el.dataset.state = next.startsWith('label') ? 'label' : next;
    text.textContent = labelled?.dataset.cursor ?? '';
  };
  const leave = () => {
    visible = false;
    gsap.to(el, { autoAlpha: 0, duration: 0.2 });
  };
  const down = () => gsap.to(el, { scale: 0.85, duration: 0.15 });
  const up = () => gsap.to(el, { scale: 1, duration: 0.3, ease: 'sartoria' });

  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('pointerleave', leave);
  window.addEventListener('pointerdown', down);
  window.addEventListener('pointerup', up);
  return () => {
    html.classList.remove('has-cursor');
    window.removeEventListener('pointermove', move);
    document.removeEventListener('pointerleave', leave);
    window.removeEventListener('pointerdown', down);
    window.removeEventListener('pointerup', up);
  };
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = dot.current;
    const text = label.current;
    if (!el || !text) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
    if (!mq.matches) return;
    let cancelled = false;
    let teardown: (() => void) | undefined;
    loadMotion().then(({ gsap }) => {
      if (!cancelled) teardown = startCursor(gsap, el, text);
    });
    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  // dopo un cambio pagina l'elemento sotto il puntatore non esiste più
  useEffect(() => {
    if (dot.current) dot.current.dataset.state = 'idle';
  }, [pathname]);

  return (
    <div ref={dot} className="cursor" data-state="idle" aria-hidden="true">
      <span ref={label} className="cursor-label" />
    </div>
  );
}
