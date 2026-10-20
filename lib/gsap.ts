'use client';
// Registrazione unica dei plugin GSAP e dei motion token (vedi DESIGN.md > Motion).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

let registered = false;
if (typeof window !== 'undefined' && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('sartoria', '0.22, 1, 0.36, 1');
  CustomEase.create('uscita', '0.7, 0, 0.84, 0');
  gsap.defaults({ ease: 'sartoria', duration: 0.8 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

/** Durate coerenti: rapida / media / lenta. */
export const DUR = { rapida: 0.4, media: 0.8, lenta: 1.2 } as const;
/** Stagger standard (righe, elementi). Totale sempre < 0.5s. */
export const STAGGER = { righe: 0.08, elementi: 0.06 } as const;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, SplitText };
