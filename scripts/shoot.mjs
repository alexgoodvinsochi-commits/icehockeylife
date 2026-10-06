// Screenshot helper.
//   node scripts/shoot.mjs <url | dist> <outDir> [--full] [--widths=390,1440] [--scrollDelay=150] [--reduced]
// Pass "dist" to shoot the built site without a web server: requests to http://site.test/ are answered
// from ./dist by Playwright itself (the sandbox here does not allow local sockets).
import { chromium } from 'playwright';
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const [target, outDir = 'shots', ...rest] = process.argv.slice(2);
const flags = Object.fromEntries(rest.map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const widths = String(flags.widths ?? '390,1440').split(',').map(Number);
const full = Boolean(flags.full);
const scrollDelay = Number(flags.scrollDelay ?? 120);
const base = String(flags.base ?? '/');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
};

async function serveDist(context) {
  const root = path.resolve(process.env.DIST || 'dist');
  await context.route('http://site.test/**', async (route) => {
    const url = new URL(route.request().url());
    let rel = decodeURIComponent(url.pathname);
    if (base !== '/' && rel.startsWith(base)) rel = '/' + rel.slice(base.length);
    let file = path.join(root, rel);
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    } catch {
      if (!path.extname(file)) file = path.join(file, 'index.html');
    }
    try {
      const body = await readFile(file);
      await route.fulfill({ status: 200, body, contentType: TYPES[path.extname(file)] ?? 'application/octet-stream' });
    } catch {
      await route.fulfill({ status: 404, body: 'not found' });
    }
  });
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const url = target === 'dist' ? `http://site.test${base}` : target;
for (const width of widths) {
  const mobile = width < 768;
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 844 : 900 },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    locale: 'ru-RU',
    reducedMotion: flags.reduced ? 'reduce' : 'no-preference',
  });
  if (target === 'dist') await serveDist(context);
  // never let test runs reach the owner's analytics
  await context.route(/mc\.yandex\.(ru|com)|yandex\.ru\/metrika/, (r) => r.abort());
  const page = await context.newPage();
  page.on('pageerror', (e) => console.log('PAGE ERROR', e.message));
  page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()));
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  // draw every section (they use content-visibility: auto), so heights and full-page shots are real
  await page.evaluate(() => document.documentElement.classList.add('cv-all'));
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(scrollDelay);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  const file = path.join(outDir, `w${width}${full ? '-full' : ''}.png`);
  await page.screenshot({ path: file, fullPage: full });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(file, 'height', height, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : '');
  await context.close();
}
await browser.close();
