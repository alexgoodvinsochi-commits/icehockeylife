// Interaction smoke test of the built site (no server: Playwright answers http://site.test/ from ./dist).
//   node scripts/smoke.mjs <shotsDir>
import { chromium } from 'playwright';
import { readFile, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = process.argv[2] ?? 'shots/smoke';
await mkdir(out, { recursive: true });
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.avif': 'image/avif' };
const results = [];
const check = (name, ok, extra = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ru-RU' });
await ctx.route('http://site.test/**', async (route) => {
  let file = path.join('dist', decodeURIComponent(new URL(route.request().url()).pathname));
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); } catch {}
  try { await route.fulfill({ body: await readFile(file), contentType: TYPES[path.extname(file)] }); } catch { await route.fulfill({ status: 404 }); }
});
await ctx.route(/mc\.yandex/, (r) => r.abort());
let opened = [];
await ctx.exposeFunction('__opened', (u) => opened.push(u));
await ctx.addInitScript(() => { window.open = (u) => { window.__opened(String(u)); return null; }; });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://site.test/', { waitUntil: 'networkidle' });

// 1. coach bio sheet opens, has content, Back closes it
await page.locator('[data-sheet-open="trener-stulov"]').click();
await page.waitForTimeout(400);
const bioOpen = await page.locator('#trener-stulov').evaluate((d) => d.open);
check('bio sheet opens', bioOpen);
check('bio sheet has NHL pupils', await page.locator('#trener-stulov').innerText().then((t) => t.includes('Самсонов')));
check('bio sheet hash', page.url().endsWith('#trener-stulov'));
await page.screenshot({ path: `${out}/bio.png` });
await page.goBack();
await page.waitForTimeout(300);
check('Back closes bio', !(await page.locator('#trener-stulov').evaluate((d) => d.open)));

// 2. menu opens and a link closes it and jumps
await page.locator('.hdr__burger').click();
await page.waitForTimeout(400);
check('menu opens', await page.locator('#menu').evaluate((d) => d.open));
await page.screenshot({ path: `${out}/menu.png` });
await page.locator('#menu a[href="#voprosy"]').click();
await page.waitForTimeout(300);
check('menu link closes menu', !(await page.locator('#menu').evaluate((d) => d.open)));
let faqTop = 1e9;
for (let i = 0; i < 30 && Math.abs(faqTop) >= 200; i++) {
  await page.waitForTimeout(100);
  faqTop = await page.locator('#voprosy').evaluate((el) => el.getBoundingClientRect().top);
}
check('menu link scrolled to FAQ', Math.abs(faqTop) < 200, `top=${Math.round(faqTop)}`);

// 3. form: empty submit is blocked, filled submit composes the WhatsApp message
await page.locator('#zapis').scrollIntoViewIfNeeded();
await page.locator('.signup__submit').click();
await page.waitForTimeout(200);
check('empty form does not open WhatsApp', opened.length === 0);
await page.fill('#f-parent', 'Анна');
await page.locator('#f-phone').click();
await page.keyboard.type('9181234567');
check('phone mask', (await page.inputValue('#f-phone')) === '+7 (918) 123-45-67', await page.inputValue('#f-phone'));
await page.selectOption('#f-age', '9');
await page.locator('.pos__opt', { hasText: 'Вратарь' }).click();
await page.locator('.signup__submit').click();
await page.waitForTimeout(300);
const wa = opened[0] ?? '';
const text = decodeURIComponent(wa.split('text=')[1] ?? '');
check('WhatsApp link to head coach', wa.startsWith('https://wa.me/79384389163?text='), wa.slice(0, 40));
check('message has all fields', ['Анна', '+7 (918) 123-45-67', 'Возраст ребёнка: 9', 'Амплуа: Вратарь', '4–10 января 2027'].every((s) => text.includes(s)), JSON.stringify(text));
check('fallback panel shown', await page.locator('[data-lead-done]').isVisible());
const sms = await page.locator('[data-lead-sms-link]').getAttribute('href');
check('SMS fallback link', sms?.startsWith('sms:+79384389163?&body='), sms?.slice(0, 30));
await page.screenshot({ path: `${out}/form-done.png` });

// 4. gallery lightbox
await page.locator('a[data-lightbox]').first().scrollIntoViewIfNeeded();
await page.locator('a[data-lightbox]').first().click();
await page.waitForTimeout(500);
check('lightbox opens', await page.locator('dialog[data-lightbox-dialog]').evaluate((d) => d.open));
await page.locator('[data-lb-next]').click();
await page.waitForTimeout(300);
check('lightbox next', (await page.locator('[data-lb-count]').innerText()).startsWith('2 /'));
await page.screenshot({ path: `${out}/lightbox.png` });
await page.locator('[data-lb-close]').click();

// 5. video facade loads the VK iframe only on click
check('no VK iframe before click', (await page.locator('[data-video] iframe').count()) === 0);
await ctx.route(/vkvideo\.ru/, (r) => r.fulfill({ status: 200, body: '<html><body>vk</body></html>', contentType: 'text/html' }));
await page.locator('[data-video-play]').click();
await page.waitForTimeout(300);
const src = await page.locator('[data-video] iframe').getAttribute('src');
check('VK iframe after click', !!src && src.includes('oid=-219304286') && src.includes('id=456239181'), src ?? '');

// 6. date-gated price: simulate 9 November
const p2 = await ctx.newPage();
await p2.addInitScript(() => { const T = new Date('2026-11-09T12:00:00+03:00').getTime(); const D = Date; globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } }; });
await p2.goto('http://site.test/', { waitUntil: 'networkidle' });
const earlyVisible = await p2.locator('.hero__price [data-until]').isVisible();
const lateVisible = await p2.locator('.hero__price [data-from]').isVisible();
check('after 8 Nov the early price hides', !earlyVisible && lateVisible);
check('after 8 Nov the countdown hides', !(await p2.locator('[data-countdown]').isVisible()));

check('no page errors', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
