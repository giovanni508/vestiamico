// Verifica visiva con Playwright: per ogni pagina e larghezza scorre tutta la pagina
// (così partono le animazioni legate allo scroll), salva schermate a intervalli regolari,
// controlla overflow orizzontale, errori di console e richieste fallite.
// Uso: BASE_URL=http://localhost:3210 [BROWSER=webkit|firefox] node scripts/screenshots.mjs [larghezze] [pagine]
// BROWSER=webkit sotto i 1024 px emula un telefono touch (motore di Safari su iPhone).
import fs from 'node:fs';
import path from 'node:path';
import { chromium, webkit, firefox } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3210';
const OUT = path.join(process.cwd(), '.shots');
const widths = (process.argv[2] ?? '390,768,1440,1920').split(',').map(Number);
const pages = (process.argv[3] ?? '/,/collezioni,/abiti-da-cerimonia,/punto-vendita,/brand,/contatti,/privacy-policy,/cookie-policy-ue,/pagina-che-non-esiste').split(',');
const heights = { 390: 844, 768: 1024, 1440: 900, 1920: 1080 };

const ENGINE = process.env.BROWSER ?? 'chromium';
const engines = { chromium, webkit, firefox };
if (!engines[ENGINE]) throw new Error(`BROWSER sconosciuto: ${ENGINE}`);

const report = [];
// BROWSER_PATH: eseguibile alternativo (es. una build di WebKit/Firefox già installata da un'altra versione di Playwright)
const browser = await engines[ENGINE].launch(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {});
for (const w of widths) {
  const h = heights[w] ?? 900;
  const mobile = ENGINE === 'webkit' && w < 1024;
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'no-preference', ...(mobile ? { isMobile: true, hasTouch: true } : {}) });
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('vestiamico-intro', '1');
      localStorage.setItem('vestiamico-consent', JSON.stringify({ v: 1, date: Date.now(), statistics: false, marketing: false }));
    } catch {}
  });
  for (const p of pages) {
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('response', (r) => r.status() >= 400 && !r.url().includes('pagina-che-non-esiste') && failed.push(`${r.status()} ${r.url()}`));
    try {
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      const slug = p === '/' ? 'home' : p.replace(/\//g, '');
      const dir = path.join(OUT, ENGINE === 'chromium' ? String(w) : `${ENGINE}-${w}`);
      fs.mkdirSync(dir, { recursive: true });
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      let y = 0;
      let i = 0;
      let overflow = 0;
      while (y < total + h && i < 40) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(900);
        overflow = Math.max(overflow, await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
        await page.screenshot({ path: path.join(dir, `${slug}-${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 70 });
        y += Math.round(h * 0.85);
        i++;
        const now = await page.evaluate(() => document.documentElement.scrollHeight);
        if (y > now) break;
      }
      report.push({ width: w, page: p, shots: i, overflowPx: overflow, errors, failed });
    } catch (e) {
      // una pagina che si blocca non deve fermare il giro: la segnaliamo e proseguiamo
      report.push({ width: w, page: p, shots: 0, overflowPx: 0, errors: [`bloccata: ${String(e.message).split(/\r?\n/)[0]}`], failed });
    }
    await page.close().catch(() => {});
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, ENGINE === 'chromium' ? 'report.json' : `report-${ENGINE}.json`), JSON.stringify(report, null, 2));
for (const r of report) {
  const flag = r.overflowPx > 0 || r.errors.length || r.failed.length ? 'ATTENZIONE' : 'ok';
  console.log(`${flag.padEnd(10)} ${ENGINE.padEnd(8)} ${String(r.width).padEnd(5)} ${r.page.padEnd(26)} shots:${r.shots} overflow:${r.overflowPx}px errori:${r.errors.length} fallite:${r.failed.length}`);
  for (const e of r.errors.slice(0, 3)) console.log('   console:', e.slice(0, 200));
  for (const f of r.failed.slice(0, 3)) console.log('   rete:', f);
}
