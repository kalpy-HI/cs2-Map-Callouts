import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const [img, jsonFile, mapKey, out] = process.argv.slice(2);
const W=860,H=860;
const data=JSON.parse(readFileSync(jsonFile,'utf8'))[mapKey];
const src=`data:image/png;base64,${readFileSync(img).toString('base64')}`;
let dots='';
for (const c of data){
  dots+=`<ellipse cx="${c.x}" cy="${c.y}" rx="${c.rx}" ry="${c.ry}" fill="#ff2d5540" stroke="#ff2d55" stroke-width="0.002"/>`;
  dots+=`<text x="${c.x}" y="${c.y-c.ry-0.006}" fill="#00ff88" font-size="0.018" text-anchor="middle" paint-order="stroke" stroke="#000" stroke-width="0.006">${c.name}</text>`;
}
const html=`<!doctype html><body style="margin:0;background:#000"><div style="position:relative;width:${W}px;height:${H}px">
<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%"/>
<svg viewBox="0 0 1 1" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${dots}</svg>
</div></body>`;
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:W,height:H}});
await p.setContent(html); await p.waitForTimeout(250);
await p.screenshot({path:out}); await b.close();
console.log('wrote',out);
