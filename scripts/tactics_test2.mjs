import { chromium } from 'playwright-core';
const S = process.env.SCR;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
await p.goto('http://localhost:4222/cs2-Map-Callouts/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1300);
await p.click('.panel-toggle:has-text("戰術板")');
await p.waitForTimeout(500);

const stage = await p.$('.map-stage');
const box = await stage.boundingBox();
const at = (fx, fy) => [box.x + box.width * fx, box.y + box.height * fy];

// place a marker then drag it
await p.click('.tt-roster .pawn:nth-child(3)');
let [px, py] = at(0.35, 0.45);
await p.mouse.click(px, py); await p.waitForTimeout(300);
const before = await p.evaluate(() => {
  const e = document.querySelector('.tactic-marker ellipse');
  return { cx: +e.getAttribute('cx'), cy: +e.getAttribute('cy') };
});
// drag it
await p.mouse.move(px, py); await p.mouse.down();
let [qx, qy] = at(0.62, 0.3);
await p.mouse.move(qx, qy, { steps: 10 }); await p.mouse.up();
await p.waitForTimeout(300);
const after = await p.evaluate(() => {
  const e = document.querySelector('.tactic-marker ellipse');
  return { cx: +e.getAttribute('cx'), cy: +e.getAttribute('cy') };
});
console.log('marker before:', JSON.stringify(before), '-> after:', JSON.stringify(after));
console.log('moved:', Math.abs(after.cx - before.cx) > 0.1 ? 'YES' : 'NO');

// per-map isolation: switch to Dust2
await p.click('.map-card:nth-child(3)');
await p.waitForTimeout(900);
const onDust2 = await p.evaluate(() => document.querySelectorAll('.tactic-marker').length);
console.log('markers on dust2 (should be 0):', onDust2);
// back to mirage
await p.click('.map-card:nth-child(2)');
await p.waitForTimeout(900);
const backMirage = await p.evaluate(() => document.querySelectorAll('.tactic-marker').length);
console.log('markers back on mirage (should be >0):', backMirage);
await p.screenshot({ path: S + '/t_dragged.png' });
await b.close();
console.log('OK');
