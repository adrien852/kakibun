/* Kakibun — Kakikana bridge + kanji display gating.
 *
 * Kakikana (same GitHub Pages origin) writes its export to localStorage under
 * KAKIKANA_KEY on every save; Kakibun reads it automatically at startup.
 * A JSON file with the same shape can also be imported by hand (Settings /
 * home banner) — useful if the apps ever live on different origins.
 *
 * Export shape (v1):
 * {
 *   "app": "kakikana", "v": 1, "date": "2026-09-01T…",
 *   "kanji":    { "mastered": ["日","本",…], "known": […], "learning": […] },
 *   "hiragana": { "mastered": […], "known": […] },     // optional, unused here
 *   "katakana": { "mastered": […], "known": […] }      // optional, unused here
 * }
 * learned (shown in kanji)   = kanji.mastered ∪ kanji.known
 * learning (kanji + furigana forced) = kanji.learning
 */
const Bridge = (() => {
  const KAKIKANA_KEY = "kakikana.export.v1";
  let learned = new Set();   // shown as kanji
  let fresh = new Set();     // subset: not yet mastered → furigana in "new" mode
  let info = null;           // {date, n, source}

  function parseExport(obj) {
    if (!obj || obj.app !== "kakikana" || !obj.kanji) return null;
    const m = obj.kanji.mastered || [], k = obj.kanji.known || [], l = obj.kanji.learning || [];
    return {
      learned: [...m, ...k, ...l],
      fresh: [...k, ...l],
      date: obj.date || null,
      counts: { mastered: m.length, known: k.length, learning: l.length }
    };
  }

  function apply(parsed, source) {
    learned = new Set(parsed.learned);
    fresh = new Set(parsed.fresh);
    info = { date: parsed.date, n: parsed.learned.length, source, counts: parsed.counts };
  }

  /* Diff what Kakikana knows now against what Kakibun saw last time.
   * The very first link is NOT a debut — we'd dump 50 "new" kanji at once. */
  function diffNew(state) {
    const now = [...learned].sort();
    if (!state.kanjiSeen) { state.kanjiSeen = now; return []; }
    const before = new Set(state.kanjiSeen);
    const fresh = now.filter(ch => !before.has(ch));
    if (fresh.length) {
      const pending = new Set(state.newKanji || []);
      fresh.forEach(ch => pending.add(ch));
      state.newKanji = [...pending];
    }
    state.kanjiSeen = now;
    return fresh;
  }

  function load(state) {
    // 1. live localStorage from Kakikana (same origin)
    try {
      const raw = localStorage.getItem(KAKIKANA_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        const parsed = parseExport(obj);
        if (parsed) { apply(parsed, "auto"); state.kakikana = { raw: obj }; diffNew(state); return; }
      }
    } catch (e) { /* ignore */ }
    // 2. previously imported copy stored in Kakibun's own state
    if (state.kakikana && state.kakikana.raw) {
      const parsed = parseExport(state.kakikana.raw);
      if (parsed) { apply(parsed, "stored"); diffNew(state); return; }
    }
    info = null;
  }

  /* Re-read Kakikana without a relaunch (called on focus / tab visible).
   * Returns the newly learned kanji, or [] when nothing changed. */
  function refresh(state) {
    const before = learned.size;
    let fresh = [];
    try {
      const raw = localStorage.getItem(KAKIKANA_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        const parsed = parseExport(obj);
        if (parsed) {
          apply(parsed, "auto");
          state.kakikana = { raw: obj };
          fresh = diffNew(state);
        }
      }
    } catch (e) { /* ignore */ }
    return { fresh, changed: fresh.length > 0 || learned.size !== before };
  }

  function importJSON(obj, state) {
    const parsed = parseExport(obj);
    if (!parsed) return false;
    apply(parsed, "file");
    state.kakikana = { raw: obj };
    diffNew(state);
    return true;
  }

  const hasInfo = () => info != null;
  const learnedCount = () => learned.size;
  const importInfo = () => info;

  function knowsAll(surfK) {
    for (const ch of surfK) if (Parse.isKanji(ch) && !learned.has(ch)) return false;
    return true;
  }
  function knowsSome(surfK) {
    for (const ch of surfK) if (Parse.isKanji(ch) && learned.has(ch)) return true;
    return false;
  }

  /* Split a word into segments as finely as the data allows, so furigana can sit
   * over ONE kanji rather than the whole run: 学生 → 学(がく) + 生(せい), letting a
   * known 生 stay bare while an unknown 学 carries its reading.
   * Falls back to a single run for jukujikun (今年 = ことし can't be split) and
   * for anything whose per-kanji readings don't reassemble exactly. */
  function segmentsFor(tok) {
    const lex = tok.lex || {};
    if (lex.seg && !tok.form) return lex.seg.map(s => ({ t: s[0], rt: s[1] }));
    const base = Parse.align(tok.surfK, tok.surfR);
    if (lex.sp || !lex.kb) return base;                 // fused reading, or nothing to split by
    const out = [];
    for (const s of base) {
      const chars = [...s.t];
      const kanji = chars.filter(Parse.isKanji);
      // only split a run that is ALL kanji and matches kb one-for-one
      if (!s.rt || kanji.length !== chars.length || kanji.length !== lex.kb.length) {
        out.push(s); continue;
      }
      if (lex.kb.join("") !== s.rt) { out.push(s); continue; }   // readings must reassemble
      chars.forEach((c, i) => out.push({ t: c, rt: lex.kb[i] }));
    }
    return out;
  }

  /* Display segments for a token: [{t, rt?}].
   * showAll bypasses gating (setting). furi: "all" | "new" | "none".
   *
   * Gating rule: a word is written in kanji as soon as ANY of its kanji is
   * learned — the unknown characters simply carry furigana. Only a word with no
   * learned kanji at all falls back to kana. Exception: in furi "none" there is
   * no furigana to lean on, so a partially-known word would be unreadable and
   * the kana fallback still applies. */
  function display(tok, opts) {
    const o = opts || {};
    if (tok.surfK == null) return [{ t: tok.surfR }];
    // forceKanji: the reading exercise must show the character it is asking
    // about, so it opts out of both the kana fallback and the furigana
    if (o.forceKanji) return segmentsFor(tok).map(s => ({ t: s.t }));
    if (!o.showAll) {
      const all = knowsAll(tok.surfK);
      if (!all && o.furi === "none") return [{ t: tok.surfR }];
      if (!all && !knowsSome(tok.surfK)) return [{ t: tok.surfR }];
    }
    const segs = segmentsFor(tok);
    if (o.furi === "none") return segs.map(s => ({ t: s.t }));
    if (o.furi === "all") return segs;
    // "new": ruby only over segments holding a not-yet-mastered or unknown kanji
    return segs.map(s => {
      if (!s.rt) return s;
      const needs = [...s.t].some(ch => Parse.isKanji(ch) && (fresh.has(ch) || !learned.has(ch)));
      return needs ? s : { t: s.t };
    });
  }

  return { load, refresh, importJSON, display, segmentsFor, knowsAll, knowsSome,
           hasInfo, learnedCount, importInfo,
           isLearned: (ch) => learned.has(ch), KAKIKANA_KEY };
})();
if (typeof module !== "undefined") module.exports = { Bridge };
