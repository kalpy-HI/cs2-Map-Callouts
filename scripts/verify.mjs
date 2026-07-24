import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const img = process.argv[2];
const key = process.argv[3];
const out = process.argv[4];
const W = Number(process.argv[5] || 900);
const H = Number(process.argv[6] || 900);

const data = JSON.parse(readFileSync('scratch/callouts.json', 'utf8'))[key];
const b64 = readFileSync(img).toString('base64');
const ext = img.endsWith('.webp') ? 'webp' : 'png';
const src = `data:image/${ext};base64,${b64}`;

let dots = '';
for (const c of data) {
  const r = c.r ?? 0.026;
  dots += `<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="#ff2d5533" stroke="#ff2d55" stroke-width="0.0022"/>`;
  dots += `<text x="${c.x}" y="${c.y - r - 0.004}" fill="#ffee00" font-size="0.017" text-anchor="middle" paint-order="stroke" stroke="#000" stroke-width="0.006">${c.zh}</text>`;
}

const html = `<!doctype html><html><body style="margin:0;background:#000">
<div style="position:relative;width:${W}px;height:${H}px">
  <img src="${src}" style="position:absolute;inset:0;width:100%;height:100%"/>
  <svg viewBox="0 0 1 1" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${dots}</svg>
</div></body></html>`;

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(html);
await page.waitForTimeout(200);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
