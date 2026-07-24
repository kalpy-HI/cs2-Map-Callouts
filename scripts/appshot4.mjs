import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4188/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
await p.screenshot({path:'scratch/both_collapsed.png'});
// open sidebar
await p.click('.icon-toggle');
await p.waitForTimeout(350);
await p.screenshot({path:'scratch/sidebar_open.png'});
// also open panel
await p.click('.panel-toggle:not(.icon-toggle)');
await p.waitForTimeout(350);
await p.screenshot({path:'scratch/both_open.png'});
// pick a map -> sidebar should auto close
await p.click('.map-card:nth-child(2)');
await p.waitForTimeout(350);
await p.screenshot({path:'scratch/after_pick.png'});
// mobile viewport check
await p.setViewportSize({width:390,height:800});
await p.reload({waitUntil:'networkidle'});
await p.waitForTimeout(400);
await p.screenshot({path:'scratch/mobile_collapsed.png'});
await p.click('.icon-toggle');
await p.waitForTimeout(350);
await p.screenshot({path:'scratch/mobile_sidebar_open.png'});
await b.close();
console.log('done');
