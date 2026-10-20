import logos from '@/content/brand-logos.json';

type Key = keyof typeof logos;

/**
 * Logo del brand già colorato (blu notte su avorio, avorio su notte), caricato in modo pigro.
 * Equilibrio ottico: i loghi hanno tutti la stessa area visiva, non la stessa altezza
 * (un marchio lungo e sottile come Romeo Gigli non diventa minuscolo, uno compatto non pesa troppo).
 */
export function BrandLogo({ logo, tone, area = 6200, maxWidth = 260, className = '' }: { logo: string; tone: 'notte' | 'avorio'; area?: number; maxWidth?: number; className?: string }) {
  const size = logos[logo as Key];
  if (!size) return null;
  const aspect = size.width / size.height;
  const width = Math.min(maxWidth, Math.round(Math.sqrt(area * aspect)));
  const height = Math.round(width / aspect);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- PNG a palette già ottimizzato (pochi KB): l'ottimizzatore non serve
    <img src={`/brand/loghi/${logo}-${tone}.png`} width={width} height={height} alt="" loading="lazy" decoding="async" className={`brand-logo ${className}`} style={{ width, height }} />
  );
}
