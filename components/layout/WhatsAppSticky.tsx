'use client';
// Cartellino WhatsApp discreto: compare dopo la prima scena e resta a portata di pollice.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { WhatsappLogoIcon } from '@phosphor-icons/react';
import { whatsappHref } from '@/lib/site';

export function WhatsAppSticky() {
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
    const io = new IntersectionObserver(([entry]) => {
      el.dataset.visible = String(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [pathname]);

  return (
    <a ref={ref} href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="wa-sticky" data-visible="false" data-cursor="Scrivici">
      <WhatsappLogoIcon size={22} weight="regular" aria-hidden="true" />
      <span className="wa-sticky-label">Scrivici</span>
      <span className="sr-only"> su WhatsApp (si apre in una nuova scheda)</span>
    </a>
  );
}
