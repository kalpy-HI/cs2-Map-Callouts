import { chromium } from 'playwright-core';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const S=process.env.SCR;
const b=await chromium.launch({executablePath:CHROME});
const p=await b.newPage({viewport:{width:1400,height:900}});
await p.goto('http://localhost:4200/cs2-Map-Callouts/',{waitUntil:'networkidle'});
await p.waitForTimeout(700);
await p.screenshot({path:S+'/m_sidebar_icons.png'});
// card order: h2, mirage, dust2, inferno, nuke, ancient, train, anubis
const pick = async (n, name) => {
  const open = await p.$('.app:not(.sidebar-open)');
  if (open) { await p.click('.icon-toggle'); await p.waitForTimeout(350); }
  await p.click(`.map-card:nth-child(${n})`);
  await p.waitForTimeout(800);
  await p.screenshot({path:`${S}/m_${name}.png`});
};
await pick(5, 'ancient');
await pick(4, 'nuke_upper');
// switch nuke level
await p.click('.level-controls button:nth-child(2)');
await p.waitForTimeout(700);
await p.screenshot({path:S+'/m_nuke_lower.png'});
await pick(3, 'inferno');
await pick(7, 'anubis');
await b.close(); console.log('done');
