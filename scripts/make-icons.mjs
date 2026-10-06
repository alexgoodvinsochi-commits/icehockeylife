// Renders public/favicon.svg into the PNG icons referenced by the layout and the web manifest.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const svg = readFileSync('public/favicon.svg', 'utf8');
const browser = await chromium.launch();
for (const [size, file, pad] of [[180, 'public/apple-touch-icon.png', 0], [192, 'public/icon-192.png', 0], [512, 'public/icon-512.png', 0]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<body style="margin:0;background:#0B2A6F">${svg.replace('<svg', `<svg width="${size}" height="${size}" style="display:block"`)}</body>`);
  await page.screenshot({ path: file, omitBackground: false });
  await page.close();
}
await browser.close();
console.log('icons ok');
