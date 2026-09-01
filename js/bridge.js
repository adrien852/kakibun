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

  function load(state) {
    // 1. live localStorage from Kakikana (same origin)
    try {
      const raw = localStorage.getItem(KAKIKANA_KEY);
      if (raw) {
        const parsed = parseExport(JSON.parse(raw));
        if (parsed) { apply(parsed, "auto"); state.kakikana = { raw: JSON.parse(raw) }; return; }
      }
    } catch (e) { /* ignore */ }
    // 2. previously imported copy stored in Kakibun's own state
    if (state.kakikana && state.kakikana.raw) {
      const parsed = parseExport(state.kakikana.raw);
      if (parsed) { apply(parsed, "stored"); return; }
    }
    info = null;
  }

  function importJSON(obj, state) {
    const parsed = parseExport(obj);
    if (!parsed) return false;
    apply(parsed, "file");
    state.kakikana = { raw: obj };
    return true;
  }

  const hasInfo = () => info != null;
  const learnedCount = () => learned.size;
  const importInfo = () => info;

  function knowsAll(surfK) {
    for (const ch of surfK) if (Parse.isKanji(ch) && !learned.has(ch)) return false;
    return true;
  }

  /* Display segments for a token: [{t, rt?}].
   * showAll bypasses gating (setting). furi: "all" | "new" | "none". */
  function display(tok, opts) {
    const o = opts || {};
    if (tok.surfK == null) return [{ t: tok.surfR }];
    if (!o.showAll && !knowsAll(tok.surfK)) return [{ t: tok.surfR }]; // not learned → kana
    const lex = tok.lex || {};
    const segs = (lex.seg && !tok.form)
      ? lex.seg.map(s => ({ t: s[0], rt: s[1] }))
      : Parse.align(tok.surfK, tok.surfR);
    if (o.furi === "none") return segs.map(s => ({ t: s.t }));
    if (o.furi === "all") return segs;
    // "new": ruby only when the run contains a not-yet-mastered (or unknown) kanji
    return segs.map(s => {
      if (!s.rt) return s;
      const needs = [...s.t].some(ch => Parse.isKanji(ch) && (fresh.has(ch) || !learned.has(ch)));
      return needs ? s : { t: s.t };
    });
  }

  return { load, importJSON, display, knowsAll, hasInfo, learnedCount, importInfo,
           isLearned: (ch) => learned.has(ch), KAKIKANA_KEY };
})();
if (typeof module !== "undefined") module.exports = { Bridge };
