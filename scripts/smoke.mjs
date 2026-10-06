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
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ru-RU',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
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
await page.locator('#trener-stulov [data-sheet-swap="trener-azimov"]').click();
await page.waitForTimeout(400);
check('«Следующий» swaps to the next bio', (await page.locator('#trener-azimov').evaluate((d) => d.open)) && !(await page.locator('#trener-stulov').evaluate((d) => d.open)) && page.url().endsWith('#trener-azimov'));
await page.goBack();
await page.waitForTimeout(300);
check('Back closes bio', !(await page.locator('#trener-stulov').evaluate((d) => d.open)) && !(await page.locator('#trener-azimov').evaluate((d) => d.open)));

// 1b. after an in-page jump (#zapis in the URL) closing a bio must not jump the page back to the anchor
await page.locator('.hero__cta .btn').click();
await page.waitForTimeout(800);
await page.locator('[data-sheet-open="trener-azimov"]').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const y0 = await page.evaluate(() => scrollY);
await page.locator('[data-sheet-open="trener-azimov"]').first().click();
await page.waitForTimeout(400);
await page.keyboard.press('Escape');
await page.waitForTimeout(500);
const y1 = await page.evaluate(() => scrollY);
check('closing a bio after #zapis keeps the scroll', Math.abs(y1 - y0) < 40, `${y0} → ${y1}`);
await page.evaluate(() => scrollTo(0, 0));

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

// 3. form: empty submit is blocked, consent is required, filled submit composes WhatsApp and SMS texts
await page.locator('#zapis').scrollIntoViewIfNeeded();
await page.locator('.signup__submit').click();
await page.waitForTimeout(200);
check('empty form does not open WhatsApp', opened.length === 0);
await page.fill('#f-parent', 'Анна');
await page.locator('#f-phone').click();
await page.keyboard.type('+375291234567');
check('foreign phone kept as typed', (await page.inputValue('#f-phone')) === '+375291234567', await page.inputValue('#f-phone'));
// the mask: Backspace after the area code, a fix in the middle, a pasted «+7 8 …»
await page.fill('#f-phone', '');
await page.locator('#f-phone').click();
await page.keyboard.type('938');
await page.keyboard.press('Backspace');
check('Backspace after the area code', (await page.inputValue('#f-phone')) === '+7 (93', await page.inputValue('#f-phone'));
await page.fill('#f-phone', '');
await page.locator('#f-phone').click();
await page.keyboard.type('9384389163');
await page.evaluate(() => { const el = document.querySelector('#f-phone'); el.setSelectionRange(11, 11); });
await page.keyboard.press('Backspace'); // removes the 3 of «438»
await page.keyboard.type('3');
check('edit in the middle keeps the number', (await page.inputValue('#f-phone')) === '+7 (938) 438-91-63', await page.inputValue('#f-phone'));
await page.fill('#f-phone', '');
await page.locator('#f-phone').click();
await page.evaluate(() => { const el = document.querySelector('#f-phone'); el.value = '+7 8 938 438 91 63'; el.dispatchEvent(new Event('input', { bubbles: true })); });
check('pasted «+7 8 …» number', (await page.inputValue('#f-phone')) === '+7 (938) 438-91-63', await page.inputValue('#f-phone'));
await page.fill('#f-phone', '');
await page.locator('#f-phone').click();
await page.keyboard.type('9181234567');
check('phone mask', (await page.inputValue('#f-phone')) === '+7 (918) 123-45-67', await page.inputValue('#f-phone'));
await page.fill('#f-age', '2016');
await page.locator('.pos__opt', { hasText: 'Вратарь' }).click();
await page.locator('.signup__submit').click();
await page.waitForTimeout(200);
check('no consent: WhatsApp stays closed', opened.length === 0);
check('no consent: hint with the phone', await page.locator('[data-lead-consent-hint]').isVisible());
await page.locator('[data-lead-consent]').check();
await page.locator('.signup__submit').click();
await page.waitForTimeout(600);
const wa = opened[0] ?? '';
const text = decodeURIComponent(wa.split('text=')[1] ?? '');
check('WhatsApp link to head coach', wa.startsWith('https://wa.me/79384389163?text='), wa.slice(0, 40));
check('message has all fields', ['Анна', '+7 (918) 123-45-67', 'Год рождения или возраст ребёнка: 2016', 'Амплуа: Вратарь', '4–10 января 2027'].every((s) => text.includes(s)), JSON.stringify(text));
check('message quotes the consent document', /Согласие на обработку персональных данных .*soglasie\//.test(text), text.split('\n').pop());
const panel = page.locator('[data-lead-done]');
check('ready panel shown', await panel.isVisible());
const box = await panel.boundingBox();
check('ready panel in view', !!box && box.y < 844 && box.y + 60 > 0, JSON.stringify(box));
const sms = (await page.locator('[data-lead-sms-link]').getAttribute('href')) ?? '';
const smsText = decodeURIComponent(sms.split('body=')[1] ?? '');
check('SMS link to head coach', sms.startsWith('sms:+79384389163?&body='), sms.slice(0, 30));
check('phone: SMS shown, desktop line hidden', (await page.locator('[data-lead-sms-link]').isVisible()) && !(await page.locator('.signup__or .only-desk').isVisible()));
check('SMS text is short and has the consent', smsText.length <= 201 && smsText.includes('soglasie/') && smsText.includes('+79181234567'), `${smsText.length}: ${smsText}`);
await page.evaluate(() => {
  const set = (v) => Object.defineProperty(document, 'visibilityState', { value: v, configurable: true });
  set('hidden'); document.dispatchEvent(new Event('visibilitychange'));
  set('visible'); document.dispatchEvent(new Event('visibilitychange'));
});
check('back from WhatsApp: «сообщение ушло?»', await page.locator('[data-lead-nudge]').isVisible());
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
const faqEarly = await p2.locator('.faq__item[data-until]').isVisible();
const faqLate = await p2.locator('.faq__item[data-from]').count() === 1 && !(await p2.locator('.faq__item[data-from]').evaluate((d) => d.hidden));
check('after 8 Nov the FAQ answer has no early price', !faqEarly && faqLate);
check('after 8 Nov the fine print has no early price', !(await p2.locator('.price__fine [data-until]').evaluate((e) => !e.hidden)));

// 6b. after the camp: no sign-up buttons, the form gives way to a note
const p4 = await ctx.newPage();
await p4.addInitScript(() => { const T = new Date('2027-01-11T12:00:00+03:00').getTime(); const D = Date; globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [T])); } static now() { return T; } }; });
await p4.goto('http://site.test/', { waitUntil: 'networkidle' });
check('after the camp the hero CTA hides', !(await p4.locator('.hero__cta').isVisible()) && (await p4.locator('.hero__over').isVisible()));
check('after the camp the form gives way to a note', !(await p4.locator('form[data-lead]').evaluate((f) => !f.hidden)) && !(await p4.locator('.signup__over').evaluate((e) => e.hidden)));

// 7. legal pages: separate documents, header leads back to the home page
const p3 = await ctx.newPage();
p3.on('pageerror', (e) => errors.push(e.message));
await p3.goto('http://site.test/politika/', { waitUntil: 'networkidle' });
check('policy page', (await p3.locator('h1').innerText()).includes('Политика'));
check('policy header CTA goes home', (await p3.locator('.hdr__cta').getAttribute('href')) === '/#zapis');
await p3.goto('http://site.test/soglasie/', { waitUntil: 'networkidle' });
check('consent page with both parts', (await p3.locator('#zayavka').count()) === 1 && (await p3.locator('#cookie').count()) === 1);
const banner = await p3.locator('[data-cookie]').count();
check('no cookie banner without Metrica', banner === 0);

check('no page errors', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
