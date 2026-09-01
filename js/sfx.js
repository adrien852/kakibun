/* Kakibun — sound effects (WebAudio, no assets). */
const Sfx = (() => {
  let ctx = null;
  const ac = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());
  const on = () => Engine.state() && Engine.state().settings.sound;

  function tone(freq, t0, dur, type, gain) {
    const c = ac(), o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0, c.currentTime + t0);
    g.gain.linearRampToValueAtTime(gain || 0.18, c.currentTime + t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + 0.05);
  }

  // correct: rising 5th, pitch climbs with combo (rhythm-game feel)
  function good(combo) {
    if (!on()) return;
    const base = 523 * Math.pow(1.06, Math.min(combo || 0, 12));
    tone(base, 0, 0.16, "sine", 0.16);
    tone(base * 1.5, 0.07, 0.22, "sine", 0.16);
  }
  function bad() {
    if (!on()) return;
    tone(196, 0, 0.25, "triangle", 0.14);
    tone(147, 0.09, 0.3, "triangle", 0.12);
  }
  function tap() { if (on()) tone(880, 0, 0.05, "sine", 0.05); }
  // mastery: rising run then a held bell over a fifth
  function master() {
    if (!on()) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.15, "sine", 0.14));
    tone(880, 0.42, 1.2, "sine", 0.12);
    tone(1175, 0.42, 1.5, "sine", 0.16);
  }
  function complete() {
    if (!on()) return;
    [523, 659, 784].forEach((f, i) => tone(f, i * 0.12, 0.3, "sine", 0.15));
    tone(1047, 0.4, 0.6, "sine", 0.18);
  }
  return { good, bad, tap, master, complete };
})();
