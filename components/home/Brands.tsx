import { LazyImage } from '@/components/ui/LazyImage';
import { brand, home, img } from '@/lib/content';
import { Marquee } from '@/components/motion/Marquee';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { StitchLink } from '@/components/ui/StitchLink';
import { TLink } from '@/components/motion/PageTransition';
import { BrandLogo } from '@/components/ui/BrandLogo';

type B = { name: string; logo: string };

function BrandItem({ b }: { b: B }) {
  const tile = img(b.logo);
  return (
    <TLink href="/brand" className="brand-item" data-cursor="Scopri" aria-label={`${b.name}, scopri i brand`}>
      <span className="brand-mono" aria-hidden="true">
        <BrandLogo logo={b.logo} tone="notte" />
      </span>
      <span className="brand-color" aria-hidden="true">
        <LazyImage src={tile.src} alt="" width={160} height={160} sizes="160px" quality={75} />
      </span>
    </TLink>
  );
}

/** Scena 6. Le firme: due nastri in direzioni opposte, loghi monocromatici che si colorano al passaggio. */
export function Brands() {
  const [donna, uomo] = brand.groups;
  return (
    <section id="brand" className="brands theme-avorio" aria-labelledby="brands-title">
      <div className="wrap brands-head">
        <SplitReveal as="h2" id="brands-title" className="font-display t-h2 brands-title">
          {home.brands.title}
        </SplitReveal>
      </div>
      <div className="brands-rows">
        <Marquee duration={38} label={`Brand donna: ${donna.brands.map((b) => b.name).join(', ')}`}>
          {[...donna.brands, ...donna.brands].map((b, i) => (
            <BrandItem key={`${b.logo}-${i}`} b={b} />
          ))}
        </Marquee>
        <span className="brands-thread stitch-x" aria-hidden="true" />
        <Marquee duration={44} reverse label={`Brand uomo: ${uomo.brands.map((b) => b.name).join(', ')}`}>
          {[...uomo.brands, ...uomo.brands].map((b, i) => (
            <BrandItem key={`${b.logo}-${i}`} b={b} />
          ))}
        </Marquee>
      </div>
      <div className="wrap brands-foot">
        <StitchLink href="/brand" cursor="Scopri">
          Scopri tutti i brand
        </StitchLink>
      </div>
    </section>
  );
}
