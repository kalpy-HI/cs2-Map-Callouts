import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4190/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
await p.screenshot({path:'scratch/z_default.png'});   // default: labels shown, big map

const stage = await p.$('.map-stage');
const box = await stage.boundingBox();
const cx = box.x + box.width*0.83, cy = box.y + box.height*0.4; // near A點 area (mirage)

// zoom in via wheel at that point (several ticks)
await p.mouse.move(cx, cy);
for (let i=0;i<8;i++){
  await p.mouse.wheel(0, -120);
  await p.waitForTimeout(30);
}
await p.waitForTimeout(200);
await p.screenshot({path:'scratch/z_zoomed.png'});

// drag pan
await p.mouse.move(cx, cy);
await p.mouse.down();
await p.mouse.move(cx-150, cy-100, {steps:10});
await p.mouse.up();
await p.waitForTimeout(200);
await p.screenshot({path:'scratch/z_panned.png'});

// reset via button
await p.click('.zoom-controls .reset');
await p.waitForTimeout(200);
await p.screenshot({path:'scratch/z_reset.png'});

// zoom in via + button a few times
for (let i=0;i<3;i++){ await p.click('.zoom-controls button:nth-child(1)'); await p.waitForTimeout(100);}
await p.screenshot({path:'scratch/z_button_zoom.png'});

await b.close();
console.log('done');
