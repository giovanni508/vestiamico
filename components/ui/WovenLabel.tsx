// L'etichetta tessuta, come quella cucita all'interno di una giacca: trama orizzontale,
// estremità ripiegate e impunture ai lati. È la firma del sito (footer, storia, 404).
export function WovenLabel({ lines = ['Vestiamico', 'Palermo, dal 1960'], className = '' }: { lines?: [string, string] | string[]; className?: string }) {
  return (
    <span className={`woven-label ${className}`} aria-hidden="true">
      <span className="woven-label-stitch" />
      <span className="woven-label-text">
        <span className="woven-label-name font-display">{lines[0]}</span>
        <span className="woven-label-sub">{lines[1]}</span>
      </span>
      <span className="woven-label-stitch" />
    </span>
  );
}
