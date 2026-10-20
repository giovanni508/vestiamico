import logos from '@/content/brand-logos.json';

type Key = keyof typeof logos;

/** Logo del brand già colorato (blu notte su avorio, avorio su notte), caricato in modo pigro. */
export function BrandLogo({ logo, tone, className = '' }: { logo: string; tone: 'notte' | 'avorio'; className?: string }) {
  const size = logos[logo as Key];
  if (!size) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- PNG a palette già ottimizzato (pochi KB): l'ottimizzatore non serve
    <img src={`/brand/loghi/${logo}-${tone}.png`} width={size.width} height={size.height} alt="" loading="lazy" decoding="async" className={`brand-logo ${className}`} />
  );
}
