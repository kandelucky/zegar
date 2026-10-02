// druk.js — Karty pracy: tasks to print on an A4 sheet. Task types (the ▾ field above the sheet, the same as in Trening):
//   Dorysuj wskazówkę — as in the textbook's „Dorysuj wskazówkę minutową": the dial shows only the hour hand, the time
//     is under the clock in digits, the child draws the long hand.
//   Tak czy nie? — „Czy zegar pokazuje tę godzinę?": both hands, under the clock a time and the boxes TAK · NIE. Half
//     of the captions are wrong, with the traps from Ćwiczenia: the neighbouring hour (08:35 → 09:35, the hour hand is
//     close to 9) or the number under the minute hand taken literally (08:35 → 08:07). Every pair of tasks has one
//     right and one wrong caption — half and half for any number of clocks.
//   Narysuj wskazówki — a dial without hands, the time under the clock in digits, the child draws both.
//   Która godzina? — both hands, under the clock two empty boxes „▢ : ▢" for the hour and the minutes (named as in
//     Trening). Answers: lines „1. 08:35".
//   Przeczytaj i narysuj — like „Narysuj wskazówki", but the time under the clock is in words („Za pięć siódma" —
//     cwZdanie, the sentences from Lekcje). Always room for 2 lines — the clocks in a row stay level.
//   Po południu — 12 ↔ 24: a sheet like „Która godzina?", but the child writes the afternoon time — hands
//     at 8:35 → 20:35; twelve stays 12:xx. Answers: lines „1. 20:35".
//   Upływ czasu — „Która godzina będzie?": both hands, under the clock „za 20 minut" (5 … 30, forwards only)
//     and the boxes „▢ : ▢". Answers: lines „1. 09:10".
//   Upływ czasu — trudniej: the same, but 1 to 3 hours pass, in 5-minute steps — „za 2 godziny" · „za 1 godz. 35 min".
//   Zapisz słowami: both hands, under the clock two lines to write on. Answers: sentences from cwZdanie —
//     „1. Za pięć siódma".
// Also above the sheet: the number of clocks (▾ 4 · 6 · 9 · 12) · „Odpowiedzi" — a second page with the answers at
// its top, small and upside down on purpose (two pages may be printed on one sheet, and the child should not be able
// to read the answers easily): clocks with both hands, „1 TAK · 2 NIE" or the lines listed above · „Zapisz" (APK only) —
// the pages as a PDF into Android's share window · „Wydrukuj" — window.print() · 🎲 — other times.
// The sheet is always white with dark print (also in the Nocny theme); the dial is the one chosen under 🕓, without
// a frame. All its sizes are multiples of --mm: on screen --mm = 1/210 of the preview width, in print 1 mm. What gets
// printed is the copies of the pages in #do-druku — the only thing visible in @media print (CSS in index.html).
// Times: 01:00 … 12:55 in 5-minute steps; on one sheet each hour and each minute value at most once.
// In the app: Start → the strip above the clock, or ☰ (for checking: index.html?widok=druk&typ=czy&ile=12&odp=1).
// Uses globals from index.html: h, noweSvg, styl, cyfry, rzutKostki, IKONA_ROZWIN; log (sim-bridge.js); cwTasuj, cwLos,
// cwCyfry24, cwZdanie (cwiczenia.js), samCzas (samouczki.js), Zegar (tarcza.js).
"use strict";

// key · name in the ▾ field · instruction on the sheet
const DRUK_TYPY = [['dorysuj', 'Dorysuj wskazówkę', 'Dorysuj wskazówkę minutową.'],
                   ['czy', 'Tak czy nie?', 'Czy zegar pokazuje tę godzinę?'],
                   ['narysuj', 'Narysuj wskazówki', 'Narysuj wskazówki.'],
                   ['godzina', 'Która godzina?', 'Która godzina?'],
                   ['slowa', 'Przeczytaj i narysuj', 'Przeczytaj i narysuj wskazówki.'],
                   ['popo', 'Po południu', 'Która godzina po południu?'],
                   ['uplyw', 'Upływ czasu', 'Która godzina będzie?'],
                   ['uplyw2', 'Upływ czasu — trudniej', 'Która godzina będzie?'],
                   ['pisz', 'Zapisz słowami', 'Która godzina? Zapisz słowami.']];
const DRUK_ILE = [4, 6, 9, 12];                  // clocks per sheet (columns and sizes: .ile-4 … .ile-12 in index.html)
const DRUK_IKONA = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>';
const ZAPISZ_IKONA = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>';
const DRUK_KOSTKA ='<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><g class="oczka" fill="currentColor" stroke="none"><circle cx="8" cy="8" r="1.5"/><circle cx="16" cy="8" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></g></svg>';

let drukTyp = 'dorysuj', drukIle = 6, drukOdp = false;
let drukGodziny = null;                          // 12 random times; the sheet takes the first drukIle
let drukBledy = null;                            // „Tak czy nie?", for each of the 12: '' right · 'g' wrong hour · 'm' wrong minutes
let drukUplyw = null;                            // „Upływ czasu", for each of the 12: minutes that pass (5 … 30)
let drukUplyw2 = null;                           // „Upływ czasu — trudniej": 60 … 180, in steps of 5
try {
  const typ = localStorage.getItem('zegar-druk-typ'), n = +localStorage.getItem('zegar-druk-ile');
  if (DRUK_TYPY.some(([k]) => k === typ)) drukTyp = typ;
  if (DRUK_ILE.includes(n)) drukIle = n;
  drukOdp = localStorage.getItem('zegar-druk-odp') === 'tak';
} catch (e) {}
{ // for checking: index.html?widok=druk&typ=czy&ile=12&odp=1
  const q = new URLSearchParams(location.search);
  if (DRUK_TYPY.some(([k]) => k === q.get('typ'))) drukTyp = q.get('typ');
  if (DRUK_ILE.includes(+q.get('ile'))) drukIle = +q.get('ile');
  if (q.get('odp') === '1') drukOdp = true;
}

// changing the number of clocks or the task type does not pick new times — the same ones stay, the last are added or dropped
function drukLosuj() {
  const min = cwTasuj([...Array(12).keys()]);
  drukGodziny = cwTasuj([...Array(12).keys()]).map((g, i) => (g + 1) * 60 + min[i] * 5);
  drukBledy = cwTasuj(['g', 'm', 'g', 'm', 'g', 'm']).flatMap(b => cwTasuj(['', b]));
  // from :35 on always across the full hour (08:50 + 20 → 09:10) — that comes to nearly half of the tasks, as in Ćwiczenia
  drukUplyw = drukGodziny.map(T => { const od = T % 60 >= 35 ? (60 - T % 60) / 5 : 1; return (od + cwLos(7 - od)) * 5; });
  drukUplyw2 = drukGodziny.map(() => 60 + cwLos(25) * 5);
}

// the caption under clock T (60 … 779) in „Tak czy nie?": the right one or one with a trap
function drukNapis(T, blad) {
  const g = Math.floor(T / 60), m = T % 60;
  if (blad === 'g') return ((g - 1 + (m >= 30 ? 1 : 11)) % 12 + 1) * 60 + m;   // hour hand closer to the next number → +1, otherwise −1
  if (blad === 'm') return g * 60 + (m / 5 || 12);                             // minute hand on 7 → „07"
  return T;
}

// the caption above the boxes in „Upływ czasu": „za 20 minut" · „za 2 godziny" · „za 1 godz. 35 min"
function drukZa(d) {
  const g = Math.floor(d / 60), m = d % 60;
  return 'za ' + (!g ? `${m} minut` : !m ? `${g} ${g === 1 ? 'godzinę' : 'godziny'}` : `${g} godz. ${m} min`);
}

// a clock for the sheet; bez: 1 — only the hour hand shows, 2 — no hands at all
function drukZegar(T, bez = 0) {
  const svg = noweSvg('');
  Zegar(svg, { styl, cyfry, t: T % 720 });
  const wsk = svg.querySelectorAll('.w-godz, .w-min, .m-wsk, .k-wsk');
  if (bez) wsk[1].style.display = 'none';
  if (bez === 2) wsk[0].style.display = 'none';
  return svg;
}

// the pages to print: the task sheet and — with answers on — a second one holding only the answers
function drukStrony() {
  const czy = drukTyp === 'czy', popo = drukTyp === 'popo', slowa = drukTyp === 'slowa', pisz = drukTyp === 'pisz';
  const dlugi = drukTyp === 'uplyw2', uplyw = drukTyp === 'uplyw' || dlugi;
  const godz = drukTyp === 'godzina' || popo || uplyw;   // boxes under the clock for writing in the time
  const bez = czy || godz || pisz ? 0 : drukTyp === 'dorysuj' ? 1 : 2;
  const klasa = `arkusz ile-${drukIle} typ-${uplyw ? 'uplyw' : drukTyp}`;   // both „Upływ czasu" types — the same sheet
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
      : popo && T < 720 ? T + 720 : T)}`;                  // afternoon: 8:35 → 20:35, 12:35 stays
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
  const ster = h('div', 'druk-ster');
  // a ▾ field with a list — the same as above the clock in Trening (#pole and #rodzaj-menu in index.html)
  function rozwijane(klasa, etykieta) {
    const rama = h('div', 'dropdown pole-box ' + klasa), pole = h('div', 'pole');
    const lista = h('ul', 'dropdown-content menu bg-base-100 rounded-box z-30 w-full p-2 shadow text-base');
    pole.tabIndex = lista.tabIndex = 0;
    pole.setAttribute('role', 'button');
    pole.setAttribute('aria-label', etykieta);
    rama.append(pole, lista);
    return [rama, pole, lista];
  }
  const [typ, pole, lista] = rozwijane('dropdown-center', 'Zadanie');
  // how many clocks — a smaller ▾ field, in one row with „Odpowiedzi"
  const [ile, ilePole, ileLista] = rozwijane('druk-ile', 'Zegarów na kartce');
  const odp = h('label', 'druk-odp', '<input type="checkbox" class="toggle toggle-primary"><span>Odpowiedzi</span>');
  const srodek = h('div', 'druk-srodek');
  srodek.append(ile, odp);
  const dol = h('div', 'druk-dol'), drukuj = h('button', 'btn btn-primary', `${DRUK_IKONA}Wydrukuj`);
  // 🎲 as in Trening: the class .losuj — rzutKostki() spins the die and changes its pips
  const losuj = h('button', 'btn btn-primary losuj druk-losuj', DRUK_KOSTKA), kartki = h('div', 'druk-kartki');
  losuj.setAttribute('aria-label', 'Inne godziny');
  const pdf = window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.PdfGenerator;   // only in the APK
  const zapiszPdf = pdf ? h('button', 'btn btn-primary', `${ZAPISZ_IKONA}Zapisz`) : null;
  if (zapiszPdf) { dol.classList.add('dwa'); dol.append(zapiszPdf); }   // .dwa — smaller letters, so the row fits 360 px
  dol.append(drukuj, losuj);
  ster.append(typ, srodek, dol);
  box.append(ster, kartki);

  const zegarow = n => `${n} ${n < 5 ? 'zegary' : 'zegarów'}`;
  // fills a ▾ field and its list; a tap on an item closes the list and saves the choice
  function wybor(pole, lista, opcje, wybrana, ustaw) {
    pole.innerHTML = `<span>${opcje.find(([k]) => k === wybrana)[1]}</span>` + IKONA_ROZWIN;
    lista.replaceChildren(...opcje.map(([k, nazwa]) => {
      const li = h('li'), a = h('a', k === wybrana ? 'menu-active' : null, nazwa);
      a.onclick = () => {
        document.activeElement.blur();                  // closes the list
        if (k !== wybrana) { ustaw(k); zapisz(); }
      };
      li.append(a);
      return li;
    }));
  }
  function rysuj() {
    const strony = drukStrony();
    kartki.replaceChildren(...strony.map(s => { const p = h('div', 'druk-podglad'); p.append(s); return p; }));
    document.getElementById('do-druku').replaceChildren(...strony.map(s => s.cloneNode(true)));
    wybor(pole, lista, DRUK_TYPY, drukTyp, k => { drukTyp = k; });
    wybor(ilePole, ileLista, DRUK_ILE.map(n => [n, zegarow(n)]), drukIle, n => { drukIle = n; });
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
  // the APK's WebView ignores window.print() — there the plugin prints the same page through Android's print dialog
  const drukarka = window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Printer;
  drukuj.onclick = () => {
    log('karty pracy: drukuj');
    if (drukarka) drukarka.printWebView({ name: 'Zegar - karta pracy' }).catch(e => log(`drukuj: ${e.message}`));
    else window.print();
  };
  // the PDF is drawn in a separate WebView that cannot reach the app's files — so the pages go with all the CSS inline
  if (zapiszPdf) zapiszPdf.onclick = () => {
    log('karty pracy: zapisz PDF');
    const css = [...document.styleSheets].map(s => {
      try { return [...s.cssRules].map(r => r.cssText).join('\n'); } catch (e) { return ''; }
    }).join('\n');
    const html = document.documentElement.cloneNode(false), body = document.body.cloneNode(false);
    body.append(document.getElementById('do-druku').cloneNode(true));
    html.append(h('head', null, `<meta charset="utf-8"><style>${css}</style>`), body);
    pdf.fromData({ data: '<!doctype html>' + html.outerHTML, documentSize: 'A4', type: 'share', fileName: 'Zegar - karta pracy.pdf' })
      .catch(e => log(`zapisz PDF: ${e.message}`));
  };
  rysuj();
}
