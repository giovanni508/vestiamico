// Verifica che ogni immagine/video citato nei file di content/ esista in content/media.json.
// Con --prune elimina da public/media/img le immagini che nessun contenuto usa.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const media = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/media.json'), 'utf8'));
const files = fs.readdirSync(path.join(ROOT, 'content')).filter((f) => f.endsWith('.json') && f !== 'media.json' && f !== 'map.json');
const used = new Set(['mg-1800']);
let missing = 0;

const IMAGE_FIELDS = new Set(['key', 'image', 'logo']);
const VIDEO_FIELDS = new Set(['video', 'mobileVideo']);
function walk(node, file) {
  if (Array.isArray(node)) return node.forEach((n) => walk(n, file));
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node)) {
    if (IMAGE_FIELDS.has(k) && typeof v === 'string') {
      used.add(v);
      if (!media.images[v]) {
        console.error(`✗ ${file}: immagine "${v}" non trovata`);
        missing++;
      }
    } else if ((VIDEO_FIELDS.has(k) && typeof v === 'string') || (k === 'videos' && Array.isArray(v))) {
      for (const key of [v].flat()) {
        if (!media.videos[key]) {
          console.error(`✗ ${file}: video "${key}" non trovato`);
          missing++;
        }
      }
    } else walk(v, file);
  }
}
for (const f of files) walk(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', f), 'utf8')), f);

if (process.argv.includes('--prune')) {
  let removed = 0;
  for (const key of Object.keys(media.images)) {
    if (!used.has(key)) {
      fs.rmSync(path.join(ROOT, 'public', media.images[key].src), { force: true });
      delete media.images[key];
      removed++;
    }
  }
  fs.writeFileSync(path.join(ROOT, 'content/media.json'), JSON.stringify(media, null, 1) + '\n');
  console.log(`rimosse ${removed} immagini non usate`);
}
console.log(missing ? `${missing} riferimenti mancanti` : `ok: ${used.size} immagini usate, tutti i riferimenti esistono`);
process.exit(missing ? 1 : 0);
