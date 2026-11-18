import { home } from '@/lib/content';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FadeUp } from '@/components/motion/FadeUp';
import { RulerFx } from './RulerFx';

/** Scena 4. Taglie donna 38–56 e uomo 44–70: il metro da sarta (dalla più piccola alla più grande) scorre al ritmo dello scroll. */
export function Sizes() {
  const { sizes } = home;
  const values: number[] = [];
  const from = Math.min(...sizes.ranges.map((r) => r.from));
  const to = Math.max(...sizes.ranges.map((r) => r.to));
  for (let s = from; s <= to; s += 2) values.push(s);
  const segment = (
    <div className="ruler-seq">
      {values.map((v) => (
        <div key={v} className="ruler-seg" data-size={v}>
          <span className="ruler-num font-display">{v}</span>
          <span className="ruler-ticks" />
        </div>
      ))}
    </div>
  );
  return (
    <section id="taglie" className="sizes theme-avorio" aria-labelledby="sizes-title">
      <div className="wrap sizes-head">
        <SplitReveal as="h2" id="sizes-title" className="sizes-title font-display t-display">
          {sizes.statement}
        </SplitReveal>
      </div>

      <RulerFx>
        <div className="ruler" aria-hidden="true">
          <div className="ruler-track" data-ruler-track>
            {segment}
            {segment}
            {segment}
          </div>
          <span className="ruler-needle" />
        </div>
      </RulerFx>

      <FadeUp className="wrap sizes-foot">
        <div className="sizes-ranges">
          {sizes.ranges.map((r) => (
            <p key={r.label} className="sizes-range" data-fade>
              <span className="sizes-range-label font-misura">{r.label}</span>
              <span className="sizes-range-value font-display">
                Dalla {r.from} alla {r.to}
              </span>
            </p>
          ))}
        </div>
        <p className="t-lead measure muted" data-fade>
          {sizes.body}
        </p>
      </FadeUp>
    </section>
  );
}
