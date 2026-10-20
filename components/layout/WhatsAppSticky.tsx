'use client';
// Cartellino WhatsApp discreto: compare dopo la prima scena e resta a portata di pollice.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { WhatsappLogoIcon } from '@phosphor-icons/react';
import { ScrollTrigger } from '@/lib/gsap';
import { whatsappHref } from '@/lib/site';

export function WhatsAppSticky() {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.visible = 'false';
    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 0.9,
      end: 'max',
      onToggle: (self) => {
        el.dataset.visible = String(self.isActive);
      },
    });
    return () => st.kill();
  }, [pathname]);

  return (
    <a
      ref={ref}
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-sticky"
      data-visible="false"
      data-cursor="Scrivici"
    >
      <WhatsappLogoIcon size={22} weight="regular" aria-hidden="true" />
      <span className="wa-sticky-label">Scrivici</span>
      <span className="sr-only"> su WhatsApp (si apre in una nuova scheda)</span>
    </a>
  );
}
