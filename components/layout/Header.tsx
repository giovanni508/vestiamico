'use client';
// Header: trasparente sopra la prima scena, diventa fodera blu (con sfocatura) scorrendo,
// si nasconde scendendo e ricompare risalendo. Su mobile apre un menu a tutto schermo.
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { WhatsappLogoIcon, PhoneIcon, InstagramLogoIcon, FacebookLogoIcon, XIcon } from '@phosphor-icons/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { getLenis } from '@/lib/lenis';
import { nav, site, whatsappHref } from '@/lib/site';
import { TLink } from '@/components/motion/PageTransition';
import { Logo } from '@/components/ui/Logo';

export function Header({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // chiude il menu quando cambia pagina (aggiornamento durante il render, senza effetti a cascata)
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // stato solido / nascosto in base allo scroll
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        el.dataset.solid = String(y > 24);
        el.dataset.hidden = String(y > 240 && self.direction === 1);
      },
    });
    el.dataset.solid = String(window.scrollY > 24);
    return () => st.kill();
  }, [pathname]);

  // menu: blocco scroll, Esc, focus intrappolato, animazione a maschera
  useEffect(() => {
    const panel = menu.current;
    if (!panel) return;
    const lenis = getLenis();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!open) {
      lenis?.start();
      document.documentElement.classList.remove('menu-open');
      return;
    }
    lenis?.stop();
    document.documentElement.classList.add('menu-open');
    const items = panel.querySelectorAll('[data-menu-item]');
    const extras = panel.querySelectorAll('[data-menu-extra]');
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.fromTo(panel, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.out' });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'sartoria', stagger: 0.06, delay: 0.15 });
      gsap.fromTo(extras, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, delay: 0.45 });
    }, panel);
    const first = panel.querySelector<HTMLElement>('a, button');
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === 'Tab') {
        const f = panel.querySelectorAll<HTMLElement>('a, button');
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      ctx.revert();
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header ref={header} className="site-header" data-solid="false" data-hidden="false">
        {children}
        <div className="wrap site-header-bar">
          <TLink href="/" className="site-logo" aria-label="Vestiamico, torna alla home">
            <Logo className="h-[30px] sm:h-[34px]" title="Vestiamico" />
          </TLink>

          <nav aria-label="Principale" className="site-nav">
            <ul>
              {nav.slice(1).map((item) => (
                <li key={item.href}>
                  <TLink href={item.href} className="nav-link" aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={whatsappHref()}
            className="header-wa"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Scrivici"
          >
            <WhatsappLogoIcon size={18} weight="regular" aria-hidden="true" />
            <span>Scrivici</span>
            <span className="sr-only"> su WhatsApp (si apre in una nuova scheda)</span>
          </a>

          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-toggle-label">{open ? 'Chiudi' : 'Menu'}</span>
            <span className="menu-toggle-lines" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        id="menu-mobile"
        ref={menu}
        className="menu-panel theme-notte grain"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
      >
        <div className="wrap menu-panel-inner">
          <div className="menu-panel-top">
            <Logo className="h-[30px]" title="Vestiamico" />
            <button type="button" className="menu-close" onClick={() => setOpen(false)}>
              <span>Chiudi</span>
              <XIcon size={20} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Menu principale">
            <ol className="menu-list">
              {nav.map((item, i) => (
                <li key={item.href} className="line-mask">
                  <TLink href={item.href} data-menu-item className="menu-link" aria-current={isActive(item.href) ? 'page' : undefined}>
                    <span className="menu-num font-misura" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display">{item.label}</span>
                  </TLink>
                </li>
              ))}
            </ol>
          </nav>
          <div className="menu-extras">
            <a data-menu-extra href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="menu-wa">
              <WhatsappLogoIcon size={26} aria-hidden="true" />
              <span>
                <strong>Scrivici su WhatsApp</strong>
                <span className="block t-small muted">{site.whatsapp.display}</span>
              </span>
            </a>
            <a data-menu-extra href={site.phones[0].href} className="menu-phone">
              <PhoneIcon size={20} aria-hidden="true" />
              <span>Chiama il negozio, {site.phones[0].display}</span>
            </a>
            <div data-menu-extra className="menu-social">
              {site.social.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.name} (si apre in una nuova scheda)`}>
                  {s.name === 'Instagram' ? <InstagramLogoIcon size={22} aria-hidden="true" /> : <FacebookLogoIcon size={22} aria-hidden="true" />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
