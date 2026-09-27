// dzwieki.js — dźwięki aplikacji (Lasha 27.09: „მოქმედებების ხმები … ღილაკებისთვის და საათის მოქმედებისთვის" → plan „ოკ").
// Pliki z Numko (Matma-Robot/Audiof) w dzwieki/; gdy pliku brak — krótki generowany beep, jak w Numko.
//   klik      — każdy przycisk i pozycja menu (sam, niżej); bez 🔊 i bez odpowiedzi w ćwiczeniach — te mają dobrze / źle
//   tik       — wskazówka minęła liczbę (tarcza.js): minutowa co 5 minut, godzinowa co godzinę; generowany, bez pliku
//   zatrzask  — wskazówka puszczona i dociągnięta (tarcza.js)
//   ocena(b)  — dobra / zła odpowiedź (cwiczenia.js) · brawo — koniec rundy
//   obrot     — karta „Która godzina?" się obraca (index.html, „Zakryj godzinę"); generowany, bez pliku
//   wlacz(b)  — ⚙ „Dźwięki", pamiętane w localStorage 'zegar-dzwieki'
(function () {
  "use strict";
  let wlaczone = true;
  try { wlaczone = localStorage.getItem('zegar-dzwieki') !== 'nie'; } catch (e) {}

  // przeglądarka trzyma AudioContext uśpiony do pierwszego dotknięcia — ac() za każdym razem go budzi
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

  // szum dl sekund przez filtr pasmowy; obwiednia(x) — głośność w chwili x = 0…1; bufor liczony raz, potem z pamięci
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

  // tik: 30 ms szumu — jak mechanizm zegara; przy szybkim kręceniu najwyżej jeden na 40 ms
  let ostTik = 0;
  function tik() {
    const teraz = performance.now();
    if (!wlaczone || teraz - ostTik < 40) return;
    ostTik = teraz;
    const c = ac();
    if (c) szum(c, .03, x => Math.pow(1 - x, 4), .6).frequency.value = 2500;
  }

  // obrót karty „Która godzina?" (Lasha 27.09, z dwóch propozycji „1"): „ფშუ" — szum narasta i gaśnie, filtr jedzie
  // w górę i z powrotem; 0.35 s, karta obraca się 0.45 s
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

  // klik przy każdym przycisku i pozycji menu. Bąbelkowanie, nie przechwytywanie: onclick przełącznika w ⚙ działa
  // pierwszy — po „Włączone" klik już słychać, po „Wyłączone" już nie.
  document.addEventListener('click', e => {
    if (!wlaczone) return;
    ac();                                    // pierwsze dotknięcie budzi AudioContext — tik działa od pierwszego ruchu
    const b = e.target.closest('button, a, label.btn, summary');
    if (b && !b.closest('#powiedz, .cw-wybor')) Dzwiek.klik();
  });
})();
