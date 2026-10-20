// Genera da i JPG dei loghi brand (sfondo pieno) delle maschere alfa monocromatiche
// per il nastro dei brand, e l'immagine Open Graph 1200x630.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public/brand/loghi');
fs.mkdirSync(OUT, { recursive: true });
const brand = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/brand.json'), 'utf8'));
const keys = brand.groups.flatMap((g) => g.brands.map((b) => b.logo));

for (const key of keys) {
  const src = path.join(ROOT, 'public/media/img', `${key}.jpg`);
  const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
  const corner = data[0];
  const light = corner > 128;
  const alpha = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < alpha.length; i++) {
    const l = data[i];
    let a = light ? 255 - l : l - corner;
    a = Math.max(0, Math.min(255, (a - 14) * 2.6));
    alpha[i] = a;
  }
  const rgba = Buffer.alloc(alpha.length * 4);
  for (let i = 0; i < alpha.length; i++) rgba[i * 4 + 3] = alpha[i];
  const trimmed = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 10 })
    .png()
    .toBuffer();
  const out = await sharp(trimmed).resize({ height: 140, width: 520, fit: 'inside' }).png({ compressionLevel: 9 }).toFile(path.join(OUT, `${key}.png`));
  console.log(key, light ? 'chiaro' : 'scuro', `${out.width}x${out.height}`);
}

// Open Graph: facciata reale del negozio, velo blu notte, logo oro
const og = path.join(ROOT, 'public/og.jpg');
const photo = await sharp(path.join(ROOT, 'public/media/img/mg-1800.jpg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).toBuffer();
const veil = Buffer.from(
  `<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0d1730" stop-opacity=".94"/><stop offset=".55" stop-color="#0d1730" stop-opacity=".72"/><stop offset="1" stop-color="#0d1730" stop-opacity=".15"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="18" y="18" width="1164" height="594" fill="none" stroke="#d9b66a" stroke-opacity=".6" stroke-dasharray="10 8"/></svg>`,
);
const logo = await sharp(path.join(ROOT, 'public/brand/logo-oro.png')).resize({ width: 300 }).toBuffer();
const text = Buffer.from(
  `<svg width="700" height="160"><text x="0" y="60" font-family="Georgia, serif" font-size="54" fill="#f2eee5">Dalle passerelle</text><text x="0" y="128" font-family="Georgia, serif" font-size="54" fill="#f2eee5">al tuo armadio</text></svg>`,
);
await sharp(photo)
  .composite([
    { input: veil, left: 0, top: 0 },
    { input: logo, left: 80, top: 70 },
    { input: text, left: 80, top: 400 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(og);
console.log('og.jpg ok');
