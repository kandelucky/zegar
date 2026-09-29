// lekcja-polowy.js — lekcja 4 „Po i za" (Lasha 28.09, jak lekcja „წუთია და აკლია" w Zegar-ka): tarcza na dwie
// połowy — prawa „po", lewa „za" (kolory --sam-po / --sam-za, jak w samouczku poziomu 3); przy 12 „pełna godzina",
// przy 6 „wpół do". Dziecko przesuwa minutową, świeci połowa (albo 12 / 6), na której stoi; pod zegarem „dziesięć po".
// Wpisana w LEKCJE w index.html (tam też style „Po i za"); podgląd: sim.html?app=index.html%3Flekcja%3D4.
// Korzysta z globalnych z index.html: h, noweSvg, styl, RAMA, log, MINUTY, Zegar (tarcza.js).
"use strict";

let tPolowy = 10;   // start: „dziesięć po"; zostaje przy zmianie wyglądu

// minuty (0…55) → co świeci: 'po' prawa połowa · 'za' lewa · '12' · '6'
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
  // dwie połowy zaraz nad tłem tarczy (kreski i cyfry zostają na wierzchu), jak wycinek w lekcja-uplyw.js
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
