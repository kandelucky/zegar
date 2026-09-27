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
// Licznik 3/10 w nagłówku; na końcu „Brawo!", „Jeszcze raz", „Wróć".
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
// W aplikacji: Start → Ćwiczenia → lista poziomów, albo ☰ → Poziom N (do sprawdzania: index.html?poziom=2).
// Podgląd bez aplikacji: sim.html?app=cwiczenia.html%3Fpoziom%3D2 (?typ=1|2 — tylko jeden typ, ?styl=).
// Korzysta z globalnych z index.html: NS, h, noweSvg, styl, RAMA, GODZ, GODZ_EJ, duza, MINUTY, pora, log, simScreen,
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
// godzinowa — godzinowa stoi tam na stałe, rusza się tylko minutowa
function cwZegar(miejsce, t, zmiana, tylko = 'g', godzinowa) {
  const svg = noweSvg('duzy');
  miejsce.append(svg);
  Zegar(svg, { styl, cyfry: 'zwykle', rama: RAMA[styl] || '', t, tylko, godzinowa, zmiana });
  return svg;
}

// kółko pod liczbą H (0 = 12): zielone zostaje, czerwone gaśnie; do tego dźwięk dobrze / źle (dzwieki.js)
function cwKolko(svg, H, dobrze) {
  if (window.Dzwiek) Dzwiek.ocena(dobrze);
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

// poziomy: typy pytań, z czego losować, formy zapisu (w rundzie wymieszane po równo), pułapka w Wybierz (opcjonalnie);
// typ może mieć własne liczby (poziom 7: Pokaż tylko pełne godziny)
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
    pulapka: T => T < 60 ? [T + 720, T + 60] : [T - 720, T - 120] }
];

// runda; licznik — element na „3/10" w nagłówku; wroc() — przycisk „Wróć" na końcu; nrPoz — od 0 (brak = poziom 1);
// tylkoTyp 1|2 — do sprawdzania
function cwiczenia(box, licznik, wroc, nrPoz, tylkoTyp) {
  const znak = box.cwZnak = {};                 // spóźniony setTimeout starej rundy nie pisze do nowej
  const poz = CW_POZIOMY[nrPoz || 0];
  const typy = tylkoTyp ? [poz.typy[tylkoTyp - 1]] : poz.typy;
  const kolejka = cwTasuj(Array.from({ length: CW_ILE }, (_, i) => typy[i % typy.length]));
  const nazwyForm = Object.keys(poz.formy);
  const formy = cwTasuj(Array.from({ length: CW_ILE }, (_, i) => nazwyForm[i % nazwyForm.length]));
  let nr = 0, ost = -1, bledyRazem = 0;

  function pytanie() {
    box.textContent = '';
    licznik.textContent = `${nr + 1}/${CW_ILE}`;
    const typ = kolejka[nr];
    const liczby = typ.liczby || poz.liczby;
    let X;
    do X = liczby[cwLos(liczby.length)]; while (X === ost);
    ost = X;
    const forma = formy[nr];
    const p = { pyt: h('div', 'cw-pytanie ' + forma), zegar: h('div', 'cw-zegar'),
                cel: h('div', `cw-cel ${forma} ${poz.klasa || ''}`),
                forma, zapis: poz.formy[forma], liczby, pulapka: poz.pulapka };
    box.append(p.pyt, p.zegar, p.cel);
    typ.buduj(p, X, bledy => {
      bledyRazem += bledy;
      log(`ćwiczenie ${nr + 1}/${CW_ILE} · ${typ.nazwa} ${p.zapis(X)} ✓${bledy ? ` (błędy: ${bledy})` : ''}`);
      setTimeout(() => {
        if (box.cwZnak !== znak) return;
        nr++;
        if (nr < CW_ILE) pytanie(); else koniec();
      }, CW_DALEJ_MS);
    });
    simScreen(`cwiczenia-${nr + 1}`);
  }

  function koniec() {
    box.textContent = '';
    licznik.textContent = '';
    const jeszcze = h('button', 'btn btn-primary btn-lg', 'Jeszcze raz'), wr = h('button', 'btn btn-lg', 'Wróć');
    jeszcze.onclick = () => cwiczenia(box, licznik, wroc, nrPoz, tylkoTyp);
    wr.onclick = wroc;
    const przyciski = h('div', 'cw-koniec');
    przyciski.append(jeszcze, wr);
    box.append(h('p', 'cw-wynik', 'Brawo!'), przyciski);
    if (window.Dzwiek) Dzwiek.brawo();
    log(`ćwiczenia: koniec rundy, błędy razem: ${bledyRazem}`);
    simScreen('cwiczenia-koniec');
  }

  pytanie();
}
