// Render og.png (1200×630) from copy.json + the watt bars. Run with any node_modules that has sharp:
//   NODE_PATH=/path/to/node_modules node og.mjs
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const copy = JSON.parse(fs.readFileSync(new URL('./copy.json', import.meta.url)));
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// wrap h1 into lines of ~22 chars
const words = copy.h1.split(' '); const lines = []; let cur = '';
for (const w of words) { if ((cur + ' ' + w).trim().length > 15) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
lines.push(cur.trim());

const bars = [['Vornado, medium', 1125], ['Radiant panel', 150], ['Rubber floor mat', 120], ['Heated desk mat', 95], ['Heated vest', 12], ['Wool arm warmers', 0]];
const X0 = 640, W = 500;
const barSvg = bars.map(([l, w], i) => {
  const y = 150 + i * 70;
  const bw = Math.max(3, w / 1125 * W);
  return `<text x="${X0}" y="${y}" font-family="Helvetica, Arial" font-size="22" fill="#6a645a">${l} · ${w} W</text>
  <rect x="${X0}" y="${y + 10}" width="${W}" height="22" fill="#ebe4d7"/>
  <rect x="${X0}" y="${y + 10}" width="${bw}" height="22" fill="${i ? '#c4501b' : '#1b1a17'}"/>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f5f1ea"/>
  <rect y="618" width="1200" height="12" fill="#c4501b"/>
  <text x="60" y="90" font-family="Helvetica, Arial" font-size="22" letter-spacing="3" fill="#6a645a">A SHOPPING LOOKBOOK</text>
  ${lines.map((l, i) => `<text x="60" y="${200 + i * 74}" font-family="Georgia, serif" font-weight="bold" font-size="62" fill="#1b1a17">${esc(l)}</text>`).join('')}
  <text x="60" y="560" font-family="Helvetica, Arial" font-size="24" fill="#6a645a">drewhoover.com/warm-desk-lookbook</text>
  ${barSvg}
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(new URL('./og.png', import.meta.url).pathname);
console.log('wrote og.png');
