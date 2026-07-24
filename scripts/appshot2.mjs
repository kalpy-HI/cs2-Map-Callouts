import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4186/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(500);
// toggle "顯示報點名稱"
await p.click('.toggle input');
await p.waitForTimeout(300);
await p.screenshot({path:'scratch/mirage_labels.png'});
// switch to Dust II (3rd child: h2 + card1 + card2)
await p.click('.map-card:nth-child(3)');
await p.waitForTimeout(400);
// toggle again (was reset? no, showLabels is app-level state, persists)
await p.screenshot({path:'scratch/dust2_labels.png'});
await b.close();
console.log('done');
