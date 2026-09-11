import { chromium } from 'playwright-core';
const S = process.env.SCR;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
await p.goto('http://localhost:4220/cs2-Map-Callouts/', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1200);

// open tactics board
await p.click('.panel-toggle:has-text("戰術板")');
await p.waitForTimeout(500);
await p.screenshot({ path: S + '/t_open.png' });

const stage = await p.$('.map-stage');
const box = await stage.boundingBox();
const at = (fx, fy) => [box.x + box.width * fx, box.y + box.height * fy];

// pen: draw a curve
await p.click('.tt-group button[title="畫筆"]');
let [x, y] = at(0.25, 0.35);
await p.mouse.move(x, y); await p.mouse.down();
for (let i = 0; i <= 12; i++) {
  const [mx, my] = at(0.25 + i * 0.02, 0.35 + Math.sin(i / 2) * 0.05);
  await p.mouse.move(mx, my); await p.waitForTimeout(12);
}
await p.mouse.up();

// arrow in another colour
await p.click('.tt-colors .swatch:nth-child(4)');
await p.click('.tt-group button[title="箭頭"]');
let [ax, ay] = at(0.55, 0.7); let [bx, by] = at(0.78, 0.45);
await p.mouse.move(ax, ay); await p.mouse.down();
await p.mouse.move(bx, by, { steps: 8 }); await p.mouse.up();
await p.waitForTimeout(200);

// place two CT and one T marker
await p.click('.tt-roster .pawn:nth-child(1)');           // CT 1
let [c1x, c1y] = at(0.4, 0.5); await p.mouse.click(c1x, c1y); await p.waitForTimeout(150);
await p.click('.tt-roster .pawn:nth-child(2)');           // CT 2
let [c2x, c2y] = at(0.47, 0.55); await p.mouse.click(c2x, c2y); await p.waitForTimeout(150);
await p.click('.tt-roster .pawn:nth-child(6)');           // T 1
let [t1x, t1y] = at(0.6, 0.62); await p.mouse.click(t1x, t1y); await p.waitForTimeout(200);

await p.screenshot({ path: S + '/t_drawn.png' });
const counts = async () => p.evaluate(() => ({
  strokes: document.querySelectorAll('.tactics-layer path[stroke]:not([stroke="transparent"])').length,
  markers: document.querySelectorAll('.tactic-marker').length,
}));
console.log('after draw:', JSON.stringify(await counts()));

// undo once
await p.click('.tactics-toolbar button[title="復原"]');
await p.waitForTimeout(300);
console.log('after undo:', JSON.stringify(await counts()));

// persistence: reload
await p.reload({ waitUntil: 'domcontentloaded' });
await p.waitForTimeout(1400);
await p.click('.panel-toggle:has-text("戰術板")');
await p.waitForTimeout(600);
console.log('after reload:', JSON.stringify(await counts()));
await p.screenshot({ path: S + '/t_reload.png' });
await b.close();
console.log('OK');
