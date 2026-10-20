import { home } from '@/lib/content';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { FadeUp } from '@/components/motion/FadeUp';
import { RulerFx } from './RulerFx';

/** Scena 4. Dalla 38 alla 60: il metro da sarta scorre al ritmo dello scroll. */
export function Sizes() {
  const { sizes } = home;
  const values: number[] = [];
  for (let s = sizes.from; s <= sizes.to; s += 2) values.push(s);
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
        <p className="sizes-range font-display" data-fade>
          Dalla {sizes.from} alla {sizes.to}
        </p>
        <p className="t-lead measure muted" data-fade>
          {sizes.body}
        </p>
      </FadeUp>
    </section>
  );
}
