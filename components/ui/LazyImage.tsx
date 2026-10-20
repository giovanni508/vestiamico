'use client';
// Immagine sotto la piega: viene richiesta solo quando sta per entrare nello schermo
// (margine più stretto del lazy-loading nativo, che su rete veloce scarica tutto subito).
// Fino ad allora c'è un segnaposto della stessa misura, con il testo alternativo.
import { useEffect, useRef, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

type Props = ImageProps & {
  margin?: string;
  /** 'section': osserva la sezione che contiene l'immagine (gallerie orizzontali, dove la foto è ritagliata) */
  observe?: 'self' | 'section';
};

export function LazyImage({ margin = '600px 0px', observe = 'self', alt, ...props }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(observe === 'section' ? (el.closest('section') ?? el) : el);
    return () => io.disconnect();
  }, [margin, observe]);

  if (near) return <Image alt={alt} {...props} />;
  const { fill, width, height } = props;
  return (
    <span
      ref={ref}
      className={`lazy-ph${fill ? ' lazy-ph--fill' : ''}`}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      style={fill ? undefined : { width: Number(width), height: Number(height) }}
    />
  );
}
