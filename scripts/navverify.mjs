import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const [img, mapKey, level, out] = process.argv.slice(2);
const W=860, H=860;
const all = JSON.parse(readFileSync(process.env.SCR+'/nav_places.json','utf8'))[mapKey];
const data = all.filter(p=>p.level===level);
const b64=readFileSync(img).toString('base64');
const src=`data:image/png;base64,${b64}`;
let dots='';
for (const c of data){
  const r=Math.max(0.022, Math.min(0.055, c.span/3));
  dots+=`<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="#ff2d5540" stroke="#ff2d55" stroke-width="0.002"/>`;
  dots+=`<text x="${c.x}" y="${c.y-r-0.006}" fill="#00ff88" font-size="0.018" text-anchor="middle" paint-order="stroke" stroke="#000" stroke-width="0.006">${c.name}</text>`;
}
const html=`<!doctype html><body style="margin:0;background:#000"><div style="position:relative;width:${W}px;height:${H}px">
<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%"/>
<svg viewBox="0 0 1 1" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${dots}</svg>
</div></body>`;
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:W,height:H}});
await p.setContent(html); await p.waitForTimeout(200);
await p.screenshot({path:out}); await b.close();
console.log('wrote',out);
