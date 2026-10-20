import { StarIcon } from '@phosphor-icons/react/dist/ssr';

/** Cinque stelle. `decorative` quando il voto è già scritto accanto in chiaro. */
export function Stars({ rating = 5, className = '', decorative = false }: { rating?: number; className?: string; decorative?: boolean }) {
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': `Valutazione ${rating} su 5` };
  return (
    <span className={`inline-flex gap-1 ${className}`} {...a11y}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} size={16} weight={i < rating ? 'fill' : 'regular'} aria-hidden="true" />
      ))}
    </span>
  );
}
