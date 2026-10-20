import type { ReactNode } from 'react';
import { Magnetic } from '@/components/motion/Magnetic';
import { TLink } from '@/components/motion/PageTransition';

type Props = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  cursor?: string;
  external?: boolean;
  /** testo per screen reader aggiunto al nome (es. "su WhatsApp, si apre in una nuova scheda") */
  srSuffix?: string;
};

/**
 * Il cartellino: l'azione principale del sito ha la forma dell'etichetta appesa ai capi,
 * con il foro e il filo d'oro. Colori invertiti rispetto alla sezione che lo ospita.
 */
export function TagButton({ href, children, icon, className = '', cursor, external, srSuffix }: Props) {
  const body = (
    <>
      <span className="tag-string" aria-hidden="true" />
      <span className="tag-body">
        <span className="tag-hole" aria-hidden="true" />
        {icon && <span className="tag-icon">{icon}</span>}
        <span className="tag-label">{children}</span>
        {srSuffix && <span className="sr-only"> {srSuffix}</span>}
      </span>
    </>
  );
  const cls = `tag-button ${className}`;
  return (
    <Magnetic>
      {external || !href.startsWith('/') ? (
        <a href={href} className={cls} data-cursor={cursor} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {body}
        </a>
      ) : (
        <TLink href={href} className={cls} data-cursor={cursor}>
          {body}
        </TLink>
      )}
    </Magnetic>
  );
}
