// druk.js — Karty pracy: zadania do wydrukowania na kartce A4 (Lasha 30.09: „საათს ჰქონდეს დამატებითი ფუნქცია —
// მაგალითების დაბეჭდვით"). Rodzaje zadań (pole ▾ nad kartką, takie jak w Treningu):
//   Dorysuj wskazówkę — jak w podręczniku „Dorysuj wskazówkę minutową": na tarczy stoi tylko godzinowa, pod zegarem
//     godzina cyframi, dziecko dorysowuje długą (Lasha: „დიდი ისარი უნდა დააკლდეს").
//   Tak czy nie? — „Czy zegar pokazuje tę godzinę?" (Lasha: „სწორია თუ არა", plan „ოკ"): obie wskazówki, pod zegarem
//     godzina i kratki TAK · NIE. Połowa napisów jest zła, pułapki jak w Ćwiczeniach: sąsiednia godzina (08:35 → 09:35,
//     godzinowa blisko 9) albo liczba spod minutowej wzięta wprost (08:35 → 08:07). W każdej parze zadań jedno dobre,
//     jedno złe — przy każdej liczbie zegarów wychodzi pół na pół.
//   Narysuj wskazówki — tarcza bez wskazówek, pod zegarem godzina cyframi, dziecko rysuje obie (plan „კი").
//   Która godzina? — obie wskazówki, pod zegarem dwie puste kratki „▢ : ▢" do wpisania godziny i minut (Lasha „კი";
//     nazwa jak w Treningu). Odpowiedzi: napisy „1. 08:35".
//   Przeczytaj i narysuj — jak „Narysuj wskazówki", ale godzina pod zegarem słowami („Za pięć siódma" — cwZdanie, zdania
//     z Lekcji; plan „კარგია"). Miejsce zawsze na 2 wiersze — zegary w rzędzie stoją równo.
//   Po południu — 12 ↔ 24 (plan „კი"): kartka jak „Która godzina?", ale dziecko wpisuje godzinę po południu — wskazówki
//     na 8:35 → 20:35; dwunasta zostaje 12:xx. Odpowiedzi: napisy „1. 20:35".
//   Upływ czasu — „Która godzina będzie?" (plan „კი"): obie wskazówki, pod zegarem „za 20 minut" (5 … 30, tylko
//     naprzód) i kratki „▢ : ▢". Odpowiedzi: napisy „1. 09:10".
//   Upływ czasu — trudniej (Lasha 30.09: „დაამატე რთული ვარიანტიც როცა გავიდა 1-3 საათიო"): to samo, ale mija od 1 do
//     3 godzin, co 5 minut — „za 2 godziny" · „za 1 godz. 35 min".
//   Zapisz słowami (Lasha 30.09: „საათის ციფერბლატი და ტექსტი უნდა დაწეროს ბავშვმა"): obie wskazówki, pod zegarem dwie
//     linie do pisania. Odpowiedzi: zdania z cwZdanie — „1. Za pięć siódma".
// Nad kartką jeszcze: ile zegarów — 4 · 6 · 9 · 12 (Lasha: „მშობელი თავად უნდა ირჩევდეს … ნებისმიერ დროს შეცვალოს") ·
// „Z odpowiedziami" — druga strona (Lasha 30.09: „პასუხები აუცილებლად უნდა იყოს მეორე გვერდზე"), u jej góry, małe
// i do góry nogami („ამოტრიალებული"; „ცოტა გაადიდე … და ზევით იყოს"): zegary z obiema wskazówkami albo „1 TAK · 2 NIE" ·
// „Wydrukuj" — window.print() · 🎲 — inne godziny.
// Kartka zawsze biała z ciemnym drukiem (także w motywie Nocnym), tarcza z 🕓 bez ramy. Wszystkie jej rozmiary to
// wielokrotności --mm: na ekranie --mm = 1/210 szerokości podglądu, w druku 1 mm. Do druku idą kopie stron
// w #do-druku — jedyne, co widać w @media print (CSS w index.html).
// Godziny: 01:00 … 12:55 co 5 minut; na kartce każda godzina i każda liczba minut najwyżej raz.
// W aplikacji: Start → pas nad zegarem albo ☰ (do sprawdzania: index.html?widok=druk&typ=czy&ile=12&odp=1).
// Korzysta z globalnych z index.html: h, noweSvg, styl, cyfry, log, rzutKostki, IKONA_ROZWIN, cwTasuj, cwLos, cwCyfry24, cwZdanie (cwiczenia.js),
// samCzas (samouczki.js), Zegar (tarcza.js).
"use strict";

// klucz · nazwa w polu ▾ · polecenie na kartce
const DRUK_TYPY = [['dorysuj', 'Dorysuj wskazówkę', 'Dorysuj wskazówkę minutową.'],
                   ['czy', 'Tak czy nie?', 'Czy zegar pokazuje tę godzinę?'],
                   ['narysuj', 'Narysuj wskazówki', 'Narysuj wskazówki.'],
                   ['godzina', 'Która godzina?', 'Która godzina?'],
                   ['slowa', 'Przeczytaj i narysuj', 'Przeczytaj i narysuj wskazówki.'],
                   ['popo', 'Po południu', 'Która godzina po południu?'],
                   ['uplyw', 'Upływ czasu', 'Która godzina będzie?'],
                   ['uplyw2', 'Upływ czasu — trudniej', 'Która godzina będzie?'],
                   ['pisz', 'Zapisz słowami', 'Która godzina? Zapisz słowami.']];
const DRUK_ILE = [4, 6, 9, 12];                  // zegarów na kartce (kolumny i rozmiary: .ile-4 … .ile-12 w index.html)
const DRUK_IKONA = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>';
const DRUK_KOSTKA = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><g class="oczka" fill="currentColor" stroke="none"><circle cx="8" cy="8" r="1.5"/><circle cx="16" cy="8" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></g></svg>';

let drukTyp = 'dorysuj', drukIle = 6, drukOdp = false;
let drukGodziny = null;                          // 12 wylosowanych godzin; kartka bierze pierwsze drukIle
let drukBledy = null;                            // „Tak czy nie?", dla każdej z 12: '' dobrze · 'g' zła godzina · 'm' złe minuty
let drukUplyw = null;                            // „Upływ czasu", dla każdej z 12: za ile minut (5 … 30)
let drukUplyw2 = null;                           // „Upływ czasu — trudniej": 60 … 180, co 5
try {
  const typ = localStorage.getItem('zegar-druk-typ'), n = +localStorage.getItem('zegar-druk-ile');
  if (DRUK_TYPY.some(([k]) => k === typ)) drukTyp = typ;
  if (DRUK_ILE.includes(n)) drukIle = n;
  drukOdp = localStorage.getItem('zegar-druk-odp') === 'tak';
} catch (e) {}
{ // do sprawdzania: index.html?widok=druk&typ=czy&ile=12&odp=1
  const q = new URLSearchParams(location.search);
  if (DRUK_TYPY.some(([k]) => k === q.get('typ'))) drukTyp = q.get('typ');
  if (DRUK_ILE.includes(+q.get('ile'))) drukIle = +q.get('ile');
  if (q.get('odp') === '1') drukOdp = true;
}

// zmiana liczby zegarów albo rodzaju zadania nie losuje od nowa — te same godziny zostają, dochodzą albo znikają ostatnie
function drukLosuj() {
  const min = cwTasuj([...Array(12).keys()]);
  drukGodziny = cwTasuj([...Array(12).keys()]).map((g, i) => (g + 1) * 60 + min[i] * 5);
  drukBledy = cwTasuj(['g', 'm', 'g', 'm', 'g', 'm']).flatMap(b => cwTasuj(['', b]));
  // od :35 zawsze przez pełną godzinę (08:50 + 20 → 09:10) — wychodzi blisko połowy zadań, jak w Ćwiczeniach
  drukUplyw = drukGodziny.map(T => { const od = T % 60 >= 35 ? (60 - T % 60) / 5 : 1; return (od + cwLos(7 - od)) * 5; });
  drukUplyw2 = drukGodziny.map(() => 60 + cwLos(25) * 5);
}

// napis pod zegarem T (60 … 779) w „Tak czy nie?": dobry albo z pułapką
function drukNapis(T, blad) {
  const g = Math.floor(T / 60), m = T % 60;
  if (blad === 'g') return ((g - 1 + (m >= 30 ? 1 : 11)) % 12 + 1) * 60 + m;   // godzinowa bliżej następnej liczby → +1, inaczej −1
  if (blad === 'm') return g * 60 + (m / 5 || 12);                             // minutowa na 7 → „07"
  return T;
}

// napis nad kratkami w „Upływie czasu": „za 20 minut" · „za 2 godziny" · „za 1 godz. 35 min"
function drukZa(d) {
  const g = Math.floor(d / 60), m = d % 60;
  return 'za ' + (!g ? `${m} minut` : !m ? `${g} ${g === 1 ? 'godzinę' : 'godziny'}` : `${g} godz. ${m} min`);
}

// zegar kartki; bez: 1 — widać tylko godzinową, 2 — żadnej wskazówki
function drukZegar(T, bez = 0) {
  const svg = noweSvg('');
  Zegar(svg, { styl, cyfry, t: T % 720 });
  const wsk = svg.querySelectorAll('.w-godz, .w-min, .m-wsk, .k-wsk');
  if (bez) wsk[1].style.display = 'none';
  if (bez === 2) wsk[0].style.display = 'none';
  return svg;
}

// strony do druku: kartka z zadaniami i — z odpowiedziami — druga, tylko z nimi
function drukStrony() {
  const czy = drukTyp === 'czy', popo = drukTyp === 'popo', slowa = drukTyp === 'slowa', pisz = drukTyp === 'pisz';
  const dlugi = drukTyp === 'uplyw2', uplyw = drukTyp === 'uplyw' || dlugi;
  const godz = drukTyp === 'godzina' || popo || uplyw;   // pod zegarem kratki do wpisania godziny
  const bez = czy || godz || pisz ? 0 : drukTyp === 'dorysuj' ? 1 : 2;
  const klasa = `arkusz ile-${drukIle} typ-${uplyw ? 'uplyw' : drukTyp}`;   // oba „Upływy" — ta sama kartka
  const a = h('div', klasa), siatka = h('div', 'ark-siatka'), odp = h('div', 'ark-odp');
  drukGodziny.slice(0, drukIle).forEach((T, i) => {
    const p = h('div', 'ark-zad'), blad = czy ? drukBledy[i] : '', d = uplyw ? (dlugi ? drukUplyw2 : drukUplyw)[i] : 0;
    p.append(h('span', 'ark-nr', `${i + 1}.`), drukZegar(T, bez));
    if (uplyw) p.append(h('span', 'ark-za', drukZa(d)));
    p.append(godz ? h('div', 'ark-pole', '<i></i><b>:</b><i></i>')
             : pisz ? h('div', 'ark-linie', '<i></i><i></i>')
                  : h('b', null, slowa ? cwZdanie(T) : samCzas(drukNapis(T, blad), cwCyfry24)));
    if (czy) p.append(h('div', 'ark-tn', '<span><i></i>TAK</span><span><i></i>NIE</span>'));
    siatka.append(p);
    const o = h('div');
    if (czy) o.textContent = `${i + 1} ${blad ? 'NIE' : 'TAK'}`;
    else if (pisz) o.textContent = `${i + 1}. ${cwZdanie(T)}`;
    else if (godz) o.textContent = `${i + 1}. ${cwCyfry24(
      uplyw ? (T + d - 60) % 720 + 60                      // 12:50 + 20 → 01:10
      : popo && T < 720 ? T + 720 : T)}`;                  // po południu: 8:35 → 20:35, 12:35 zostaje
    else o.append(drukZegar(T), h('span', null, i + 1));
    odp.append(o);
  });
  a.append(h('h1', null, DRUK_TYPY.find(([k]) => k === drukTyp)[2]), siatka);
  if (!drukOdp) return [a];
  const druga = h('div', klasa);
  druga.append(odp);
  return [a, druga];
}

function druk(box) {
  if (!drukGodziny) drukLosuj();
  box.textContent = '';
  const ster = h('div', 'druk-ster'), ile = h('div', 'join');
  // rodzaj zadania: pole ▾ z listą — to samo co nad zegarem w Treningu (#pole i #rodzaj-menu w index.html)
  const typ = h('div', 'dropdown dropdown-center pole-box'), pole = h('div', 'pole');
  const lista = h('ul', 'dropdown-content menu bg-base-100 rounded-box z-30 w-full p-2 shadow text-base');
  pole.tabIndex = lista.tabIndex = 0;
  pole.setAttribute('role', 'button');
  pole.setAttribute('aria-label', 'Zadanie');
  typ.append(pole, lista);
  const grupa = (tytul, join) => { const g = h('div', 'ustaw-grupa'); g.append(h('span', null, tytul), join); return g; };
  const odp = h('label', 'druk-odp', '<input type="checkbox" class="toggle toggle-primary"><span>Z odpowiedziami</span>');
  const dol = h('div', 'druk-dol'), drukuj = h('button', 'btn btn-primary', `${DRUK_IKONA}Wydrukuj`);
  // 🎲 jak w Treningu (Lasha 30.09): klasa .losuj — rzutKostki() obraca kostkę i zmienia oczka
  const losuj = h('button', 'btn btn-primary losuj druk-losuj', DRUK_KOSTKA), kartki = h('div', 'druk-kartki');
  losuj.setAttribute('aria-label', 'Inne godziny');
  dol.append(drukuj, losuj);
  ster.append(typ, grupa('Zegarów na kartce', ile), odp, dol);
  box.append(ster, kartki);

  function guziki(join, opcje, wybrana, ustaw) {
    join.textContent = '';
    opcje.forEach(([k, nazwa]) => {
      const b = h('button', 'join-item btn btn-sm' + (k === wybrana ? ' btn-primary' : ''), nazwa);
      b.onclick = () => { if (k !== wybrana) { ustaw(k); zapisz(); } };
      join.append(b);
    });
  }
  function rysuj() {
    const strony = drukStrony();
    kartki.replaceChildren(...strony.map(s => { const p = h('div', 'druk-podglad'); p.append(s); return p; }));
    document.getElementById('do-druku').replaceChildren(...strony.map(s => s.cloneNode(true)));
    pole.innerHTML = `<span>${DRUK_TYPY.find(([k]) => k === drukTyp)[1]}</span>` + IKONA_ROZWIN;
    lista.replaceChildren(...DRUK_TYPY.map(([k, nazwa]) => {
      const li = h('li'), a = h('a', k === drukTyp ? 'menu-active' : null, nazwa);
      a.onclick = () => {
        document.activeElement.blur();                  // zamyka listę
        if (k !== drukTyp) { drukTyp = k; zapisz(); }
      };
      li.append(a);
      return li;
    }));
    guziki(ile, DRUK_ILE.map(n => [n, n]), drukIle, n => { drukIle = n; });
  }
  function zapisz() {
    try {
      localStorage.setItem('zegar-druk-typ', drukTyp);
      localStorage.setItem('zegar-druk-ile', drukIle);
      localStorage.setItem('zegar-druk-odp', drukOdp ? 'tak' : 'nie');
    } catch (e) {}
    log(`karty pracy: ${DRUK_TYPY.find(([k]) => k === drukTyp)[1]} · ${drukIle} zegarów · odpowiedzi: ${drukOdp ? 'tak' : 'nie'}`);
    rysuj();
  }
  const we = odp.querySelector('input');
  we.checked = drukOdp;
  we.onchange = () => { drukOdp = we.checked; zapisz(); };
  losuj.onclick = () => { rzutKostki(); drukLosuj(); log('karty pracy: inne godziny'); rysuj(); };
  drukuj.onclick = () => { log('karty pracy: drukuj'); window.print(); };
  rysuj();
}
