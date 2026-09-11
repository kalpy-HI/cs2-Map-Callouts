import { chromium } from 'playwright-core';
const S = process.env.SCR;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
await p.goto('http://localhost:4210/cs2-Map-Callouts/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);
// 1) sizes on ancient (card 6)
await p.click('.map-card:nth-child(6)');
await p.waitForTimeout(900);
await p.screenshot({ path: S + '/v_ancient_sizes.png' });
// 2) menu should STILL be open after switching
const stillOpen = await p.$('.app.sidebar-open') ? 'OPEN' : 'CLOSED';
console.log('sidebar after map switch:', stillOpen);
// switch again to confirm
await p.click('.map-card:nth-child(4)');
await p.waitForTimeout(900);
console.log('sidebar after 2nd switch:', await p.$('.app.sidebar-open') ? 'OPEN' : 'CLOSED');
await p.screenshot({ path: S + '/v_inferno_zh.png' });
// 3) language toggle -> EN
await p.click('.lang-toggle button:nth-child(2)');
await p.waitForTimeout(700);
await p.screenshot({ path: S + '/v_inferno_en.png' });
await b.close();
console.log('OK');
