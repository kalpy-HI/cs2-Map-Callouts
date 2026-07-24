import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4194/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(600);
await p.screenshot({path:'scratch/default_state.png'}); // check panel open by default

const stage = await p.$('.map-stage');
const box = await stage.boundingBox();
const cx = box.x + box.width*0.52, cy = box.y + box.height*0.44; // 中路 area mirage

await p.mouse.move(cx, cy);
for (let i=0;i<10;i++){ await p.mouse.wheel(0,-120); await p.waitForTimeout(30); }
await p.waitForTimeout(300);
await p.screenshot({path:'scratch/zoom_crisp_check.png'});

await b.close();
console.log('done');
