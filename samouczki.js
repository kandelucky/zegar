// samouczki.js — „Jak to działa?": krótki samouczek przed poziomem ćwiczeń (Lasha 27.09: „უფრო გასაგები ტუტორიალი",
// plan z czatu „კი"): 3 kroki z „Dalej" (Lasha: „შეამოკლე 3 ნაბიჯამდე"), zegar sam pokazuje, co zdanie mówi (miga
// wskazówka, kółko pod liczbą, wskazówka jedzie, palec ją ciągnie). Bez głosu (Lasha: „ხმები არ არის საჭირო").
// Przy pierwszym wejściu w poziom sam, potem przez 💡 w nagłówku.
// Na razie poziomy 1–4; reszta według tabeli z czatu, każdy po jego „კი".
// Cała pomoc w jednej ramce (Lasha: „მთლიანი დახმარება უნდა იყოს ჩარჩოში … რომ ეს არაა ჩვეულებრივი საათი"): zdanie (22),
// zegar, pod nim duży napis (32), mały opis (17) i „Dalej" — w ostatnim kroku „Wróć" → runda (Lasha: „Teraz ty!"
// „არ არის ინტუიციური").
// Podgląd: sim.html?app=cwiczenia.html%3Fpoziom%3D2%26samouczek%3D1 (&krok=N — od kroku N).
// W aplikacji: index.html (cwStart przy wejściu w poziom, 💡 w nagłówku); podgląd osobno — cwiczenia.html.
// Korzysta z globalnych: NS, h, noweSvg, styl, RAMA, log, simScreen, GODZ, duza, MINUTY, Zegar (tarcza.js),
// uplywWycinek (lekcja-uplyw.js), cwKolko, cwCyfry (cwiczenia.js).
"use strict";

const SAM_KLUCZ = n => `zegar-samouczek-${n + 1}`;   // localStorage: samouczek poziomu n + 1 już obejrzany do końca
// szybciej (Lasha: „ანიმაცია ძალიან ნელია. ბავშვები ეგრევე შემდეგს აწვებიან"); „Dalej" nieczynne, póki coś jedzie
const SAM_LICZBA_MS = 250;  // tyle wskazówka jedzie od liczby do liczby
const SAM_PRZED_MS = 300, SAM_PO_MS = 150;   // pauza przed ruchem i po nim
const SAM_12_6 = '12 — pełna godzina · 6 — wpół do';   // poziom 3, krok 1 — mały napis
// poziom 3: nazwa minut k × 5 (MINUTY z index.html), słowa po / za w kolorach połówek tarczy
const samNazwa = k => MINUTY[k].replace(/\b(po|za)\b/, w => `<span class="sam-${w}">${w}</span>`);

// wskazówka samouczka (s.reka 'g' | 'm') jedzie od od do cel (minuty), tik przy każdej liczbie; o.palec — 👆 na jej
// końcu, jakby ją ciągnął; o.licz — przy każdej minionej liczbie zapala się jej podpis minut (05, 10 … — tarcza
// z cyframi 'minuty') i rośnie duży napis „15 minut". Na końcu gotowe(). s.zywy() = false, gdy krok już się zmienił.
// s.jedzie() / s.stoi() — „Dalej" nieczynne od wywołania do końca (gotowe() przed s.stoi(), więc łańcuch — dalej nieczynne)
function samJedz(s, od, cel, gotowe, o = {}) {
  s.jedzie();
  const m = s.reka !== 'g', co = m ? 5 : 60;     // ile minut od liczby do liczby (obie wskazówki — jak minutowa)
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
    s.z.ustaw(tt);
  };
  stan(od);
  setTimeout(() => {
    if (!s.zywy()) return;
    const start = performance.now(), ms = (cel - od) / co * SAM_LICZBA_MS;
    let ost = Math.floor(od / co);
    (function krok(n) {
      if (!s.zywy()) return;
      const q = Math.min(1, (n - start) / ms), e = q < .5 ? 2 * q * q : 1 - (2 - 2 * q) ** 2 / 2;
      const tt = od + (cel - od) * e;
      stan(tt);
      const nL = Math.floor(tt / co);
      if (nL !== ost) {
        if (window.Dzwiek) Dzwiek.tik();
        if (o.licz) {                            // wolna klatka może przeskoczyć liczbę — zapalają się wszystkie minione
          for (let i = ost + 1; i <= nL; i++) s.podpis(i);
          s.wynik(`<span class="m">${nL * 5}</span> minut`);
        }
        ost = nL;
      }
      if (q < 1) { requestAnimationFrame(krok); return; }
      if (window.Dzwiek) Dzwiek.zatrzask();
      setTimeout(() => { if (s.zywy()) { if (palec) palec.remove(); gotowe(); s.stoi(); } }, SAM_PO_MS);
    })(start);
  }, SAM_PRZED_MS);
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

// „07:45" — godzina w kolorze godzinowej, minuty w kolorze minutowej
const samCzas = tm => cwCyfry(tm).replace(/^(\d+):(\d+)$/, '<span class="g">$1</span>:<span class="m">$2</span>');

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

// poziom: tylko — jak w jego ćwiczeniach ('g' | 'm' | '' obie) · chwyt 'm' — łapie się zawsze minutowa (tarcza.js)
// · cwiartki — tarcza pocięta na 4 kawałki (poziom 4), kawałki zabarwia s.cwiartki(lista) · cyfry — tarcza (domyślnie 'zwykle'; 'minuty' — podpisy 05 … 55
// ukryte, zapalają się przy liczeniu) · kroki.
// krok: zdanie — w ramce · t — gdzie stoją wskazówki · swieci 'g' | 'm' — która miga · kolko — pod którą liczbą zielone
// kółko (0 = 12) · pol 'po' | 'za' | 'oba' — która połowa tarczy zabarwiona · bez 'g' — godzinowej nie widać · duzy, maly — pod zegarem · pokaz(s) — animacja kroku (s.wynik(duzy, maly), s.kolko(H) na końcu;
// s.ciagnij(fn) — w tym kroku dziecko samo ciągnie wskazówkę, fn(t, puszczone) przy każdym ruchu).
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
  ] }
];

const samouczekJest = n => !!CW_SAMOUCZKI[n];
function samouczekByl(n) { try { return !!localStorage.getItem(SAM_KLUCZ(n)); } catch (e) { return false; } }

// samouczek poziomu nrPoz (od 0); licznik — „2/3" w nagłówku; potem() — po „Wróć"; odKroku — do sprawdzania
function samouczek(box, licznik, nrPoz, potem, odKroku = 0) {
  const sam = CW_SAMOUCZKI[nrPoz], kroki = sam.kroki;
  const znak = box.cwZnak = {};                 // spóźnione setTimeout / rAF (rundy albo kroku) nic nie piszą
  box.textContent = '';
  const ramka = h('div', 'sam-ramka'), pyt = h('div', 'sam-gora'), miejsce = h('div', 'sam-zegar'), cel = h('div', 'sam-pod');
  const zdanie = h('p'), duzy = h('p', 'sam-duzy'), maly = h('p', 'sam-maly');
  const dalejB = h('button', 'btn btn-primary btn-lg sam-dalej');
  pyt.append(h('span', 'sam-znak', '💡 Jak to działa?'), zdanie);
  cel.append(duzy, maly, dalejB);
  ramka.append(pyt, miejsce, cel);
  box.append(ramka);

  const svg = noweSvg('duzy');
  miejsce.append(svg);
  let naRuch = null;                             // krok, w którym dziecko samo ciągnie (s.ciagnij), inaczej tylko do patrzenia
  const z = Zegar(svg, { styl, cyfry: sam.cyfry || 'zwykle', rama: RAMA[styl] || '', t: kroki[0].t, tylko: sam.tylko,
                         chwyt: sam.chwyt,
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
  function krok() {
    const k = kroki[nr], moj = box.samKrok = {};
    const zywy = () => box.cwZnak === znak && box.samKrok === moj;
    licznik.textContent = `${nr + 1}/${kroki.length}`;
    naRuch = null;
    svg.style.pointerEvents = 'none';
    svg.querySelectorAll('.cw-kolko, .sam-palec, .sam-klin').forEach(e => e.remove());
    podpisy.forEach(e => e.classList.add('sam-ukryty'));
    po.classList.toggle('sam-ukryty', k.pol !== 'po' && k.pol !== 'oba');
    za.classList.toggle('sam-ukryty', k.pol !== 'za' && k.pol !== 'oba');
    cwiartki.forEach(e => e.classList.add('sam-ukryty'));
    wsk.forEach(w => w.classList.remove('sam-swieci'));
    wsk[0].classList.toggle('sam-ukryty', k.bez === 'g');
    z.ustaw(k.t);
    if (k.swieci) wsk[k.swieci === 'g' ? 0 : 1].classList.add('sam-swieci');
    if (k.kolko != null) cwKolko(svg, k.kolko, true, true);
    zdanie.innerHTML = k.zdanie;
    duzy.innerHTML = k.duzy || '';
    maly.innerHTML = k.maly || '';
    dalejB.textContent = nr < kroki.length - 1 ? 'Dalej' : 'Wróć';
    dalejB.disabled = false;
    let ruchy = 0;                               // ile animacji kroku jeszcze jedzie — póki > 0, „Dalej" nieczynne
    if (k.pokaz) k.pokaz({ z, svg, tarcza, zywy, reka: sam.tylko,
      jedzie: () => { ruchy++; dalejB.disabled = true; },
      stoi: () => { if (--ruchy <= 0) dalejB.disabled = false; },
      kolko: H => cwKolko(svg, H, true, true),
      podpis: n => { if (podpisy[n % 12]) podpisy[n % 12].classList.remove('sam-ukryty'); },
      podpisy: lista => {                        // świecą tylko te (liczby bez zawijania: 13 = 05)
        const widac = new Set(lista.map(n => (n % 12 + 12) % 12));
        podpisy.forEach((e, i) => e.classList.toggle('sam-ukryty', !widac.has(i)));
      },
      cwiartki: lista => cwiartki.forEach((e, i) => e.classList.toggle('sam-ukryty', !lista.includes(i))),
      ciagnij: fn => { naRuch = fn; svg.style.pointerEvents = ''; },
      klin: () => { const k = document.createElementNS(NS, 'path'); k.setAttribute('class', 'sektor sam-klin');
                    za.after(k); return k; },
      wynik: (d, m) => { duzy.innerHTML = d || ''; maly.innerHTML = m || ''; } });
    log(`samouczek ${nr + 1}/${kroki.length}: ${zdanie.textContent}`);
    simScreen(`samouczek-${nr + 1}`);
  }
  dalejB.onclick = () => {
    if (nr < kroki.length - 1) { nr++; krok(); return; }
    try { localStorage.setItem(SAM_KLUCZ(nrPoz), '1'); } catch (e) {}
    log('samouczek: koniec → runda');
    potem();
  };
  krok();
}

// wejście w poziom nrPoz (od 0): za pierwszym razem najpierw samouczek (jeśli poziom go ma), potem runda()
function cwStart(box, licznik, nrPoz, runda) {
  if (samouczekJest(nrPoz) && !samouczekByl(nrPoz)) samouczek(box, licznik, nrPoz, runda);
  else runda();
}
