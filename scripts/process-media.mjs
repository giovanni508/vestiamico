// Elabora i media sorgenti scaricati dal vecchio sito (.media-src/) in asset ottimizzati:
// - immagini  -> public/media/img/<slug>.jpg (lato lungo max 1600px) + content/media.json (dimensioni + blur)
// - video     -> public/media/video/<slug>.mp4 + .webm + poster .jpg (muti, ottimizzati per il loop)
// - logo/icone-> public/brand/ e app/
// Uso: npm run media   (richiede ffmpeg nel PATH)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.join(ROOT, '.media-src');
const OUT_IMG = path.join(ROOT, 'public/media/img');
const OUT_VID = path.join(ROOT, 'public/media/video');
const OUT_BRAND = path.join(ROOT, 'public/brand');
for (const d of [OUT_IMG, OUT_VID, OUT_BRAND]) fs.mkdirSync(d, { recursive: true });

const SKIP = /(favicon|logo-|placeholder|Klarna|background1|Home_Interior|cropped-)/i;
// duplicati identici sul vecchio sito
const DUPES = new Set([
  '2025_11_Abito-rosso-Vestiamico.jpeg',
  '2025_11_Abito-rosso-Vestiamico2.jpeg',
  '2025_11_854M-1-scaled.jpg',
  '2025_11_4-1-scaled.jpg',
]);

const slug = (f) =>
  f
    .replace(/^\d{4}_\d{2}_/, '')
    .replace(/\.(jpe?g|png|webp|mp4)$/i, '')
    .replace(/-scaled$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const manifest = { images: {}, videos: {} };

async function images() {
  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !SKIP.test(f) && !DUPES.has(f));
  for (const f of files) {
    const key = slug(f);
    const out = path.join(OUT_IMG, `${key}.jpg`);
    const img = sharp(path.join(SRC, f)).rotate();
    const resized = img.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
    const { width, height } = await resized
      .clone()
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(out);
    const blurBuf = await sharp(path.join(SRC, f)).rotate().resize(12, 12, { fit: 'inside' }).flatten({ background: '#ffffff' }).jpeg({ quality: 50 }).toBuffer();
    manifest.images[key] = {
      src: `/media/img/${key}.jpg`,
      width,
      height,
      blur: `data:image/jpeg;base64,${blurBuf.toString('base64')}`,
      source: `https://vestiamico.it/wp-content/uploads/${f.slice(0, 4)}/${f.slice(5, 7)}/${f.slice(8)}`,
    };
  }
  console.log(`immagini: ${files.length}`);
}

const VIDEOS = [
  // chiave, file sorgente, inizio, durata
  ['passerella', '2026_06_Video-abbigliamento.mp4', 0, 5],
  ['abito-blu', '2026_06_Video-vestiamico.mp4', 0, 6],
  ['smoking-blu', '2026_06_Abbigliamento-cerimonia-uomo.mp4', 0, 5],
  ['tailleur-giallo', '2026_06_Video-abbigliamento-donna.mp4', 0, 5],
  ['negozio-ingresso', '2025_11_Lo-Store.mp4', 0, 12],
  ['negozio-esterno', '2026_06_Vestiamico-Store.mp4', 0, 10],
  ['abito-verde', '2025_11_Video-Vestiamico.mp4', 2, 9],
];

function ff(args) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
}

function videos() {
  for (const [key, file, ss, t] of VIDEOS) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) {
      console.warn(`video mancante: ${file}`);
      continue;
    }
    const base = path.join(OUT_VID, key);
    const vf = "scale='min(720,iw)':-2:flags=lanczos,fps=24,format=yuv420p";
    ff(['-ss', String(ss), '-t', String(t), '-i', src, '-an', '-vf', vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-profile:v', 'high', '-movflags', '+faststart', `${base}.mp4`]);
    ff(['-ss', String(ss), '-t', String(t), '-i', src, '-an', '-vf', vf, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', `${base}.webm`]);
    ff(['-ss', String(ss + 0.2), '-i', src, '-frames:v', '1', '-vf', "scale='min(720,iw)':-2", '-q:v', '3', `${base}.jpg`]);
    const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', `${base}.mp4`]).toString().trim();
    const [width, height] = probe.split(',').map(Number);
    manifest.videos[key] = {
      mp4: `/media/video/${key}.mp4`,
      webm: `/media/video/${key}.webm`,
      poster: `/media/video/${key}.jpg`,
      width,
      height,
      sizeKb: Math.round((fs.statSync(`${base}.mp4`).size) / 1024),
      source: file,
    };
    console.log(`video ${key}: ${width}x${height}, ${manifest.videos[key].sizeKb} KB`);
  }
}

async function brand() {
  // logo oro con wordmark e monogramma per header scuro / footer
  await sharp(path.join(SRC, '2025_10_logo-footer.png')).resize({ width: 480 }).png({ compressionLevel: 9 }).toFile(path.join(OUT_BRAND, 'logo-oro.png'));
  await sharp(path.join(SRC, '2025_10_logo-footer.png')).resize({ width: 480 }).webp({ quality: 90 }).toFile(path.join(OUT_BRAND, 'logo-oro.webp'));
  await sharp(path.join(SRC, '2025_11_favicon-vestiamico.png')).resize({ width: 600 }).webp({ quality: 90 }).toFile(path.join(OUT_BRAND, 'monogramma-oro.webp'));
  await sharp(path.join(SRC, '2025_11_favicon-vestiamico.png')).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(path.join(OUT_BRAND, 'monogramma-oro.png'));
  // icone app
  const fav = path.join(SRC, '2025_11_favicon-vestiamico.png');
  const navy = { r: 14, g: 22, b: 38, alpha: 1 };
  const pad = async (size, out) => {
    const inner = Math.round(size * 0.72);
    const logo = await sharp(fav).trim().resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: navy } })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toFile(out);
  };
  await pad(512, path.join(ROOT, 'app/icon.png'));
  await pad(180, path.join(ROOT, 'app/apple-icon.png'));
  await pad(64, path.join(SRC, 'fav64.png'));
  // favicon.ico: generato come ICO con PNG incorporati (vedi DECISIONS.md)
  console.log('brand: ok');
}

await images();
videos();
await brand();
fs.writeFileSync(path.join(ROOT, 'content/media.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log('content/media.json scritto');
