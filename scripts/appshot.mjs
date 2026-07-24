import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser=await chromium.launch({executablePath:CHROME});
const page=await browser.newPage({viewport:{width:1400,height:900}});
await page.goto('http://localhost:4185/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await page.waitForTimeout(600);
await page.screenshot({path:'scratch/app_dust2.png'});
// hover a callout on Dust2 (A大 area) by moving over its circle
const stage=await page.$('.map-stage');
const box=await stage.boundingBox();
// A大 at ~ (0.86,0.40) of image box
await page.mouse.move(box.x+box.width*0.86, box.y+box.height*0.40);
await page.waitForTimeout(300);
await page.screenshot({path:'scratch/app_dust2_hover.png'});
// switch to Mirage (first map card)
await page.click('.map-card:nth-child(2)');
await page.waitForTimeout(500);
await page.screenshot({path:'scratch/app_mirage.png'});
await browser.close();
console.log('done');
