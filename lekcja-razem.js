// lekcja-razem.js — lekcja 5 „Godzina i minuty": obie wskazówki, jedna godzina na kilka sposobów
// (podręcznik s. 15: „20 minut po ósmej"; s. 17 zad. 2: „za piętnaście szósta · piąta trzydzieści · 5:45").
// Wpisana w LEKCJE w index.html (tam też style „lekcja 5"); podgląd: sim.html?app=index.html%3Flekcja%3D5.
// Korzysta z globalnych z index.html: GODZ, GODZ_EJ, h, noweSvg, styl, RAMA, log, Zegar (tarcza.js).
"use strict";

// jak w podręczniku: „piętnaście po" / „za piętnaście", kwadrans tylko jako „albo"
const RAZEM_PO = { 5: 'pięć po', 10: 'dziesięć po', 15: 'piętnaście po', 20: 'dwadzieścia po', 25: 'dwadzieścia pięć po' };
const RAZEM_ZA = { 35: 'za dwadzieścia pięć', 40: 'za dwadzieścia', 45: 'za piętnaście', 50: 'za dziesięć', 55: 'za pięć' };
// „piąta trzydzieści" — godzina + minuty jak na zegarze cyfrowym
const RAZEM_LICZ = { 5: 'zero pięć', 10: 'dziesięć', 15: 'piętnaście', 20: 'dwadzieścia', 25: 'dwadzieścia pięć',
  30: 'trzydzieści', 35: 'trzydzieści pięć', 40: 'czterdzieści', 45: 'czterdzieści pięć', 50: 'pięćdziesiąt', 55: 'pięćdziesiąt pięć' };

let tRazem = 8 * 60 + 20;   // start: „20 minut po ósmej"; zostaje przy zmianie wyglądu

function lekcjaRazem(box) {
  box.append(h('p', 'wstep cichy', 'Krótsza wskazówka pokazuje godzinę, a dłuższa — minuty.'),
    h('p', 'wstep', 'Przesuń <b class="g">godzinową</b> albo <b class="m">minutową</b> wskazówkę.'));
  const miejsce = h('div', 'karta-zegar'), svg = noweSvg('duzy');
  miejsce.append(svg);
  const glowny = h('p', 'napis-karty razem-glowny'), albo = h('p', 'razem-albo'),
        slowa = h('p', 'razem-slowa'), cyfrowy = h('p', 'razem-cyfry');
  box.append(miejsce, glowny, albo, slowa, cyfrowy);

  let ost = -1;
  const pokaz = (tt, puszczone) => {
    const t5 = Math.round(tt / 5) * 5 % 720;
    const g = Math.floor(t5 / 60) % 12, m = t5 % 60, nast = (g + 1) % 12;   // g 0 = dwunasta
    const mm = String(m).padStart(2, '0');
    if (t5 !== ost) { ost = t5; napisz(g, m, nast, mm); }
    if (puszczone) log(`razem: ${g || 12}:${mm} — ${glowny.textContent} · ${slowa.textContent}`);
  };
  const napisz = (g, m, nast, mm) => {
    // 1. słowami, jak w podręczniku
    const [cm, cg] = m === 0 ? ['', GODZ[g]]
      : m < 30 ? [RAZEM_PO[m], GODZ_EJ[g]]
      : m === 30 ? ['wpół do', GODZ_EJ[nast]]
      : [RAZEM_ZA[m], GODZ[nast]];
    glowny.innerHTML = (cm ? `<span class="m">${cm}</span>` : '') + `<span class="g">${cg}</span>`;
    // 2. kwadrans — „inny sposób"; miejsce zostaje, żeby nic nie skakało pod palcem
    albo.textContent = m === 15 ? `albo: kwadrans po ${GODZ_EJ[g]}` : m === 45 ? `albo: za kwadrans ${GODZ[nast]}` : '';
    // 3. „piąta czterdzieści pięć" — przy pełnej godzinie pusto (to już jest wyżej)
    slowa.innerHTML = m ? `<span class="g">${GODZ[g]}</span> <span class="m">${RAZEM_LICZ[m]}</span>` : '';
    // 4. cyfrowo, obie godziny doby
    const [ga, gb] = g ? [g, g + 12] : [0, 12];
    const czas = gg => `<span><span class="g">${gg}</span>:<span class="m">${mm}</span></span>`;
    cyfrowy.innerHTML = czas(ga) + '<small>albo</small>' + czas(gb);
  };

  Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t: tRazem,
    zmiana(nt, puszczone) { tRazem = nt; pokaz(nt, puszczone); } });
  pokaz(tRazem);
}
