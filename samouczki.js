// samouczki.js — „Jak to działa?": a short tutorial before an exercise level: 3–4 steps with „Dalej", the clock itself
// shows what the sentence says (a hand blinks, a circle under a number, a hand moves, a finger drags it). No voice.
// Shown by itself on the first entry into a level, later through 💡 in the header.
// Levels 1–10 for now; the bonus level has none yet.
// The whole help sits in one frame, so it reads as help and not as the ordinary clock: the sentence (22),
// the clock, under it the big caption (32), the small note (17) and „Dalej" — in the last step „Zaczynamy!" / „Wróć" (💡) → the round.
// Preview: sim.html?app=cwiczenia.html%3Fpoziom%3D2%26samouczek%3D1 (&krok=N — from step N).
// In the app: index.html (cwStart on entering a level, 💡 in the header); standalone preview — cwiczenia.html.
// Uses globals: NS, h, noweSvg, styl, RAMA, log, simScreen, GODZ, duza, MINUTY, Zegar (tarcza.js),
// uplywWycinek (lekcja-uplyw.js), cwKolko, cwCyfry, cwCyfry24, cwMost (cwiczenia.js).
"use strict";

const SAM_KLUCZ = n => `zegar-samouczek-${n + 1}`;   // localStorage: the tutorial of level n + 1 was already shown (by itself only once)
// kept fast — with a slow animation children press „Dalej" right away; „Dalej" is disabled while something is moving
const SAM_LICZBA_MS = 250;  // the hand takes this long from one number to the next
const SAM_PRZED_MS = 300, SAM_PO_MS = 150;   // pause before the move and after it
const SAM_12_6 = '12 — pełna godzina · 6 — wpół do';   // level 3, step 1 — the small caption
// level 3: the name of minute k × 5 (MINUTY from index.html), the words po / za in the colours of the dial halves
const samNazwa = k => MINUTY[k].replace(/\b(po|za)\b/, w => `<span class="sam-${w}">${w}</span>`);

// the tutorial hand (s.reka 'g' | 'm') moves from od to cel (minutes), a tick at every number; o.palec — 👆 at its
// tip, as if dragging it; o.licz — at every number passed its minute label lights up (05, 10 … — a dial
// with 'minuty' digits) and the big caption „15 minut" counts up; o.klatka(tt) — called every frame with the hand's position
// (level 9: sector and counting). o.sama 'g' | 'm' — separately (level 10): only that hand moves, the other stays at o.stoi
// · o.ms — the whole move takes this many ms (otherwise SAM_LICZBA_MS per number) · o.przed — the pause before it (otherwise
// SAM_PRZED_MS). Ends with gotowe().
// cel < od — backwards (level 8): the tick comes when the hand reaches a number, not when it leaves one (without o.licz).
// s.zywy() = false once the step has changed.
// s.jedzie() / s.stoi() — „Dalej" is disabled from the call to the end (gotowe() runs before s.stoi(), so in a chain it stays disabled)
function samJedz(s, od, cel, gotowe, o = {}) {
  s.jedzie();
  const m = (o.sama || s.reka) !== 'g', co = m ? 5 : 60;   // minutes from one number to the next (both hands — as for the minute hand)
  const r = m ? 52 : 44;                         // the finger near the tip of the hand, short of the digits
  let palec = null;
  if (o.palec) {
    palec = document.createElementNS(NS, 'text');
    palec.setAttribute('class', 'sam-palec');
    palec.textContent = '👆';
    s.tarcza.append(palec);                      // inside the dial group — with 'minuty' digits it scales together with the dial
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
        if (o.licz) {                            // a slow frame may skip a number — all the passed ones light up
          for (let i = ost + 1; i <= nL; i++) s.podpis(i);
          s.wynik(`<span class="m">${nL * 5 % 60}</span> minut`);   // counted from the full hour (level 5: from 8:00)
        }
        ost = nL;
      }
      if (q < 1) { requestAnimationFrame(krok); return; }
      if (window.Dzwiek) Dzwiek.zatrzask();
      setTimeout(() => { if (s.zywy()) { if (palec) palec.remove(); gotowe(); s.stoi(); } }, SAM_PO_MS);
    })(start);
  }, o.przed ?? SAM_PRZED_MS);
}

// the hand stands still, the green sector from minute m0 grows by ile minutes (uplywWycinek from lekcja-uplyw.js), a tick
// at every number, the big caption counts „5 minut", „10 minut"; ends with gotowe()
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

// level 2, step 4: the child drags the minute hand; around the dial the labels of the last 4 numbers passed are lit
// (05 · 10 · 15 · 20 → 05 goes out, 25 lights up … endlessly, also across 12); the minutes under the clock.
// The distance from the start counts (T, no wrapping at 12); backwards from the start — no labels.
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

// 🏋 Trening (index.html): one clock, both hands — the one nearer the finger is grabbed.
// Starts at s.t (now, to 5 minutes), the whole day: forwards across 12 — 13:00 … 23:55 → 00:00, backwards likewise
// (the distance from the start counts, no wrapping at 12). The number of the hour the short hand has passed is enlarged
// (CSS .sam-teraz in index.html). Around the dial the last 4 numbers the minute hand reached are lit —
// both ways (forwards 00 · 05 · 10 · 15, backwards 00 · 55 · 50 · 45; after turning back they are replaced one at a time). Under
// the clock a big „14:25" (hour in the short hand's colour, minutes — the long hand's) and „Dwadzieścia pięć po drugiej po południu".
// Below, two switches; turning one on turns the other off:
//  „Po i za" — the po / za dial halves, under the clock the sentence from level 6 („Za pięć siódma") and the digits;
//  „Upływ czasu" — from the moment it is switched on the elapsed time is tinted behind the minute hand; at the tip of the minute
//   hand, beyond the dial, „1 godz." · „20 min" (nearest 5 minutes), under the clock „08:00 → 09:20" and „Minęła 1 godzina
//   i 20 minut.". Backwards from the start likewise: „07:40 → 08:00" and „To było 20 minut temu.". One colour per direction:
//   forwards green, backwards orange; over an hour — the last hour stronger.
//   The 4 numbers are not lit then (the caption stands in their place).
const SAM_UPLYW_KOLOR = ['sektor', 'sam-pol-po'];   // forwards · backwards
const SAM_ZA_TARCZA = 80;                        // the caption starts this far from the centre — just beyond the dial's rim
function samTrening(s) {
  const liczby = s.svg.querySelectorAll('.s-cyfra, .m-cyfra, .k-cyfra');   // 1 … 12, in order
  let tryb = '', T = 0, ost = s.t % 720;         // tryb: '' · 'po' · 'uplyw' · T — distance from the start
  let slad = [Math.round(ost % 60 / 5)];         // number indices (0 = 00 … 11 = 55), latest first
  let uplyw = null;                              // { T0, t0, m0, dol, gora, napis, byl } — since „Upływ czasu" was switched on
  const teraz = () => ((s.t + Math.round(T / 5) * 5) % 1440 + 1440) % 1440;

  function rysujUplyw(u) {
    const wtyl = T < u.T0, x = Math.abs(T - u.T0), g = Math.floor(x / 60), m = x - g * 60;
    const kolor = `${SAM_UPLYW_KOLOR[wtyl ? 1 : 0]} sam-klin`;
    u.gora.setAttribute('class', kolor);
    u.dol.setAttribute('class', kolor);
    u.gora.style.fillOpacity = g ? .55 : '';     // the last hour stronger, the previous one under it
    // gora — the last m minutes, dol — the rest of the dial from the previous hour; at a full 60 the arc vanishes
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
    if (wiersze.length) {                        // caption centred on the minute hand's extension, its near edge just beyond the dial
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
    else s.wynik(samCzas(q, cwCyfry24), slowami(q));   // as in „Odczytaj"
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

  // the switches under the clock (in .sam-pod, below the captions)
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
    const doszla = [];                           // numbers passed on the way, in order: forwards (T1, T], backwards [T, T1)
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

// „Minęła 1 godzina i 20 minut." · „To było 1 godzinę i 20 minut temu." — d minutes (in steps of 5, so always „minut");
// 1 godzina (with „temu" godzinę) · 2–4, 22–24 godziny · 5–21 godzin; hours in the hour hand's colour, minutes — the minute hand's
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

// „07:45" — hour in the hour hand's colour, minutes in the minute hand's
const samCzas =(tm, zapis = cwCyfry) => zapis(tm).replace(/^(\d+):(\d+)$/, '<span class="g">$1</span>:<span class="m">$2</span>');
// level 6: the sentence („Za pięć siódma") with po / za in the colours of the dial halves; all in one <span> — .sam-dwa .sam-duzy
// centres it in the room for 2 lines
const samZdanie = tm => `<span>${cwZdanie(tm).replace(/\b(po|za|Za)\b/,
                                                     w => `<span class="sam-${w.toLowerCase()}">${w}</span>`)}</span>`;

// level 4, step 1: the minute hand moves piece by piece 12 → 3 → 6 → 9 → 12 (from 7:00, up to 60), each piece passed gets tinted,
// under the clock „15 minut", „30 minut", „45 minut", „60 minut" and from the first piece on the small „15 minut to kwadrans.";
// at the end a circle under 12. Each piece has its own green, from light (12 → 3) to dark (9 → 12) — CSS .sam-cwiartka.c0 … c3
function samCwiartki(s) {
  (function kawalek(i) {
    samJedz(s, 420 + i * 15, 435 + i * 15, () => {
      s.cwiartki([...Array(i + 1).keys()]);
      s.wynik(`<span class="m">${15 * (i + 1)}</span> minut`, '15 minut to <b>kwadrans</b>.');
      if (i < 3) kawalek(i + 1); else s.kolko(0);
    });
  })(0);
}

// level 4, step 3: the child drags the minute hand, the hour hand follows; the piece the minute hand stands in gets tinted
// (at 3 — still the 12 → 3 one, at the full hour none); under the clock the nearest 15 minutes: „07:15" · „Piętnaście po siódmej"
function samKawalek(s) {
  const pisz = nt => {
    const tt = (nt % 720 + 720) % 720, q = Math.round(tt / 15) * 15 % 720;
    s.cwiartki([Math.ceil(tt % 60 / 15) - 1]);
    s.wynik(samCzas(q), cwZdanie(q));
  };
  pisz(420);
  s.ciagnij(pisz);
}

// level 7: 14:25 and 00:40 as in the level list (on the dial 2:25 = t 145, 12:40 = t 40); a dial with po13 — in the afternoon
// the digits are 13 … 23 (s.z.popo)
const SAM_13_MS = 1000;     // step 1: „02:25" stays this long before the digits turn into 13 … 23
// level 7, step 1: „02:25" → after a moment the digits 1 … 11 turn into 13 … 23, under the clock „14:25" · „2 + 12 = 14"
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
// level 7, step 3: the child moves the hands from 12:00 (noon); under the clock, live, „17:25" · „Wieczorem" —
// the whole day, nearest 5 minutes; in the afternoon the dial shows 13 … 23, from midnight to noon 1 … 11. The distance from
// the start counts (no wrapping at 12).
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

// level 8: 14:05 as in the level list (on the dial 2:05 = t 125)
const SAM_1405 = 845;       // minutes from midnight
// later — the „po" colour from levels 3 and 6, earlier — „za", so the two directions differ: sectors from 05 to the minute hand,
// x minutes from 14:05 (+ forwards, − backwards), at most a full circle (at 60 the arc vanishes)
function samPrzesunKliny(s) {
  const po = s.klin('sam-pol-po'), za = s.klin('sam-pol-za');
  return x => {
    x = Math.max(-59.9, Math.min(59.9, x));
    po.setAttribute('d', uplywWycinek(5, Math.max(0, x)));
    za.setAttribute('d', uplywWycinek(5 + Math.min(0, x), Math.max(0, -x)));
  };
}
// under the clock „14:20" · „15 minut później" (d minutes from 14:05; the word in its sector's colour), d = 0 — the time alone
const samPrzesunNapis = (s, d, maly) => s.wynik(samCzas(((SAM_1405 + d) % 1440 + 1440) % 1440, cwCyfry24), maly ??
  (d > 0 ? `${d} minut <span class="sam-po">później</span>` : d < 0 ? `${-d} minut <span class="sam-za">wcześniej</span>` : ''));
// level 8, steps 1 and 2: 👆 drags the minute hand by d minutes (10 — later, −10 — earlier, across 12), the hour hand follows,
// the sector grows behind the minute hand, under the clock, live, „14:10" · „5 minut później"; at the end maly (if given)
// instead of „10 minut…"
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
// level 8, step 3: the child drags the minute hand from 14:05, the hour hand follows; the sector behind the hand, under the clock,
// live, as in steps 1 and 2 — nearest 5 minutes. The distance from the start counts (no wrapping at 12).
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

// level 9: the bridge 13:50 → 14:00 → 14:10 as in the level list (on the dial 1:50 = t 110), jumps 10 + 10
const SAM_MOST = 830;       // 13:50 — minutes from midnight
// the bridge from the round (cwMost) under the clock, without the „razem" row — the total is the big caption below it; the sector
// from 50 in two pieces: up to 12 green, past 12 in the „po" colour from levels 3 and 6
function samMostPod(s) {
  const m = cwMost(SAM_MOST, 10, 10);
  m.razem.remove();
  s.pod(m.el);
  const kliny = [s.klin(), s.klin('sam-pol-po')];
  return { m, klin: x => {                       // x — minutes from 50
    kliny[0].setAttribute('d', uplywWycinek(50, Math.min(x, 10)));
    kliny[1].setAttribute('d', uplywWycinek(0, x - 10));
  } };
}
// the caption above the arrow „+10 min": still being counted — the number in a yellow badge like „?" in the round, done — green
function samSkok(el, x, gotowy) {
  el.classList.toggle('teraz', !gotowy);
  el.classList.toggle('zrobione', gotowy);
  el.innerHTML = `+<b>${x}</b> min`;
}

// level 9, steps 1 and 2: jump i (0 — to the full hour, 1 — the rest) — above the arrow „+? min", the hands move 10 minutes,
// the sector grows behind the minute hand, the big caption counts „5 minut", „10 minut"; at the end „+10 min" turns green and
// a circle under 12 (step 1) or „razem: 20 minut" · „10 + 10" (step 2)
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

// level 9, step 3: the child drags the minute hand from 13:50, the hour hand follows; the bridge grows behind the hand — up to 14:00
// one jump (13:50 → 13:55 · +5), beyond it two (13:50 → 14:00 → 14:25 · +10 · +25), the sector from 50; below
// „razem: 35 minut" · „10 + 25". The distance from the start counts (no wrapping at 12); backwards from the start — just the start.
// Every 60 minutes it starts over: the start moves to where the hand is — 14:50, 15:50 …
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

// level 10: 16:30 as in the level list (on the dial 4:30 = t 270)
const SAM_1630 = '<span class="g">16</span>:<span class="m">30</span>';
// level 10, step 1: from 11:00 👆 moves the long hand 12 → 6 (the short one stays at 11), right after that the short hand
// 11 → 12 → 1 … → halfway from 4 to 5 (the long one stays), a tick at every number; ~2.7 s in all, at the end „16:30" and
// the rule from „Sprawdź"
function samOsobno(s) {
  samJedz(s, 660, 690, () => samJedz(s, 660, 990, () => s.wynik(SAM_1630, '<b class="g">Krótka</b> — między 4 a 5.'),
                                     { palec: true, sama: 'g', stoi: 690, przed: 100 }),
          { palec: true, sama: 'm', stoi: 660, ms: 600 });
}
// level 10, steps 2–4: a dial from the round (CW_NIETYPOWE), the child moves the hands — together, as on an ordinary clock
// (separately would give a time that cannot be written down); under the clock, live, „16:35" — the whole day from 16:30 (as in
// step 1 and in Ustaw): forwards 23:55 → 00:00 → 01:00 …, backwards likewise. The distance from the start counts (no wrapping at 12).
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

// level: tylko — as in its exercises ('g' | 'm' | '' both) · chwyt 'm' — the minute hand is always the one grabbed (tarcza.js)
// · cwiartki — the dial cut into 4 pieces (level 4), s.cwiartki(lista) tints the pieces · cyfry — the dial (default 'zwykle';
// 'minuty' — the labels 05 … 55 are hidden and light up while counting) · po13 — the dial can show 13 … 23 in the afternoon
// (level 7; switched on by s.z.popo) · kroki.
// step: zdanie — in the frame · t — where the hands stand · osobno — each hand moves on its own (tarcza.js; level 10, step 1)
// · cyfry — a different dial in this step (z.cyfry; level 10) · swieci 'g' | 'm' — which hand blinks · kolko — the number with
// the green circle under it (0 = 12) · pol 'po' | 'za' | 'oba' — which half of the dial is tinted · bez 'g' — the hour hand
// is hidden · duzy, maly — under the clock · pokaz(s) — the step's animation (s.wynik(duzy, maly), s.kolko(H) at the end;
// s.ciagnij(fn) — in this step the child drags the hand, fn(t, puszczone) on every move; s.pod(el) — el under
// the clock, above the big caption, only in this step — level 9: the bridge). A level without a tutorial — null.
// The last step — the child drags the hand itself, without the finger.
const CW_SAMOUCZKI = [
  { tylko: 'g', kroki: [                         // 1 · Godziny: the example 05:00 as in the level list
    { zdanie: '<b class="g">Krótka wskazówka</b> pokazuje godzinę.', t: 300, swieci: 'g', kolko: 5,
      duzy: '<span class="g">Piąta</span>' },
    { zdanie: '<b class="m">Długa wskazówka</b> na 12 — pełna godzina.', t: 300, swieci: 'm', kolko: 0,
      duzy: '<span class="g">05</span>:<span class="m">00</span>' },
    { zdanie: 'Popatrz, jak przesunąć <b class="g">krótką wskazówkę</b> na 9.', t: 300,
      pokaz: s => samJedz(s, 300, 540, () => { s.kolko(9); s.wynik('<span class="g">Dziewiąta</span>', '09:00'); },
                          { palec: true }) },
    { zdanie: 'Przesuwaj <b class="g">krótką wskazówkę</b> palcem.', t: 300,
      pokaz: s => {                              // under the clock, live, „Szósta · 06:00"
        const pisz = nt => { const H = Math.round(nt / 60) % 12; s.wynik(`<span class="g">${duza(GODZ[H])}</span>`, cwCyfry(H * 60)); };
        pisz(300);
        s.ciagnij(pisz);
      } }
  ] },
  { tylko: 'm', cyfry: 'minuty', kroki: [        // 2 · Minuty: the example 35 as in the level list
    { zdanie: '<b class="m">Długa wskazówka</b> pokazuje minuty.', t: 35, swieci: 'm', kolko: 7,
      duzy: '<span class="m">35</span> minut' },
    { zdanie: 'Każda liczba to <b class="m">5 minut</b>. Licz piątkami.', t: 0,
      pokaz: s => samJedz(s, 0, 35, () => s.kolko(7), { licz: true }) },
    { zdanie: 'Popatrz, jak przesunąć <b class="m">długą wskazówkę</b> na 4.', t: 0,
      pokaz: s => samJedz(s, 0, 20, () => s.kolko(4), { palec: true, licz: true }) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 0, pokaz: samOstatnie4 }
  ] },
  { tylko: 'm', kroki: [                         // 3 · Po i za: the example 50 „za dziesięć" as in the level list
    { zdanie: 'Po prawej — <b class="sam-po">po</b>.', t: 0, pol: 'po', maly: SAM_12_6,
      pokaz: s => samJedz(s, 0, 10, () => { s.kolko(2); s.wynik('dziesięć <span class="sam-po">po</span>', SAM_12_6); }) },
    { zdanie: 'Po lewej — <b class="sam-za">za</b>: ile brakuje do 12.', t: 50, pol: 'za',
      pokaz: s => samKlin(s, 50, 10, () => { s.kolko(10); s.wynik('<span class="sam-za">za</span> dziesięć'); }) },
    // no „Popatrz, jak przesunąć" step — by now the child knows how to drag both hands
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 0, pol: 'oba',
      pokaz: s => {                              // under the clock, live, „pięć po" … „za pięć"
        const pisz = nt => s.wynik(samNazwa(Math.round(nt / 5) % 12));
        pisz(0);
        s.ciagnij(pisz);
      } }
  ] },
  // 4 · Co 15 minut: a pizza of 4 pieces, hour 7 as in the level list (07:45); no „Przesuń" step — by this level
  // the child already knows how the clock works
  { tylko: '', chwyt: 'm', cwiartki: true, kroki: [
    { zdanie: '<b class="m">4&nbsp;kawałki</b> po 15 minut, czyli <b class="m">4&nbsp;kwadranse</b>.', t: 420, bez: 'g', pokaz: samCwiartki },
    { zdanie: '<b class="g">Krótka wskazówka</b> też idzie — powoli.', t: 420, swieci: 'g',
      duzy: samCzas(420), maly: 'Siódma',
      pokaz: s => samJedz(s, 420, 450, () => s.wynik(samCzas(450), 'Wpół do ósmej')) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 420, pokaz: samKawalek }
  ] },
  // 5 · Co 5 minut: first the short hand, then the long one; 08:35 as in the level list. Step 1 — against the trap 09:35,
  // step 2 — against 08:07
  { tylko: '', chwyt: 'm', cyfry: 'minuty', kroki: [
    { zdanie: 'Najpierw <b class="g">krótka</b>: liczba, którą minęła.', t: 515, swieci: 'g', kolko: 8,
      duzy: '<span class="g">08</span>', maly: 'jeszcze nie 9' },
    { zdanie: 'Potem <b class="m">długa</b>: licz piątkami.', t: 480,
      pokaz: s => samJedz(s, 480, 515, () => { s.kolko(7); s.wynik(samCzas(515), '7 to 35 minut, a nie 07'); },
                          { licz: true }) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 515,
      pokaz: s => {                              // under the clock, live, „08:40", „08:45" … — nearest 5 minutes
        const pisz = nt => s.wynik(samCzas(Math.round(nt / 5) * 5 % 720));
        pisz(515);
        s.ciagnij(pisz);
      } }
  ] },
  // 6 · Słowami: po → the hour the short hand has passed · za → the one it is heading to (the trap „Za pięć szósta"); 6:55 as in
  // the level list. dwa — room for 2 lines under the clock („Dwadzieścia pięć po szóstej" does not fit in one)
  { tylko: '', chwyt: 'm', dwa: true, kroki: [
    // the caption comes through pokaz, not duzy: cwZdanie needs MINUTY / GODZ_EJ, and the page defines those only after samouczki.js
    { zdanie: '<b class="sam-po">Po</b> — godzina, którą krótka minęła.', t: 370, pol: 'po', swieci: 'g', kolko: 6,
      pokaz: s => s.wynik(samZdanie(370), cwCyfry(370)) },
    { zdanie: '<b class="sam-za">Za</b> — godzina, do której krótka idzie.', t: 415, pol: 'za',
      pokaz: s => samKlin(s, 55, 5, () => { s.kolko(7); s.wynik(samZdanie(415), 'za pięć minut będzie siódma'); }) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 415, pol: 'oba',
      pokaz: s => {                              // under the clock, live, the sentence and the digits — nearest 5 minutes
        const pisz = nt => { const q = Math.round(nt / 5) * 5 % 720; s.wynik(samZdanie(q), cwCyfry(q)); };
        pisz(s.t);
        s.ciagnij(pisz);
      } }
  ] },
  // 7 · Po południu: add 12 · after midnight 00 (the traps from Wybierz: 02:25 and 12:40)
  { tylko: '', po13: true, kroki: [
    { zdanie: '<b>Po południu</b> — dodaj <b class="g">12</b>.', t: 145, swieci: 'g', duzy: samCzas(145),
      pokaz: samDodaj12 },
    { zdanie: '<b>Po północy</b> — <b class="g">00</b>, nie 12.', t: 40, swieci: 'g', kolko: 0,
      duzy: samCzas(40, cwCyfry24), maly: 'W nocy' },
    { zdanie: 'Przesuwaj wskazówki palcem.', t: 0, pokaz: samPoludnieCiagnij }
  ] },
  // 8 · Wcześniej, później: 14:05 as in the level list; backwards across 12 — the trap 14:55 from Wybierz; the sentences are
  // short („Później — do przodu.") because „długa wskazówka przesuwa się…" did not fit in 2 lines
  { tylko: '', chwyt: 'm', kroki: [
    { zdanie: '<b class="sam-po">Później</b> — do przodu.', t: 125, pokaz: s => samPrzesun(s, 10) },
    { zdanie: '<b class="sam-za">Wcześniej</b> — do tyłu.', t: 125,
      pokaz: s => samPrzesun(s, -10, 'Przez 12 — jest już 13, nie 14.') },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 125, pokaz: samPrzesunCiagnij }
  ] },
  // 9 · Ile minut?: the bridge from the round, first to the full hour, then the rest, the total = both jumps
  { tylko: '', chwyt: 'm', kroki: [
    { zdanie: 'Najpierw — do <b class="m">pełnej godziny</b>.', t: 110, pokaz: s => samMost(s, 0) },
    { zdanie: 'Potem — to, co <b class="m">zostało</b>.', t: 120, pokaz: s => samMost(s, 1) },
    { zdanie: 'Przesuwaj <b class="m">długą wskazówkę</b> palcem.', t: 110, pokaz: samMostCiagnij }
  ] },
  // 10 · Mistrz: the hands separately as in the Ustaw round (👆 on the short hand shows where to grab it), then each dial from the round
  // in its own step — the child looks, moves the hands and goes on by itself once it has taken in the new dial
  { tylko: '', kroki: [
    { zdanie: 'Tu każda wskazówka chodzi <b>osobno</b>.', t: 660, osobno: true, swieci: 'g', pokaz: samOsobno },
    // first that a clock may look different, then how to read this dial; <br> — two lines, broken at the sense break
    { zdanie: 'Zegary bywają różne.<br>Tu są tylko 12, 3, 6 i 9.', t: 270, cyfry: 'cztery', pokaz: samTarczaCiagnij },
    { zdanie: 'Czasem nie ma liczb.<br>12 jest na górze, 6 na dole.', t: 270, cyfry: 'brak', pokaz: samTarczaCiagnij },
    { zdanie: 'Czasem liczby są rzymskie:<br>IV to 4, V to 5.', t: 270, cyfry: 'rzymskie', pokaz: samTarczaCiagnij }
  ] }
];

const samouczekJest = n => !!CW_SAMOUCZKI[n];
function samouczekByl(n) { try { return !!localStorage.getItem(SAM_KLUCZ(n)); } catch (e) { return false; } }

// the tutorial of level nrPoz (from 0); licznik — „2/3" in the header; potem() — after the last button; odKroku — for checking;
// koniec — the label of the last button: „Wróć" (💡), „Zaczynamy!" on the first entry into a level
// nrPoz may also be a tutorial object itself ({ tylko, kroki … }) — 🏋 Trening in index.html; its t0 (0 … 1439) — the start
// of every step instead of k.t (Start: the current time). The pokaz functions get the start in s.t (with the time of day).
function samouczek(box, licznik, nrPoz, potem, odKroku = 0, koniec = 'Wróć') {
  const sam = typeof nrPoz === 'object' ? nrPoz : CW_SAMOUCZKI[nrPoz], kroki = sam.kroki;
  const tKroku = k => sam.t0 != null ? sam.t0 : k.t;
  const znak = box.cwZnak = {};                 // late setTimeout / rAF callbacks (of a round or a step) write nothing
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
  let naRuch = null;                             // set in a step where the child drags (s.ciagnij), otherwise the clock is only to look at
  const z = Zegar(svg, { styl, cyfry: sam.cyfry || 'zwykle', rama: RAMA[styl] || '', t: tKroku(kroki[0]) % 720, tylko: sam.tylko,
                         chwyt: sam.chwyt, po13: sam.po13,
                         zmiana: (nt, puszczone) => { if (naRuch) naRuch(nt, puszczone); } });
  const wsk = svg.querySelectorAll('.w-godz, .w-min, .m-wsk, .k-wsk');   // [hour hand, minute hand] — in this order in every style
  const tarcza = wsk[1].parentNode.parentNode;   // the group with the digits and the hands
  const podpisy = svg.querySelectorAll('.s-min, .m-min, .k-min');         // 00, 05 … 55 (only with 'minuty' digits)
  // the dial halves (level 3): right „po", left „za" — above the background, under the digits; the green sector (s.klin) above them
  const polowa = (klasa, d) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('class', klasa);
                                 p.setAttribute('d', d); return p; };
  const po = polowa('sam-pol-po', 'M100 100 V11 A89 89 0 0 1 100 189 Z'),
        za = polowa('sam-pol-za', 'M100 100 V189 A89 89 0 0 1 100 11 Z');
  svg.querySelector('.s-tlo, .m-tlo, .k-tlo').after(po, za);
  // level 4: 4 pieces of 15 minutes (tinted by s.cwiartki) and the cuts 12 · 3 · 6 · 9 from the centre to the digits
  const cwiartki = [];
  if (sam.cwiartki) {
    for (let i = 0; i < 4; i++) cwiartki.push(polowa(`sektor sam-cwiartka c${i} sam-ukryty`, uplywWycinek(i * 15, 15)));
    za.after(...cwiartki, polowa('sam-ciecie', 'M100 48 V152 M48 100 H152'));
  }

  let nr = Math.min(kroki.length - 1, odKroku);
  let dodatek = null;                            // s.pod — under the clock, only in its own step
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
    if (sam.po13) z.popo(false);                 // level 7: every step starts with the digits 1 … 12, pokaz switches on 13 … 23
    if (k.cyfry) z.cyfry(k.cyfry);
    z.ustaw(tKroku(k) % 720);
    if (k.swieci) wsk[k.swieci === 'g' ? 0 : 1].classList.add('sam-swieci');
    if (k.kolko != null) cwKolko(svg, k.kolko, true, true);
    zdanie.innerHTML = k.zdanie;
    duzy.innerHTML = k.duzy || '';
    maly.innerHTML = k.maly || '';
    dalejB.textContent = nr < kroki.length - 1 ? 'Dalej' : koniec;
    dalejB.disabled = false;
    let ruchy = 0;                               // how many of the step's animations are still running — while > 0, „Dalej" is disabled
    if (k.pokaz) k.pokaz({ z, svg, tarcza, zywy, reka: sam.tylko, t: tKroku(k),
      jedzie: () => { ruchy++; dalejB.disabled = true; },
      stoi: () => { if (--ruchy <= 0) dalejB.disabled = false; },
      kolko: H => cwKolko(svg, H, true, true),
      podpis: n => { if (podpisy[n % 12]) podpisy[n % 12].classList.remove('sam-ukryty'); },
      podpisy: lista => {                        // only these are lit (numbers without wrapping: 13 = 05)
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

// entering level nrPoz (from 0): the first time the tutorial comes first (if the level has one), then runda();
// saved right away — leaving halfway will not show it again, from then on only through 💡
function cwStart(box, licznik, nrPoz, runda) {
  if (!samouczekJest(nrPoz) || samouczekByl(nrPoz)) return runda();
  try { localStorage.setItem(SAM_KLUCZ(nrPoz), '1'); } catch (e) {}
  samouczek(box, licznik, nrPoz, runda, 0, 'Zaczynamy!');
}
