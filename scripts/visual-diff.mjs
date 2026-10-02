// Visual regression check: screenshots every page of two builds at the AGENTS.md viewports and
// reports any page whose pixels differ.
//   node scripts/visual-diff.mjs <baseDistDir> <newDistDir> [outDir]
// Needs Playwright + Chromium (PLAYWRIGHT_BROWSERS_PATH / CHROME_PATH). Not part of `npm run build`.
import http from 'node:http';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const [baseDir, newDir, outDir = 'visual-diff'] = process.argv.slice(2);
if (!baseDir || !newDir) { console.error('usage: visual-diff.mjs <baseDist> <newDist> [outDir]'); process.exit(2); }

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')); }

const VIEWPORTS = [[390, 844], [768, 1024], [1366, 650], [1920, 950]];
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.json': 'application/json' };

function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      try {
        const body = await readFile(path.join(dir, p));
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
        res.end(body);
      } catch { res.writeHead(404); res.end(); }
    }).listen(0, () => resolve(server));
  });
}

async function shoot(browser, port, file, [w, h]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'load' });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' +
    // sticky boxes land at slightly different offsets in full-page captures; pin them the same way on both builds
    '[style],*{scroll-behavior:auto!important}video::-webkit-media-controls{display:none!important}' });
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })));
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('*')) if (getComputedStyle(el).position === 'sticky') el.style.setProperty('position', 'relative', 'important');
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(150);
  const png = await page.screenshot({ fullPage: true });
  await page.close();
  return png;
}

const pages = (await readdir(newDir)).filter((f) => f.endsWith('.html')).sort();
const [a, b] = await Promise.all([serve(baseDir), serve(newDir)]);
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let failed = 0;
for (const vp of VIEWPORTS) {
  for (const file of pages) {
    let [x, y] = await Promise.all([shoot(browser, a.address().port, file, vp), shoot(browser, b.address().port, file, vp)]);
    // Chromium occasionally rasterizes a scaled photo a few pixels differently; a real change survives a re-shoot.
    if (!x.equals(y)) [x, y] = await Promise.all([shoot(browser, a.address().port, file, vp), shoot(browser, b.address().port, file, vp)]);
    if (!x.equals(y)) {
      failed++;
      const dir = path.join(outDir, `${vp[0]}x${vp[1]}`);
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, `${file}.base.png`), x);
      await writeFile(path.join(dir, `${file}.new.png`), y);
      console.log(`DIFF ${vp[0]}x${vp[1]} ${file}`);
    }
  }
}
await browser.close(); a.close(); b.close();
console.log(failed ? `${failed} screenshot(s) differ — see ${outDir}/` : `All ${pages.length * VIEWPORTS.length} screenshots identical.`);
process.exit(failed ? 1 : 0);
