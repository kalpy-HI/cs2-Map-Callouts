import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4192/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(400);
await p.click('.icon-toggle');
await p.waitForTimeout(300);
await p.click('.map-card:nth-child(3)');
await p.waitForTimeout(500);

const result = await p.evaluate(() => {
  const stage = document.querySelector('.map-stage').getBoundingClientRect();
  const img = document.querySelector('.map-stage img').getBoundingClientRect();
  const circles = [...document.querySelectorAll('.overlay circle, .overlay polygon')];
  const out = [];
  for (const c of circles) {
    const title = c.querySelector('title')?.textContent || '';
    const r = c.getBoundingClientRect();
    const cx = r.x + r.width/2, cy = r.y + r.height/2;
    out.push({
      title,
      relStage: [(cx-stage.x)/stage.width, (cy-stage.y)/stage.height],
      relImg: [(cx-img.x)/img.width, (cy-img.y)/img.height],
    });
  }
  return { stage, img, out };
});
console.log(JSON.stringify(result, null, 1));
await b.close();
