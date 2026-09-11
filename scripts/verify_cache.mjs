import { chromium } from 'playwright-core';
const S = process.env.SCR;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
// 清掉舊的戰術資料，確保看到預設重生點
await p.goto('http://localhost:4230/cs2-Map-Callouts/', { waitUntil: 'domcontentloaded' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1300);

const names = await p.$$eval('.map-card .name-en', els => els.map(e => e.textContent));
console.log('maps:', names.join(', '));

await p.click('.panel-toggle:has-text("戰術板")');
await p.waitForTimeout(600);
const n = await p.evaluate(() => document.querySelectorAll('.tactic-marker').length);
console.log('default spawn markers on Mirage:', n);
await p.screenshot({ path: S + '/v_spawns_mirage.png' });

// Cache 是第 6 張（h2 + 5）
await p.click('.map-card:has-text("Cache")');
await p.waitForTimeout(1100);
const nc = await p.evaluate(() => ({
  markers: document.querySelectorAll('.tactic-marker').length,
  callouts: document.querySelectorAll('.overlay ellipse').length,
}));
console.log('cache:', JSON.stringify(nc));
await p.screenshot({ path: S + '/v_cache.png' });
await b.close();
console.log('OK');
