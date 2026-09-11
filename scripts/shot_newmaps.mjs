import { chromium } from 'playwright-core';
const S = process.env.SCR;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
await p.goto('http://localhost:4203/cs2-Map-Callouts/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
await p.screenshot({ path: S + '/m_sidebar_icons.png' });
async function pick(n, name) {
  if (await p.$('.app:not(.sidebar-open)')) { await p.click('.icon-toggle'); await p.waitForTimeout(400); }
  await p.click(`.map-card:nth-child(${n})`);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${S}/m_${name}.png` });
}
await pick(6, 'ancient');
await pick(5, 'nuke_upper');
await p.click('.level-controls button:nth-child(2)');
await p.waitForTimeout(800);
await p.screenshot({ path: S + '/m_nuke_lower.png' });
await pick(4, 'inferno');
await pick(8, 'anubis');
await b.close();
console.log('OK done');
