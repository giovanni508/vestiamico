// Nucleo del motion layer (caricato in differita da lib/motion.ts): registra i plugin GSAP
// e i motion token. Vedi DESIGN.md > Motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('sartoria', '0.22, 1, 0.36, 1');
CustomEase.create('uscita', '0.7, 0, 0.84, 0');
gsap.defaults({ ease: 'sartoria', duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });
if (process.env.NODE_ENV !== 'production') (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger;

export const motion = { gsap, ScrollTrigger, SplitText };
