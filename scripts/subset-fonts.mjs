// Font self-hosted e ridotti ai soli caratteri usati dal sito (licenza SIL OFL: modifica consentita).
// Scarica le versioni variabili ufficiali da Google Fonts (sottoinsieme latin), le riduce con
// harfbuzz (subset-font) mantenendo gli assi variabili, e le salva in app/fonts/.
// Da rilanciare quando si aggiungono testi con caratteri nuovi: npm run fonts
import fs from 'node:fs';
import path from 'node:path';
import subsetFont from 'subset-font';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'app/fonts');
fs.mkdirSync(OUT, { recursive: true });

// 1. caratteri usati: contenuti, componenti e pagine, più ASCII stampabile e la tipografia italiana
const files = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(json|md|tsx|ts)$/.test(f.name)) files.push(p);
  }
};
['content', 'app', 'components', 'lib'].forEach((d) => walk(path.join(ROOT, d)));
const chars = new Set();
for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCharCode(c));
for (const c of 'àèéìíòóùúÀÈÉÌÍÒÓÙÚçÇñ’‘“”«»–—…•·€©®°× ') chars.add(c);
for (const f of files) for (const c of fs.readFileSync(f, 'utf8')) if (c.codePointAt(0) >= 0x20 && c.codePointAt(0) < 0x2100) chars.add(c);
const text = [...chars].join('');
console.log(`caratteri: ${chars.size}`);

// 2. sorgenti variabili ufficiali (sottoinsieme latin) dall'API CSS di Google Fonts
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';
async function latinWoff2(cssUrl) {
  const css = await (await fetch(cssUrl, { headers: { 'User-Agent': UA } })).text();
  const blocks = css.split('/*').filter((b) => b.startsWith(' latin */'));
  return blocks.map((b) => b.match(/url\((https:[^)]+\.woff2)\)/)[1]);
}

// Bodoni: peso fissato a 500 (l'unico usato), resta l'asse ottico che dà il contrasto ai titoli grandi.
// Archivo: pesi limitati a 400-700.
const fonts = [
  { name: 'bodoni-moda', url: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..900&display=swap', axes: { wght: 500 } },
  { name: 'bodoni-moda-italic', url: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@1,6..96,400..900&display=swap', axes: { wght: 500 } },
  { name: 'archivo', url: 'https://fonts.googleapis.com/css2?family=Archivo:wght@100..900&display=swap', axes: { wght: { min: 400, max: 700 } } },
];

for (const f of fonts) {
  const [src] = await latinWoff2(f.url);
  const original = Buffer.from(await (await fetch(src)).arrayBuffer());
  const subset = await subsetFont(original, text, { targetFormat: 'woff2', variationAxes: f.axes });
  fs.writeFileSync(path.join(OUT, `${f.name}.woff2`), subset);
  console.log(`${f.name}: ${(original.length / 1024).toFixed(1)} KB -> ${(subset.length / 1024).toFixed(1)} KB`);
}
