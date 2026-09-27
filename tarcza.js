// tarcza.js — tarcza zegara w kilku wersjach i przeciąganie wskazówek.
//
//   const z = Zegar(svg, { styl, cyfry, rama, t, zmiana });
//     styl  : 'szkolny' | 'minimalny' | 'klasyczny'
//     cyfry : 'zwykle' | 'minuty' | 'brak' | 'cztery' | 'rzymskie'
//     rama  : '' | '1' | '2' | '3' — obudowa wokół tarczy (RAMY niżej)
//     t     : minuty od 12:00 (0…719)
//     zmiana: (t, puszczone) => … — przy każdym ruchu; puszczone = true po dociągnięciu do kroku
//     krok  : 5 (domyślnie) | 1 — do ilu minut dociąga minutowa po puszczeniu
//     tylko : '' | 'g' | 'm' — lekcja o jednej wskazówce: 'g' = rusza się tylko godzinowa, minutowa stoi
//             na 12, dociąga do pełnych godzin; 'm' = tylko minutowa, godzinowej nie widać
//     godzinowa: tm — godzinowa stoi na stałe w tm (0…719), rusza się tylko minutowa
//             (jak w podręczniku „Dorysuj wskazówkę minutową"); tylko wtedy bez znaczenia
//     chwyt : 'm' — łapie się zawsze minutowa, godzinowa widać i jedzie za nią (Ćwiczenia, poziom 8)
//     osobno: true — wskazówki niezależne, każda chodzi sama (Ćwiczenia, poziom 10 „Ustaw"); godzinowa dociąga co 5 minut
//             (2,5°), więc staje też między liczbami; zmiana(t, puszczone, tg) — tg = gdzie stoi godzinowa (0…719)
//     sektor: true — minuty od pełnej godziny zaznaczone na zielono (jak w podręczniku)
//     popo  : true — po południu
//     po13  : true — po południu (popo) cyfry 13 … 23 zamiast 1 … 11, u góry zostaje 12 (index.html daje to tylko
//             cyfrom arabskim: zwykle, minuty)
//   z.ustaw(t) — ustawia wskazówki z zewnątrz (bez wywołania zmiana)
//   z.jedz(t, ms, koniec) — jak ustaw, ale wskazówki jadą tam przez ms, każda najkrótszą drogą; potem koniec()
//   z.popo(b)  — przełącza połowę doby bez przebudowy (działa też w trakcie przeciągania)
//
// Dźwięk (dzwieki.js, jeśli jest na stronie): tik, gdy ciągnięta wskazówka minie liczbę; zatrzask po dociągnięciu.
// Kolory i czcionki: tarcza.css. Wszystko rysowane w viewBox 0 0 200 200, środek 100,100.
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
  // napis przy godzinie h (1…12) albo null, gdy w tej wersji go nie ma; na13 = teraz 13 … 23 (po13 i po południu)
  function etykieta(h, cyfry, na13) {
    if (cyfry === 'brak') return null;
    if (cyfry === 'cztery' && h % 3) return null;
    if (cyfry === 'rzymskie') return RZYM[h % 12];
    return String(na13 && h < 12 ? h + 12 : h);   // u góry zostaje 12
  }
  // zwraca [[h, <text>], …] — do z.popo()
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

  // Każdy styl rysuje tarczę i zwraca dwie grupy wskazówek (obracane wokół 100,100).
  const STYLE = {
    // jak w podręczniku: kropki minut, cyfry w kolorze wskazówki godzinowej
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
    // zwykły zegar ścienny bez kolorów (wzór Lashy, 27.09): cienki obrys, kreska co minutę,
    // kwadracik co 5 minut, duże proste cyfry, czarne wskazówki
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
    // zegar ścienny: podwójny obrys, „tor kolejowy" minut, cyfry szeryfowe, wskazówki z grotem
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

  // Ramy (obudowa) wokół tarczy, między r 92 a 99 — tarcza zostaje w środku bez własnego obrysu.
  let nrFiltra = 0;
  const kolo = (p, r, cls, w, extra) => el(p, 'circle', Object.assign({ cx: 100, cy: 100, r, class: cls, 'stroke-width': w || 0 }, extra));
  const RAMY = {
    // 1: cienka czarna obręcz, jak na zdjęciu Lashy, z ledwo widoczną linią od środka
    '1'(svg) {
      kolo(svg, 93.5, 'r-tlo');
      kolo(svg, 96, 'r-obr', 6);
      kolo(svg, 92.6, 'r-cien', 0.7);
    },
    // 2: dwie cienkie linie
    '2'(svg) {
      kolo(svg, 99, 'r-tlo');
      kolo(svg, 98.4, 'r-obr', 1.2);
      kolo(svg, 95.2, 'r-obr', 1.2);
    },
    // 3: jasna obudowa z miękkim cieniem
    '3'(svg) {
      const id = 'rama-cien-' + (++nrFiltra);
      const f = el(el(svg, 'defs', {}), 'filter', { id, x: '-15%', y: '-15%', width: '130%', height: '130%' });
      el(f, 'feDropShadow', { dx: 0, dy: 1.5, stdDeviation: 1.6, 'flood-opacity': 0.3 });
      kolo(svg, 95.5, 'r-obud', 7, { filter: `url(#${id})` });
      kolo(svg, 92, 'r-tlo');                // przykrywa cień od środka; pod podpisami minut też tło tarczy
      kolo(svg, 99, 'r-cien', 0.6);
      kolo(svg, 92, 'r-cien', 0.8);
    }
  };

  // wycinek od 12 do kąta deg (zgodnie z ruchem wskazówek)
  function wycinek(r, deg) {
    if (deg < 0.5) return '';
    const [x0, y0] = pol(r, 0), [x1, y1] = pol(r, deg);
    return `M100 100 L${x0} ${y0} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
  }

  function Zegar(svg, o) {
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.classList.add('zegar');
    if (o.rama) { svg.classList.add('z-rama'); RAMY[o.rama](svg); }
    // z ramą i podpisami minut całość trochę mniejsza, żeby podpisy nie weszły na ramę
    const w = o.rama && o.cyfry === 'minuty' ? 0.93 : 1;
    const g0 = el(svg, 'g', { transform: `translate(100 100) scale(${w}) translate(-100 -100)` });
    // z minutami: tarcza mniejsza, podpisy 00…55 na zewnątrz (jak w podręczniku)
    const k = (o.cyfry === 'minuty' ? 0.82 : 1) * w;
    const g = el(g0, 'g', { transform: `translate(100 100) scale(${k / w}) translate(-100 -100)` });
    const { godz, min, liczby } = STYLE[o.styl](g, o.cyfry, !!o.po13 && !!o.popo);
    const stoi = o.godzinowa;
    const tylko = stoi != null ? 'm' : o.tylko || '';
    if (tylko === 'm' && stoi == null) godz.style.display = 'none';
    // sektor zaraz nad tłem tarczy — kreski i cyfry zostają na wierzchu
    const sektor = o.sektor ? g.insertBefore(document.createElementNS(NS, 'path'), g.firstChild.nextSibling) : null;
    if (sektor) sektor.setAttribute('class', 'sektor');
    if (o.cyfry === 'minuty') {
      for (let m = 0; m < 60; m += 5) {
        const [x, y] = pol(89, m * 6);
        el(g0, 'text', { x, y, class: o.styl.charAt(0) + '-min' }, String(m).padStart(2, '0'));
      }
    }

    let t = o.t || 0, chwyt = null;
    let tg = t;                              // osobno: godzinowa ma własne miejsce
    const zmiana = o.zmiana || function () {};

    // katy = to, co widać teraz — jedz() rusza stąd, także z połowy poprzedniej jazdy
    let katy = null, jazda = 0;
    function obroc(aG, aM) {
      katy = { g: aG, m: aM };
      godz.setAttribute('transform', `rotate(${aG} 100 100)`);
      min.setAttribute('transform', `rotate(${aM} 100 100)`);
      if (sektor) sektor.setAttribute('d', wycinek(86, ((aM % 360) + 360) % 360));
    }
    const katG = tt => (stoi != null ? stoi : o.osobno ? tg : tt) / 2;
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
      if (p.d < 8) return;                   // przy samej osi kąt jest niepewny
      const co = chwyt === 'm' ? 5 : 60, ile = () => Math.floor((o.osobno && chwyt === 'g' ? tg : t) / co);
      const przed = ile();
      if (chwyt === 'm') {
        let d = p.a / 6 - t % 60;
        if (d > 30) d -= 60;
        if (d < -30) d += 60;
        t = (t + d + 720) % 720;             // minutowa ciągnie za sobą godzinową (osobno — nie)
      } else if (o.osobno) {
        tg = p.a * 2;
      } else {
        t = p.a * 2;
      }
      if (ile() !== przed && window.Dzwiek) Dzwiek.tik();   // ciągnięta wskazówka minęła liczbę
      rysuj();
      zmiana(t, false, tg);
    }

    svg.addEventListener('pointerdown', e => {
      const p = punkt(e);
      if (p.d > 98) return;
      const aG = (o.osobno ? tg : t % 720) / 2, aM = (t % 60) * 6;
      // w środku tarczy łapie ta wskazówka, która jest bliżej palca; dalej zawsze minutowa
      chwyt = tylko || o.chwyt || ((p.d < 60 * k && roznica(p.a, aG) < roznica(p.a, aM)) ? 'g' : 'm');
      svg.setPointerCapture(e.pointerId);
      svg.classList.add('ciagnie');
      przesun(p);
    });
    svg.addEventListener('pointermove', e => { if (chwyt) przesun(punkt(e)); });

    function pusc() {
      if (!chwyt) return;
      const godzinowa = o.osobno && chwyt === 'g';   // osobno: dociąga się tylko puszczona wskazówka
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

    rysuj();
    return {
      ustaw(nt) { if (!chwyt) { jazda++; t = tg = nt; rysuj(); } },
      // wskazówki jadą płynnie do nt, każda swoją najkrótszą drogą (🎲 losowa godzina); na końcu zatrzask i koniec().
      // Złapana wskazówka przerywa jazdę — wtedy koniec() nie przychodzi (zmiana i tak mówi, gdzie jest).
      jedz(nt, ms, koniec) {
        if (chwyt) return;
        const nr = ++jazda, od = katy, start = performance.now();
        tg = nt;                             // osobno: obie jadą na nt
        const droga = (a, b) => ((b - a) % 360 + 540) % 360 - 180;   // z a do b najkrótszą drogą, −180…180
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
      popo(po) { liczby.forEach(([h, e]) => { e.textContent = etykieta(h, o.cyfry, !!o.po13 && po); }); }
    };
  }

  window.Zegar = Zegar;
})();
