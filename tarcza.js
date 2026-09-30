// tarcza.js — the clock dial in several versions, and dragging the hands.
//
//   const z = Zegar(svg, { styl, cyfry, rama, t, zmiana });
//     styl  : 'szkolny' | 'minimalny' | 'klasyczny'
//     cyfry : 'zwykle' | 'minuty' | 'brak' | 'cztery' | 'rzymskie'
//     rama  : '' | '1' | '2' | '3' — a case around the dial (RAMY below)
//     t     : minutes from 12:00 (0…719)
//     zmiana: (t, puszczone) => … — on every move; puszczone = true once the hand has snapped to the step
//     krok  : 5 (default) | 1 — how many minutes the minute hand snaps to when released
//     tylko : '' | 'g' | 'm' — a lesson about one hand: 'g' = only the hour hand moves, the minute hand stays
//             on 12, snaps to full hours; 'm' = only the minute hand, the hour hand is hidden
//     godzinowa: tm — the hour hand stays fixed at tm (0…719), only the minute hand moves
//             (as in the textbook's „Dorysuj wskazówkę minutową"); tylko is then ignored
//     chwyt : 'm' — the minute hand is always the one grabbed, the hour hand shows and follows it (Ćwiczenia, level 8)
//     osobno: true — independent hands, each moves on its own (Ćwiczenia, level 10 „Ustaw"); the hour hand snaps every 5 minutes
//             (2.5°), so it also stops between the numbers; zmiana(t, puszczone, tg) — tg = where the hour hand is (0…719)
//     sektor: true — the minutes since the full hour are marked in green (as in the textbook)
//     popo  : true — afternoon
//     po13  : true — in the afternoon (popo) the digits are 13 … 23 instead of 1 … 11, 12 stays at the top (index.html
//             gives this only to Arabic digits: zwykle, minuty)
//     oba   : true — at every number 1 … 12 a small 13 … 24 on the inside (like the clocks at school)
//   z.ustaw(t, tg) — sets the hands from outside (without calling zmiana); tg — osobno: the hour hand elsewhere (default t)
//   z.jedz(t, ms, koniec) — like ustaw, but the hands travel there over ms, each the shortest way; then koniec()
//   z.popo(b)  — switches the half of the day without a rebuild (also works mid-drag)
//   z.cyfry(c) — changes the digits without a rebuild: 'zwykle' | 'cztery' | 'brak' | 'rzymskie' (for a clock built with all 12,
//             not 'minuty' — that one has a different scale); the level 10 tutorial
//   z.osobno(b) — turns osobno on / off without a rebuild (the hour hand returns to t); the level 10 tutorial
//
// Sound (dzwieki.js, if it is on the page): tik when the dragged hand passes a number; zatrzask once it has snapped.
// Colours and fonts: tarcza.css. Everything is drawn in viewBox 0 0 200 200, centre 100,100.
(function () {
  "use strict";
  const NS = 'http://www.w3.org/2000/svg';
  const RZYM = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  function el(parent, tag, attrs, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    parent.appendChild(e);
    return e;
  }
  const pol = (r, deg) => { const a = deg * Math.PI / 180; return [100 + r * Math.sin(a), 100 - r * Math.cos(a)]; };
  function kreska(g, deg, r1, r2, cls, w) {
    const [x1, y1] = pol(r1, deg), [x2, y2] = pol(r2, deg);
    el(g, 'line', { x1, y1, x2, y2, class: cls, 'stroke-width': w });
  }
  // the label at hour h (1…12), or null when this version has none; na13 = 13 … 23 right now (po13 and afternoon)
  function etykieta(h, cyfry, na13) {
    if (cyfry === 'brak') return null;
    if (cyfry === 'cztery' && h % 3) return null;
    if (cyfry === 'rzymskie') return RZYM[h % 12];
    return String(na13 && h < 12 ? h + 12 : h);   // 12 stays at the top
  }
  // returns [[h, <text>], …] — for z.popo() and z.cyfry()
  function cyfry12(g, cyfry, r, cls, po) {
    const liczby = [];
    for (let h = 1; h <= 12; h++) {
      const lab = etykieta(h, cyfry, po);
      if (!lab) continue;
      const [x, y] = pol(r, h * 30);
      liczby.push([h, el(g, 'text', { x, y, class: cls + (cyfry === 'rzymskie' ? ' rz' : '') }, lab)]);
    }
    return liczby;
  }

  // Each style draws the dial and returns the two hand groups (rotated around 100,100).
  const STYLE = {
    // as in the textbook: minute dots, digits in the colour of the hour hand
    szkolny(g, cyfry, po) {
      el(g, 'circle', { cx: 100, cy: 100, r: 92, class: 's-tlo' });
      for (let i = 0; i < 60; i++) {
        const [x, y] = pol(84, i * 6);
        el(g, 'circle', { cx: x, cy: y, r: i % 5 ? 1.1 : 2.3, class: 's-kropka' });
      }
      const liczby = cyfry12(g, cyfry, 69, 's-cyfra', po);
      const godz = el(g, 'g', {}), min = el(g, 'g', {});
      el(godz, 'line', { x1: 100, y1: 110, x2: 100, y2: 54, class: 'w-godz', 'stroke-width': 8 });
      el(min, 'line', { x1: 100, y1: 114, x2: 100, y2: 22, class: 'w-min', 'stroke-width': 5 });
      el(g, 'circle', { cx: 100, cy: 100, r: 5, class: 'os' });
      el(g, 'circle', { cx: 100, cy: 100, r: 1.8, class: 'os2' });
      return { godz, min, liczby };
    },
    // a plain wall clock without colours: thin outline, a tick every minute,
    // a small square every 5 minutes, big plain digits, black hands
    minimalny(g, cyfry, po) {
      el(g, 'circle', { cx: 100, cy: 100, r: 92, class: 'm-tlo' });
      for (let i = 0; i < 60; i++) {
        if (i % 5) { kreska(g, i * 6, 84, 88.5, 'm-kreska', 0.9); continue; }
        el(g, 'rect', { x: 98.4, y: 13.5, width: 3.2, height: 4, class: 'm-znak', transform: `rotate(${i * 6} 100 100)` });
      }
      const liczby = cyfry12(g, cyfry, 70, 'm-cyfra', po);
      const godz = el(g, 'g', {}), min = el(g, 'g', {});
      el(godz, 'path', { class: 'm-wsk', d: 'M97.3 108 L102.7 108 L101.8 54 L98.2 54 Z' });
      el(min, 'path', { class: 'm-wsk', d: 'M97.9 110 L102.1 110 L101.2 22 L98.8 22 Z' });
      el(g, 'circle', { cx: 100, cy: 100, r: 4.2, class: 'os' });
      el(g, 'circle', { cx: 100, cy: 100, r: 1.5, class: 'os2' });
      return { godz, min, liczby };
    },
    // a wall clock: double outline, a "railway track" of minutes, serif digits, hands with an arrowhead
    klasyczny(g, cyfry, po) {
      el(g, 'circle', { cx: 100, cy: 100, r: 92, class: 'k-tlo' });
      el(g, 'circle', { cx: 100, cy: 100, r: 87.5, class: 'k-linia', 'stroke-width': 0.8 });
      el(g, 'circle', { cx: 100, cy: 100, r: 84, class: 'k-linia', 'stroke-width': 0.6 });
      el(g, 'circle', { cx: 100, cy: 100, r: 78, class: 'k-linia', 'stroke-width': 0.6 });
      for (let i = 0; i < 60; i++) kreska(g, i * 6, i % 5 ? 78 : 74, 84, 'k-kreska', i % 5 ? 0.8 : 2.4);
      const liczby = cyfry12(g, cyfry, 63, 'k-cyfra', po);
      const godz = el(g, 'g', {}), min = el(g, 'g', {});
      el(godz, 'path', { class: 'k-wsk', d: 'M98.2 110 L101.8 110 L101.3 70 C105.5 66 105.5 59 100 52 C94.5 59 94.5 66 98.7 70 Z' });
      el(min, 'path', { class: 'k-wsk', d: 'M98.5 115 L101.5 115 L100.8 34 L100 20 L99.2 34 Z' });
      el(g, 'circle', { cx: 100, cy: 100, r: 4.5, class: 'os' });
      el(g, 'circle', { cx: 100, cy: 100, r: 1.6, class: 'os2' });
      return { godz, min, liczby };
    }
  };

  // Frames (the case) around the dial, between r 92 and 99 — the dial stays inside without an outline of its own.
  let nrFiltra = 0;
  const kolo = (p, r, cls, w, extra) => el(p, 'circle', Object.assign({ cx: 100, cy: 100, r, class: cls, 'stroke-width': w || 0 }, extra));
  const RAMY = {
    // 1: a thin black rim with a barely visible line on the inside
    '1'(svg) {
      kolo(svg, 93.5, 'r-tlo');
      kolo(svg, 96, 'r-obr', 6);
      kolo(svg, 92.6, 'r-cien', 0.7);
    },
    // 2: two thin lines
    '2'(svg) {
      kolo(svg, 99, 'r-tlo');
      kolo(svg, 98.4, 'r-obr', 1.2);
      kolo(svg, 95.2, 'r-obr', 1.2);
    },
    // 3: a light case with a soft shadow
    '3'(svg) {
      const id = 'rama-cien-' + (++nrFiltra);
      const f = el(el(svg, 'defs', {}), 'filter', { id, x: '-15%', y: '-15%', width: '130%', height: '130%' });
      el(f, 'feDropShadow', { dx: 0, dy: 1.5, stdDeviation: 1.6, 'flood-opacity': 0.3 });
      kolo(svg, 95.5, 'r-obud', 7, { filter: `url(#${id})` });
      kolo(svg, 92, 'r-tlo');                // covers the shadow on the inside; the minute labels get the dial background too
      kolo(svg, 99, 'r-cien', 0.6);
      kolo(svg, 92, 'r-cien', 0.8);
    }
  };

  // the sector from 12 to the angle deg (clockwise)
  function wycinek(r, deg) {
    if (deg < 0.5) return '';
    const [x0, y0] = pol(r, 0), [x1, y1] = pol(r, deg);
    return `M100 100 L${x0} ${y0} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
  }

  function Zegar(svg, o) {
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.classList.add('zegar');
    if (o.rama) { svg.classList.add('z-rama'); RAMY[o.rama](svg); }
    // with a frame and minute labels the whole thing is a little smaller, so the labels stay off the frame
    const w = o.rama && o.cyfry === 'minuty' ? 0.93 : 1;
    const g0 = el(svg, 'g', { transform: `translate(100 100) scale(${w}) translate(-100 -100)` });
    // with minutes: a smaller dial, the labels 00…55 outside it (as in the textbook)
    const k = (o.cyfry === 'minuty' ? 0.82 : 1) * w;
    const g = el(g0, 'g', { transform: `translate(100 100) scale(${k / w}) translate(-100 -100)` });
    const { godz, min, liczby } = STYLE[o.styl](g, o.cyfry, !!o.po13 && !!o.popo);
    if (o.oba) for (let h = 1; h <= 12; h++) {     // small 13 … 24 nearer the centre, under the big number (Szkolny only — index.html)
      const [x, y] = pol(52, h * 30);
      el(g, 'text', { x, y, class: 's-cyfra24' }, String(h + 12));
    }
    const stoi = o.godzinowa;
    const tylko = stoi != null ? 'm' : o.tylko || '';
    if (tylko === 'm' && stoi == null) godz.style.display = 'none';
    // the sector sits right above the dial background — ticks and digits stay on top
    const sektor = o.sektor ? g.insertBefore(document.createElementNS(NS, 'path'), g.firstChild.nextSibling) : null;
    if (sektor) sektor.setAttribute('class', 'sektor');
    if (o.cyfry === 'minuty') {
      for (let m = 0; m < 60; m += 5) {
        const [x, y] = pol(89, m * 6);
        el(g0, 'text', { x, y, class: o.styl.charAt(0) + '-min' }, String(m).padStart(2, '0'));
      }
    }

    let t = o.t || 0, chwyt = null;
    let tg = t, osobno = !!o.osobno;         // osobno: the hour hand has its own position
    const zmiana = o.zmiana || function () {};

    // katy = what is on screen now — jedz() starts from here, also from the middle of a previous run
    let katy = null, jazda = 0;
    function obroc(aG, aM) {
      katy = { g: aG, m: aM };
      godz.setAttribute('transform', `rotate(${aG} 100 100)`);
      min.setAttribute('transform', `rotate(${aM} 100 100)`);
      if (sektor) sektor.setAttribute('d', wycinek(86, ((aM % 360) + 360) % 360));
    }
    const katG = tt => (stoi != null ? stoi : osobno ? tg : tt) / 2;
    const katM = tt => tylko === 'g' ? 0 : (tt % 60) * 6;

    function rysuj() {
      const tt = ((t % 720) + 720) % 720;
      obroc(katG(tt), katM(tt));
    }

    function punkt(e) {
      const r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 200 - 100;
      const y = (e.clientY - r.top) / r.height * 200 - 100;
      return { a: (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360, d: Math.hypot(x, y) };
    }
    const roznica = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };

    function przesun(p) {
      if (p.d < 8) return;                   // right at the axis the angle is unreliable
      const co = chwyt === 'm' ? 5 : 60, ile = () => Math.floor((osobno && chwyt === 'g' ? tg : t) / co);
      const przed = ile();
      if (chwyt === 'm') {
        let d = p.a / 6 - t % 60;
        if (d > 30) d -= 60;
        if (d < -30) d += 60;
        t = (t + d + 720) % 720;             // the minute hand pulls the hour hand along (not with osobno)
      } else if (osobno) {
        tg = p.a * 2;
      } else {
        t = p.a * 2;
      }
      if (ile() !== przed && window.Dzwiek) Dzwiek.tik();   // the dragged hand passed a number
      rysuj();
      zmiana(t, false, tg);
    }

    svg.addEventListener('pointerdown', e => {
      const p = punkt(e);
      if (p.d > 98) return;
      const aG = (osobno ? tg : t % 720) / 2, aM = (t % 60) * 6;
      // in the middle of the dial the hand closer to the finger is grabbed; further out always the minute hand
      chwyt = tylko || o.chwyt || ((p.d < 60 * k && roznica(p.a, aG) < roznica(p.a, aM)) ? 'g' : 'm');
      svg.setPointerCapture(e.pointerId);
      svg.classList.add('ciagnie');
      przesun(p);
    });
    svg.addEventListener('pointermove', e => { if (chwyt) przesun(punkt(e)); });

    function pusc() {
      if (!chwyt) return;
      const godzinowa = osobno && chwyt === 'g';   // osobno: only the released hand snaps
      chwyt = null;
      svg.classList.remove('ciagnie');
      const co = tylko === 'g' ? 60 : (o.krok || 5);
      const od = godzinowa ? tg : t, cel = Math.round(od / co) * co, start = performance.now();
      (function krok(n) {
        if (chwyt) return;
        const q = Math.min(1, (n - start) / 150);
        let v = od + (cel - od) * q;
        if (q === 1) { v = cel % 720; if (window.Dzwiek) Dzwiek.zatrzask(); }
        if (godzinowa) tg = v; else t = v;
        rysuj();
        zmiana(t, q === 1, tg);
        if (q < 1) requestAnimationFrame(krok);
      })(start);
    }
    svg.addEventListener('pointerup', pusc);
    svg.addEventListener('pointercancel', pusc);

    // the labels at the numbers — only the ones that were built (liczby)
    let na13 = !!o.po13 && !!o.popo, cyfry = o.cyfry;
    const napisy = () => liczby.forEach(([h, e]) => {
      e.textContent = etykieta(h, cyfry, na13) || '';
      e.classList.toggle('rz', cyfry === 'rzymskie');
    });

    rysuj();
    return {
      ustaw(nt, ng = nt) { if (!chwyt) { jazda++; t = nt; tg = ng; rysuj(); } },
      // the hands travel smoothly to nt, each its own shortest way (🎲 random time); at the end zatrzask and koniec().
      // Grabbing a hand interrupts the run — koniec() then never comes (zmiana says where the hand is anyway).
      jedz(nt, ms, koniec) {
        if (chwyt) return;
        const nr = ++jazda, od = katy, start = performance.now();
        tg = nt;                             // osobno: both travel to nt
        const droga = (a, b) => ((b - a) % 360 + 540) % 360 - 180;   // from a to b the shortest way, −180…180
        const dG = droga(od.g, katG(nt)), dM = droga(od.m, katM(nt));
        t = nt;
        (function krok(n) {
          if (chwyt || nr !== jazda) return;
          const q = Math.min(1, (n - start) / ms), e = q < .5 ? 4 * q * q * q : 1 - Math.pow(2 - 2 * q, 3) / 2;
          if (q === 1) {
            rysuj();
            if (window.Dzwiek) Dzwiek.zatrzask();
            if (koniec) koniec();
            return;
          }
          obroc(od.g + dG * e, od.m + dM * e);
          requestAnimationFrame(krok);
        })(start);
      },
      popo(po) { na13 = !!o.po13 && po; napisy(); },
      cyfry(c) { cyfry = c; napisy(); },
      osobno(b) { osobno = !!b; tg = t; rysuj(); }
    };
  }

  window.Zegar = Zegar;
})();
