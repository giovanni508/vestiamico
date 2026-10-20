'use client';
// Cartellino WhatsApp discreto: compare dopo la prima scena e resta a portata di pollice.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { whatsappHref } from '@/lib/site';

export function WhatsAppSticky({ icon }: { icon: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // una sentinella a 90% della prima schermata: quando esce in alto, il cartellino appare
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;left:0;top:90vh;width:1px;height:1px;pointer-events:none;';
    document.body.appendChild(sentinel);
    let pastHero = false;
    // si ritira dove coprirebbe contenuti: footer e modulo contatti (lì i contatti ci sono già) e il metro delle taglie
    const covering = new Set<Element>();
    const update = () => {
      el.dataset.visible = String(pastHero && covering.size === 0);
    };
    const io = new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    io.observe(sentinel);
    const avoid = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) covering.add(e.target);
        else covering.delete(e.target);
      }
      update();
    });
    document.querySelectorAll('.site-footer, .contact-form, .form-done, .ruler').forEach((n) => avoid.observe(n));
    return () => {
      io.disconnect();
      avoid.disconnect();
      sentinel.remove();
    };
  }, [pathname]);

  return (
    <a ref={ref} href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="wa-sticky" data-visible="false" data-cursor="Scrivici">
      {icon}
      <span className="wa-sticky-label">Scrivici</span>
      <span className="sr-only"> su WhatsApp (si apre in una nuova scheda)</span>
    </a>
  );
}
