'use client';
import type Lenis from 'lenis';

// Istanza unica di Lenis condivisa (niente stato React: lo scroll non deve causare render).
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Scorre a un elemento o a una posizione, con Lenis se attivo, altrimenti nativo. */
export function scrollToTarget(target: HTMLElement | number, opts: { immediate?: boolean; offset?: number } = {}) {
  const offset = opts.offset ?? 0;
  if (instance) {
    instance.scrollTo(target, { offset, immediate: opts.immediate, force: true, duration: 1.4 });
    return;
  }
  const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: opts.immediate ? 'auto' : 'smooth' });
}
