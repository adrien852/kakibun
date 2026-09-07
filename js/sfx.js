/* Kakibun — sound, tuned to the season (Web Audio, no asset files).
 *
 * One tuned pad plus one clean marimba note, transposed per season, so the app
 * sounds the way it looks: spring bright, winter low. The season supplies four
 * frequencies; every cue is built from those, which is why nothing here needs
 * its own tuning table.
 *
 *   haru  349 · 523 · 698 · 1046      natsu 440 · 659 · 880 · 1318
 *   aki   293 · 440 · 587 ·  880      fuyu  196 · 294 · 392 ·  784
 */
const Sfx = (() => {
  let ctx = null;

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    // iOS suspends the context until a gesture; every cue follows one
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  const on = () => {
    try { return !!(Engine.state() && Engine.state().settings.sound); }
    catch (e) { return false; }
  };
  const chord = () => {
    try { return Season.current().chord; } catch (e) { return [293, 440, 587, 880]; }
  };

  /* f2 bends the pitch across the note — the only thing the wrong-answer cue
   * needs that a flat tone can't give. */
  function tone(f, t0, dur, type, gain, f2) {
    if (!on()) return;
    const c = ac(), o = c.createOscillator(), g = c.createGain();
    const t = c.currentTime + t0;
    o.type = type || "sine";
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  /* correct — the pad opens under a marimba note and its octave */
  function good() {
    const p = chord();
    tone(p[0], 0,    1.7,  "triangle", 0.06);
    tone(p[1], 0,    1.6,  "sine",     0.04);
    tone(p[2], 0.05, 1.4,  "sine",     0.03);
    tone(p[3], 0.1,  0.7,  "sine",     0.15);
    tone(p[3] * 2, 0.1, 0.32, "sine",  0.035);
  }
  /* wrong — a short fall, deliberately not a buzzer */
  function bad() {
    tone(146, 0,    0.5, "triangle", 0.1, 110);
    tone(196, 0.05, 0.4, "sine",     0.05);
  }
  /* tap — the marimba note alone, barely there */
  function tap() { tone(chord()[3], 0, 0.09, "sine", 0.05); }
  /* about to speak, or playback starting — three ascending pad tones */
  function voice() {
    const p = chord();
    tone(p[1], 0,    0.5, "sine", 0.08);
    tone(p[2], 0.12, 0.5, "sine", 0.06);
    tone(p[3], 0.24, 0.7, "sine", 0.05);
  }
  /* a grammar point just became 🏅 — the pad, held, with the octave over it */
  function master() {
    const p = chord();
    tone(p[0], 0,    2.0, "triangle", 0.07);
    tone(p[1], 0.06, 1.9, "sine",     0.05);
    tone(p[2], 0.12, 1.7, "sine",     0.04);
    tone(p[3], 0.18, 1.1, "sine",     0.15);
    tone(p[3] * 2, 0.30, 0.9, "sine", 0.05);
  }
  /* session finished */
  function complete() {
    const p = chord();
    [p[1], p[2], p[3]].forEach((f, i) => tone(f, i * 0.12, 0.5, "sine", 0.09));
    tone(p[3] * 2, 0.4, 0.8, "sine", 0.05);
  }

  return { good, bad, tap, voice, master, complete };
})();
