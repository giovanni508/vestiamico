// Controlli di accessibilità e motion con Playwright:
// 1) prefers-reduced-motion: nessun contenuto resta nascosto, niente preloader, marquee fermi
// 2) tastiera: il primo Tab mostra lo skip link, il focus è sempre visibile, il menu mobile intrappola il focus
// 3) indietro del browser: la posizione di scroll viene ripristinata
// Uso: BASE_URL=http://localhost:3210 node scripts/a11y-motion-check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3210';
const OUT = path.join(process.cwd(), '.shots', 'checks');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const results = [];
const ok = (name, pass, info = '') => results.push({ name, pass, info });

// 1. reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const p of ['/', '/collezioni', '/abiti-da-cerimonia']) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    const pre = await page.evaluate(() => getComputedStyle(document.querySelector('.preloader')).display);
    ok(`reduced ${p}: preloader nascosto`, pre === 'none', pre);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 800) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(150);
    }
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('main h1, main h2, main h3, main p, main img, main a')]
        .filter((el) => {
          const s = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return r.width > 0 && (s.visibility === 'hidden' || Number(s.opacity) < 0.5);
        })
        .map((el) => el.tagName + '.' + String(el.className).slice(0, 30)),
    );
    ok(`reduced ${p}: nessun contenuto nascosto`, hidden.length === 0, hidden.slice(0, 5).join(', '));
    const lenis = await page.evaluate(() => document.documentElement.classList.contains('lenis'));
    ok(`reduced ${p}: scroll nativo (niente Lenis)`, !lenis);
  }
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#brand')?.scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, 'reduced-brand.jpg'), type: 'jpeg', quality: 70 });
  await ctx.close();
}

// 2. tastiera
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('vestiamico-intro', '1');
    localStorage.setItem('vestiamico-consent', JSON.stringify({ v: 1, date: Date.now(), statistics: false, marketing: false }));
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await page.waitForTimeout(600);
  const skip = await page.evaluate(() => {
    const a = document.activeElement;
    const r = a.getBoundingClientRect();
    return { text: a.textContent, visible: r.top >= 0 && r.bottom <= innerHeight };
  });
  ok('tastiera: primo Tab = skip link visibile', skip.text.includes('Vai al contenuto') && skip.visible, JSON.stringify(skip));
  await page.screenshot({ path: path.join(OUT, 'tab-skip.jpg'), type: 'jpeg', quality: 70 });
  let noOutline = [];
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const a = document.activeElement;
      const s = getComputedStyle(a);
      // alcuni link estesi disegnano il focus sul contenitore (es. i pannelli Donna/Uomo)
      const host = a.closest('.split-panel');
      const hs = host ? getComputedStyle(host) : null;
      const hostOutline = Boolean(hs && hs.outlineStyle !== 'none' && hs.outlineWidth !== '0px');
      return { el: a.tagName + '.' + String(a.className).slice(0, 25), outline: (s.outlineStyle !== 'none' && s.outlineWidth !== '0px') || hostOutline, shadow: s.boxShadow !== 'none' };
    });
    if (!f.outline && !f.shadow) noOutline.push(f.el);
  }
  ok('tastiera: focus sempre visibile (25 Tab)', noOutline.length === 0, noOutline.slice(0, 5).join(', '));
  await ctx.close();

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await mctx.addInitScript(() => {
    sessionStorage.setItem('vestiamico-intro', '1');
    localStorage.setItem('vestiamico-consent', JSON.stringify({ v: 1, date: Date.now(), statistics: false, marketing: false }));
  });
  const m = await mctx.newPage();
  await m.goto(BASE + '/', { waitUntil: 'networkidle' });
  await m.click('.menu-toggle');
  await m.waitForTimeout(900);
  await m.screenshot({ path: path.join(OUT, 'menu-mobile.jpg'), type: 'jpeg', quality: 70 });
  const inside = [];
  for (let i = 0; i < 14; i++) {
    await m.keyboard.press('Tab');
    inside.push(await m.evaluate(() => Boolean(document.activeElement.closest('#menu-mobile'))));
  }
  ok('menu mobile: il focus resta nel menu', inside.every(Boolean));
  await m.keyboard.press('Escape');
  await m.waitForTimeout(300);
  const closed = await m.evaluate(() => document.querySelector('#menu-mobile').hidden && document.activeElement.classList.contains('menu-toggle'));
  ok('menu mobile: Esc chiude e riporta il focus', closed);
  await mctx.close();
}

// 3. indietro del browser
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    sessionStorage.setItem('vestiamico-intro', '1');
    localStorage.setItem('vestiamico-consent', JSON.stringify({ v: 1, date: Date.now(), statistics: false, marketing: false }));
  });
  const page = await ctx.newPage();
  await page.goto(BASE + '/collezioni', { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 2400);
  await page.waitForTimeout(1500);
  const before = await page.evaluate(() => Math.round(window.scrollY));
  await page.evaluate(() => document.querySelector('a[href="/brand"]')?.click());
  await page.waitForURL('**/brand');
  await page.waitForTimeout(1200);
  await page.goBack();
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => Math.round(window.scrollY));
  ok('indietro: posizione ripristinata', Math.abs(after - before) < 200, `prima ${before}, dopo ${after}`);
  await ctx.close();
}

await browser.close();
for (const r of results) console.log(`${r.pass ? 'ok ' : 'NO '} ${r.name}${r.info ? `  (${r.info})` : ''}`);
process.exit(results.every((r) => r.pass) ? 0 : 1);
