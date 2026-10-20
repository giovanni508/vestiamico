// Logo orizzontale ufficiale (monogramma VA + VESTIAMICO) usato come maschera:
// prende il colore del testo corrente, così funziona su notte e su avorio.
export function Logo({ className = '', title = 'Vestiamico' }: { className?: string; title?: string }) {
  return (
    <span
      role="img"
      aria-label={title}
      className={`logo-mask inline-block aspect-[442/120] bg-current ${className}`}
      style={{
        WebkitMaskImage: 'url(/brand/logo-orizzontale-bianco.webp)',
        maskImage: 'url(/brand/logo-orizzontale-bianco.webp)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
      }}
    />
  );
}
