// dzwieki.js — the app's sounds: for the buttons and for what the clock does.
// Files from Numko (Matma-Robot/Audiof) in dzwieki/; when a file is missing — a short generated beep, as in Numko.
//   klik      — every button and menu item (by itself, below); not 🔊, not the answers in the exercises — those have right / wrong
//   tik       — a hand passed a number (tarcza.js): the minute hand every 5 minutes, the hour hand every hour; generated, no file
//   zatrzask  — a hand released and snapped into place (tarcza.js)
//   ocena(b)  — a right / wrong answer (cwiczenia.js) · brawo — the end of a round
//   obrot     — the „Która godzina?" card flips (index.html, „Zakryj godzinę"); generated, no file
//   wlacz(b)  — ⚙ „Dźwięki", remembered in localStorage 'zegar-dzwieki'
(function () {
  "use strict";
  let wlaczone = true;
  try { wlaczone = localStorage.getItem('zegar-dzwieki') !== 'nie'; } catch (e) {}

  // the browser keeps AudioContext suspended until the first touch — ac() wakes it on every call
  let AC = null;
  function ac() {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
    } catch (e) { AC = null; }
    return AC;
  }
  function beep(f, dur, type) {
    const c = ac();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination);
    o.start(); o.stop(c.currentTime + dur);
  }

  const PLIKI = {};
  [['klik', .5], ['zatrzask', .5], ['dobrze', .7], ['zle', .6], ['brawo', .8]].forEach(([nazwa, glosnosc]) => {
    const a = new Audio(`dzwieki/${nazwa}.ogg`);
    a.preload = 'auto'; a.volume = glosnosc;
    a.onerror = () => { a.zly = true; };
    PLIKI[nazwa] = a;
  });
  function zagraj(nazwa, zapas) {
    if (!wlaczone) return;
    const a = PLIKI[nazwa];
    if (!a.zly) try { a.currentTime = 0; a.play().catch(() => {}); return; } catch (e) {}
    zapas();
  }

  // dl seconds of noise through a band-pass filter; obwiednia(x) — volume at moment x = 0…1; buffer computed once, then reused
  const bufory = {};
  function szum(c, dl, obwiednia, glosnosc) {
    let b = bufory[dl];
    if (!b) {
      const n = Math.round(c.sampleRate * dl), d = (b = bufory[dl] = c.createBuffer(1, n, c.sampleRate)).getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * obwiednia(i / n);
    }
    const zr = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    zr.buffer = b;
    f.type = 'bandpass';
    g.gain.value = glosnosc;
    zr.connect(f); f.connect(g); g.connect(c.destination);
    zr.start();
    return f;
  }

  // tik: 30 ms of noise — like a clock mechanism; when the hand is turned fast, at most one per 40 ms
  let ostTik = 0;
  function tik() {
    const teraz = performance.now();
    if (!wlaczone || teraz - ostTik < 40) return;
    ostTik = teraz;
    const c = ac();
    if (c) szum(c, .03, x => Math.pow(1 - x, 4), .6).frequency.value = 2500;
  }

  // the „Która godzina?" card flipping: a whoosh — the noise swells and fades, the filter sweeps
  // up and back; 0.35 s, the card turns for 0.45 s
  function obrot() {
    if (!wlaczone) return;
    const c = ac();
    if (!c) return;
    const f = szum(c, .35, x => Math.sin(Math.PI * x), .35), t0 = c.currentTime;
    f.Q.value = 1.5;
    f.frequency.setValueAtTime(500, t0);
    f.frequency.exponentialRampToValueAtTime(2500, t0 + .16);
    f.frequency.exponentialRampToValueAtTime(700, t0 + .35);
  }

  const Dzwiek = window.Dzwiek = {
    get wlaczone() { return wlaczone; },
    wlacz(b) {
      wlaczone = b;
      try { localStorage.setItem('zegar-dzwieki', b ? 'tak' : 'nie'); } catch (e) {}
    },
    klik: () => zagraj('klik', () => beep(330, .06, 'triangle')),
    zatrzask: () => zagraj('zatrzask', () => beep(950, .045)),
    ocena: dobrze => dobrze ? zagraj('dobrze', () => { beep(660, .12); setTimeout(() => beep(880, .16), 110); })
                            : zagraj('zle', () => beep(180, .25, 'square')),
    brawo: () => zagraj('brawo', () => { beep(1050, .08); setTimeout(() => beep(1400, .12), 80); }),
    tik,
    obrot
  };

  // klik on every button and menu item. Bubbling, not capture: the onclick of the switch in ⚙ runs
  // first — after „Włączone" the click is already heard, after „Wyłączone" no longer.
  document.addEventListener('click', e => {
    if (!wlaczone) return;
    ac();                                    // the first touch wakes AudioContext — tik works from the first move
    const b = e.target.closest('button, a, label.btn, summary');
    if (b && !b.closest('#powiedz, .cw-wybor, #sprawdz, .cw-sprawdz')) Dzwiek.klik();
  });
})();
