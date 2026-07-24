import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const img = process.argv[2];          // path to image
const out = process.argv[3];          // output png
const W = Number(process.argv[4] || 760);
const H = Number(process.argv[5] || 760);

const b64 = readFileSync(img).toString('base64');
const ext = img.endsWith('.webp') ? 'webp' : img.endsWith('.png') ? 'png' : 'jpeg';
const src = `data:image/${ext};base64,${b64}`;

// grid lines every 0.05, labels every 0.1
let lines = '';
for (let i = 0; i <= 20; i++) {
  const p = i / 20;
  const major = i % 2 === 0;
  const col = major ? '#00e5ff' : '#00e5ff55';
  lines += `<line x1="${p}" y1="0" x2="${p}" y2="1" stroke="${col}" stroke-width="${major?0.0025:0.0012}"/>`;
  lines += `<line x1="0" y1="${p}" x2="1" y2="${p}" stroke="${col}" stroke-width="${major?0.0025:0.0012}"/>`;
  if (major) {
    lines += `<text x="${p+0.004}" y="0.024" fill="#ff2d55" font-size="0.022">${p.toFixed(1)}</text>`;
    lines += `<text x="0.002" y="${p-0.004}" fill="#ffcc00" font-size="0.022">${p.toFixed(1)}</text>`;
  }
}

const html = `<!doctype html><html><body style="margin:0">
<div style="position:relative;width:${W}px;height:${H}px">
  <img src="${src}" style="position:absolute;inset:0;width:100%;height:100%"/>
  <svg viewBox="0 0 1 1" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${lines}</svg>
</div></body></html>`;

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(html);
await page.waitForTimeout(200);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
