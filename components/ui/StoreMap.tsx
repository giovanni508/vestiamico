import { map } from '@/lib/content';
import { StoreMapFx } from './StoreMapFx';

/**
 * Mappa stilizzata del quartiere (dati OpenStreetMap, generata da scripts/build-map.mjs):
 * strade nei toni della fodera, Via dell'Orsa Minore cucita in oro, pin col monogramma.
 * Nessun servizio esterno, nessun cookie.
 */
export function StoreMap({ className = '' }: { className?: string }) {
  const { pin } = map;
  return (
    <figure className={`store-map ${className}`}>
      <StoreMapFx>
        <svg viewBox={map.viewBox} className="store-map-svg" role="img" aria-labelledby="map-title" preserveAspectRatio="xMidYMid slice">
          <title id="map-title">Mappa del quartiere con Via dell&apos;Orsa Minore e la posizione del negozio Vestiamico</title>
          <g className="map-minor">
            {map.roads.minor.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g className="map-major">
            {map.roads.major.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g className="map-street" data-map-street>
            {map.highlight.map((d, i) => (
              <path key={i} d={d} pathLength={1} />
            ))}
          </g>
          <g className="map-pin" transform={`translate(${pin.x} ${pin.y})`} data-map-pin>
            <circle r="46" className="map-pin-pulse" />
            <circle r="24" className="map-pin-dot" />
            <path d="M-12 -9H-7L0 9L7 -9H12" className="map-pin-va" />
          </g>
        </svg>
      </StoreMapFx>
      <figcaption className="store-map-credit t-micro">
        Dati mappa ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          OpenStreetMap contributors
        </a>
      </figcaption>
    </figure>
  );
}
