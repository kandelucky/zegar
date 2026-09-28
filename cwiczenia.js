// cwiczenia.js — Ćwiczenia: zadania osobno od lekcji (Lasha 27.09: w lekcjach bez zadań, „ცალკე გვექნება").
// Poziom 1 — Godziny, jak najprościej (Lasha: „უფრო მექანიკური … მაქსიმალურად მარტივი"): tylko cyfra
// i wskazówka godzinowa — bez 24 h, bez głosu. Dwa typy, wymieszane, runda = 10:
//   Pokaż — w ramce „Pokaż na zegarze: 05:00", dziecko ustawia godzinową na 5; sprawdza się samo po puszczeniu
//   Wybierz — w ramce „Która godzina?", godzinowa stoi na liczbie, pod zegarem 3 godziny do wyboru
// Ramka z pytaniem nad zegarem, odpowiedzi pod nim (Lasha 27.09: „კითხვის ჩარჩო საათის ზევით").
// Godzina jak na prawdziwym zegarze — 05:00, nie 5 — albo słowem „Piąta"; w rundzie wymieszane 5 + 5
// (Lasha 27.09: „არა ციფრი 1 არამედ 01:00 … ტექსტის ვარიანტიც", wybrał „არეული რაუნდში").
// Źle → kółko pod liczbą (i wybrany przycisk) na chwilę czerwone, próbuje dalej; dobrze → zielone
// i po chwili samo następne pytanie.
// Licznik 3/10 w nagłówku; na końcu „Brawo!", ile za pierwszym razem („8 / 10"), „Następny poziom", „Jeszcze raz",
// „Poziomy" (lista poziomów).
// Poziom 2 — Minuty (plan 10 poziomów, Lasha 27.09 „ok"; podręcznik s. 5, zad. 1a „Ile to minut po pełnej
// godzinie?"): tylko wskazówka minutowa, godzinowej nie widać; na tarczy zwykłe 1…12, bez 00…55 — właśnie tego
// dziecko się uczy (7 → 35). Te same dwa typy: Pokaż „20 minut" · Wybierz „Ile minut?" + 20 · 35 · 50.
// Poziom 3 — Po i za (podręcznik s. 5, zad. 2; Lasha 27.09 „ok"): tylko minutowa, jak w 2, ale nazwą z książki —
// pełna godzina · pięć po … wpół do … za pięć (MINUTY z index.html). Pokaż „za dziesięć" · Wybierz „Jak to powiesz?"
// + 3 nazwy jedna pod drugą; jedna zła zawsze lustrzana (9 → „za piętnaście", pułapka „piętnaście po").
// Poziom 4 — Co 15 minut (podręcznik s. 7, zad. 5b; Lasha 27.09 „ოკ"): pierwszy raz obie wskazówki, tylko :00 :15 :30 :45,
// cyfrą „07:45" albo zdaniem „Za piętnaście ósma" (wymieszane 5 + 5; zdania 22 px — w 32 się nie mieszczą).
// Pokaż — godzinowa już stoi, ciągnie się tylko minutową. Wybierz — „Która godzina?", złe: sąsiednia godzina
// (3:30 → „Wpół do trzeciej" / 04:30) i ta sama godzina, inny kwadrans; na tarczy bez kółka, tylko przycisk.
// Poziom 5 — Co 5 minut (podręcznik s. 5, zad. 3 · s. 7, zad. 5a; Lasha 27.09 „ოკ"): jak 4, ale dowolne 5 minut (bez :00)
// i tylko cyfrą. Wybierz: 08:35 · 09:35 (godzinowa blisko 9) · 08:07 (liczba spod minutowej wzięta wprost).
// Poziom 6 — Słowami (podręcznik s. 7, zad. 5b · Karta pracy 1a; Lasha 27.09 „კი"): jak 5, ale tylko zdaniem.
// Wybierz: „Za pięć siódma" · „Za pięć szósta" (po „za" idzie NASTĘPNA godzina) · „Pięć po szóstej" (lustro).
// Poziom 7 — Po południu (podręcznik s. 5, zad. 1b i 3; Lasha 27.09 „ki"): cyfry 13…23 i 00, bez słów.
// Pokaż „17:00" — godzinowa na 5, jak w 1. Wybierz — w ramce pora („Wieczorem"), zegar 8:25 → 20:25 · 08:25 · 18:25.
// Poziom 8 — Wcześniej, później (podręcznik s. 6, zad. 4; Lasha 27.09 „კი"): w ramce „Jest 14:05" + „10 minut wcześniej",
// ±10 / ±15 / ±20. Pokaż — zegar stoi na 14:05, ciągnie się minutową, godzinowa jedzie za nią. Wybierz — 13:55 · 14:15 · 14:55.
// Poziom 9 — Ile minut? (podręcznik s. 7, zad. 6 · Karta pracy 1b; Lasha 27.09 „კი"): most 13:50 → 14:00 → 14:10 w trzech
// krokach (+10 · +10 · razem 20), na zegarze rośnie zielony wycinek. Bez Pokaż; runda = 5 przykładów.
// Poziom 10 — Mistrz (podręcznik s. 7, zad. 5 i 7 · Dobra rada; Lasha 27.09 „კარგი"): 4 × Ustaw „16:30" — obie wskazówki
// osobno, godzinowa ma stanąć między 4 a 5, „Sprawdź" · 3 × Wybierz na nietypowej tarczy (12 · 3 · 6 · 9 / bez cyfr /
// rzymskie) · 3 × pytanie z trzech różnych poziomów 4–9, jak w nich samych.
// Bonus — Ponad godzinę (Lasha 28.09 „ki"): „Jest 08:20" + „Minęła 1 godzina i 25 minut", od 1 do 5 godzin, co 2 pytania
// o godzinę więcej. Pokaż — jak Ustaw z poziomu 10, ale od 08:20 · Wybierz — 09:45 · 09:20 (same godziny) · 08:45 (same minuty).
// W aplikacji: Start → Ćwiczenia → lista poziomów, albo ☰ → Poziom N (do sprawdzania: index.html?poziom=2).
// Podgląd bez aplikacji: sim.html?app=cwiczenia.html%3Fpoziom%3D2 (?typ=1|2 — tylko jeden typ, ?styl=).
// Korzysta z globalnych z index.html: NS, h, noweSvg, styl, RAMA, GODZ, GODZ_EJ, duza, MINUTY, pora, log, simScreen,
// uplywWycinek (lekcja-uplyw.js),
// Zegar (tarcza.js).
"use strict";

const CW_ILE = 10;          // pytań w rundzie
const CW_DALEJ_MS = 900;    // od dobrej odpowiedzi do następnego pytania
const CW_ZLE_MS = 700;      // tyle świeci czerwone kółko

const cwLos = n => Math.floor(Math.random() * n);
function cwTasuj(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = cwLos(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// godzina H (0 = dwunasta) w formie pytania
const CW_FORMY = {
  cyfry: H => String(H || 12).padStart(2, '0') + ':00',
  slowa: H => duza(GODZ[H])
};

// zegar pytania: tarcza z menu, cyfry zwykłe (jak w lekcji Godziny); tylko — 'g' | 'm' (jedna wskazówka) | '' (obie);
// godzinowa — godzinowa stoi tam na stałe, rusza się tylko minutowa; chwyt 'm' — łapie się minutowa, godzinowa jedzie za nią
function cwZegar(miejsce, t, zmiana, tylko = 'g', godzinowa, chwyt) {
  const svg = noweSvg('duzy');
  miejsce.append(svg);
  Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t, tylko, godzinowa, chwyt, zmiana });
  return svg;
}

// kółko pod liczbą H (0 = 12): zielone zostaje, czerwone gaśnie; do tego dźwięk dobrze / źle (dzwieki.js), chyba że cicho
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

// Wybierz: 3 przyciski pod zegarem — X i dwie dowolne inne z p.liczby (jeśli poziom ma p.pulapka(X, forma) — jedna
// albo dwie pułapki — idą najpierw); naTarczy(x) — pod którą liczbą kółko (null — bez kółka)
function cwWybierz(p, svg, X, naTarczy, gotowe) {
  let bledy = 0;
  const pul = [].concat(p.pulapka ? p.pulapka(X, p.forma) : []).filter(x => x !== X);
  const inne = [...pul, ...cwTasuj(p.liczby.filter(x => x !== X && !pul.includes(x)))].slice(0, 2);
  const rzad = h('div', 'cw-wybor');
  cwTasuj([X, ...inne]).forEach(x => {
    const b = h('button', 'btn btn-lg', p.zapis(x));
    b.onclick = () => {
      if (naTarczy) cwKolko(svg, naTarczy(x), x === X);   // na tarczy widać, gdzie jest wybrana liczba
      else if (window.Dzwiek) Dzwiek.ocena(x === X);      // bez kółka — sam dźwięk
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

// H = 0…11 (0 = dwunasta), minutowa zawsze na 12; p.zapis(H) — 05:00 albo „Piąta";
// p.pyt — ramka nad zegarem, p.cel — pole pod nim; gotowe(bledy) — po dobrej odpowiedzi
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
      svg.style.pointerEvents = 'none';          // tylko do patrzenia
      cwWybierz(p, svg, H, x => x, gotowe);
  } }
];

// M = 5…55 — minuty (bez 00: „0 minut" to nie pytanie), p.zapis(M) = „35"; kółko pod liczbą M / 5
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
      svg.style.pointerEvents = 'none';          // tylko do patrzenia
      cwWybierz(p, svg, M, x => x / 5, gotowe);
  } }
];

// k = 0…11 — minutowa na liczbie k (k × 5 minut, 0 = pełna godzina), p.zapis(k) = „za dziesięć"; kółko pod liczbą k
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
      svg.style.pointerEvents = 'none';          // tylko do patrzenia
      cwWybierz(p, svg, k, x => x, gotowe);
  } }
];

// tm = minuty od 12:00 (poziom 4 co 15, poziomy 5–6 co 5) — obie wskazówki; p.zapis(tm) = „07:45" albo „Za piętnaście ósma"
const cwCyfry = tm => String(Math.floor(tm / 60) || 12).padStart(2, '0') + ':' + String(tm % 60).padStart(2, '0');
function cwZdanie(tm) {                          // nazwy minut jak w poziomie 3 (MINUTY) — „piętnaście", nie „kwadrans"
  const g = Math.floor(tm / 60) % 12, m = tm % 60, n = (g + 1) % 12;
  // po → ta godzina (pięć po szóstej) · wpół do → następna, -ej (wpół do siódmej) · za → następna (za pięć siódma)
  return duza(m === 0 ? GODZ[g] : `${MINUTY[m / 5]} ${m < 30 ? GODZ_EJ[g] : m === 30 ? GODZ_EJ[n] : GODZ[n]}`);
}
const CW_OBIE = [
  { nazwa: 'Pokaż', buduj(p, tm, gotowe) {      // godzinowa już stoi dobrze, dziecko ciągnie tylko minutową
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
      svg.style.pointerEvents = 'none';          // tylko do patrzenia
      cwWybierz(p, svg, tm, null, gotowe);       // bez kółka: przy pułapce minuty są te same (Lasha „ოკ")
  } }
];

// T = minuty od północy, tylko godziny 13…23 i 00 (12:xx wygląda tak samo rano i po południu); p.zapis(T) = „14:25"
const cwCyfry24 = T => String(Math.floor(T / 60)).padStart(2, '0') + ':' + String(T % 60).padStart(2, '0');
const CW_24 = [
  { nazwa: 'Pokaż', liczby: [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(H => H * 60),   // pełne godziny
    buduj(p, T, gotowe) {                        // jak Pokaż z poziomu 1: „17:00" → godzinowa na 5
      CW_GODZINY[0].buduj({ ...p, zapis: () => p.zapis(T) }, T / 60 % 12, gotowe);
  } },
  { nazwa: 'Wybierz', buduj(p, T, gotowe) {
      p.pyt.append(h('small', null, duza(pora(T))), h('b', null, 'Która godzina?'));
      const svg = cwZegar(p.zegar, T % 720, null, '');
      svg.style.pointerEvents = 'none';          // tylko do patrzenia
      cwWybierz(p, svg, T, null, gotowe);
  } }
];

// X = { T, d }: jest T (minuty od północy, 06:00 … 21:55), d = ±10 / ±15 / ±20 minut; wynik T + d
const cwWynik = X => X.T + X.d;
const cwPrzez = X => Math.floor(cwWynik(X) / 60) !== Math.floor(X.T / 60);   // przechodzi przez pełną godzinę
function cwLosujPrzesuniecie() {                 // mniej więcej połowa pytań przez pełną godzinę (Lasha „კი")
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
  { nazwa: 'Pokaż', buduj(p, X, gotowe) {       // minutowa od T do T + d, godzinowa jedzie za nią
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
      svg.style.pointerEvents = 'none';          // tylko do patrzenia
      const R = cwWynik(X), zn = Math.sign(X.d);
      // 14:05 − 10 → 14:15 (w złą stronę) · 14:55 (godzina się nie zmieniła); bez przejścia: 08:30 + 10 → 08:20 · 08:45 (o liczbę za daleko)
      const pulapka = () => [X.T - X.d, cwPrzez(X) ? R - 60 * zn : R + 5 * zn];
      cwWybierz({ ...p, zapis: cwCyfry24, pulapka, liczby: [] }, svg, R, null, gotowe);
  } }
];

// X = { T, a, b }: od T (06:50 … 22:55) do pełnej godziny a minut, potem jeszcze b; a + b ≤ 55
function cwLosujMost() {
  let a, b;
  do { a = 5 * (1 + cwLos(10)); b = 5 * (1 + cwLos(10)); } while (a + b > 55);
  return { T: (6 + cwLos(17)) * 60 + 60 - a, a, b };
}
// zegar poziomu 9 (tylko do patrzenia): dalej(ile) — wskazówki idą naprzód, zielony wycinek od T rośnie za minutową
// (jak w lekcji 5; uplywWycinek z lekcja-uplyw.js)
function cwZegarUplyw(miejsce, T) {
  const svg = noweSvg('duzy');
  miejsce.append(svg);
  svg.style.pointerEvents = 'none';
  const z = Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t: T % 720, tylko: '' });
  const klin = document.createElementNS(NS, 'path');
  klin.setAttribute('class', 'sektor');
  svg.querySelector('.s-tlo, .m-tlo, .k-tlo').after(klin);
  let juz = 0;                                   // ile minut od T już pokazane
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
// Oblicz: most z podręcznika (s. 7, zad. 6) 13:50 → 14:00 → 14:10; trzy kroki, każdy 3 przyciski:
// skok do pełnej godziny · skok dalej · razem. Złe: ① liczba minut wzięta wprost (50) · o 5 za dużo;
// ② druga strona (50) · o 5 mniej; ③ odejmowanie jak zwykłych liczb (1410 − 1350 = 60) · same minuty (50 − 10 = 40)
const CW_MOST = [
  { nazwa: 'Oblicz', buduj(p, X, gotowe) {
      const { T, a, b } = X, m1 = T % 60;
      p.pyt.append(h('b', null, 'Ile minut upłynie?'));
      const dalej = cwZegarUplyw(p.zegar, T);
      const most = h('div', 'cw-most');
      const skoki = [h('span', 'skok s1'), h('span', 'skok s2')], razem = h('span', 'razem');
      most.append(skoki[0], skoki[1],
                  h('span', 'czas c1', cwCyfry24(T)), h('span', 'strz a1', '→'),
                  h('span', 'czas c2', cwCyfry24(T + a)), h('span', 'strz a2', '→'),
                  h('span', 'czas c3', cwCyfry24(T + a + b)), razem);
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

// Ustaw (poziom 10): T = minuty od północy, dowolne 5 minut bez :00 („16:30", jak w podręczniku 08:10 · 20:15).
// Wskazówki chodzą osobno (tarcza.js: osobno), sprawdza przycisk „Sprawdź": minutowa dokładnie na T % 60, godzinowa
// gdziekolwiek między H a H + 1, byle nie na liczbie (Dobra rada, s. 7). Źle → czerwone kółko przy każdej złej wskazówce
// (godzinowa — pod najbliższą liczbą); dobrze → godzinowa dojeżdża na swoje dokładne miejsce.
const CW_USTAW = { nazwa: 'Ustaw', liczby: Array.from({ length: 288 }, (_, i) => i * 5).filter(T => T % 60), zapis: cwCyfry24,
  buduj(p, T, gotowe) {
    const H = Math.floor(T / 60) % 12, M = T % 60;
    let start;                                   // prawdziwa godzina, ale inna godzina i inne minuty niż T
    do start = cwLos(144) * 5; while (Math.floor(start / 60) === H || start % 60 === M);
    p.pyt.append(h('small', null, 'Ustaw'), h('b', null, p.zapis(T)));
    cwUstaw(p, start, T, gotowe);
} };
// zegar Ustaw (poziom 10, bonus): wskazówki stoją na start (0…719) i chodzą osobno, pod zegarem „Sprawdź"; cel T (bez :00)
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
      z.jedz(T % 720, 400);                      // godzinowa na dokładne miejsce, minutowa już stoi
      gotowe(bledy);
    };
    p.cel.append(b);
}

// Wybierz na nietypowej tarczy (poziom 10): tylko 12 · 3 · 6 · 9 / bez cyfr / rzymskie (tarcza.js je ma), każda raz w rundzie.
// Reszta jak w poziomie 5: dowolne 5 minut bez :00, cyfrą, złe 09:35 · 08:07, bez kółka
const CW_NIETYPOWE = ['cztery', 'brak', 'rzymskie'].map(cyfry => ({ nazwa: 'Wybierz', zapis: cwCyfry,
  losuj: () => { const l = CW_POZIOMY[4].liczby; return l[cwLos(l.length)]; },
  buduj(p, tm, gotowe) {
    p.pyt.append(h('b', null, 'Która godzina?'));
    const svg = noweSvg('duzy');
    p.zegar.append(svg);
    svg.style.pointerEvents = 'none';            // tylko do patrzenia
    Zegar(svg, { styl, cyfry, rama: RAMA[styl] || '', t: tm, tylko: '' });
    cwWybierz({ ...p, liczby: CW_POZIOMY[4].liczby, pulapka: CW_POZIOMY[4].pulapka }, svg, tm, null, gotowe);
} }));

// pytanie z poziomu L (0…8) w poziomie 10 — jak w nim samym: losowy jego typ i forma, jego liczby, pułapki, klasa pola
function cwZPoziomu(L) {
  const poz = CW_POZIOMY[L];
  return { nazwa: `Poziom ${L + 1}`,
    losuj() {
      const typ = poz.typy[cwLos(poz.typy.length)], formy = Object.keys(poz.formy), forma = formy[cwLos(formy.length)];
      const liczby = typ.liczby || poz.liczby;
      return { typ, forma, liczby, X: poz.losuj ? poz.losuj() : liczby[cwLos(liczby.length)] };
    },
    zapis: Q => `${Q.typ.nazwa} ${poz.formy[Q.forma](Q.X)}`,   // do logu
    buduj(p, Q, gotowe) {
      p.pyt.className = 'cw-pytanie ' + Q.forma;
      p.cel.className = `cw-cel ${Q.forma} ${poz.klasa || ''}`;
      Q.typ.buduj({ ...p, forma: Q.forma, zapis: poz.formy[Q.forma], liczby: Q.liczby, pulapka: poz.pulapka }, Q.X, gotowe);
  } };
}

// Bonus — Ponad godzinę: X = { T, g, m } — jest T (minuty od północy, od 06:00), minęło g godzin (1…5) i m minut (5…55);
// wynik T + 60g + m, nie przez północ i nie na :00 (Ustaw — godzinowa między liczbami). Runda coraz dłuższa (Lasha 28.09:
// „1-დან 5 საათამდე მაგრამ მატებით"): pytania 1–2 → 1 godzina, 3–4 → 2 … 9–10 → 5; w każdej parze Pokaż + Wybierz.
function cwLosujMinelo(g) {
  const m = 5 * (1 + cwLos(11));
  let T;
  do T = 360 + cwLos((1435 - 60 * g - m - 360) / 5 + 1) * 5; while ((T + m) % 60 === 0);
  return { T, g, m };
}
const cwMinelo = X => X.T + 60 * X.g + X.m;
// „Minęła 1 godzina" · „Minęły 2 godziny" · „Minęło 5 godzin" (minut 5 … 55 zawsze „minut"); godziny w kolorze
// godzinowej, minuty — minutowej; w ramce 22 (CSS .cw-pytanie.minelo) — w 32 się nie mieści
function cwRamkaMinelo(p, X) {
  const [cz, godz] = X.g === 1 ? ['Minęła', 'godzina'] : X.g < 5 ? ['Minęły', 'godziny'] : ['Minęło', 'godzin'];
  p.pyt.append(h('small', null, `Jest ${cwCyfry24(X.T)}`),
               h('b', null, `${cz} <span class="g">${X.g} ${godz}</span> i <span class="m">${X.m} minut</span>`));
}
const CW_MINELO = [
  { nazwa: 'Pokaż', buduj(p, X, gotowe) {       // jak Ustaw z poziomu 10, ale od T: przy 5 godzinach nie trzeba 5 kółek minutową
      cwRamkaMinelo(p, X);
      cwUstaw(p, X.T % 720, cwMinelo(X), gotowe);
  } },
  { nazwa: 'Wybierz', buduj(p, X, gotowe) {
      cwRamkaMinelo(p, X);
      const svg = cwZegar(p.zegar, X.T % 720, null, '');
      svg.style.pointerEvents = 'none';          // tylko do patrzenia
      const R = cwMinelo(X), G = X.T + 60 * X.g;
      // przez pełną godzinę: 08:50 + 1 h 20 → 09:10 (godzina nie przeniesiona) · 09:50 (same godziny);
      // bez: 08:20 + 1 h 25 → 09:20 (same godziny) · 08:45 (same minuty)
      const pulapka = () => X.T % 60 + X.m >= 60 ? [R - 60, G] : [G, X.T + X.m];
      cwWybierz({ ...p, zapis: cwCyfry24, pulapka, liczby: [] }, svg, R, null, gotowe);
  } }
];

// poziomy: typy pytań, z czego losować, formy zapisu (w rundzie wymieszane po równo), pułapka w Wybierz (opcjonalnie);
// typ może mieć własne liczby (poziom 7: Pokaż tylko pełne godziny); losuj() — pytanie zamiast liczby (poziom 8);
// ile — pytań w rundzie, gdy nie 10 (poziom 9); kolejka(tylkoTyp) — cała runda naraz, typ może mieć własne losuj() i zapis
// (poziom 10)
const CW_POZIOMY = [
  { typy: CW_GODZINY, liczby: [...Array(12).keys()], formy: CW_FORMY },                    // 1 · Godziny
  { typy: CW_MINUTY, liczby: Array.from({ length: 11 }, (_, i) => (i + 1) * 5),           // 2 · Minuty
    formy: { cyfry: M => String(M) } },
  { typy: CW_PO_ZA, liczby: [...Array(12).keys()], formy: { slowa: k => MINUTY[k] },     // 3 · Po i za
    pulapka: k => (12 - k) % 12 },               // lustro: 3 ↔ 9; 0 i 6 same siebie → obie złe losowe
  { typy: CW_OBIE, liczby: Array.from({ length: 48 }, (_, i) => i * 15),                   // 4 · Co 15 minut
    formy: { cyfry: cwCyfry, zdania: cwZdanie },
    pulapka: (tm, forma) => {
      const m = tm % 60;
      // sąsiednia godzina: 3:30 → „Wpół do trzeciej" (słowem: godzina bieżąca zamiast następnej) · 04:30 (cyfrą: bliższa liczba)
      const godz = (tm + (m >= 30 && forma === 'zdania' ? -60 : 60) + 720) % 720;
      return [godz, tm - m + (m + 15 * (1 + cwLos(3))) % 60];   // + ta sama godzina, inny kwadrans
    } },
  { typy: CW_OBIE, liczby: Array.from({ length: 144 }, (_, i) => i * 5).filter(tm => tm % 60),   // 5 · Co 5 minut
    formy: { cyfry: cwCyfry },                   // bez :00 — pełne godziny były w 1, a „08:07" na :00 nie działa
    pulapka: tm => [(tm + 60) % 720,             // 09:35 — godzinowa blisko 9
                    tm - tm % 60 + tm % 60 / 5] },  // 08:07 — liczba spod minutowej wzięta wprost
  { typy: CW_OBIE, liczby: Array.from({ length: 144 }, (_, i) => i * 5).filter(tm => tm % 60),   // 6 · Słowami
    formy: { zdania: cwZdanie },                 // jak 5, ale tylko zdaniem
    klasa: 'dwa-wiersze',                        // „Dwadzieścia pięć po jedenastej" — przyciski w dwóch wierszach (Lasha „ა")
    pulapka: tm => {
      const m = tm % 60;
      // 6:55 „Za pięć siódma" → „Za pięć szósta" (po „za" / „wpół do" bieżąca godzina zamiast następnej;
      // przy „po" odwrotnie: 2:25 → „…po trzeciej") · „Pięć po szóstej" (lustro: 55 ↔ 05; wpół do samo siebie → losowa)
      return [(tm + (m >= 30 ? -60 : 60) + 720) % 720, tm - m + (60 - m)];
    } },
  { typy: CW_24, liczby: Array.from({ length: 288 }, (_, i) => i * 5).filter(T => T < 720 ? T < 60 : T >= 780),
    formy: { cyfry: cwCyfry24 },                 // 7 · Po południu: 00:05 … 00:55 i 13:00 … 23:55
    // 14:25 → 02:25 (odczyt 12 h) · 12:25 (+10 zamiast +12); 00:40 → 12:40 (12 u góry) · 01:40 (godzinowa blisko 1)
    pulapka: T => T < 60 ? [T + 720, T + 60] : [T - 720, T - 120] },
  { typy: CW_PRZESUN, liczby: [], losuj: cwLosujPrzesuniecie,                                // 8 · Wcześniej, później
    formy: { cyfry: X => `${cwCyfry24(X.T)} ${X.d > 0 ? '+' : '−'}${Math.abs(X.d)} min` } },  // (zapis do logu)
  { typy: CW_MOST, liczby: [], losuj: cwLosujMost, ile: 5, klasa: 'most',                   // 9 · Ile minut?
    formy: { cyfry: X => `${cwCyfry24(X.T)} → ${cwCyfry24(X.T + X.a + X.b)}` } },           // (zapis do logu)
  { typy: [], liczby: [], formy: { cyfry: cwCyfry24 },                                        // 10 · Mistrz
    kolejka: tylko => {                          // 4 Ustaw · 3 nietypowe tarcze · 3 z różnych poziomów 4–9; ?typ=1|2|3 — jedna grupa
      const grupy = [[CW_USTAW], CW_NIETYPOWE, cwTasuj([3, 4, 5, 6, 7, 8]).slice(0, 3).map(cwZPoziomu)];
      return cwTasuj(tylko ? Array.from({ length: CW_ILE }, (_, i) => grupy[tylko - 1][i % grupy[tylko - 1].length])
                           : [CW_USTAW, CW_USTAW, CW_USTAW, ...grupy.flat()]);
    } },
  { typy: CW_MINELO, liczby: [], formy: { minelo: X => `${cwCyfry24(X.T)} +${X.g} h ${X.m} min` },   // 11 · Bonus (log)
    kolejka: tylko => Array.from({ length: CW_ILE / 2 }, (_, i) =>   // para i → i + 1 godzin, Pokaż i Wybierz w losowej kolejności
      (tylko ? [CW_MINELO[tylko - 1], CW_MINELO[tylko - 1]] : cwTasuj([...CW_MINELO]))
        .map(typ => ({ ...typ, losuj: () => cwLosujMinelo(i + 1) }))).flat() }
];

// runda; licznik — element na „3/10" w nagłówku; wroc() — przycisk „Poziomy" na końcu; nrPoz — od 0 (brak = poziom 1);
// tylkoTyp 1|2 — do sprawdzania; dalej() — „Następny poziom" na końcu (brak — przycisku nie ma, np. po poziomie 10)
function cwiczenia(box, licznik, wroc, nrPoz, tylkoTyp, dalej) {
  const znak = box.cwZnak = {};                 // spóźniony setTimeout starej rundy nie pisze do nowej
  const poz = CW_POZIOMY[nrPoz || 0];
  const typy = tylkoTyp ? [poz.typy[tylkoTyp - 1]] : poz.typy;
  const ile = poz.ile || CW_ILE;
  const kolejka = poz.kolejka ? poz.kolejka(tylkoTyp) : cwTasuj(Array.from({ length: ile }, (_, i) => typy[i % typy.length]));
  const nazwyForm = Object.keys(poz.formy);
  const formy = cwTasuj(Array.from({ length: ile }, (_, i) => nazwyForm[i % nazwyForm.length]));
  let nr = 0, ost = -1, bledyRazem = 0, trafione = 0;   // trafione — bez błędu za pierwszym razem

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
    if (dalej) {                                 // główny przycisk — następny poziom; bez niego „Jeszcze raz"
      const nast = h('button', 'btn btn-primary btn-lg', 'Następny poziom');
      nast.onclick = dalej;
      przyciski.append(nast);
    }
    const jeszcze = h('button', `btn ${dalej ? '' : 'btn-primary'} btn-lg`, 'Jeszcze raz'), wr = h('button', 'btn btn-lg', 'Poziomy');
    jeszcze.onclick = () => cwiczenia(box, licznik, wroc, nrPoz, tylkoTyp, dalej);
    wr.onclick = wroc;
    przyciski.append(jeszcze, wr);
    // ile trafione za pierwszym razem (Lasha 27.09 „ოკ"); poziom 9 — przykład, w którym wszystkie trzy kroki bez błędu
    box.append(h('p', 'cw-wynik', 'Brawo!'),
               h('p', 'cw-punkty', `<b>${trafione} / ${ile}</b><small>za pierwszym razem</small>`), przyciski);
    if (window.Dzwiek) Dzwiek.brawo();
    log(`ćwiczenia: koniec rundy, za pierwszym razem ${trafione}/${ile}, błędy razem: ${bledyRazem}`);
    simScreen('cwiczenia-koniec');
  }

  pytanie();
}
