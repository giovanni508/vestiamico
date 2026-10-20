// Genera la mappa stilizzata del quartiere dai dati OpenStreetMap (ODbL).
// Input:  .media-src/osm/roads.json (query Overpass, vedi README)
// Output: content/map.json  { viewBox, roads: { major: [d], minor: [d] }, highlight: [d], pin: {x,y} }
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(ROOT, '.media-src/osm/roads.json'), 'utf8'));
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));

const { lat: clat, lng: clng } = site.address.geo;
const SIZE = 1000;
const RADIUS_M = 850; // metà lato della mappa in metri
const mPerDegLat = 111320;
const mPerDegLng = 111320 * Math.cos((clat * Math.PI) / 180);
const project = (lat, lng) => {
  const x = ((lng - clng) * mPerDegLng) / RADIUS_M;
  const y = -((lat - clat) * mPerDegLat) / RADIUS_M;
  return [((x + 1) / 2) * SIZE, ((y + 1) / 2) * SIZE];
};
const r = (n) => Math.round(n * 10) / 10;

const MAJOR = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary']);
const roads = { major: [], minor: [] };
const highlight = [];
for (const el of data.elements) {
  if (el.type !== 'way' || !el.geometry) continue;
  const pts = el.geometry.map((g) => project(g.lat, g.lon));
  if (pts.every(([x, y]) => x < -50 || x > SIZE + 50 || y < -50 || y > SIZE + 50)) continue;
  const d = 'M' + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join('L');
  const name = el.tags?.name || '';
  if (/Orsa Minore/i.test(name)) highlight.push(d);
  else if (MAJOR.has(el.tags?.highway)) roads.major.push(d);
  else if (el.tags?.highway !== 'service') roads.minor.push(d);
}
// il pin va sul punto della via evidenziata più vicino al centro (il civico esatto è da confermare)
let [px, py] = project(clat, clng);
let best = Infinity;
for (const d of highlight) {
  for (const pair of d.slice(1).split('L')) {
    const [x, y] = pair.split(' ').map(Number);
    const dist = (x - SIZE / 2) ** 2 + (y - SIZE / 2) ** 2;
    if (dist < best) [best, px, py] = [dist, x, y];
  }
}
const out = { viewBox: `0 0 ${SIZE} ${SIZE}`, roads, highlight, pin: { x: r(px), y: r(py) }, attribution: '© OpenStreetMap contributors' };
fs.writeFileSync(path.join(ROOT, 'content/map.json'), JSON.stringify(out) + '\n');
console.log(`mappa: ${roads.major.length} principali, ${roads.minor.length} secondarie, ${highlight.length} evidenziate, ${(JSON.stringify(out).length / 1024).toFixed(1)} KB`);
