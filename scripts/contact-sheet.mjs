// Unisce gli screenshot di .shots/<larghezza>/<pagina>-NN.jpg in provini .shots/sheets/<pagina>-<larghezza>.jpg
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const OUT = path.join(process.cwd(), '.shots', 'sheets');
fs.mkdirSync(OUT, { recursive: true });
for (const w of fs.readdirSync('.shots').filter((d) => /^\d+$/.test(d))) {
  const files = fs.readdirSync(path.join('.shots', w));
  const groups = {};
  for (const f of files) (groups[f.replace(/-\d+\.jpg$/, '')] ??= []).push(f);
  for (const [name, list] of Object.entries(groups)) {
    list.sort();
    const meta = await sharp(path.join('.shots', w, list[0])).metadata();
    const scale = +w < 800 ? 0.5 : 0.3;
    const tw = Math.round(meta.width * scale), th = Math.round(meta.height * scale);
    const cols = +w < 800 ? 8 : 4;
    const rows = Math.ceil(list.length / cols);
    const comps = await Promise.all(list.map(async (f, i) => ({ input: await sharp(path.join('.shots', w, f)).resize(tw, th).toBuffer(), left: (i % cols) * (tw + 6), top: Math.floor(i / cols) * (th + 6) })));
    await sharp({ create: { width: cols * (tw + 6), height: rows * (th + 6), channels: 3, background: '#888' } }).composite(comps).jpeg({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.jpg`));
  }
}
console.log(fs.readdirSync(OUT).join(' '));
