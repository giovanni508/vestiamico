'use client';
// Transizioni di pagina "a sipario": View Transitions API (la nuova pagina si apre dal centro,
// vedi globals.css) con fallback GSAP a due pannelli. Disattivate con prefers-reduced-motion.
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps, type MouseEvent } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<null | (() => void)>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resolve = pending.current;
    if (!resolve) return;
    pending.current = null;
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }, [pathname]);

  const waitForRoute = useCallback(
    () =>
      new Promise<void>((resolve) => {
        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };
        pending.current = finish;
        window.setTimeout(finish, 2500);
      }),
    [],
  );

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname || prefersReducedMotion()) {
        router.push(href);
        return;
      }
      const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
      if (typeof doc.startViewTransition === 'function') {
        doc.startViewTransition(async () => {
          router.push(href);
          await waitForRoute();
        });
        return;
      }
      const el = curtain.current;
      if (!el) {
        router.push(href);
        return;
      }
      const panels = el.querySelectorAll('[data-panel]');
      gsap
        .timeline()
        .set(el, { autoAlpha: 1 })
        .fromTo(panels, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'uscita' })
        .add(() => {
          router.push(href);
          waitForRoute().then(() => {
            gsap
              .timeline()
              .to(panels, { scaleX: 0, duration: 0.8, ease: 'expo.out', stagger: 0.04 })
              .set(el, { autoAlpha: 0 });
          });
        });
    },
    [router, waitForRoute],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={curtain} className="page-curtain" aria-hidden="true">
        <div data-panel className="page-curtain-panel" style={{ transformOrigin: 'left center' }} />
        <div data-panel className="page-curtain-panel" style={{ transformOrigin: 'right center' }} />
      </div>
    </TransitionContext.Provider>
  );
}

type LinkProps = ComponentProps<typeof NextLink> & { href: string };

/** Link interno con transizione a sipario. I link esterni, tel: e mailto: restano normali. */
export function TLink({ href, onClick, ...rest }: LinkProps) {
  const ctx = useContext(TransitionContext);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !ctx) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (rest.target && rest.target !== '_self') return;
    if (!href.startsWith('/')) return;
    e.preventDefault();
    ctx.navigate(href);
  };
  return <NextLink href={href} onClick={handle} {...rest} />;
}
