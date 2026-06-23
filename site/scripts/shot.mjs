// Screenshot helper for visual/alignment QA.
// Usage: node scripts/shot.mjs <baseURL> <outDir> <path1> [path2 ...]
// Captures each path at desktop (1280) and mobile (390) widths, full page.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [, , base, outDir, ...paths] = process.argv;
if (!base || !outDir || paths.length === 0) {
  console.error('usage: node scripts/shot.mjs <baseURL> <outDir> <path...>');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const widths = [{ tag: 'desktop', w: 1280, h: 900 }, { tag: 'mobile', w: 390, h: 844 }];
const browser = await chromium.launch();
for (const p of paths) {
  for (const { tag, w, h } of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(Number(process.env.WAIT) || 600); // let fonts/animations settle
    // Scroll through the page so IntersectionObserver scroll-reveals fire, then return to top.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
    const name = (p.replace(/[\/]/g, '_') || 'root') + `_${tag}.png`;
    await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
    console.log('shot', name);
    await page.close();
  }
}
await browser.close();
