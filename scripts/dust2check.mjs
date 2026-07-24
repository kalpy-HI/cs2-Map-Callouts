import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4191/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(400);
// switch to Dust II (2nd map card)
await p.click('.icon-toggle');
await p.waitForTimeout(300);
await p.click('.map-card:nth-child(3)'); // h2 + card1(mirage) + card2(dust2)
await p.waitForTimeout(500);
await p.screenshot({path:'scratch/dust2_live.png'});
await b.close();
console.log('done');
