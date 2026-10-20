import { home, reviews } from '@/lib/content';
import { Stars } from '@/components/ui/Stars';
import { ReviewsFx } from './ReviewsFx';

/** Scena 7. Le tre recensioni reali, come grandi citazioni che si avvicendano scorrendo. */
export function Reviews() {
  return (
    <section id="recensioni" className="reviews theme-avorio" aria-labelledby="reviews-title">
      <ReviewsFx>
        <div className="wrap reviews-grid">
          <div className="reviews-side">
            <h2 id="reviews-title" className="font-display t-h2">
              {home.reviews.title}
            </h2>
            <p className="reviews-rating">
              <Stars rating={reviews.rating} className="accent" decorative />
              <span className="t-small muted">Valutazione 5 su 5</span>
            </p>
            <ol className="reviews-dots" aria-hidden="true">
              {reviews.items.map((r, i) => (
                <li key={r.author} data-rv-dot={i} />
              ))}
            </ol>
          </div>
          <ol className="reviews-list">
            {reviews.items.map((r, i) => (
              <li key={r.author} className="review" data-rv-item={i}>
                <figure>
                  <blockquote>
                    <p className="review-quote font-display">“{r.highlight}”</p>
                    <p className="review-full t-small muted">{r.text}</p>
                  </blockquote>
                  <figcaption className="review-author">
                    <span className="review-name">{r.author}</span>
                    <Stars rating={r.rating} className="accent" />
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </ReviewsFx>
    </section>
  );
}
