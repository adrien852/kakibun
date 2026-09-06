/* Kakibun — sentence DSL parser + furigana alignment + reading lookup.
 *
 * DSL, one sentence per string, tokens separated by spaces:
 *   watashi            lexicon word, base form
 *   taberu.mashita     lexicon word, conjugated (see Conj)
 *   は=top             particle + its function (key into PARTICLES)
 *   ~もいいですか       glue: raw kana carrying the sentence's grammar point
 *   、                  pause
 * 。 is appended automatically at render time (unless the last token ends in か+glue).
 */
const Parse = (() => {
  const isKanji = (c) => c >= "一" && c <= "鿿";
  const fold = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));

  const DEVOICE = {"が":"か","ぎ":"き","ぐ":"く","げ":"け","ご":"こ","ざ":"さ","じ":"し","ず":"す","ぜ":"せ","ぞ":"そ",
    "だ":"た","ぢ":"ち","づ":"つ","で":"て","ど":"と","ば":"は","び":"ひ","ぶ":"ふ","べ":"へ","ぼ":"ほ",
    "ぱ":"は","ぴ":"ひ","ぷ":"ふ","ぺ":"へ","ぽ":"ほ"};
  const devoice = (s) => s ? (DEVOICE[s[0]] || s[0]) + s.slice(1) : s;

  // lenient reading equality: rendaku on first kana, っ-gemination on last
  function readEq(seg, base) {
    if (!seg || !base) return false;
    if (seg === base) return true;
    if (devoice(seg) === base) return true;
    const g = (s) => s.endsWith("っ") ? s.slice(0, -1) : null;
    const gs = g(seg);
    if (gs !== null && (base.startsWith(gs) || base.startsWith(devoice(gs)))) return true;
    return false;
  }

  // find this reading among the kanji's listed readings → {type,f,note} | null
  function readingType(ch, reading) {
    const info = typeof KANJI_INFO !== "undefined" ? KANJI_INFO[ch] : null;
    if (!info) return null;
    for (const [list, type] of [[info.on, "on"], [info.kun, "kun"]]) {
      for (const e of list) {
        if (readEq(fold(reading), e[0])) {
          return { type, f: e[1], note: e[2] ? { fr: e[2], en: e[3] } : null };
        }
      }
    }
    return null;
  }

  /* Align a kanji surface with its kana reading → display segments [{t, rt?}].
   * Assumes at most ONE kanji run (words with several runs supply lex.seg). */
  function align(k, r) {
    if (k == null) return [{ t: r }];
    const fk = fold(k), fr = fold(r);
    let i = 0;
    while (i < k.length && !isKanji(k[i]) && i < r.length && fk[i] === fr[i]) i++;
    let sk = k.length, sr = r.length;
    while (sk > i && sr > i && !isKanji(k[sk - 1]) && fk[sk - 1] === fr[sr - 1]) { sk--; sr--; }
    const segs = [];
    if (i > 0) segs.push({ t: k.slice(0, i) });
    const run = k.slice(i, sk), ruby = r.slice(i, sr);
    if (run) segs.push({ t: run, rt: ruby });
    if (sk < k.length) segs.push({ t: k.slice(sk) });
    return segs;
  }

  /* Per-kanji breakdown of a word for the popup.
   * → { sp?:true, parts:[{ch, reading}] , run, ruby } */
  function kanjiBreakdown(lex, k, r) {
    const segs = lex.seg
      ? lex.seg.map(s => ({ t: s[0], rt: s[1] }))
      : align(k, r);
    const runSeg = segs.filter(s => s.rt && [...s.t].some(isKanji));
    const parts = [];
    let sp = !!lex.sp;
    for (const s of runSeg) {
      const chars = [...s.t].filter(isKanji);
      if (lex.sp) { parts.push({ chars, reading: s.rt, fused: true }); continue; }
      if (chars.length === 1) parts.push({ chars, reading: s.rt });
      else if (lex.kb && lex.kb.length === chars.length)
        chars.forEach((ch, idx) => parts.push({ chars: [ch], reading: lex.kb[idx] }));
      else { parts.push({ chars, reading: s.rt, fused: true }); sp = true; }
    }
    return { sp, parts };
  }

  function parseToken(t) {
    if (t === "、") return { type: "punct", surfK: null, surfR: "、" };
    if (t[0] === "~") return { type: "glue", surfK: null, surfR: t.slice(1) };
    const eq = t.indexOf("=");
    if (eq > 0 && !t.includes(".")) {
      const p = t.slice(0, eq), fn = t.slice(eq + 1);
      const key = p + "." + fn;
      if (typeof PARTICLES !== "undefined" && !PARTICLES[key]) throw new Error("unknown particle fn: " + key);
      return { type: "p", p, fn: key, surfK: null, surfR: p };
    }
    if (t === "です") return { type: "w", lex: LEXICON.desu, form: "desu", surfK: null, surfR: "です" };
    const dot = t.indexOf(".");
    const id = dot > 0 ? t.slice(0, dot) : t;
    const form = dot > 0 ? t.slice(dot + 1) : null;
    const lex = LEXICON[id];
    if (!lex) throw new Error("unknown word: " + id);
    const c = Conj.conj(lex, form);
    return { type: "w", lex, form, surfK: c.k, surfR: c.r };
  }

  function sentence(dsl) {
    const toks = dsl.trim().split(/\s+/).map(parseToken);
    const surfK = toks.map(t => t.surfK != null ? t.surfK : t.surfR).join("");
    const surfR = toks.map(t => t.surfR).join("");
    return { toks, surfK, surfR };
  }

  /* Equally-correct alternative surfaces for a sentence: the same sentence with
   * one token swapped for a word the prompt could not have chosen between (see
   * ALT_WORDS in data/lexicon.js). One swap at a time — a prompt is only ever
   * ambiguous about one word, and combinations would multiply for nothing.
   *
   * Only an UNINFLECTED token is swapped: a conjugated form belongs to its own
   * verb and the two words are no longer interchangeable. */
  function altReadings(parsed) {
    if (typeof ALT_WORDS === "undefined") return [];
    const out = [];
    parsed.toks.forEach((tok, i) => {
      const lex = tok.lex;
      if (!lex || tok.surfR !== lex.r) return;
      const grp = ALT_WORDS.find(g => g.indexOf(lex.id) >= 0);
      if (!grp) return;
      for (const other of grp) {
        if (other === lex.id) continue;
        const w = LEXICON[other];
        if (!w) continue;
        out.push({
          k: parsed.toks.map((t, j) => j === i ? (w.k || w.r)
                : (t.surfK != null ? t.surfK : t.surfR)).join(""),
          r: parsed.toks.map((t, j) => j === i ? w.r : t.surfR).join(""),
          said: w,      // what the learner produced
          want: lex     // what this sentence actually uses
        });
      }
    });
    return out;
  }

  return { sentence, parseToken, align, kanjiBreakdown, readingType, fold, isKanji, readEq,
           altReadings };
})();
if (typeof module !== "undefined") module.exports = { Parse };
