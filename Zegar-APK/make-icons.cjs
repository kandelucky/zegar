// make-icons.cjs — draws the launcher icon and the splash screens into android/app/src/main/res.
// Run from Zegar-APK: node make-icons.cjs   (after `npx cap add android`, which brings the default images)
const fs = require('fs'), path = require('path'), sharp = require('sharp');

const RES = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
const TLO = '#5b8c5a';     // icon background: primary of the default theme (szkola-krem)
const KREM = '#f7f1e4';    // base-100 of the default theme

// The szkolny dial from tarcza.js (viewBox 0 0 200 200), simplified for small sizes:
// hour dots only, no digits, thicker hands. Shows 10:10.
function tarcza() {
  let kropki = '';
  for (let h = 0; h < 12; h++) {
    const a = h * 30 * Math.PI / 180;
    kropki += `<circle cx="${(100 + 76 * Math.sin(a)).toFixed(2)}" cy="${(100 - 76 * Math.cos(a)).toFixed(2)}" r="${h % 3 ? 4 : 6}" fill="#3d3830" fill-opacity=".55"/>`;
  }
  return `<circle cx="100" cy="100" r="92" fill="${KREM}" stroke="#96b7de" stroke-width="7"/>${kropki}
    <line x1="100" y1="112" x2="100" y2="52" stroke="#e0452b" stroke-width="12" stroke-linecap="round" transform="rotate(305 100 100)"/>
    <line x1="100" y1="116" x2="100" y2="38" stroke="#1f6fd6" stroke-width="8" stroke-linecap="round" transform="rotate(60 100 100)"/>
    <circle cx="100" cy="100" r="8" fill="#3d3830"/><circle cx="100" cy="100" r="3" fill="${KREM}"/>`;
}

// canvas w × h, the dial `d` wide in its centre, `tlo` drawn under it
function svg(w, h, d, tlo) {
  const s = d / 200;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${tlo}
    <g transform="translate(${(w - d) / 2} ${(h - d) / 2}) scale(${s})">${tarcza()}</g></svg>`);
}

const png = (buf, plik) => sharp(buf).png().toFile(path.join(RES, plik));

(async () => {
  // dp sizes are for mdpi; the adaptive foreground is 108 dp with a 66 dp safe circle
  for (const [dpi, k] of [['mdpi', 1], ['hdpi', 1.5], ['xhdpi', 2], ['xxhdpi', 3], ['xxxhdpi', 4]]) {
    const n = 48 * k, f = 108 * k;
    await png(svg(f, f, f * 0.56, ''), `mipmap-${dpi}/ic_launcher_foreground.png`);
    await png(svg(n, n, n * 0.8, `<rect width="${n}" height="${n}" rx="${n * 0.22}" fill="${TLO}"/>`), `mipmap-${dpi}/ic_launcher.png`);
    await png(svg(n, n, n * 0.8, `<circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="${TLO}"/>`), `mipmap-${dpi}/ic_launcher_round.png`);
  }
  fs.writeFileSync(path.join(RES, 'values', 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${TLO}</color>\n</resources>\n`);

  // every splash.png Capacitor generated is redrawn at its own size
  for (const kat of fs.readdirSync(RES).filter(k => k.startsWith('drawable'))) {
    const plik = path.join(RES, kat, 'splash.png');
    if (!fs.existsSync(plik)) continue;
    const { width: w, height: h } = await sharp(plik).metadata();
    const buf = await sharp(svg(w, h, Math.min(w, h) * 0.4, `<rect width="${w}" height="${h}" fill="${KREM}"/>`)).png().toBuffer();
    fs.writeFileSync(plik, buf);
  }
  await sharp(svg(1024, 1024, 820, `<rect width="1024" height="1024" rx="225" fill="${TLO}"/>`)).png().toFile(path.join(__dirname, 'icon-preview.png'));
  console.log('icons + splash written');
})();
