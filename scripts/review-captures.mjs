// Catture per la revisione finale: pagina intera della home a 1440 e 390 px,
// dopo aver percorso tutta la pagina (le animazioni legate allo scroll arrivano allo stato finale).
// Uso: BASE_URL=http://localhost:3210 node scripts/review-captures.mjs
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3210';
const OUT = path.join(process.cwd(), '.impeccable', 'review');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const [name, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('vestiamico-intro', '1');
    localStorage.setItem('vestiamico-consent', JSON.stringify({ v: 1, date: Date.now(), statistics: false, marketing: false }));
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= total; y += Math.round(height * 0.6)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await page.screenshot({ path: path.join(OUT, `${name}-first-viewport.png`) });
  await ctx.close();
}
await browser.close();
console.log(fs.readdirSync(OUT).join(' '));
