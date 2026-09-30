// lekcja-polowy.js — lesson 4 „Po i za": the dial in two
// halves — right „po", left „za" (colours --sam-po / --sam-za, as in the level 3 tutorial); at 12 „pełna godzina",
// at 6 „wpół do". The child moves the minute hand, the half it stands on (or 12 / 6) lights up; under the clock „dziesięć po".
// Registered in LEKCJE in index.html (its styles are there too); preview: sim.html?app=index.html%3Flekcja%3D4.
// Uses globals from index.html: h, noweSvg, styl, RAMA, log, MINUTY, Zegar (tarcza.js).
"use strict";

let tPolowy = 10;   // start: „dziesięć po"; kept when the clock look changes

// minutes (0…55) → what lights up: 'po' right half · 'za' left · '12' · '6'
const polowyGdzie = m => m === 0 ? '12' : m < 30 ? 'po' : m === 30 ? '6' : 'za';

function lekcjaPolowy(box) {
  box.append(h('p', 'wstep cichy', 'Na prawej połowie mówimy „po”, na lewej — „za”.'),
    h('p', 'wstep', 'Przesuń <b class="m">wskazówkę minutową (dłuższą)</b>.'));
  const gora = h('div', 'polowy-gora'),
        zaEl = h('span', 'za', 'za'), g12 = h('span', null, 'pełna godzina'), poEl = h('span', 'po', 'po');
  gora.append(zaEl, g12, poEl);
  const miejsce = h('div', 'karta-zegar'), svg = noweSvg('duzy');
  miejsce.append(svg);
  const g6 = h('p', 'polowy-6', 'wpół do'), napisK = h('p', 'napis-karty');
  box.append(gora, miejsce, g6, napisK);

  Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t: tPolowy, tylko: 'm',
    zmiana(nt, puszczone) { tPolowy = nt; pokaz(nt, puszczone); } });
  // the two halves right above the dial background (ticks and digits stay on top), like the sector in lekcja-uplyw.js
  const tlo = svg.querySelector('.s-tlo, .m-tlo, .k-tlo');
  const polowa = (cls, d) => { const p = document.createElementNS(tlo.namespaceURI, 'path'); p.setAttribute('class', cls); p.setAttribute('d', d); return p; };
  const po = polowa('polowa-po', 'M100 100 L100 14 A86 86 0 0 1 100 186 Z'),
        za = polowa('polowa-za', 'M100 100 L100 186 A86 86 0 0 1 100 14 Z');
  tlo.after(po, za);

  let ost = -1;
  function pokaz(tt, puszczone) {
    const m = Math.round(tt / 5) * 5 % 60, gdzie = polowyGdzie(m);
    if (puszczone) log(`połowy: ${m} min — ${MINUTY[m / 5]}`);
    if (m === ost) return;
    ost = m;
    napisK.innerHTML = `<span class="m">${MINUTY[m / 5]}</span>`;
    [[po, 'po'], [poEl, 'po'], [za, 'za'], [zaEl, 'za'], [g12, '12'], [g6, '6']]
      .forEach(([e, k]) => e.classList.toggle('swieci', k === gdzie));
  }
  pokaz(tPolowy);
}
