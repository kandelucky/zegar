// lekcja-uplyw.js — lesson 6 „Upływ czasu" (textbook p. 16): the minute hand moves by 10 and 20 minutes,
// the example with Kuba (13:45 → 14:05, 15 + 5 = 20 minutes).
// Registered in LEKCJE in index.html (its styles are there too); preview: sim.html?app=index.html%3Flekcja%3D6.
// Uses globals from index.html: h, noweSvg, styl, RAMA, log, Zegar (tarcza.js).
"use strict";

let tUplyw = 8 * 60 + 15;   // start as the first clock in the textbook (from 3 to 5); kept when the clock look changes
const T_KUBA = 1 * 60 + 45; // 13:45

// green sector from minute m0, ile minutes long (like the sector in tarcza.js, but from any minute)
function uplywWycinek(m0, ile) {
  if (ile < 0.1) return '';
  const r = 86, p = m => { const a = m * 6 * Math.PI / 180; return `${100 + r * Math.sin(a)} ${100 - r * Math.cos(a)}`; };
  return `M100 100 L${p(m0)} A${r} ${r} 0 ${ile > 30 ? 1 : 0} 1 ${p(m0 + ile)} Z`;
}

// the lesson's clock with the sector right above the dial background (ticks and digits stay on top)
function uplywZegar(miejsce, t, opcje) {
  const svg = noweSvg('duzy');
  miejsce.append(svg);
  const z = Zegar(svg, Object.assign({ styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t }, opcje));
  const tlo = svg.querySelector('.s-tlo, .m-tlo, .k-tlo');
  const klin = document.createElementNS(tlo.namespaceURI, 'path');
  klin.setAttribute('class', 'sektor');
  tlo.after(klin);
  let anim = 0;
  return {
    svg,
    stop() { cancelAnimationFrame(anim); klin.setAttribute('d', ''); },
    // the hands move from t0 by ile minutes, the green grows behind the minute hand; gotowe() at the end
    przesun(t0, ile, gotowe) {
      cancelAnimationFrame(anim);
      const start = performance.now(), dl = ile * 80;
      const krok = n => {
        const q = Math.min(1, (n - start) / dl), e = q < .5 ? 2 * q * q : 1 - (2 - 2 * q) ** 2 / 2;
        z.ustaw(q < 1 ? t0 + ile * e : (t0 + ile) % 720);
        klin.setAttribute('d', uplywWycinek(t0 % 60, ile * e));
        if (q < 1) anim = requestAnimationFrame(krok); else gotowe();
      };
      anim = requestAnimationFrame(krok);
    }
  };
}

// 8:15 — hour and minutes in the hands' colours, in one piece (so the flex gap puts no space inside)
function uplywCzas(t) {
  const tt = ((Math.round(t) % 720) + 720) % 720;
  return `<span><span class="g">${Math.floor(tt / 60) || 12}</span>:<span class="m">${String(tt % 60).padStart(2, '0')}</span></span>`;
}

function lekcjaUplyw(box) {
  // 1. +10 / +20 minutes on the clock
  box.append(h('p', 'wstep cichy', 'Jak wyobrazić sobie upływ czasu? Patrz, jak się poruszają wskazówki zegara.'),
    h('p', 'wstep', 'Naciśnij <b>+10 min</b> albo <b>+20 min</b> i patrz na <b class="m">wskazówkę minutową</b>.'));
  const miejsce = h('div', 'karta-zegar');
  box.append(miejsce);
  const przyciski = h('div', 'flex gap-3 justify-center'),
        napis = h('p', 'napis-karty uplyw-napis'), minelo = h('p', 'uplyw');
  box.append(przyciski, napis, minelo);

  const zegar = uplywZegar(miejsce, tUplyw, {
    zmiana(nt, puszczone) {                  // dragging: no green, only the time
      zegar.stop();
      tUplyw = nt % 720;
      napis.innerHTML = uplywCzas(Math.round(nt / 5) * 5);
      minelo.textContent = '';
      if (puszczone) log(`upływ: ustawione ${napis.textContent}`);
    }
  });
  [10, 20].forEach(n => {
    const b = h('button', 'btn btn-outline w-32', `+${n} min`);
    b.onclick = () => {
      const t0 = tUplyw;
      tUplyw = (t0 + n) % 720;
      napis.innerHTML = uplywCzas(t0) + '<small>→</small>' + uplywCzas(t0 + n);
      minelo.textContent = '';
      zegar.przesun(t0, n, () => { minelo.textContent = `Minęło ${n} minut.`; });
      log(`upływ: +${n} min — ${napis.textContent}`);
    };
    przyciski.append(b);
  });
  napis.innerHTML = uplywCzas(tUplyw);

  // 2. the example: Kuba, two ways
  const przyklad = h('div', 'rada przyklad',
    '<span class="znak">Przykład</span>' +
    '<p>Kuba przyszedł na przystanek o <b>13:45</b>. Jego autobus odjeżdża o <b>14:05</b>. Jak długo Kuba będzie czekał na autobus?</p>' +
    '<p><b>Sposób 1.</b> Wyobraźmy sobie zegar wskazówkowy ustawiony na 13:45. Przesuwamy wskazówkę minutową na pięć po drugiej.</p>');
  const zp = h('div', 'przyklad-zegar');
  przyklad.append(zp);
  const kuba = uplywZegar(zp, T_KUBA, {});
  kuba.svg.style.pointerEvents = 'none';     // for show only — it cannot be moved
  const pokazB = h('button', 'btn btn-outline', 'Przesuń wskazówkę'),
        odczyt = h('p', 'przyklad-odczyt', 'Odczytujemy, że od 13:45 do 14:05 upływa <b>20 minut</b>.');
  odczyt.style.visibility = 'hidden';        // the room stays — nothing jumps
  pokazB.onclick = () => {
    odczyt.style.visibility = 'hidden';
    kuba.przesun(T_KUBA, 20, () => { odczyt.style.visibility = ''; pokazB.textContent = 'Jeszcze raz'; });
    log('przykład: 13:45 → 14:05 = 20 minut');
  };
  przyklad.append(pokazB, odczyt,
    h('p', '', '<b>Sposób 2.</b> Skorzystajmy z cyfrowego zapisu godzin.'),
    h('p', 'sposob2', '13:45<small>15 minut →</small>14:00<small>5 minut →</small>14:05'),
    h('p', 'suma', '15 minut + 5 minut = 20 minut'),
    h('p', '', '<b>Odp.</b> Kuba będzie czekał na autobus 20 minut.'));
  box.append(przyklad);
  // the textbook quiz („Jest 13:45…") — not here: the tasks will live separately
}
