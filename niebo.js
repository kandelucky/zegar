// niebo.js — pasek nieba nad zegarem (Lasha 27.09: „როდის ხდება მოქმედება უნდა იყოს უფრო ცხადი. საათის ზევით უნდა
// იყოს ანიმაცია ან მზის ან მთავრის ამოსვლის" → plan „კი").
//
//   const n = Niebo(box);   — rysuje w box (div) svg 320 × 90
//   n.ustaw(tm)             — tm: minuty od północy (0…1439, może być z ułamkiem), od razu
//   n.jedz(tm, ms)          — płynnie przez ms, najkrótszą drogą po dobie (najwyżej 12 h); ustaw() przerywa jazdę
//
// Słońce idzie po łuku: wschodzi o 6:00 z lewej, o 12:00 stoi najwyżej, zachodzi o 18:00 z prawej;
// księżyc tak samo od 18:00 do 6:00. Kolor nieba, ziemi i gwiazdy idą za godziną (KLATKI niżej).
(function () {
  "use strict";
  const NS = 'http://www.w3.org/2000/svg';
  const W = 320, H = 90, HORYZONT = 80, LUK = 60;
  // [minuta, niebo u góry, niebo przy ziemi, ziemia, gwiazdy 0…1]; pomiędzy klatkami — płynnie
  const KLATKI = [
    [0,    '#0b1633', '#1c2d5a', '#1f3a2c', 1],
    [300,  '#0b1633', '#1c2d5a', '#1f3a2c', 1],    //  5:00 jeszcze noc
    [360,  '#6d8fd0', '#f6b59b', '#4f7a4a', 0],    //  6:00 wschód: różowo przy ziemi
    [480,  '#5aa8e6', '#cde9f8', '#6fae5c', 0],    //  8:00 dzień
    [1020, '#4d9fe3', '#c4e4f8', '#6fae5c', 0],    // 17:00
    [1080, '#5b6cb3', '#f7a15f', '#4f7a4a', 0],    // 18:00 zachód: pomarańczowo
    [1170, '#1f2c63', '#6d4a85', '#2a4636', .7],   // 19:30 zmierzch
    [1260, '#0b1633', '#1c2d5a', '#1f3a2c', 1],    // 21:00 noc
    [1440, '#0b1633', '#1c2d5a', '#1f3a2c', 1]
  ];
  const GWIAZDY = [[22, 14], [56, 34], [90, 10], [128, 28], [166, 12], [204, 38], [236, 16], [270, 32], [300, 11],
                   [148, 50], [38, 56], [286, 56]];
  let ile = 0;   // każde niebo ma swoje id w defs

  function el(parent, tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    parent.appendChild(e);
    return e;
  }
  const rgb = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const miesz = (a, b, q) => { const x = rgb(a), y = rgb(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * q))})`; };
  // f: 0 = wschód (lewo, horyzont), .5 = najwyżej, 1 = zachód (prawo); poza 0…1 — pod ziemią
  const luk = f => [24 + f * (W - 48), HORYZONT - Math.sin(f * Math.PI) * LUK];

  function Niebo(box) {
    const nr = ++ile;
    const svg = el(box, 'svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' });
    const defs = el(svg, 'defs');
    const grad = el(defs, 'linearGradient', { id: `niebo-kolor-${nr}`, x1: 0, y1: 0, x2: 0, y2: 1 });
    const gora = el(grad, 'stop', { offset: 0 }), dol = el(grad, 'stop', { offset: 1 });
    const sierp = el(defs, 'mask', { id: `niebo-sierp-${nr}` });
    el(sierp, 'circle', { r: 10, fill: '#fff' });
    el(sierp, 'circle', { cx: 5, cy: -4, r: 9, fill: '#000' });

    el(svg, 'rect', { width: W, height: H, fill: `url(#niebo-kolor-${nr})` });
    const gwiazdy = el(svg, 'g', { fill: '#fff' });
    GWIAZDY.forEach(([x, y], i) => el(gwiazdy, 'circle', { cx: x, cy: y, r: i % 3 ? 1.1 : 1.7 }));
    const slonce = el(svg, 'g');
    el(slonce, 'circle', { r: 17, fill: '#ffd54a', opacity: .35 });
    el(slonce, 'circle', { r: 11, fill: '#ffd54a' });
    const ksiezyc = el(svg, 'g');
    el(ksiezyc, 'circle', { r: 10, fill: '#f3efd6', mask: `url(#niebo-sierp-${nr})` });
    // ziemia na wierzchu: słońce i księżyc chowają się za nią
    const ziemia = el(svg, 'path', { d: 'M0 79 Q40 73 80 77 T160 76 T240 78 T320 75 V90 H0 Z' });

    let teraz = 0, jazda = 0;
    function rysuj(tm) {
      teraz = tm = ((tm % 1440) + 1440) % 1440;
      let i = 0;
      while (tm >= KLATKI[i + 1][0]) i++;
      const a = KLATKI[i], b = KLATKI[i + 1], q = (tm - a[0]) / (b[0] - a[0]);
      gora.setAttribute('stop-color', miesz(a[1], b[1], q));
      dol.setAttribute('stop-color', miesz(a[2], b[2], q));
      ziemia.setAttribute('fill', miesz(a[3], b[3], q));
      gwiazdy.setAttribute('opacity', a[4] + (b[4] - a[4]) * q);
      const [sx, sy] = luk((tm - 360) / 720);
      const [kx, ky] = luk(((tm - 1080 + 1440) % 1440) / 720);
      slonce.setAttribute('transform', `translate(${sx} ${sy})`);
      ksiezyc.setAttribute('transform', `translate(${kx} ${ky})`);
    }

    return {
      ustaw(tm) { jazda++; rysuj(tm); },
      jedz(tm, ms) {
        const nr = ++jazda, od = teraz, d = ((tm - od) % 1440 + 2160) % 1440 - 720, start = performance.now();
        (function krok(n) {
          if (nr !== jazda) return;
          const q = Math.min(1, (n - start) / ms), e = q < .5 ? 4 * q * q * q : 1 - Math.pow(2 - 2 * q, 3) / 2;
          rysuj(od + d * e);
          if (q < 1) requestAnimationFrame(krok);
        })(start);
      }
    };
  }

  window.Niebo = Niebo;
})();
