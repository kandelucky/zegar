// lekcja-uplyw.js — lekcja 6 „Upływ czasu" (podręcznik s. 16): wskazówka minutowa przesuwa się o 10 i 20 minut,
// przykład z Kubą (13:45 → 14:05, 15 + 5 = 20 minut).
// Wpisana w LEKCJE w index.html (tam też style „lekcja 6"); podgląd: sim.html?app=index.html%3Flekcja%3D6.
// Korzysta z globalnych z index.html: h, noweSvg, styl, RAMA, log, Zegar (tarcza.js).
"use strict";

let tUplyw = 8 * 60 + 15;   // start jak pierwszy zegar w podręczniku (od 3 do 5); zostaje przy zmianie wyglądu
const T_KUBA = 1 * 60 + 45; // 13:45

// zielony wycinek od minuty m0, długości ile minut (jak sektor w tarcza.js, ale od dowolnej minuty)
function uplywWycinek(m0, ile) {
  if (ile < 0.1) return '';
  const r = 86, p = m => { const a = m * 6 * Math.PI / 180; return `${100 + r * Math.sin(a)} ${100 - r * Math.cos(a)}`; };
  return `M100 100 L${p(m0)} A${r} ${r} 0 ${ile > 30 ? 1 : 0} 1 ${p(m0 + ile)} Z`;
}

// zegar lekcji z wycinkiem zaraz nad tłem tarczy (kreski i cyfry zostają na wierzchu)
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
    // wskazówki idą od t0 o ile minut, zielone rośnie za minutową; gotowe() na końcu
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

// 8:15 — godzina i minuty w kolorach wskazówek, w jednym kawałku (bez odstępu z flex gap)
function uplywCzas(t) {
  const tt = ((Math.round(t) % 720) + 720) % 720;
  return `<span><span class="g">${Math.floor(tt / 60) || 12}</span>:<span class="m">${String(tt % 60).padStart(2, '0')}</span></span>`;
}

function lekcjaUplyw(box) {
  // 1. +10 / +20 minut na zegarze
  box.append(h('p', 'wstep cichy', 'Jak wyobrazić sobie upływ czasu? Patrz, jak się poruszają wskazówki zegara.'),
    h('p', 'wstep', 'Naciśnij <b>+10 min</b> albo <b>+20 min</b> i patrz na <b class="m">wskazówkę minutową</b>.'));
  const miejsce = h('div', 'karta-zegar');
  box.append(miejsce);
  const przyciski = h('div', 'flex gap-3 justify-center'),
        napis = h('p', 'napis-karty uplyw-napis'), minelo = h('p', 'uplyw');
  box.append(przyciski, napis, minelo);

  const zegar = uplywZegar(miejsce, tUplyw, {
    zmiana(nt, puszczone) {                  // przeciąganie: bez zielonego, tylko godzina
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

  // 2. Przykład: Kuba, dwa sposoby
  const przyklad = h('div', 'rada przyklad',
    '<span class="znak">Przykład</span>' +
    '<p>Kuba przyszedł na przystanek o <b>13:45</b>. Jego autobus odjeżdża o <b>14:05</b>. Jak długo Kuba będzie czekał na autobus?</p>' +
    '<p><b>Sposób 1.</b> Wyobraźmy sobie zegar wskazówkowy ustawiony na 13:45. Przesuwamy wskazówkę minutową na pięć po drugiej.</p>');
  const zp = h('div', 'przyklad-zegar');
  przyklad.append(zp);
  const kuba = uplywZegar(zp, T_KUBA, {});
  kuba.svg.style.pointerEvents = 'none';     // tylko do pokazu — nie da się go przestawić
  const pokazB = h('button', 'btn btn-outline', 'Przesuń wskazówkę'),
        odczyt = h('p', 'przyklad-odczyt', 'Odczytujemy, że od 13:45 do 14:05 upływa <b>20 minut</b>.');
  odczyt.style.visibility = 'hidden';        // miejsce zostaje — nic nie skacze
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
  // quiz z podręcznika („Jest 13:45…") — nie tu: zadania będą osobno (Lasha)
}
