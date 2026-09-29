// samouczki.js — „Jak to działa?": krótki samouczek przed poziomem ćwiczeń (Lasha 27.09: „უფრო გასაგები ტუტორიალი",
// plan z czatu „კი"): 3 kroki z „Dalej" (Lasha: „შეამოკლე 3 ნაბიჯამდე"), zegar sam pokazuje, co zdanie mówi (miga
// wskazówka, kółko pod liczbą, wskazówka jedzie, palec ją ciągnie). Bez głosu (Lasha: „ხმები არ არის საჭირო").
// Przy pierwszym wejściu w poziom sam, potem przez 💡 w nagłówku.
// Na razie poziomy 1–10; bonus według tabeli z czatu, po jego „კი".
// Cała pomoc w jednej ramce (Lasha: „მთლიანი დახმარება უნდა იყოს ჩარჩოში … რომ ეს არაა ჩვეულებრივი საათი"): zdanie (22),
// zegar, pod nim duży napis (32), mały opis (17) i „Dalej" — w ostatnim kroku „Zaczynamy!" / „Wróć" (💡) → runda (Lasha: „Teraz ty!"
// „არ არის ინტუიციური").
// Podgląd: sim.html?app=cwiczenia.html%3Fpoziom%3D2%26samouczek%3D1 (&krok=N — od kroku N).
// W aplikacji: index.html (cwStart przy wejściu w poziom, 💡 w nagłówku); podgląd osobno — cwiczenia.html.
// Korzysta z globalnych: NS, h, noweSvg, styl, RAMA, log, simScreen, GODZ, duza, MINUTY, Zegar (tarcza.js),
// uplywWycinek (lekcja-uplyw.js), cwKolko, cwCyfry, cwCyfry24, cwMost (cwiczenia.js).
"use strict";

const SAM_KLUCZ = n => `zegar-samouczek-${n + 1}`;   // localStorage: samouczek poziomu n + 1 już pokazany (sam tylko raz — Lasha 28.09)
// szybciej (Lasha: „ანიმაცია ძალიან ნელია. ბავშვები ეგრევე შემდეგს აწვებიან"); „Dalej" nieczynne, póki coś jedzie
const SAM_LICZBA_MS = 250;  // tyle wskazówka jedzie od liczby do liczby
const SAM_PRZED_MS = 300, SAM_PO_MS = 150;   // pauza przed ruchem i po nim
const SAM_12_6 = '12 — pełna godzina · 6 — wpół do';   // poziom 3, krok 1 — mały napis
// poziom 3: nazwa minut k × 5 (MINUTY z index.html), słowa po / za w kolorach połówek tarczy
const samNazwa = k => MINUTY[k].replace(/\b(po|za)\b/, w => `<span class="sam-${w}">${w}</span>`);

// wskazówka samouczka (s.reka 'g' | 'm') jedzie od od do cel (minuty), tik przy każdej liczbie; o.palec — 👆 na jej
// końcu, jakby ją ciągnął; o.licz — przy każdej minionej liczbie zapala się jej podpis minut (05, 10 … — tarcza
// z cyframi 'minuty') i rośnie duży napis „15 minut"; o.klatka(tt) — w każdej klatce, gdzie jest wskazówka (poziom 9:
// wycinek i liczenie). o.sama 'g' | 'm' — osobno (poziom 10): jedzie tylko ta, druga stoi w o.stoi · o.ms — cała jazda
// tyle ms (inaczej SAM_LICZBA_MS za liczbę) · o.przed — pauza przed nią (inaczej SAM_PRZED_MS). Na końcu gotowe().
// cel < od — w tył (poziom 8): tik, gdy wskazówka dojdzie do liczby, nie gdy z niej zejdzie (bez o.licz).
// s.zywy() = false, gdy krok już się zmienił.
// s.jedzie() / s.stoi() — „Dalej" nieczynne od wywołania do końca (gotowe() przed s.stoi(), więc łańcuch — dalej nieczynne)
function samJedz(s, od, cel, gotowe, o = {}) {
  s.jedzie();
  const m = (o.sama || s.reka) !== 'g', co = m ? 5 : 60;   // ile minut od liczby do liczby (obie wskazówki — jak minutowa)
  const r = m ? 52 : 44;                         // palec przy końcu wskazówki, przed cyframi
  let palec = null;
  if (o.palec) {
    palec = document.createElementNS(NS, 'text');
    palec.setAttribute('class', 'sam-palec');
    palec.textContent = '👆';
    s.tarcza.append(palec);                      // w grupie tarczy — przy cyfrach 'minuty' skaluje się razem z nią
  }
  const stan = tt => {
    if (palec) {
      const a = (m ? tt * 6 : tt / 2) * Math.PI / 180;
      palec.setAttribute('x', 100 + r * Math.sin(a));
      palec.setAttribute('y', 100 - r * Math.cos(a));
    }
    if (o.sama === 'g') s.z.ustaw(o.stoi, tt); else if (o.sama) s.z.ustaw(tt, o.stoi); else s.z.ustaw(tt);
    if (o.klatka) o.klatka(tt);
  };
  stan(od);
  setTimeout(() => {
    if (!s.zywy()) return;
    const start = performance.now(), ms = o.ms || Math.abs(cel - od) / co * SAM_LICZBA_MS;
    const w = cel < od ? Math.ceil : Math.floor;
    let ost = w(od / co);
    (function krok(n) {
      if (!s.zywy()) return;
      const q = Math.min(1, (n - start) / ms), e = q < .5 ? 2 * q * q : 1 - (2 - 2 * q) ** 2 / 2;
      const tt = od + (cel - od) * e;
      stan(tt);
      const nL = w(tt / co);
      if (nL !== ost) {
        if (window.Dzwiek) Dzwiek.tik();
        if (o.licz) {                            // wolna klatka może przeskoczyć liczbę — zapalają się wszystkie minione
          for (let i = ost + 1; i <= nL; i++) s.podpis(i);
          s.wynik(`<span class="m">${nL * 5 % 60}</span> minut`);   // od pełnej godziny (poziom 5: od 8:00)
        }
        ost = nL;
      }
      if (q < 1) { requestAnimationFrame(krok); return; }
      if (window.Dzwiek) Dzwiek.zatrzask();
      setTimeout(() => { if (s.zywy()) { if (palec) palec.remove(); gotowe(); s.stoi(); } }, SAM_PO_MS);
    })(start);
  }, o.przed ?? SAM_PRZED_MS);
}

// wskazówka stoi, zielony wycinek od minuty m0 rośnie o ile minut (uplywWycinek z lekcja-uplyw.js), tik przy każdej
// liczbie, duży napis liczy „5 minut", „10 minut"; na końcu gotowe()
function samKlin(s, m0, ile, gotowe) {
  s.jedzie();
  const klin = s.klin();
  setTimeout(() => {
    if (!s.zywy()) return;
    const start = performance.now(), ms = ile / 5 * SAM_LICZBA_MS;
    let ost = 0;
    (function krok(n) {
      if (!s.zywy()) return;
      const q = Math.min(1, (n - start) / ms), e = q < .5 ? 2 * q * q : 1 - (2 - 2 * q) ** 2 / 2;
      klin.setAttribute('d', uplywWycinek(m0, ile * e));
      const nL = Math.floor(ile * e / 5);
      if (nL !== ost) {
        if (window.Dzwiek) Dzwiek.tik();
        s.wynik(`<span class="m">${nL * 5}</span> minut`);
        ost = nL;
      }
      if (q < 1) { requestAnimationFrame(krok); return; }
      if (window.Dzwiek) Dzwiek.zatrzask();
      setTimeout(() => { if (s.zywy()) { gotowe(); s.stoi(); } }, SAM_PO_MS);
    })(start);
  }, SAM_PRZED_MS);
}

// krok 4 poziomu 2: dziecko samo ciągnie minutową; wokół tarczy świecą podpisy 4 ostatnich minionych liczb
// (05 · 10 · 15 · 20 → 05 gaśnie, zapala się 25 … bez końca, także przez 12 — Lasha 27.09); pod zegarem minuty.
// Liczy się droga od startu (T, bez zawijania na 12); w tył od startu — bez podpisów.
function samOstatnie4(s) {
  let T = 0, ost = 0;
  s.ciagnij(nt => {
    let d = nt - ost;
    if (d > 360) d -= 720;
    if (d < -360) d += 720;
    ost = nt;
    T += d;
    const k = Math.floor(T / 5), m = (k % 12 + 12) % 12 * 5, lista = [];
    for (let j = Math.max(1, k - 3); j <= k; j++) lista.push(j);
    s.podpisy(lista);
    s.wynik(m ? `<span class="m">${m}</span> minut` : 'Pełna godzina');
  });
}

// 🏋 Trening (index.html; Lasha 29.09: „დატოვე მხოლოდ ერთი ვარიანტი … დაბლა ორი ჩამრთველი"): jeden zegar, obie wskazówki —
// łapie się ta bliżej palca. Start s.t (teraz, co 5 minut), cała doba: w przód przez 12 — 13:00 … 23:55 → 00:00, w tył tak samo
// (liczy się droga od startu, bez zawijania na 12). Liczba godziny, którą krótka minęła, powiększona (Lasha: „როცა 8 საათია,
// გადიდდეს ციფრი 8"; CSS .sam-teraz w index.html). Wokół tarczy świecą 4 ostatnie liczby, do których doszła minutowa —
// w obie strony (w przód 00 · 05 · 10 · 15, w tył 00 · 55 · 50 · 45; po zawróceniu wymieniają się po jednej). Pod zegarem
// duże „14:25" (godzina w kolorze krótkiej, minuty — długiej) i „Dwadzieścia pięć po drugiej po południu".
// Pod spodem dwa przełączniki, włączenie jednego wyłącza drugi:
//  „Po i za" — połówki tarczy po / za, pod zegarem zdanie z poziomu 6 („Za pięć siódma") i cyfry;
//  „Upływ czasu" — od chwili włączenia za minutową zabarwia się miniony czas; przy końcu minutowej, za tarczą, „1 godz." ·
//   „20 min" (najbliższe 5 minut), pod zegarem „08:00 → 09:20" i „Minęła 1 godzina i 20 minut.". W tył od startu
//   (Lasha 29.09, _visual/por-uplyw.html) tak samo: „07:40 → 08:00" i „To było 20 minut temu.". Kolor jeden na kierunek
//   („ან ერთი ფერი იქნება ან მეორე"): w przód zielony, w tył pomarańczowy; ponad godzinę — ostatnia godzina mocniej.
//   4 liczby wtedy nie świecą (napis stoi w ich miejscu).
const SAM_UPLYW_KOLOR = ['sektor', 'sam-pol-po'];   // w przód · w tył
const SAM_ZA_TARCZA = 80;                        // napis zaczyna się tyle od środka — tuż za obrzeżem tarczy
function samTrening(s) {
  const liczby = s.svg.querySelectorAll('.s-cyfra, .m-cyfra, .k-cyfra');   // 1 … 12, po kolei
  let tryb = '', T = 0, ost = s.t % 720;         // tryb: '' · 'po' · 'uplyw' · T — droga od startu
  let slad = [Math.round(ost % 60 / 5)];         // numery liczb (0 = 00 … 11 = 55), ostatnia pierwsza
  let uplyw = null;                              // { T0, t0, m0, dol, gora, napis, byl } — od włączenia „Upływ czasu"
  const teraz = () => ((s.t + Math.round(T / 5) * 5) % 1440 + 1440) % 1440;

  function rysujUplyw(u) {
    const wtyl = T < u.T0, x = Math.abs(T - u.T0), g = Math.floor(x / 60), m = x - g * 60;
    const kolor = `${SAM_UPLYW_KOLOR[wtyl ? 1 : 0]} sam-klin`;
    u.gora.setAttribute('class', kolor);
    u.dol.setAttribute('class', kolor);
    u.gora.style.fillOpacity = g ? .55 : '';     // ostatnia godzina mocniej, pod nią poprzednia
    // gora — ostatnie m minut, dol — reszta tarczy z poprzedniej godziny; pełne 60 — łuk znika
    u.gora.setAttribute('d', wtyl ? uplywWycinek(u.m0 - m, m) : uplywWycinek(u.m0, m));
    u.dol.setAttribute('d', !g ? '' : wtyl ? uplywWycinek(u.m0, Math.min(60 - m, 59.9)) : uplywWycinek(u.m0 + m, Math.min(60 - m, 59.9)));
    const d = Math.round(x / 5) * 5, wiersze = [];
    if (d >= 60) wiersze.push(`${Math.floor(d / 60)} godz.`);
    if (d % 60) wiersze.push(`${d % 60} min`);
    if (wiersze.join() !== u.byl) {
      u.byl = wiersze.join();
      u.napis.textContent = '';
      wiersze.forEach(w => { const t = document.createElementNS(NS, 'tspan'); t.textContent = w; u.napis.append(t); });
    }
    if (wiersze.length) {                        // środek napisu na przedłużeniu minutowej, bliższy brzeg tuż za tarczą
      const b = u.napis.getBBox(), a = ost % 60 * 6 * Math.PI / 180;
      const r = SAM_ZA_TARCZA + Math.abs(Math.sin(a)) * b.width / 2 + Math.abs(Math.cos(a)) * b.height / 2;
      const cx = 100 + r * Math.sin(a), cy = 100 - r * Math.cos(a);
      [...u.napis.children].forEach((t, i) => {
        t.setAttribute('x', cx);
        t.setAttribute('y', cy + (i - (wiersze.length - 1) / 2) * 10);
      });
    }
    const start = samCzas(u.t0, cwCyfry24), koniec = samCzas(((u.t0 + (wtyl ? -d : d)) % 1440 + 1440) % 1440, cwCyfry24);
    if (!d) s.wynik(start);
    else s.wynik(wtyl ? `${koniec} → ${start}` : `${start} → ${koniec}`, samMinelo(d, wtyl));
  }

  function pisz() {
    const q = teraz();
    liczby.forEach((e, i) => e.classList.toggle('sam-teraz', i === (Math.floor(q / 60) + 11) % 12));
    s.podpisy(uplyw ? [] : slad);
    if (uplyw) rysujUplyw(uplyw);
    else if (tryb === 'po') s.wynik(samZdanie(q), samCzas(q, cwCyfry24));
    else s.wynik(samCzas(q, cwCyfry24), slowami(q));   // jak w „Odczytaj" (Lasha: „საათის სწორი ტექსტი")
  }

  function ustawTryb(k) {
    tryb = k;
    s.polowy(tryb === 'po');
    if (uplyw) { uplyw.dol.remove(); uplyw.gora.remove(); uplyw.napis.remove(); uplyw = null; }
    if (tryb === 'uplyw') {
      const napis = document.createElementNS(NS, 'text');
      napis.setAttribute('class', 'sam-uplyw');
      s.svg.append(napis);
      uplyw = { T0: T, t0: teraz(), m0: ost % 60, dol: s.klin(), gora: s.klin(), napis, byl: null };
    }
    przelaczniki.forEach(([k2, we]) => { we.checked = k2 === tryb; });
    log(`trening: ${tryb || 'zwykły'}`);
    pisz();
  }

  // przełączniki pod zegarem (w .sam-pod, pod napisami)
  const rzad = h('div', 'sam-przelaczniki');
  const przelaczniki = [['po', 'Po i za'], ['uplyw', 'Upływ czasu']].map(([k, nazwa]) => {
    const l = h('label'), we = h('input', 'toggle toggle-primary');
    we.type = 'checkbox';
    we.onchange = () => ustawTryb(we.checked ? k : '');
    l.append(we, h('span', null, nazwa));
    rzad.append(l);
    return [k, we];
  });
  s.svg.closest('.sam-ramka').querySelector('.sam-pod').append(rzad);

  pisz();
  s.ciagnij(nt => {
    let d = nt - ost;
    if (d > 360) d -= 720;
    if (d < -360) d += 720;
    ost = nt;
    const T1 = T;
    T += d;
    const doszla = [];                           // liczby po drodze, po kolei: w przód (T1, T], w tył [T, T1)
    if (T > T1) for (let k = Math.floor(T1 / 5) + 1; k * 5 <= T; k++) doszla.push(k);
    else for (let k = Math.ceil(T1 / 5) - 1; k * 5 >= T; k--) doszla.push(k);
    const o = Math.round(s.t % 720 % 60 / 5);
    doszla.forEach(k => { const n = ((k + o) % 12 + 12) % 12; slad = [n, ...slad.filter(x => x !== n)].slice(0, 4); });
    pisz();
  });
}
const TRENING = { tylko: '', cyfry: 'minuty', dwa: true, kroki: [
  { zdanie: 'Przesuwaj wskazówki palcem.', t: 480, pokaz: samTrening }
] };

// „Minęła 1 godzina i 20 minut." · „To było 1 godzinę i 20 minut temu." — d minut (co 5, więc zawsze „minut");
// 1 godzina (przy „temu" godzinę) · 2–4, 22–24 godziny · 5–21 godzin; godziny w kolorze godzinowej, minuty — minutowej
const samGodzin = (g, temu) => g === 1 ? (temu ? 'godzinę' : 'godzina')
  : g % 10 >= 2 && g % 10 <= 4 && (g % 100 < 12 || g % 100 > 14) ? 'godziny' : 'godzin';
function samMinelo(d, temu) {
  const g = Math.floor(d / 60), m = d % 60, czesci = [];
  if (g) czesci.push(`<span class="g">${g} ${samGodzin(g, temu)}</span>`);
  if (m) czesci.push(`<span class="m">${m} minut</span>`);
  if (temu) return `To było ${czesci.join(' i ')} temu.`;
  const cz = !g ? 'Minęło' : g === 1 ? 'Minęła' : samGodzin(g) === 'godziny' ? 'Minęły' : 'Minęło';
  return `${cz} ${czesci.join(' i ')}.`;
}

// „07:45" — godzina w kolorze godzinowej, minuty w kolorze minutowej
const samCzas =(tm, zapis = cwCyfry) => zapis(tm).replace(/^(\d+):(\d+)$/, '<span class="g">$1</span>:<span class="m">$2</span>');
// poziom 6: zdanie („Za pięć siódma") z po / za w kolorach połówek tarczy; całe w jednym <span> — .sam-dwa .sam-duzy
// stawia je na środku miejsca na 2 wiersze
const samZdanie = tm => `<span>${cwZdanie(tm).replace(/\b(po|za|Za)\b/,
                                                     w => `<span class="sam-${w.toLowerCase()}">${w}</span>`)}</span>`;

// krok 1 poziomu 4: minutowa jedzie kawałek po kawałku 12 → 3 → 6 → 9 → 12 (od 7:00, do 60 — Lasha), miniony kawałek się zabarwia,
// pod zegarem „15 minut", „30 minut", „45 minut", „60 minut" i od pierwszego kawałka mały „15 minut to kwadrans."; na końcu kółko
// pod 12. Każdy kawałek ma swoją zieleń, od jasnej (12 → 3) do ciemnej (9 → 12) — CSS .sam-cwiartka.c0 … c3
function samCwiartki(s) {
  (function kawalek(i) {
    samJedz(s, 420 + i * 15, 435 + i * 15, () => {
      s.cwiartki([...Array(i + 1).keys()]);
      s.wynik(`<span class="m">${15 * (i + 1)}</span> minut`, '15 minut to <b>kwadrans</b>.');   // Lasha: „ამას მეორენაირად ჰქვია კვადრანსი"
      if (i < 3) kawalek(i + 1); else s.kolko(0);
    });
  })(0);
}

// krok 3 poziomu 4: dziecko ciągnie minutową, godzinowa jedzie za nią; zabarwia się kawałek, w którym stoi minutowa
// (na 3 — jeszcze ten 12 → 3, na pełnej godzinie żaden); pod zegarem najbliższe 15 minut: „07:15" · „Piętnaście po siódmej"
function samKawalek(s) {
  const pisz = nt => {
    const tt = (nt % 720 + 720) % 720, q = Math.round(tt / 15) * 15 % 720;
    s.cwiartki([Math.ceil(tt % 60 / 15) - 1]);
    s.wynik(samCzas(q), cwZdanie(q));
  };
  pisz(420);
  s.ciagnij(pisz);
}

// poziom 7: 14:25 i 00:40 jak na liście poziomów (na tarczy 2:25 = t 145, 12:40 = t 40); tarcza z po13 — po południu
// cyfry 13 … 23 (s.z.popo)
const SAM_13_MS = 1000;     // krok 1: tyle stoi „02:25", zanim cyfry staną się 13 … 23
// krok 1 poziomu 7: „02:25" → po chwili cyfry 1 … 11 stają się 13 … 23, pod zegarem „14:25" · „2 + 12 = 14"
function samDodaj12(s) {
  s.jedzie();
  setTimeout(() => {
    if (!s.zywy()) return;
    s.z.popo(true);
    if (window.Dzwiek) Dzwiek.zatrzask();
    s.wynik(samCzas(865, cwCyfry24), '<span class="g">2</span> + 12 = <span class="g">14</span>');
    s.stoi();
  }, SAM_13_MS);
}
// krok 3 poziomu 7: dziecko samo przesuwa wskazówki od 12:00 (południe); pod zegarem na żywo „17:25" · „Wieczorem" —
// cała doba, najbliższe 5 minut; po południu tarcza pokazuje 13 … 23, od północy do południa 1 … 11. Liczy się droga od
// startu (bez zawijania na 12).
function samPoludnieCiagnij(s) {
  let D = 0, ost = 0;
  const pisz = () => {
    const T = ((720 + Math.round(D / 5) * 5) % 1440 + 1440) % 1440;
    s.z.popo(T >= 720);
    s.wynik(samCzas(T, cwCyfry24), duza(pora(T)));
  };
  pisz();
  s.ciagnij(nt => {
    let d = nt - ost;
    if (d > 360) d -= 720;
    if (d < -360) d += 720;
    ost = nt;
    D += d;
    pisz();
  });
}

// poziom 8: 14:05 jak na liście poziomów (na tarczy 2:05 = t 125)
const SAM_1405 = 845;       // minuty od północy
// później — kolor „po" z poziomów 3 i 6, wcześniej — „za" (Lasha: „ფერები უნდა განსხვავდებოდეს"): wycinki od 05 do minutowej,
// x minut od 14:05 (+ w przód, − w tył), najwyżej pełne koło (przy 60 łuk znika)
function samPrzesunKliny(s) {
  const po = s.klin('sam-pol-po'), za = s.klin('sam-pol-za');
  return x => {
    x = Math.max(-59.9, Math.min(59.9, x));
    po.setAttribute('d', uplywWycinek(5, Math.max(0, x)));
    za.setAttribute('d', uplywWycinek(5 + Math.min(0, x), Math.max(0, -x)));
  };
}
// pod zegarem „14:20" · „15 minut później" (d minut od 14:05; słowo w kolorze swojego wycinka), d = 0 — sama godzina
const samPrzesunNapis = (s, d, maly) => s.wynik(samCzas(((SAM_1405 + d) % 1440 + 1440) % 1440, cwCyfry24), maly ??
  (d > 0 ? `${d} minut <span class="sam-po">później</span>` : d < 0 ? `${-d} minut <span class="sam-za">wcześniej</span>` : ''));
// kroki 1 i 2 poziomu 8: 👆 ciągnie minutową o d minut (10 — później, −10 — wcześniej, przez 12), godzinowa jedzie za nią,
// wycinek rośnie za minutową, pod zegarem na żywo „14:10" · „5 minut później"; na końcu maly (jeśli jest) zamiast „10 minut…"
function samPrzesun(s, d, maly) {
  const klin = samPrzesunKliny(s);
  let ost = 0;
  samPrzesunNapis(s, 0);
  samJedz(s, 125, 125 + d, () => samPrzesunNapis(s, d, maly), { palec: true, klatka: tt => {
    klin(tt - 125);
    const n = Math.trunc((tt - 125) / 5) * 5;
    if (n !== ost) { samPrzesunNapis(s, n); ost = n; }
  } });
}
// krok 3 poziomu 8: dziecko ciągnie minutową od 14:05, godzinowa jedzie za nią; wycinek za wskazówką, pod zegarem na żywo
// jak w krokach 1 i 2 — najbliższe 5 minut. Liczy się droga od startu (bez zawijania na 12).
function samPrzesunCiagnij(s) {
  const klin = samPrzesunKliny(s);
  let D = 0, ost = 125;
  samPrzesunNapis(s, 0);
  s.ciagnij(nt => {
    let d = nt - ost;
    if (d > 360) d -= 720;
    if (d < -360) d += 720;
    ost = nt;
    D += d;
    klin(D);
    samPrzesunNapis(s, Math.round(D / 5) * 5);
  });
}

// poziom 9: most 13:50 → 14:00 → 14:10 jak na liście poziomów (na tarczy 1:50 = t 110), skoki 10 + 10
const SAM_MOST = 830;       // 13:50 — minuty od północy
// most z rundy (cwMost) pod zegarem, bez wiersza „razem" — razem to duży napis pod nim; wycinek od 50 w dwóch
// kawałkach: do 12 zielony, za 12 w kolorze „po" z poziomów 3 i 6 (Lasha: „12-ის შემდეგ სხვა ფერი დაიწყოს")
function samMostPod(s) {
  const m = cwMost(SAM_MOST, 10, 10);
  m.razem.remove();
  s.pod(m.el);
  const kliny = [s.klin(), s.klin('sam-pol-po')];
  return { m, klin: x => {                       // x — ile minut od 50
    kliny[0].setAttribute('d', uplywWycinek(50, Math.min(x, 10)));
    kliny[1].setAttribute('d', uplywWycinek(0, x - 10));
  } };
}
// napis nad strzałką „+10 min": jeszcze liczony — liczba w żółtej plakietce jak „?" w rundzie, gotowy — zielony
function samSkok(el, x, gotowy) {
  el.classList.toggle('teraz', !gotowy);
  el.classList.toggle('zrobione', gotowy);
  el.innerHTML = `+<b>${x}</b> min`;
}

// kroki 1 i 2 poziomu 9: skok i (0 — do pełnej godziny, 1 — reszta) — nad strzałką „+? min", wskazówki jadą 10 minut,
// wycinek rośnie za minutową, duży napis liczy „5 minut", „10 minut"; na końcu „+10 min" zielone i kółko pod 12 (krok 1)
// albo „razem: 20 minut" · „10 + 10" (krok 2)
function samMost(s, i) {
  const { m, klin } = samMostPod(s), skok = m.skoki[i], od = 110 + 10 * i;
  if (i) samSkok(m.skoki[0], 10, true);
  samSkok(skok, '?', false);
  let ost = 0;
  samJedz(s, od, od + 10, () => {
    samSkok(skok, 10, true);
    if (i) s.wynik('razem: <span class="m">20</span> minut', '10 + 10'); else s.kolko(0);
  }, { klatka: tt => {
    klin(tt - 110);
    const n = Math.floor((tt - od) / 5) * 5;
    if (n !== ost) { s.wynik(`<span class="m">${n}</span> minut`); ost = n; }
  } });
}

// krok 3 poziomu 9: dziecko ciągnie minutową od 13:50, godzinowa jedzie za nią; most rośnie za wskazówką — do 14:00
// jeden skok (13:50 → 13:55 · +5), dalej dwa (13:50 → 14:00 → 14:25 · +10 · +25), wycinek od 50; pod spodem
// „razem: 35 minut" · „10 + 25". Liczy się droga od startu (bez zawijania na 12); w tył od startu — sam start.
// Co 60 minut od nowa (Lasha: „როცა მივა 60 წუთზე რესეტდებოდეს"): start tam, gdzie wskazówka — 14:50, 15:50 …
function samMostCiagnij(s) {
  const { m, klin } = samMostPod(s), [s1, s2] = m.skoki, [c1, c2, c3] = m.czasy;
  let D = 0, ost = 110;
  const pisz = () => {
    const d0 = Math.max(0, Math.round(D / 5) * 5), g = d0 - d0 % 60, start = (SAM_MOST + g) % 1440;
    const d = d0 - g, a = Math.min(d, 10), b = d - a;
    klin(Math.max(0, D - g));
    [s1, m.strz[0], c2].forEach(e => e.classList.toggle('sam-ukryty', !a));
    [s2, m.strz[1], c3].forEach(e => e.classList.toggle('sam-ukryty', !b));
    samSkok(s1, a, a === 10);
    samSkok(s2, b, true);
    c1.textContent = cwCyfry24(start);
    c2.textContent = cwCyfry24((start + a) % 1440);
    c3.textContent = cwCyfry24((start + d) % 1440);
    s.wynik(d ? `razem: <span class="m">${d}</span> minut` : '', b ? `${a} + ${b}` : '');
  };
  pisz();
  s.ciagnij(nt => {
    let d = nt - ost;
    if (d > 360) d -= 720;
    if (d < -360) d += 720;
    ost = nt;
    D += d;
    pisz();
  });
}

// poziom 10: 16:30 jak na liście poziomów (na tarczy 4:30 = t 270)
const SAM_1630 = '<span class="g">16</span>:<span class="m">30</span>';
// krok 1 poziomu 10 (Lasha: „სწრაფად აჩვენე ორივე ისარის ანიმაცია და მერე დალეი" · „11 საათიდან გადმოიტანოს"): od 11:00
// 👆 długa 12 → 6 (krótka stoi na 11), zaraz potem krótka 11 → 12 → 1 … → pół drogi od 4 do 5 (długa stoi), tik przy każdej
// liczbie; razem ~2,7 s, na końcu „16:30" i reguła ze „Sprawdź"
function samOsobno(s) {
  samJedz(s, 660, 690, () => samJedz(s, 660, 990, () => s.wynik(SAM_1630, '<b class="g">Krótka</b> — między 4 a 5.'),
                                     { palec: true, sama: 'g', stoi: 690, przed: 100 }),
          { palec: true, sama: 'm', stoi: 660, ms: 600 });
}
// kroki 2–4 poziomu 10: tarcza z rundy (CW_NIETYPOWE), dziecko samo przesuwa wskazówki — razem, jak w zwykłym zegarze
// (osobno dałoby godzinę nie do zapisania); pod zegarem na żywo „16:35" — cała doba od 16:30 (jak w kroku 1 i w Ustaw):
// w przód 23:55 → 00:00 → 01:00 …, w tył tak samo (Lasha: „ყველა ახალ ციფერბლატზე … გადაწიოს ისრები და ქვევით დაეწერება
// ეხლა რომელი საათია ციფრებით" · „რატომ არ არის 1,2,3?" → „ბ მთელი დღე"). Liczy się droga od startu (bez zawijania na 12).
function samTarczaCiagnij(s) {
  let D = 0, ost = 270;
  const pisz = () => s.wynik(samCzas(((990 + Math.round(D / 5) * 5) % 1440 + 1440) % 1440, cwCyfry24),   // 990 = 16:30
                             'Przesuwaj wskazówki palcem.');
  pisz();
  s.ciagnij(nt => {
    let d = nt - ost;
    if (d > 360) d -= 720;
    if (d < -360) d += 720;
    ost = nt;
    D += d;
    pisz();
  });
}

// poziom: tylko — jak w jego ćwiczeniach ('g' | 'm' | '' obie) · chwyt 'm' — łapie się zawsze minutowa (tarcza.js)
// · cwiartki — tarcza pocięta na 4 kawałki (poziom 4), kawałki zabarwia s.cwiartki(lista) · cyfry — tarcza (domyślnie 'zwykle'; 'minuty' — podpisy 05 … 55
// ukryte, zapalają się przy liczeniu) · po13 — tarcza umie po południu pokazać 13 … 23 (poziom 7; włącza s.z.popo) · kroki.
// krok: zdanie — w ramce · t — gdzie stoją wskazówki · osobno — każda wskazówka chodzi sama (tarcza.js; poziom 10, krok 1)
// · cyfry — w tym kroku inna tarcza (z.cyfry; poziom 10) · swieci 'g' | 'm' — która miga · kolko — pod którą liczbą zielone
// kółko (0 = 12) · pol 'po' | 'za' | 'oba' — która połowa tarczy zabarwiona · bez 'g' — godzinowej nie widać · duzy, maly — pod zegarem · pokaz(s) — animacja kroku (s.wynik(duzy, maly), s.kolko(H) na końcu;
// s.ciagnij(fn) — w tym kroku dziecko samo ciągnie wskazówkę, fn(t, puszczone) przy każdym ruchu; s.pod(el) — el pod
// zegarem, nad dużym napisem, tylko w tym kroku — poziom 9: most). Poziom bez samouczka — null.
// Krok 4 (Lasha 27.09: „მეოთხე გვერდი სადაც ბავშვი გადაწევს ისარს") — dziecko samo, bez palca.
const CW_SAMOUCZKI = [
  { tylko: 'g', kroki: [                         // 1 · Godziny: przykład 05:00 jak na liście poziomów
    { zdanie: '<b class="g">Krótka wskazówka</b> pokazuje godzinę.', t: 300, swieci: 'g', kolko: 5,
      duzy: '<span class="g">Piąta</span>' },
    { zdanie: '<b class="m">Długa wskazówka</b> na 12 — pełna godzina.', t: 300, swieci: 'm', kolko: 0,
      duzy: '<span class="g">05</span>:<span class="m">00</span>' },
    { zdanie: 'Popatrz, jak przesunąć <b class="g">krótką wskazówkę</b> na 9.', t: 300,
      pokaz: s => samJedz(s, 300, 540, () => { s.kolko(9); s.wynik('<span class="g">Dziewiąta</span>', '09:00'); },
                          { palec: true }) },
    { zdanie: 'Przesuwaj <b class="g">krótką wskazówkę</b> palcem.', t: 300,
      pokaz: s => {                              // pod zegarem na żywo „Szósta · 06:00" (Lasha: „ქვემოთ ცოცხალი საათი")
        const pisz = nt => { const H = Math.round(nt / 60) % 12; s.wynik(`<span class="g">${duza(GODZ[H])}</span>`, cwCyfry(H * 60)); };
        pisz(300);
        s.ciagnij(pisz);
      } }
  ] },
  { tylko: 'm', cyfry: 'minuty', kroki: [        // 2 · Minuty: przykład 35 jak na liście poziomów
    { zdanie: '<b class="m">Długa wskazówka</b> pokazuje minuty.', t: 35, swieci: 'm', kolko: 7,
      duzy: '<span class="m">35</span> minut' },
    { zdanie: 'Każda liczba to <b class="m">5 minut</b>. Licz piątkami.', t: 0,
      pokaz: s => samJedz(s, 0, 35, () => s.kolko(7), { licz: true }) },
    { zdanie: 'Popatrz, jak przesunąć <b class="m">długą wskazówkę</b> na 4.', t: 0,
      pokaz: s => samJedz(s, 0, 20, () => s.kolko(4), { palec: true, licz: true }) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 0, pokaz: samOstatnie4 }
  ] },
  { tylko: 'm', kroki: [                         // 3 · Po i za: przykład 50 „za dziesięć" jak na liście poziomów
    { zdanie: 'Po prawej — <b class="sam-po">po</b>.', t: 0, pol: 'po', maly: SAM_12_6,
      pokaz: s => samJedz(s, 0, 10, () => { s.kolko(2); s.wynik('dziesięć <span class="sam-po">po</span>', SAM_12_6); }) },
    { zdanie: 'Po lewej — <b class="sam-za">za</b>: ile brakuje do 12.', t: 50, pol: 'za',
      pokaz: s => samKlin(s, 50, 10, () => { s.kolko(10); s.wynik('<span class="sam-za">za</span> dziesięć'); }) },
    // bez kroku „Popatrz, jak przesunąć" (Lasha: „ბავშვმა უკვე იცის როგორ უნდა გადაათრიოს დიდი და პატარა ისარი")
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 0, pol: 'oba',
      pokaz: s => {                              // pod zegarem na żywo „pięć po" … „za pięć" (Lasha: „საათი ეუბნებოდეს რომელია ზა თუ პო")
        const pisz = nt => s.wynik(samNazwa(Math.round(nt / 5) % 12));
        pisz(0);
        s.ciagnij(pisz);
      } }
  ] },
  // 4 · Co 15 minut: pizza z 4 kawałków, godzina 7 jak na liście poziomów (07:45); bez kroku „Przesuń" (Lasha: „ბავშვმა
  // ამ ლეველამდე უკვე კარგად გაიგო როგორ მოქმედებს საათი")
  { tylko: '', chwyt: 'm', cwiartki: true, kroki: [
    { zdanie: '<b class="m">4&nbsp;kawałki</b> po 15 minut, czyli <b class="m">4&nbsp;kwadranse</b>.', t: 420, bez: 'g', pokaz: samCwiartki },
    { zdanie: '<b class="g">Krótka wskazówka</b> też idzie — powoli.', t: 420, swieci: 'g',
      duzy: samCzas(420), maly: 'Siódma',
      pokaz: s => samJedz(s, 420, 450, () => s.wynik(samCzas(450), 'Wpół do ósmej')) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 420, pokaz: samKawalek }
  ] },
  // 5 · Co 5 minut: najpierw krótka, potem długa; 08:35 jak na liście poziomów. Krok 1 — na pułapkę 09:35, krok 2 — na 08:07
  { tylko: '', chwyt: 'm', cyfry: 'minuty', kroki: [
    { zdanie: 'Najpierw <b class="g">krótka</b>: liczba, którą minęła.', t: 515, swieci: 'g', kolko: 8,
      duzy: '<span class="g">08</span>', maly: 'jeszcze nie 9' },
    { zdanie: 'Potem <b class="m">długa</b>: licz piątkami.', t: 480,
      pokaz: s => samJedz(s, 480, 515, () => { s.kolko(7); s.wynik(samCzas(515), '7 to 35 minut, a nie 07'); },
                          { licz: true }) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 515,
      pokaz: s => {                              // pod zegarem na żywo „08:40", „08:45" … — najbliższe 5 minut
        const pisz = nt => s.wynik(samCzas(Math.round(nt / 5) * 5 % 720));
        pisz(515);
        s.ciagnij(pisz);
      } }
  ] },
  // 6 · Słowami: po → godzina, którą krótka minęła · za → ta, do której idzie (pułapka „Za pięć szósta"); 6:55 jak na
  // liście poziomów. dwa — pod zegarem miejsce na 2 wiersze („Dwadzieścia pięć po szóstej" nie mieści się w jednym)
  { tylko: '', chwyt: 'm', dwa: true, kroki: [
    // napis przez pokaz, nie duzy: cwZdanie potrzebuje MINUTY / GODZ_EJ, a te strona definiuje dopiero po samouczki.js
    { zdanie: '<b class="sam-po">Po</b> — godzina, którą krótka minęła.', t: 370, pol: 'po', swieci: 'g', kolko: 6,
      pokaz: s => s.wynik(samZdanie(370), cwCyfry(370)) },
    { zdanie: '<b class="sam-za">Za</b> — godzina, do której krótka idzie.', t: 415, pol: 'za',
      pokaz: s => samKlin(s, 55, 5, () => { s.kolko(7); s.wynik(samZdanie(415), 'za pięć minut będzie siódma'); }) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 415, pol: 'oba',
      pokaz: s => {                              // pod zegarem na żywo zdanie i cyfry — najbliższe 5 minut
        const pisz = nt => { const q = Math.round(nt / 5) * 5 % 720; s.wynik(samZdanie(q), cwCyfry(q)); };
        pisz(s.t);
        s.ciagnij(pisz);
      } }
  ] },
  // 7 · Po południu: dodaj 12 · po północy 00 (pułapki z Wybierz: 02:25 i 12:40); plan z czatu → „კი"
  { tylko: '', po13: true, kroki: [
    { zdanie: '<b>Po południu</b> — dodaj <b class="g">12</b>.', t: 145, swieci: 'g', duzy: samCzas(145),
      pokaz: samDodaj12 },
    { zdanie: '<b>Po północy</b> — <b class="g">00</b>, nie 12.', t: 40, swieci: 'g', kolko: 0,
      duzy: samCzas(40, cwCyfry24), maly: 'W nocy' },
    { zdanie: 'Przesuwaj wskazówki palcem.', t: 0, pokaz: samPoludnieCiagnij }
  ] },
  // 8 · Wcześniej, później: 14:05 jak na liście poziomów; w tył przez 12 — pułapka 14:55 z Wybierz (plan z czatu → „ოკ";
  // „długa wskazówka przesuwa się…" w 2 wierszach się nie mieściło → krótko, Lasha: „Później — do przodu.")
  { tylko: '', chwyt: 'm', kroki: [
    { zdanie: '<b class="sam-po">Później</b> — do przodu.', t: 125, pokaz: s => samPrzesun(s, 10) },
    { zdanie: '<b class="sam-za">Wcześniej</b> — do tyłu.', t: 125,
      pokaz: s => samPrzesun(s, -10, 'Przez 12 — jest już 13, nie 14.') },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 125, pokaz: samPrzesunCiagnij }
  ] },
  // 9 · Ile minut?: most z rundy, najpierw do pełnej godziny, potem reszta, razem = oba skoki (plan z czatu → Lasha „ოკ")
  { tylko: '', chwyt: 'm', kroki: [
    { zdanie: 'Najpierw — do <b class="m">pełnej godziny</b>.', t: 110, pokaz: s => samMost(s, 0) },
    { zdanie: 'Potem — to, co <b class="m">zostało</b>.', t: 120, pokaz: s => samMost(s, 1) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 110, pokaz: samMostCiagnij }
  ] },
  // 10 · Mistrz: wskazówki osobno jak w rundzie Ustaw (👆 na krótkiej pokazuje, gdzie ją łapać), potem każda tarcza z rundy
  // w swoim kroku — dziecko patrzy, przesuwa i samo idzie dalej (Lasha: „თავად გადავა მომდევნოზე როცა … გაიაზრებს ახალ
  // პირობას"); plan z czatu → „კი"
  { tylko: '', kroki: [
    { zdanie: 'Tu każda wskazówka chodzi <b>osobno</b>.', t: 660, osobno: true, swieci: 'g', pokaz: samOsobno },
    // najpierw, że zegar może wyglądać inaczej, potem jak czytać tę tarczę (Lasha: „დამატებითი ახსნა რომ საათი შეიძლება
    // გამოიყურებოდეს სხვადასხვანაირად" → „ოკ"); <br> — dwa wiersze łamane po sensie (Lasha: „წინასწარ სწორი გადასვლით")
    { zdanie: 'Zegary bywają różne.<br>Tu są tylko 12, 3, 6 i 9.', t: 270, cyfry: 'cztery', pokaz: samTarczaCiagnij },
    { zdanie: 'Czasem nie ma liczb.<br>12 jest na górze, 6 na dole.', t: 270, cyfry: 'brak', pokaz: samTarczaCiagnij },
    { zdanie: 'Czasem liczby są rzymskie:<br>IV to 4, V to 5.', t: 270, cyfry: 'rzymskie', pokaz: samTarczaCiagnij }
  ] }
];

const samouczekJest = n => !!CW_SAMOUCZKI[n];
function samouczekByl(n) { try { return !!localStorage.getItem(SAM_KLUCZ(n)); } catch (e) { return false; } }

// samouczek poziomu nrPoz (od 0); licznik — „2/3" w nagłówku; potem() — po ostatnim przycisku; odKroku — do sprawdzania;
// koniec — napis ostatniego przycisku: „Wróć" (💡), „Zaczynamy!" przy pierwszym wejściu w poziom (Lasha 28.09)
// nrPoz może też być samym samouczkiem ({ tylko, kroki … }) — 🏋 Trening w index.html; jego t0 (0 … 1439) — start
// każdego kroku zamiast k.t (Start: teraz — Lasha 29.09). Funkcje pokaz dostają start w s.t (z porą doby).
function samouczek(box, licznik, nrPoz, potem, odKroku = 0, koniec = 'Wróć') {
  const sam = typeof nrPoz === 'object' ? nrPoz : CW_SAMOUCZKI[nrPoz], kroki = sam.kroki;
  const tKroku = k => sam.t0 != null ? sam.t0 : k.t;
  const znak = box.cwZnak = {};                 // spóźnione setTimeout / rAF (rundy albo kroku) nic nie piszą
  box.textContent = '';
  const ramka = h('div', 'sam-ramka' + (sam.dwa ? ' sam-dwa' : '')), pyt = h('div', 'sam-gora'),
        miejsce = h('div', 'sam-zegar'), cel = h('div', 'sam-pod');
  const zdanie = h('p'), duzy = h('p', 'sam-duzy'), maly = h('p', 'sam-maly');
  const dalejB = h('button', 'btn btn-primary btn-lg sam-dalej');
  pyt.append(h('span', 'sam-znak', '💡 Jak to działa?'), zdanie);
  cel.append(duzy, maly, dalejB);
  ramka.append(pyt, miejsce, cel);
  box.append(ramka);

  const svg = noweSvg('duzy');
  miejsce.append(svg);
  let naRuch = null;                             // krok, w którym dziecko samo ciągnie (s.ciagnij), inaczej tylko do patrzenia
  const z = Zegar(svg, { styl, cyfry: sam.cyfry || 'zwykle', rama: RAMA[styl] || '', t: tKroku(kroki[0]) % 720, tylko: sam.tylko,
                         chwyt: sam.chwyt, po13: sam.po13,
                         zmiana: (nt, puszczone) => { if (naRuch) naRuch(nt, puszczone); } });
  const wsk = svg.querySelectorAll('.w-godz, .w-min, .m-wsk, .k-wsk');   // [godzinowa, minutowa] — w każdym stylu w tej kolejności
  const tarcza = wsk[1].parentNode.parentNode;   // grupa z cyframi i wskazówkami
  const podpisy = svg.querySelectorAll('.s-min, .m-min, .k-min');         // 00, 05 … 55 (tylko przy cyfrach 'minuty')
  // połówki tarczy (poziom 3): prawa „po", lewa „za" — nad tłem, pod cyframi; zielony wycinek (s.klin) nad nimi
  const polowa = (klasa, d) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('class', klasa);
                                 p.setAttribute('d', d); return p; };
  const po = polowa('sam-pol-po', 'M100 100 V11 A89 89 0 0 1 100 189 Z'),
        za = polowa('sam-pol-za', 'M100 100 V189 A89 89 0 0 1 100 11 Z');
  svg.querySelector('.s-tlo, .m-tlo, .k-tlo').after(po, za);
  // poziom 4: 4 kawałki po 15 minut (zabarwia s.cwiartki) i cięcia 12 · 3 · 6 · 9 od środka do cyfr
  const cwiartki = [];
  if (sam.cwiartki) {
    for (let i = 0; i < 4; i++) cwiartki.push(polowa(`sektor sam-cwiartka c${i} sam-ukryty`, uplywWycinek(i * 15, 15)));
    za.after(...cwiartki, polowa('sam-ciecie', 'M100 48 V152 M48 100 H152'));
  }

  let nr = Math.min(kroki.length - 1, odKroku);
  let dodatek = null;                            // s.pod — pod zegarem, tylko w swoim kroku
  function krok() {
    const k = kroki[nr], moj = box.samKrok = {};
    const zywy = () => box.cwZnak === znak && box.samKrok === moj;
    licznik.textContent = `${nr + 1}/${kroki.length}`;
    naRuch = null;
    if (dodatek) { dodatek.remove(); dodatek = null; }
    svg.style.pointerEvents = 'none';
    svg.querySelectorAll('.cw-kolko, .sam-palec, .sam-klin').forEach(e => e.remove());
    podpisy.forEach(e => e.classList.add('sam-ukryty'));
    po.classList.toggle('sam-ukryty', k.pol !== 'po' && k.pol !== 'oba');
    za.classList.toggle('sam-ukryty', k.pol !== 'za' && k.pol !== 'oba');
    cwiartki.forEach(e => e.classList.add('sam-ukryty'));
    wsk.forEach(w => w.classList.remove('sam-swieci'));
    wsk[0].classList.toggle('sam-ukryty', k.bez === 'g');
    z.osobno(k.osobno);
    if (sam.po13) z.popo(false);                 // poziom 7: każdy krok od cyfr 1 … 12, 13 … 23 włącza pokaz
    if (k.cyfry) z.cyfry(k.cyfry);
    z.ustaw(tKroku(k) % 720);
    if (k.swieci) wsk[k.swieci === 'g' ? 0 : 1].classList.add('sam-swieci');
    if (k.kolko != null) cwKolko(svg, k.kolko, true, true);
    zdanie.innerHTML = k.zdanie;
    duzy.innerHTML = k.duzy || '';
    maly.innerHTML = k.maly || '';
    dalejB.textContent = nr < kroki.length - 1 ? 'Dalej' : koniec;
    dalejB.disabled = false;
    let ruchy = 0;                               // ile animacji kroku jeszcze jedzie — póki > 0, „Dalej" nieczynne
    if (k.pokaz) k.pokaz({ z, svg, tarcza, zywy, reka: sam.tylko, t: tKroku(k),
      jedzie: () => { ruchy++; dalejB.disabled = true; },
      stoi: () => { if (--ruchy <= 0) dalejB.disabled = false; },
      kolko: H => cwKolko(svg, H, true, true),
      podpis: n => { if (podpisy[n % 12]) podpisy[n % 12].classList.remove('sam-ukryty'); },
      podpisy: lista => {                        // świecą tylko te (liczby bez zawijania: 13 = 05)
        const widac = new Set(lista.map(n => (n % 12 + 12) % 12));
        podpisy.forEach((e, i) => e.classList.toggle('sam-ukryty', !widac.has(i)));
      },
      polowy: b => [po, za].forEach(e => e.classList.toggle('sam-ukryty', !b)),   // 🏋 Trening: „Po i za"
      cwiartki: lista => cwiartki.forEach((e, i) => e.classList.toggle('sam-ukryty', !lista.includes(i))),
      ciagnij: fn => { naRuch = fn; svg.style.pointerEvents = ''; },
      pod: el => { dodatek = el; cel.prepend(el); },
      klin: (klasa = 'sektor') => { const k = document.createElementNS(NS, 'path'); k.setAttribute('class', `${klasa} sam-klin`);
                    za.after(k); return k; },
      wynik: (d, m) => { duzy.innerHTML = d || ''; maly.innerHTML = m || ''; } });
    log(`samouczek ${nr + 1}/${kroki.length}: ${zdanie.textContent}`);
    simScreen(`samouczek-${nr + 1}`);
  }
  dalejB.onclick = () => {
    if (nr < kroki.length - 1) { nr++; krok(); return; }
    log('samouczek: koniec → runda');
    potem();
  };
  krok();
}

// wejście w poziom nrPoz (od 0): za pierwszym razem najpierw samouczek (jeśli poziom go ma), potem runda();
// zapisany od razu — wyjście w połowie nie pokaże go znowu, dalej tylko przez 💡
function cwStart(box, licznik, nrPoz, runda) {
  if (!samouczekJest(nrPoz) || samouczekByl(nrPoz)) return runda();
  try { localStorage.setItem(SAM_KLUCZ(nrPoz), '1'); } catch (e) {}
  samouczek(box, licznik, nrPoz, runda, 0, 'Zaczynamy!');
}
