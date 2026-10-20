// Lighthouse mobile (impostazioni predefinite: Moto G Power emulato, rete e CPU limitate).
// Uso: BASE_URL=http://localhost:3210 node scripts/lighthouse.mjs [pagine]
// Il browser: CHROME_PATH, altrimenti il Chromium installato da Playwright.
import fs from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3210';
const pages = (process.argv[2] ?? '/,/collezioni,/abiti-da-cerimonia,/punto-vendita,/brand,/contatti,/privacy-policy').split(',');
const OUT = path.join(process.cwd(), '.lighthouse');
fs.mkdirSync(OUT, { recursive: true });

const chromePath = process.env.CHROME_PATH ?? chromium.executablePath();
const results = [];
for (const p of pages) {
  const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--no-sandbox'] });
  try {
    // THROTTLING=devtools: limitazione applicata davvero dal browser (metriche osservate) invece della simulazione Lantern
    const throttlingMethod = process.env.THROTTLING === 'devtools' ? 'devtools' : 'simulate';
    const runner = await lighthouse(BASE + p, { port: chrome.port, output: 'html', logLevel: 'error', throttlingMethod, onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    const lhr = runner.lhr;
    const slug = (p === '/' ? 'home' : p.replace(/\//g, '')) + (throttlingMethod === 'devtools' ? '-devtools' : '');
    fs.writeFileSync(path.join(OUT, `${slug}.html`), runner.report);
    fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(lhr));
    const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
    const a = lhr.audits;
    results.push({
      page: p,
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo'),
      lcp: a['largest-contentful-paint']?.displayValue,
      cls: a['cumulative-layout-shift']?.displayValue,
      tbt: a['total-blocking-time']?.displayValue,
      fcp: a['first-contentful-paint']?.displayValue,
      si: a['speed-index']?.displayValue,
      failing: Object.values(a)
        .filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== 'informative' && x.scoreDisplayMode !== 'notApplicable' && x.scoreDisplayMode !== 'manual')
        .map((x) => `${x.id} (${x.displayValue ?? x.score})`)
        .slice(0, 12),
    });
  } finally {
    await chrome.kill();
  }
}
fs.writeFileSync(path.join(OUT, process.env.THROTTLING === 'devtools' ? 'summary-devtools.json' : 'summary.json'), JSON.stringify(results, null, 2));
for (const r of results) {
  console.log(`${r.page.padEnd(22)} P:${r.performance} A:${r.accessibility} BP:${r.bestPractices} SEO:${r.seo}  LCP ${r.lcp}  CLS ${r.cls}  TBT ${r.tbt}  FCP ${r.fcp}  SI ${r.si}`);
  if (r.failing.length) console.log('   da migliorare:', r.failing.join(', '));
}
