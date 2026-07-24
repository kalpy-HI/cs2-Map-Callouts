import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4187/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
await p.screenshot({path:'scratch/collapsed.png'});   // default collapsed, big map
await p.click('.panel-toggle');
await p.waitForTimeout(400);
await p.screenshot({path:'scratch/expanded.png'});     // panel open
await b.close();
console.log('done');
