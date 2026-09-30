// cwiczenia.js — Ćwiczenia: exercises, kept separate from the lessons (the lessons have no tasks).
// Poziom 1 — Godziny, as simple and mechanical as possible: only a digit and the hour hand — no 24 h, no voice.
// Two types, shuffled, round = 10:
//   Pokaż — the box says „Pokaż na zegarze: 05:00", the child sets the hour hand to 5; checked on release
//   Wybierz — the box says „Która godzina?", the hour hand points at a number, 3 hours to choose from under the clock
// The question box is above the clock, the answers below it.
// The hour is written as on a real clock — 05:00, not 5 — or as a word, „Piąta"; mixed 5 + 5 in a round.
// Wrong → the circle under the number (and the chosen button) goes red for a moment, the child keeps trying;
// right → green, and after a moment the next question comes by itself.
// Counter 3/10 in the header; at the end „Brawo!", how many on the first try („8 / 10"), „Następny poziom", „Jeszcze raz",
// „Poziomy" (the level list).
// Poziom 2 — Minuty (textbook p. 5, ex. 1a „Ile to minut po pełnej godzinie?"): only the minute hand, the hour hand
// is not shown; the dial has the plain 1…12, no 00…55 — that is exactly what the child is learning (7 → 35).
// The same two types: Pokaż „20 minut" · Wybierz „Ile minut?" + 20 · 35 · 50.
// Poziom 3 — Po i za (textbook p. 5, ex. 2): only the minute hand, as in 2, but named as in the book —
// pełna godzina · pięć po … wpół do … za pięć (MINUTY from index.html). Pokaż „za dziesięć" · Wybierz „Jak to powiesz?"
// + 3 names one under another; one wrong answer is always the mirror (9 → „za piętnaście", trap „piętnaście po").
// Poziom 4 — Co 15 minut (textbook p. 7, ex. 5b): both hands for the first time, only :00 :15 :30 :45,
// in digits „07:45" or as a sentence „Za piętnaście ósma" (mixed 5 + 5; sentences at 22 px — they do not fit at 32).
// Pokaż — the hour hand is already in place, only the minute hand is dragged. Wybierz — „Która godzina?", wrong answers:
// the neighbouring hour (3:30 → „Wpół do trzeciej" / 04:30) and the same hour, another quarter; no circle on the dial,
// only the button.
// Poziom 5 — Co 5 minut (textbook p. 5, ex. 3 · p. 7, ex. 5a): as 4, but any 5 minutes (no :00)
// and digits only. Wybierz: 08:35 · 09:35 (hour hand close to 9) · 08:07 (the number under the minute hand read literally).
// Poziom 6 — Słowami (textbook p. 7, ex. 5b · worksheet 1a): as 5, but sentences only.
// Wybierz: „Za pięć siódma" · „Za pięć szósta" (after „za" comes the NEXT hour) · „Pięć po szóstej" (mirror).
// Poziom 7 — Po południu (textbook p. 5, ex. 1b and 3): digits 13…23 and 00, no words.
// Pokaż „17:00" — hour hand on 5, as in 1. Wybierz — the box shows the time of day („Wieczorem"), clock 8:25 →
// 20:25 · 08:25 · 18:25.
// Poziom 8 — Wcześniej, później (textbook p. 6, ex. 4): the box says „Jest 14:05" + „10 minut wcześniej",
// ±10 / ±15 / ±20. Pokaż — the clock stands at 14:05, the minute hand is dragged, the hour hand follows.
// Wybierz — 13:55 · 14:15 · 14:55.
// Poziom 9 — Ile minut? (textbook p. 7, ex. 6 · worksheet 1b): the bridge 13:50 → 14:00 → 14:10 in three
// steps (+10 · +10 · total 20), a green wedge grows on the clock. No Pokaż; round = 5 examples.
// Poziom 10 — Mistrz (textbook p. 7, ex. 5 and 7 · Dobra rada): 4 × Ustaw „16:30" — both hands separately,
// the hour hand must stop between 4 and 5, „Sprawdź" · 3 × Wybierz on an unusual dial (12 · 3 · 6 · 9 / no digits /
// Roman) · 3 × a question from three different levels 4–9, exactly as in those levels.
// Bonus — Ponad godzinę: „Jest 08:20" + „Minęła 1 godzina i 25 minut", from 1 to 5 hours, one hour more every
// 2 questions. Pokaż — like Ustaw from level 10, but from 08:20 · Wybierz — 09:45 · 09:20 (hours only) · 08:45 (minutes only).
// In the app: Start → Ćwiczenia → level list, or ☰ → Poziom N (for checking: index.html?poziom=2).
// Preview without the app: sim.html?app=cwiczenia.html%3Fpoziom%3D2 (?typ=1|2 — one type only, ?styl=).
// Uses globals from index.html: NS, h, noweSvg, styl, RAMA, GODZ, GODZ_EJ, duza, MINUTY, pora, log, simScreen,
// uplywWycinek (lekcja-uplyw.js),
// Zegar (tarcza.js).
"use strict";

const CW_ILE = 10;          // questions per round
const CW_DALEJ_MS = 900;    // from a right answer to the next question
const CW_ZLE_MS = 700;      // how long the red circle stays lit

const cwLos = n => Math.floor(Math.random() * n);
function cwTasuj(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = cwLos(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// hour H (0 = twelve) in the form the question uses
const CW_FORMY = {
  cyfry: H => String(H || 12).padStart(2, '0') + ':00',
  slowa: H => duza(GODZ[H])
};

// question clock: the dial chosen in the menu, plain digits (as in the Godziny lesson); tylko — 'g' | 'm' (one hand) | '' (both);
// godzinowa — the hour hand stays fixed there, only the minute hand moves; chwyt 'm' — drag the minute hand, the hour hand follows
function cwZegar(miejsce, t, zmiana, tylko = 'g', godzinowa, chwyt) {
  const svg = noweSvg('duzy');
  miejsce.append(svg);
  Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t, tylko, godzinowa, chwyt, zmiana });
  return svg;
}

// circle under number H (0 = 12): green stays, red goes out; plus the right / wrong sound (dzwieki.js), unless cicho
function cwKolko(svg, H, dobrze, cicho) {
  if (window.Dzwiek && !cicho) Dzwiek.ocena(dobrze);
  const cyfra = svg.querySelectorAll('.s-cyfra, .m-cyfra, .k-cyfra')[(H + 11) % 12];
  const k = document.createElementNS(NS, 'circle');
  k.setAttribute('cx', cyfra.getAttribute('x'));
  k.setAttribute('cy', cyfra.getAttribute('y'));
  k.setAttribute('r', 15);
  k.setAttribute('class', 'cw-kolko ' + (dobrze ? 'dobrze' : 'zle'));
  cyfra.before(k);
  if (!dobrze) setTimeout(() => k.remove(), CW_ZLE_MS);
}

// Wybierz: 3 buttons under the clock — X and two random others from p.liczby (if the level has p.pulapka(X, forma) — one
// or two traps — they go first); naTarczy(x) — which number gets the circle (null — no circle)
function cwWybierz(p, svg, X, naTarczy, gotowe) {
  let bledy = 0;
  const pul = [].concat(p.pulapka ? p.pulapka(X, p.forma) : []).filter(x => x !== X);
  const inne = [...pul, ...cwTasuj(p.liczby.filter(x => x !== X && !pul.includes(x)))].slice(0, 2);
  const rzad = h('div', 'cw-wybor');
  cwTasuj([X, ...inne]).forEach(x => {
    const b = h('button', 'btn btn-lg', p.zapis(x));
    b.onclick = () => {
      if (naTarczy) cwKolko(svg, naTarczy(x), x === X);   // the dial shows where the chosen number is
      else if (window.Dzwiek) Dzwiek.ocena(x === X);      // no circle — sound only
      if (x !== X) {
        bledy++;
        b.classList.add('btn-error');
        setTimeout(() => b.classList.remove('btn-error'), CW_ZLE_MS);
        return;
      }
      b.classList.add('btn-success');
      rzad.style.pointerEvents = 'none';
      gotowe(bledy);
    };
    rzad.append(b);
  });
  p.cel.append(rzad);
}

// H = 0…11 (0 = twelve), minute hand always on 12; p.zapis(H) — 05:00 or „Piąta";
// p.pyt — the box above the clock, p.cel — the area below it; gotowe(bledy) — called after the right answer
const CW_GODZINY = [
  { nazwa: 'Pokaż', buduj(p, H, gotowe) {
      let start;
      do start = cwLos(12); while (start === H);
      p.pyt.append(h('small', null, 'Pokaż na zegarze:'), h('b', 'g', p.zapis(H)));
      let bledy = 0;
      const svg = cwZegar(p.zegar, start * 60, (nt, puszczone) => {
        if (!puszczone) return;
        const g = Math.round(nt / 60) % 12;
        cwKolko(svg, g, g === H);
        if (g !== H) { bledy++; return; }
        svg.style.pointerEvents = 'none';
        gotowe(bledy);
      });
  } },
  { nazwa: 'Wybierz', buduj(p, H, gotowe) {
      p.pyt.append(h('b', null, 'Która godzina?'));
      const svg = cwZegar(p.zegar, H * 60);
      svg.style.pointerEvents = 'none';          // display only
      cwWybierz(p, svg, H, x => x, gotowe);
  } }
];

// M = 5…55 — minutes (no 00: „0 minut" is not a question), p.zapis(M) = „35"; circle under number M / 5
const CW_MINUTY = [
  { nazwa: 'Pokaż', buduj(p, M, gotowe) {
      let start;
      do start = cwLos(12) * 5; while (start === M);
      p.pyt.append(h('small', null, 'Pokaż na zegarze:'), h('b', 'm', p.zapis(M) + ' minut'));
      let bledy = 0;
      const svg = cwZegar(p.zegar, start, (nt, puszczone) => {
        if (!puszczone) return;
        const m = Math.round(nt) % 60;
        cwKolko(svg, m / 5, m === M);
        if (m !== M) { bledy++; return; }
        svg.style.pointerEvents = 'none';
        gotowe(bledy);
      }, 'm');
  } },
  { nazwa: 'Wybierz', buduj(p, M, gotowe) {
      p.pyt.append(h('b', null, 'Ile minut?'));
      const svg = cwZegar(p.zegar, M, null, 'm');
      svg.style.pointerEvents = 'none';          // display only
      cwWybierz(p, svg, M, x => x / 5, gotowe);
  } }
];

// k = 0…11 — minute hand on number k (k × 5 minutes, 0 = full hour), p.zapis(k) = „za dziesięć"; circle under number k
const CW_PO_ZA = [
  { nazwa: 'Pokaż', buduj(p, k, gotowe) {
      let start;
      do start = cwLos(12); while (start === k);
      p.pyt.append(h('small', null, 'Pokaż na zegarze:'), h('b', 'm', p.zapis(k)));
      let bledy = 0;
      const svg = cwZegar(p.zegar, start * 5, (nt, puszczone) => {
        if (!puszczone) return;
        const m = Math.round(nt / 5) % 12;
        cwKolko(svg, m, m === k);
        if (m !== k) { bledy++; return; }
        svg.style.pointerEvents = 'none';
        gotowe(bledy);
      }, 'm');
  } },
  { nazwa: 'Wybierz', buduj(p, k, gotowe) {
      p.pyt.append(h('b', null, 'Jak to powiesz?'));
      const svg = cwZegar(p.zegar, k * 5, null, 'm');
      svg.style.pointerEvents = 'none';          // display only
      cwWybierz(p, svg, k, x => x, gotowe);
  } }
];

// tm = minutes from 12:00 (level 4 every 15, levels 5–6 every 5) — both hands; p.zapis(tm) = „07:45" or „Za piętnaście ósma"
const cwCyfry = tm => String(Math.floor(tm / 60) || 12).padStart(2, '0') + ':' + String(tm % 60).padStart(2, '0');
function cwZdanie(tm) {                          // minute names as in level 3 (MINUTY) — „piętnaście", not „kwadrans"
  const g = Math.floor(tm / 60) % 12, m = tm % 60, n = (g + 1) % 12;
  // po → this hour (pięć po szóstej) · wpół do → the next one, -ej form (wpół do siódmej) · za → the next one (za pięć siódma)
  return duza(m === 0 ? GODZ[g] : `${MINUTY[m / 5]} ${m < 30 ? GODZ_EJ[g] : m === 30 ? GODZ_EJ[n] : GODZ[n]}`);
}
const CW_OBIE = [
  { nazwa: 'Pokaż', buduj(p, tm, gotowe) {      // the hour hand is already right, the child drags only the minute hand
      const M = tm % 60;
      let start;
      do start = cwLos(12) * 5; while (start === M);
      p.pyt.append(h('small', null, 'Pokaż na zegarze:'), h('b', null, p.zapis(tm)));
      let bledy = 0;
      const svg = cwZegar(p.zegar, start, (nt, puszczone) => {
        if (!puszczone) return;
        const m = Math.round(nt) % 60;
        cwKolko(svg, m / 5, m === M);
        if (m !== M) { bledy++; return; }
        svg.style.pointerEvents = 'none';
        gotowe(bledy);
      }, 'm', tm);
  } },
  { nazwa: 'Wybierz', buduj(p, tm, gotowe) {
      p.pyt.append(h('b', null, 'Która godzina?'));
      const svg = cwZegar(p.zegar, tm, null, '');
      svg.style.pointerEvents = 'none';          // display only
      cwWybierz(p, svg, tm, null, gotowe);       // no circle: a trap has the same minutes
  } }
];

// T = minutes from midnight, hours 13…23 and 00 only (12:xx looks the same morning and afternoon); p.zapis(T) = „14:25"
const cwCyfry24 = T => String(Math.floor(T / 60)).padStart(2, '0') + ':' + String(T % 60).padStart(2, '0');
const CW_24 = [
  { nazwa: 'Pokaż', liczby: [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(H => H * 60),   // full hours
    buduj(p, T, gotowe) {                        // like Pokaż from level 1: „17:00" → hour hand on 5
      CW_GODZINY[0].buduj({ ...p, zapis: () => p.zapis(T) }, T / 60 % 12, gotowe);
  } },
  { nazwa: 'Wybierz', buduj(p, T, gotowe) {
      p.pyt.append(h('small', null, duza(pora(T))), h('b', null, 'Która godzina?'));
      const svg = cwZegar(p.zegar, T % 720, null, '');
      svg.style.pointerEvents = 'none';          // display only
      cwWybierz(p, svg, T, null, gotowe);
  } }
];

// X = { T, d }: it is T (minutes from midnight, 06:00 … 21:55), d = ±10 / ±15 / ±20 minutes; result T + d
const cwWynik = X => X.T + X.d;
const cwPrzez = X => Math.floor(cwWynik(X) / 60) !== Math.floor(X.T / 60);   // crosses a full hour
function cwLosujPrzesuniecie() {                 // about half of the questions cross a full hour
  const przez = Math.random() < .5;
  let X;
  do X = { T: 360 + cwLos(192) * 5, d: [10, 15, 20][cwLos(3)] * (cwLos(2) ? 1 : -1) };
  while (cwPrzez(X) !== przez);
  return X;
}
function cwRamkaPrzesuniecia(p, X) {
  p.pyt.append(h('small', null, `Jest ${cwCyfry24(X.T)}`),
               h('b', null, `${Math.abs(X.d)} minut ${X.d > 0 ? 'później' : 'wcześniej'}`));
}
const CW_PRZESUN = [
  { nazwa: 'Pokaż', buduj(p, X, gotowe) {       // minute hand from T to T + d, the hour hand follows
      cwRamkaPrzesuniecia(p, X);
      const cel = cwWynik(X) % 720;
      let bledy = 0;
      const svg = cwZegar(p.zegar, X.T % 720, (nt, puszczone) => {
        if (!puszczone) return;
        const t = Math.round(nt) % 720;
        cwKolko(svg, t % 60 / 5, t === cel);
        if (t !== cel) { bledy++; return; }
        svg.style.pointerEvents = 'none';
        gotowe(bledy);
      }, '', undefined, 'm');
  } },
  { nazwa: 'Wybierz', buduj(p, X, gotowe) {
      cwRamkaPrzesuniecia(p, X);
      const svg = cwZegar(p.zegar, X.T % 720, null, '');
      svg.style.pointerEvents = 'none';          // display only
      const R = cwWynik(X), zn = Math.sign(X.d);
      // 14:05 − 10 → 14:15 (wrong direction) · 14:55 (hour not changed); no crossing: 08:30 + 10 → 08:20 · 08:45 (one number too far)
      const pulapka = () => [X.T - X.d, cwPrzez(X) ? R - 60 * zn : R + 5 * zn];
      cwWybierz({ ...p, zapis: cwCyfry24, pulapka, liczby: [] }, svg, R, null, gotowe);
  } }
];

// X = { T, a, b }: from T (06:50 … 22:55) a minutes to the full hour, then b more; a + b ≤ 55
function cwLosujMost() {
  let a, b;
  do { a = 5 * (1 + cwLos(10)); b = 5 * (1 + cwLos(10)); } while (a + b > 55);
  return { T: (6 + cwLos(17)) * 60 + 60 - a, a, b };
}
// level 9 clock (display only): dalej(ile) — the hands move forward, the green wedge from T grows behind the minute hand
// (as in lesson 6; uplywWycinek from lekcja-uplyw.js)
function cwZegarUplyw(miejsce, T) {
  const svg = noweSvg('duzy');
  miejsce.append(svg);
  svg.style.pointerEvents = 'none';
  const z = Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t: T % 720, tylko: '' });
  const klin = document.createElementNS(NS, 'path');
  klin.setAttribute('class', 'sektor');
  svg.querySelector('.s-tlo, .m-tlo, .k-tlo').after(klin);
  let juz = 0;                                   // minutes from T already shown
  return function dalej(ile) {
    const od = juz, start = performance.now();
    juz += ile;
    (function krok(n) {
      const q = Math.min(1, (n - start) / (ile * 80)), e = q < .5 ? 2 * q * q : 1 - (2 - 2 * q) ** 2 / 2;
      z.ustaw((T + od + ile * e) % 720);
      klin.setAttribute('d', uplywWycinek(T % 60, od + ile * e));
      if (q < 1) requestAnimationFrame(krok);
    })(start);
  };
}
// bridge under the clock (level 9 and its tutorial): 13:50 → 14:00 → 14:10, the jumps above the arrows, the total below
function cwMost(T, a, b) {
  const m = { el: h('div', 'cw-most'), skoki: [h('span', 'skok s1'), h('span', 'skok s2')], razem: h('span', 'razem'),
              czasy: [T, T + a, T + a + b].map((x, i) => h('span', `czas c${i + 1}`, cwCyfry24(x))),
              strz: [h('span', 'strz a1', '→'), h('span', 'strz a2', '→')] };
  m.el.append(...m.skoki, m.czasy[0], m.strz[0], m.czasy[1], m.strz[1], m.czasy[2], m.razem);
  return m;
}
// Oblicz: the textbook bridge (p. 7, ex. 6) 13:50 → 14:00 → 14:10; three steps, 3 buttons each:
// jump to the full hour · jump onward · total. Wrong answers: ① the minutes read literally (50) · 5 too many;
// ② the other side (50) · 5 fewer; ③ subtracting as plain numbers (1410 − 1350 = 60) · minutes only (50 − 10 = 40)
const CW_MOST = [
  { nazwa: 'Oblicz', buduj(p, X, gotowe) {
      const { T, a, b } = X, m1 = T % 60;
      p.pyt.append(h('b', null, 'Ile minut upłynie?'));
      const dalej = cwZegarUplyw(p.zegar, T);
      const { el: most, skoki, razem } = cwMost(T, a, b);
      const odp = h('div');
      p.cel.append(most, odp);
      const kroki = [
        { el: skoki[0], ok: a, zle: [m1, a + 5], pisz: x => `+${x} min` },
        { el: skoki[1], ok: b, zle: [60 - b, b > 5 ? b - 5 : b + 5], pisz: x => `+${x} min` },
        { el: razem, ok: a + b, zle: [a + b + 40, Math.abs(b - m1)], pisz: x => `razem: ${x} min` }
      ];
      let bledy = 0;
      (function krok(i) {
        const k = kroki[i];
        k.el.innerHTML = k.pisz('<b>?</b>');
        k.el.classList.add('teraz');
        odp.textContent = '';
        const zle = [...new Set(k.zle)].filter(x => x > 0 && x !== k.ok);
        cwWybierz({ cel: odp, zapis: String, pulapka: () => zle, liczby: Array.from({ length: 11 }, (_, j) => (j + 1) * 5) },
                  null, k.ok, null, bl => {
          bledy += bl;
          k.el.innerHTML = k.pisz(`<b>${k.ok}</b>`);
          k.el.classList.replace('teraz', 'zrobione');
          if (i < 2) { dalej(i ? b : a); setTimeout(() => krok(i + 1), CW_DALEJ_MS); }
          else gotowe(bledy);
        });
      })(0);
  } }
];

// Ustaw (level 10): T = minutes from midnight, any 5 minutes except :00 („16:30", as in the textbook 08:10 · 20:15).
// The hands move separately (tarcza.js: osobno), the „Sprawdź" button checks: minute hand exactly on T % 60, hour hand
// anywhere between H and H + 1, as long as it is not on a number (Dobra rada, p. 7). Wrong → a red circle at each wrong hand
// (hour hand — under the nearest number); right → the hour hand travels to its exact place.
const CW_USTAW = { nazwa: 'Ustaw', liczby: Array.from({ length: 288 }, (_, i) => i * 5).filter(T => T % 60), zapis: cwCyfry24,
  buduj(p, T, gotowe) {
    const H = Math.floor(T / 60) % 12, M = T % 60;
    let start;                                   // a real time, but a different hour and different minutes than T
    do start = cwLos(144) * 5; while (Math.floor(start / 60) === H || start % 60 === M);
    p.pyt.append(h('small', null, 'Ustaw'), h('b', null, p.zapis(T)));
    cwUstaw(p, start, T, gotowe);
} };
// Ustaw clock (level 10, bonus): hands begin at start (0…719) and move separately, „Sprawdź" under the clock; target T (not :00)
function cwUstaw(p, start, T, gotowe) {
    const H = Math.floor(T / 60) % 12, M = T % 60;
    let m = start % 60, g = start, bledy = 0;
    const svg = noweSvg('duzy');
    p.zegar.append(svg);
    const z = Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t: start, osobno: true,
                           zmiana: (nt, puszczone, ng) => { if (puszczone) { m = Math.round(nt) % 60; g = ng; } } });
    const b = h('button', 'btn btn-primary btn-lg cw-sprawdz', 'Sprawdź');
    b.onclick = () => {
      const mDobrze = m === M, gDobrze = g > H * 60 && g < H * 60 + 60;
      if (window.Dzwiek) Dzwiek.ocena(mDobrze && gDobrze);
      if (!mDobrze || !gDobrze) {
        bledy++;
        if (!mDobrze) cwKolko(svg, m / 5, false, true);
        if (!gDobrze) cwKolko(svg, Math.round(g / 60) % 12, false, true);
        b.classList.replace('btn-primary', 'btn-error');
        setTimeout(() => b.classList.replace('btn-error', 'btn-primary'), CW_ZLE_MS);
        return;
      }
      b.classList.replace('btn-primary', 'btn-success');
      svg.style.pointerEvents = b.style.pointerEvents = 'none';
      z.jedz(T % 720, 400);                      // hour hand to its exact place, the minute hand is already there
      gotowe(bledy);
    };
    p.cel.append(b);
}

// Wybierz on an unusual dial (level 10): only 12 · 3 · 6 · 9 / no digits / Roman (tarcza.js has them), each once per round.
// The rest as in level 5: any 5 minutes except :00, in digits, wrong answers 09:35 · 08:07, no circle
const CW_NIETYPOWE = ['cztery', 'brak', 'rzymskie'].map(cyfry => ({ nazwa: 'Wybierz', zapis: cwCyfry,
  losuj: () => { const l = CW_POZIOMY[4].liczby; return l[cwLos(l.length)]; },
  buduj(p, tm, gotowe) {
    p.pyt.append(h('b', null, 'Która godzina?'));
    const svg = noweSvg('duzy');
    p.zegar.append(svg);
    svg.style.pointerEvents = 'none';            // display only
    Zegar(svg, { styl, cyfry, rama: RAMA[styl] || '', t: tm, tylko: '' });
    cwWybierz({ ...p, liczby: CW_POZIOMY[4].liczby, pulapka: CW_POZIOMY[4].pulapka }, svg, tm, null, gotowe);
} }));

// question from level L (0…8) inside level 10 — exactly as in that level: its random type and form, its numbers, traps, area class
function cwZPoziomu(L) {
  const poz = CW_POZIOMY[L];
  return { nazwa: `Poziom ${L + 1}`,
    losuj() {
      const typ = poz.typy[cwLos(poz.typy.length)], formy = Object.keys(poz.formy), forma = formy[cwLos(formy.length)];
      const liczby = typ.liczby || poz.liczby;
      return { typ, forma, liczby, X: poz.losuj ? poz.losuj() : liczby[cwLos(liczby.length)] };
    },
    zapis: Q => `${Q.typ.nazwa} ${poz.formy[Q.forma](Q.X)}`,   // for the log
    buduj(p, Q, gotowe) {
      p.pyt.className = 'cw-pytanie ' + Q.forma;
      p.cel.className = `cw-cel ${Q.forma} ${poz.klasa || ''}`;
      Q.typ.buduj({ ...p, forma: Q.forma, zapis: poz.formy[Q.forma], liczby: Q.liczby, pulapka: poz.pulapka }, Q.X, gotowe);
  } };
}

// Bonus — Ponad godzinę: X = { T, g, m } — it is T (minutes from midnight, from 06:00), g hours (1…5) and m minutes (5…55)
// have passed; result T + 60g + m, not past midnight and not on :00 (Ustaw — hour hand between numbers). The span grows
// through the round, from 1 to 5 hours: questions 1–2 → 1 hour, 3–4 → 2 … 9–10 → 5; each pair is Pokaż + Wybierz.
function cwLosujMinelo(g) {
  const m = 5 * (1 + cwLos(11));
  let T;
  do T = 360 + cwLos((1435 - 60 * g - m - 360) / 5 + 1) * 5; while ((T + m) % 60 === 0);
  return { T, g, m };
}
const cwMinelo = X => X.T + 60 * X.g + X.m;
// „Minęła 1 godzina" · „Minęły 2 godziny" · „Minęło 5 godzin" (minutes 5 … 55 are always „minut"); hours in the hour
// hand's colour, minutes in the minute hand's; 22 px in the box (CSS .cw-pytanie.minelo) — it does not fit at 32
function cwRamkaMinelo(p, X) {
  const [cz, godz] = X.g === 1 ? ['Minęła', 'godzina'] : X.g < 5 ? ['Minęły', 'godziny'] : ['Minęło', 'godzin'];
  p.pyt.append(h('small', null, `Jest ${cwCyfry24(X.T)}`),
               h('b', null, `${cz} <span class="g">${X.g} ${godz}</span> i <span class="m">${X.m} minut</span>`));
}
const CW_MINELO = [
  { nazwa: 'Pokaż', buduj(p, X, gotowe) {       // like Ustaw from level 10, but from T: 5 hours do not need 5 laps of the minute hand
      cwRamkaMinelo(p, X);
      cwUstaw(p, X.T % 720, cwMinelo(X), gotowe);
  } },
  { nazwa: 'Wybierz', buduj(p, X, gotowe) {
      cwRamkaMinelo(p, X);
      const svg = cwZegar(p.zegar, X.T % 720, null, '');
      svg.style.pointerEvents = 'none';          // display only
      const R = cwMinelo(X), G = X.T + 60 * X.g;
      // across a full hour: 08:50 + 1 h 20 → 09:10 (hour not carried) · 09:50 (hours only);
      // otherwise: 08:20 + 1 h 25 → 09:20 (hours only) · 08:45 (minutes only)
      const pulapka = () => X.T % 60 + X.m >= 60 ? [R - 60, G] : [G, X.T + X.m];
      cwWybierz({ ...p, zapis: cwCyfry24, pulapka, liczby: [] }, svg, R, null, gotowe);
  } }
];

// levels: question types, what to draw from, written forms (mixed evenly within a round), trap for Wybierz (optional);
// a type may have its own liczby (level 7: Pokaż full hours only); losuj() — a question instead of a number (level 8);
// ile — questions per round when not 10 (level 9); kolejka(tylkoTyp) — the whole round at once, a type may have its own
// losuj() and zapis (level 10)
const CW_POZIOMY = [
  { typy: CW_GODZINY, liczby: [...Array(12).keys()], formy: CW_FORMY },                    // 1 · Godziny
  { typy: CW_MINUTY, liczby: Array.from({ length: 11 }, (_, i) => (i + 1) * 5),           // 2 · Minuty
    formy: { cyfry: M => String(M) } },
  { typy: CW_PO_ZA, liczby: [...Array(12).keys()], formy: { slowa: k => MINUTY[k] },     // 3 · Po i za
    pulapka: k => (12 - k) % 12 },               // mirror: 3 ↔ 9; 0 and 6 mirror themselves → both wrong answers random
  { typy: CW_OBIE, liczby: Array.from({ length: 48 }, (_, i) => i * 15),                   // 4 · Co 15 minut
    formy: { cyfry: cwCyfry, zdania: cwZdanie },
    pulapka: (tm, forma) => {
      const m = tm % 60;
      // neighbouring hour: 3:30 → „Wpół do trzeciej" (words: current hour instead of the next) · 04:30 (digits: the nearer number)
      const godz = (tm + (m >= 30 && forma === 'zdania' ? -60 : 60) + 720) % 720;
      return [godz, tm - m + (m + 15 * (1 + cwLos(3))) % 60];   // + the same hour, another quarter
    } },
  { typy: CW_OBIE, liczby: Array.from({ length: 144 }, (_, i) => i * 5).filter(tm => tm % 60),   // 5 · Co 5 minut
    formy: { cyfry: cwCyfry },                   // no :00 — full hours were in level 1, and the „08:07" trap does not work on :00
    pulapka: tm => [(tm + 60) % 720,             // 09:35 — hour hand close to 9
                    tm - tm % 60 + tm % 60 / 5] },  // 08:07 — the number under the minute hand read literally
  { typy: CW_OBIE, liczby: Array.from({ length: 144 }, (_, i) => i * 5).filter(tm => tm % 60),   // 6 · Słowami
    formy: { zdania: cwZdanie },                 // as 5, but sentences only
    klasa: 'dwa-wiersze',                        // „Dwadzieścia pięć po jedenastej" — buttons in two lines
    pulapka: tm => {
      const m = tm % 60;
      // 6:55 „Za pięć siódma" → „Za pięć szósta" (after „za" / „wpół do" the current hour instead of the next;
      // with „po" the other way round: 2:25 → „…po trzeciej") · „Pięć po szóstej" (mirror: 55 ↔ 05; wpół do mirrors itself → random)
      return [(tm + (m >= 30 ? -60 : 60) + 720) % 720, tm - m + (60 - m)];
    } },
  { typy: CW_24, liczby: Array.from({ length: 288 }, (_, i) => i * 5).filter(T => T < 720 ? T < 60 : T >= 780),
    formy: { cyfry: cwCyfry24 },                 // 7 · Po południu: 00:05 … 00:55 and 13:00 … 23:55
    // 14:25 → 02:25 (12 h reading) · 12:25 (+10 instead of +12); 00:40 → 12:40 (12 at the top) · 01:40 (hour hand close to 1)
    pulapka: T => T < 60 ? [T + 720, T + 60] : [T - 720, T - 120] },
  { typy: CW_PRZESUN, liczby: [], losuj: cwLosujPrzesuniecie,                                // 8 · Wcześniej, później
    formy: { cyfry: X => `${cwCyfry24(X.T)} ${X.d > 0 ? '+' : '−'}${Math.abs(X.d)} min` } },  // (form for the log)
  { typy: CW_MOST, liczby: [], losuj: cwLosujMost, ile: 5, klasa: 'most',                   // 9 · Ile minut?
    formy: { cyfry: X => `${cwCyfry24(X.T)} → ${cwCyfry24(X.T + X.a + X.b)}` } },           // (form for the log)
  { typy: [], liczby: [], formy: { cyfry: cwCyfry24 },                                        // 10 · Mistrz
    kolejka: tylko => {                          // 4 Ustaw · 3 unusual dials · 3 from different levels 4–9; ?typ=1|2|3 — one group
      const grupy = [[CW_USTAW], CW_NIETYPOWE, cwTasuj([3, 4, 5, 6, 7, 8]).slice(0, 3).map(cwZPoziomu)];
      return cwTasuj(tylko ? Array.from({ length: CW_ILE }, (_, i) => grupy[tylko - 1][i % grupy[tylko - 1].length])
                           : [CW_USTAW, CW_USTAW, CW_USTAW, ...grupy.flat()]);
    } },
  { typy: CW_MINELO, liczby: [], formy: { minelo: X => `${cwCyfry24(X.T)} +${X.g} h ${X.m} min` },   // 11 · Bonus (log)
    kolejka: tylko => Array.from({ length: CW_ILE / 2 }, (_, i) =>   // pair i → i + 1 hours, Pokaż and Wybierz in random order
      (tylko ? [CW_MINELO[tylko - 1], CW_MINELO[tylko - 1]] : cwTasuj([...CW_MINELO]))
        .map(typ => ({ ...typ, losuj: () => cwLosujMinelo(i + 1) }))).flat() }
];

// round; licznik — element for „3/10" in the header; wroc() — the „Poziomy" button at the end; nrPoz — from 0 (missing = level 1);
// tylkoTyp 1|2 — for checking; dalej() — „Następny poziom" at the end (missing — no such button, e.g. after level 10)
function cwiczenia(box, licznik, wroc, nrPoz, tylkoTyp, dalej) {
  const znak = box.cwZnak = {};                 // a late setTimeout from the old round must not write into the new one
  const poz = CW_POZIOMY[nrPoz || 0];
  const typy = tylkoTyp ? [poz.typy[tylkoTyp - 1]] : poz.typy;
  const ile = poz.ile || CW_ILE;
  const kolejka = poz.kolejka ? poz.kolejka(tylkoTyp) : cwTasuj(Array.from({ length: ile }, (_, i) => typy[i % typy.length]));
  const nazwyForm = Object.keys(poz.formy);
  const formy = cwTasuj(Array.from({ length: ile }, (_, i) => nazwyForm[i % nazwyForm.length]));
  let nr = 0, ost = -1, bledyRazem = 0, trafione = 0;   // trafione — right on the first try, no mistake

  function pytanie() {
    box.textContent = '';
    licznik.textContent = `${nr + 1}/${ile}`;
    const typ = kolejka[nr];
    const liczby = typ.liczby || poz.liczby;
    let X;
    do X = typ.losuj ? typ.losuj() : poz.losuj ? poz.losuj() : liczby[cwLos(liczby.length)]; while (X === ost);
    ost = X;
    const forma = formy[nr];
    const p = { pyt: h('div', 'cw-pytanie ' + forma), zegar: h('div', 'cw-zegar'),
                cel: h('div', `cw-cel ${forma} ${poz.klasa || ''}`),
                forma, zapis: typ.zapis || poz.formy[forma], liczby, pulapka: poz.pulapka };
    box.append(p.pyt, p.zegar, p.cel);
    typ.buduj(p, X, bledy => {
      bledyRazem += bledy;
      if (!bledy) trafione++;
      log(`ćwiczenie ${nr + 1}/${ile} · ${typ.nazwa} ${p.zapis(X)} ✓${bledy ? ` (błędy: ${bledy})` : ''}`);
      setTimeout(() => {
        if (box.cwZnak !== znak) return;
        nr++;
        if (nr < ile) pytanie(); else koniec();
      }, CW_DALEJ_MS);
    });
    simScreen(`cwiczenia-${nr + 1}`);
  }

  function koniec() {
    box.textContent = '';
    licznik.textContent = '';
    const przyciski = h('div', 'cw-koniec');
    if (dalej) {                                 // primary button — the next level; without it „Jeszcze raz"
      const nast = h('button', 'btn btn-primary btn-lg', 'Następny poziom');
      nast.onclick = dalej;
      przyciski.append(nast);
    }
    const jeszcze = h('button', `btn ${dalej ? '' : 'btn-primary'} btn-lg`, 'Jeszcze raz'), wr = h('button', 'btn btn-lg', 'Poziomy');
    jeszcze.onclick = () => cwiczenia(box, licznik, wroc, nrPoz, tylkoTyp, dalej);
    wr.onclick = wroc;
    przyciski.append(jeszcze, wr);
    // how many were right on the first try; level 9 — an example counts when all three steps had no mistake
    box.append(h('p', 'cw-wynik', 'Brawo!'),
               h('p', 'cw-punkty', `<b>${trafione} / ${ile}</b><small>za pierwszym razem</small>`), przyciski);
    if (window.Dzwiek) Dzwiek.brawo();
    log(`ćwiczenia: koniec rundy, za pierwszym razem ${trafione}/${ile}, błędy razem: ${bledyRazem}`);
    simScreen('cwiczenia-koniec');
  }

  pytanie();
}
