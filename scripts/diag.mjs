import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const img = 'public/maps/dust2.png';
const out = 'scratch/dust2_diag.png';
const W = 900, H = Math.round(900 * 850/789);

const data = JSON.parse(readFileSync('scratch/callouts.json', 'utf8'))['dust2'];
const b64 = readFileSync(img).toString('base64');
const src = `data:image/png;base64,${b64}`;

let grid = '';
for (let i = 0; i <= 20; i++) {
  const p = i / 20;
  const major = i % 2 === 0;
  const col = major ? '#00e5ff' : '#00e5ff40';
  grid += `<line x1="${p}" y1="0" x2="${p}" y2="1" stroke="${col}" stroke-width="${major?0.0022:0.001}"/>`;
  grid += `<line x1="0" y1="${p}" x2="1" y2="${p}" stroke="${col}" stroke-width="${major?0.0022:0.001}"/>`;
  if (major) {
    grid += `<text x="${p+0.003}" y="0.02" fill="#ff2d55" font-size="0.018">${p.toFixed(1)}</text>`;
    grid += `<text x="0.002" y="${p-0.003}" fill="#ffcc00" font-size="0.018">${p.toFixed(1)}</text>`;
  }
}

let dots = '';
for (const c of data) {
  const r = c.r ?? 0.026;
  dots += `<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="#ff2d5540" stroke="#ff2d55" stroke-width="0.0018"/>`;
  dots += `<text x="${c.x}" y="${c.y - r - 0.004}" fill="#00ff88" font-size="0.014" text-anchor="middle" paint-order="stroke" stroke="#000" stroke-width="0.005">${c.zh}</text>`;
}

const html = `<!doctype html><html><body style="margin:0;background:#000">
<div style="position:relative;width:${W}px;height:${H}px">
  <img src="${src}" style="position:absolute;inset:0;width:100%;height:100%"/>
  <svg viewBox="0 0 1 1" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${grid}${dots}</svg>
</div></body></html>`;

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(html);
await page.waitForTimeout(200);
await page.screenshot({ path: out });
await browser.close();
console.log('wrote', out);
