import type { ReactNode } from 'react';
import { TLink } from '@/components/motion/PageTransition';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  cursor?: string;
  external?: boolean;
};

/** Link con impuntura: a riposo una cucitura tratteggiata, al passaggio il filo pieno la ricopre. */
export function StitchLink({ href, children, className = '', cursor, external }: Props) {
  const cls = `stitch-link ${className}`;
  const inner = <span className="stitch-link-text">{children}</span>;
  if (external || !href.startsWith('/')) {
    return (
      <a href={href} className={cls} data-cursor={cursor} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
        {external && <span className="sr-only"> (si apre in una nuova scheda)</span>}
      </a>
    );
  }
  return (
    <TLink href={href} className={cls} data-cursor={cursor}>
      {inner}
    </TLink>
  );
}
