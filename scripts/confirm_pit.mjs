import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4196/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
// sidebar is open by default now; click Dust II card
await p.click('.map-card:nth-child(3)');
await p.waitForTimeout(500);
// zoom into pit region for a clear close-up
const stage = await p.$('.map-stage');
let box = await stage.boundingBox();
const cx = box.x + box.width*0.86, cy = box.y + box.height*0.60;
await p.mouse.move(cx, cy);
for (let i=0;i<7;i++){ await p.mouse.wheel(0,-120); await p.waitForTimeout(30); }
await p.waitForTimeout(300);
// hover exactly on a-pit-platform circle to highlight it
box = await stage.boundingBox();
await p.mouse.move(box.x+box.width*0.5, box.y+box.height*0.4);
await p.waitForTimeout(200);
await p.screenshot({path:'scratch/confirm_pit_platform.png'});
await b.close();
console.log('done');
