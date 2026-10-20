import { home } from '@/lib/content';
import { romeNow } from '@/lib/hours';
import { CountUp } from '@/components/motion/CountUp';
import { WordLight } from '@/components/motion/WordLight';
import { FadeUp } from '@/components/motion/FadeUp';
import { TimelineFx } from './TimelineFx';

// filo orizzontale ondulato che attraversa la timeline (coordinate: 1000 per tappa)
function threadPath(n: number) {
  const w = n * 1000;
  let d = 'M0 60';
  for (let i = 0; i < n; i++) {
    const x = i * 1000;
    d += ` C${x + 250} 20 ${x + 350} 100 ${x + 500} 60 S${x + 750} 20 ${x + 1000} 60`;
  }
  return { d, w };
}

/** Scena 2. Dal 1960: il tempo che passa, la frase che si accende, le tappe di famiglia. */
export function Since() {
  const { since } = home;
  const to = Math.max(since.to, romeNow().year);
  const years = to - since.from;
  const n = since.milestones.length;
  const thread = threadPath(n);

  return (
    <section id="storia" className="since theme-notte grain" aria-labelledby="since-title">
      <div className="wrap since-head">
        <h2 id="since-title" className="sr-only">
          La nostra storia, dal {since.from}
        </h2>
        <CountUp
          from={since.from}
          to={to}
          className="since-counter font-display"
          label={`Dal ${since.from} al ${to}: ${years} anni`}
          start="top 85%"
          end="bottom 35%"
        />
        <p className="since-caption">
          <span className="since-years font-misura">{years}</span>
          <span>{since.caption}</span>
        </p>
      </div>

      <div className="wrap since-statement-wrap">
        <WordLight text={since.statement} className="since-statement font-display t-display" />
        <FadeUp className="since-body t-lead measure muted">
          <p>{since.body}</p>
        </FadeUp>
      </div>

      <TimelineFx>
        <div className="timeline-track" data-tl-track style={{ ['--n' as string]: n }}>
          <svg className="timeline-thread" viewBox={`0 0 ${thread.w} 120`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <mask id="tl-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={thread.w} height="120">
                <path data-tl-reveal d={thread.d} pathLength={1} fill="none" stroke="#fff" strokeWidth="60" />
              </mask>
            </defs>
            <path d={thread.d} className="timeline-thread-path" mask="url(#tl-mask)" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg className="timeline-vthread" viewBox="0 0 20 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <mask id="tl-vmask" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="1000">
                <path data-tl-vreveal d="M10 0V1000" pathLength={1} fill="none" stroke="#fff" strokeWidth="20" />
              </mask>
            </defs>
            <path d="M10 0V1000" className="timeline-thread-path" mask="url(#tl-vmask)" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol className="timeline-list">
          {since.milestones.map((m) => (
            <li key={m.title} className="timeline-item" data-tl-item>
              <span className="timeline-knot" data-tl-knot aria-hidden="true" />
              <p className="timeline-label font-display" data-tl-in>
                {m.label}
              </p>
              <h3 className="timeline-title font-display t-h3" data-tl-in>
                {m.title}
              </h3>
              <p className="timeline-text muted" data-tl-in>
                {m.text}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </TimelineFx>
    </section>
  );
}
