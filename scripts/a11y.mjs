// Accessibility audit of the built site with axe-core (WCAG 2.2 A/AA rules), mobile and desktop.
import { chromium } from 'playwright';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const axeSource = await readFile('node_modules/axe-core/axe.min.js', 'utf8');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.avif': 'image/avif' };
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/policy/'];
const browser = await chromium.launch();
for (const [w, h] of [[390, 844], [1440, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  await ctx.route('http://site.test/**', async (route) => {
    let file = path.join('dist', decodeURIComponent(new URL(route.request().url()).pathname));
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); } catch {}
    try { await route.fulfill({ body: await readFile(file), contentType: TYPES[path.extname(file)] }); } catch { await route.fulfill({ status: 404 }); }
  });
  await ctx.route(/mc\.yandex|vkvideo|vk\.com/, (r) => r.abort());
  for (const p of pages) {
    const page = await ctx.newPage();
    await page.goto('http://site.test' + p, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axeSource });
    const res = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    console.log(`\n== ${p} @${w}px: ${res.violations.length} violations, ${res.passes.length} passes`);
    for (const v of res.violations) {
      console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      for (const n of v.nodes.slice(0, 4)) console.log(`    ${n.target.join(' ')} :: ${(n.failureSummary || '').split('\n')[1]?.trim() ?? ''}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
