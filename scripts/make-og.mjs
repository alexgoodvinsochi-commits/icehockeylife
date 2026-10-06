// Screenshots the built /og/ page into public/og.jpg (run after `astro build`, then build again).
import { chromium } from 'playwright';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.avif': 'image/avif' };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await ctx.route('http://site.test/**', async (route) => {
  let file = path.join('dist', decodeURIComponent(new URL(route.request().url()).pathname));
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); } catch {}
  try { await route.fulfill({ body: await readFile(file), contentType: TYPES[path.extname(file)] }); } catch { await route.fulfill({ status: 404 }); }
});
const page = await ctx.newPage();
await page.goto('http://site.test/og/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log('public/og.jpg');
