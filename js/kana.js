/* Kakibun — wāpuro rōmaji → hiragana, for the typed answer modes.
 *
 * This is how Japanese is actually typed: you spell the reading in rōmaji and
 * the IME turns it into kana. Adrien already reads wāpuro rōmaji in the library
 * (お母さん (okaasan)), so typing "okaasan" costs him no new skill — and unlike
 * tiles or four buttons, a blank field gives nothing away.
 *
 * Deliberately forgiving in two places, both spelling rather than grammar:
 *   - both spellings of the ambiguous rows (shi/si, tsu/tu, ji/zi, fu/hu…)
 *   - the three particles whose sound and spelling disagree: は read "wa",
 *     へ read "e", を read "o". An IME wants "ha"/"he"/"wo" there, a learner
 *     types what he hears. `same()` folds は→わ, へ→え, を→お on BOTH sides so
 *     either works — while が vs は, で vs に and every other real particle
 *     mistake still comes out wrong.
 */
const Kana = (() => {
  const PAIRS = [
    // three-letter first, then two, then one — matched longest-first
    ["kya","きゃ"],["kyu","きゅ"],["kyo","きょ"],["gya","ぎゃ"],["gyu","ぎゅ"],["gyo","ぎょ"],
    ["sha","しゃ"],["shu","しゅ"],["sho","しょ"],["sya","しゃ"],["syu","しゅ"],["syo","しょ"],
    ["cha","ちゃ"],["chu","ちゅ"],["cho","ちょ"],["cya","ちゃ"],["cyu","ちゅ"],["cyo","ちょ"],
    ["tya","ちゃ"],["tyu","ちゅ"],["tyo","ちょ"],
    ["jya","じゃ"],["jyu","じゅ"],["jyo","じょ"],["zya","じゃ"],["zyu","じゅ"],["zyo","じょ"],
    ["nya","にゃ"],["nyu","にゅ"],["nyo","にょ"],["hya","ひゃ"],["hyu","ひゅ"],["hyo","ひょ"],
    ["bya","びゃ"],["byu","びゅ"],["byo","びょ"],["pya","ぴゃ"],["pyu","ぴゅ"],["pyo","ぴょ"],
    ["mya","みゃ"],["myu","みゅ"],["myo","みょ"],["rya","りゃ"],["ryu","りゅ"],["ryo","りょ"],
    ["dya","ぢゃ"],["dyu","ぢゅ"],["dyo","ぢょ"],
    ["shi","し"],["chi","ち"],["tsu","つ"],["ltu","っ"],["xtu","っ"],
    ["ja","じゃ"],["ju","じゅ"],["jo","じょ"],
    ["ka","か"],["ki","き"],["ku","く"],["ke","け"],["ko","こ"],
    ["ga","が"],["gi","ぎ"],["gu","ぐ"],["ge","げ"],["go","ご"],
    ["sa","さ"],["si","し"],["su","す"],["se","せ"],["so","そ"],
    ["za","ざ"],["zi","じ"],["ji","じ"],["zu","ず"],["ze","ぜ"],["zo","ぞ"],
    ["ta","た"],["ti","ち"],["tu","つ"],["te","て"],["to","と"],
    ["da","だ"],["di","ぢ"],["du","づ"],["de","で"],["do","ど"],
    ["na","な"],["ni","に"],["nu","ぬ"],["ne","ね"],["no","の"],
    ["ha","は"],["hi","ひ"],["hu","ふ"],["fu","ふ"],["he","へ"],["ho","ほ"],
    ["ba","ば"],["bi","び"],["bu","ぶ"],["be","べ"],["bo","ぼ"],
    ["pa","ぱ"],["pi","ぴ"],["pu","ぷ"],["pe","ぺ"],["po","ぽ"],
    ["ma","ま"],["mi","み"],["mu","む"],["me","め"],["mo","も"],
    ["ya","や"],["yu","ゆ"],["yo","よ"],
    ["ra","ら"],["ri","り"],["ru","る"],["re","れ"],["ro","ろ"],
    ["wa","わ"],["wo","を"],["wi","ゐ"],["we","ゑ"],
    ["a","あ"],["i","い"],["u","う"],["e","え"],["o","お"],
    ["-","ー"]
  ];
  const BY_LEN = [3, 2, 1];
  const TABLE = {};
  for (const [r, k] of PAIRS) TABLE[r] = k;

  const isVowel = (c) => "aiueo".indexOf(c) >= 0;
  const isCons = (c) => /[a-z]/.test(c) && !isVowel(c);

  /* rōmaji (or already-kana, which passes through) → hiragana */
  function toKana(input) {
    const s = String(input || "").toLowerCase().replace(/\s+/g, "");
    let out = "", i = 0;
    while (i < s.length) {
      const c = s[i];
      // anything that isn't ASCII is assumed to be kana already — let it through
      if (!/[a-z'-]/.test(c)) { out += s[i]; i++; continue; }
      // ん: "n'", "nn", or n before a consonant / end of input.
      // The subtle case is "nn" followed by a vowel: "honno" is ほんの, not
      // ほんお, because the second n starts its own syllable. Only when nothing
      // vowel-like follows does "nn" spend both letters on ん ("honn").
      if (c === "n") {
        const nx = s[i + 1], nx2 = s[i + 2];
        if (nx === "'") { out += "ん"; i += 2; continue; }
        if (nx === "n") {
          const startsSyllable = nx2 !== undefined && (isVowel(nx2) || nx2 === "y");
          out += "ん"; i += startsSyllable ? 1 : 2; continue;
        }
        if (nx === undefined || (isCons(nx) && nx !== "y")) { out += "ん"; i++; continue; }
      }
      // っ: a doubled consonant (kk, tt, ss…) — never "nn", handled above
      if (isCons(c) && s[i + 1] === c && c !== "n") { out += "っ"; i++; continue; }
      let hit = null;
      for (const len of BY_LEN) {
        const chunk = s.slice(i, i + len);
        if (chunk.length === len && TABLE[chunk]) { hit = { k: TABLE[chunk], len }; break; }
      }
      if (hit) { out += hit.k; i += hit.len; }
      else { out += c; i++; }          // unconvertible letter: keep it, so it shows as wrong
    }
    return out;
  }

  /* true if the string looks like someone typed rōmaji rather than kana */
  const isRomaji = (s) => /[a-z]/i.test(String(s || ""));

  /* Every reading the typed rōmaji could reasonably mean.
   *
   * A real IME reads "hon o" as ほの — n before a vowel is the syllable "no",
   * and ん there has to be typed "nn" or "n'". That is genuine Japanese typing
   * and worth learning, but this exercise is grading grammar, not IME spelling,
   * so an n before a vowel is allowed to be either. The feedback still shows
   * the correct kana, which is where the spelling gets learned. */
  function variants(input) {
    const s = String(input || "").toLowerCase().replace(/\s+/g, "");
    // Candidate boundaries: a LONE n before a vowel or y. Doubled n is left
    // alone — it is already an unambiguous ん, and reinterpreting it would let
    // "sennen" (せんねん, a thousand years) pass for せんえん (a thousand yen).
    const spots = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== "n") continue;
      if (s[i - 1] === "n" || s[i + 1] === "n") continue;
      const nx = s[i + 1];
      if (nx && (isVowel(nx) || nx === "y")) spots.push(i);
    }
    // Each boundary is independent — in "nanyoubi" it is the SECOND n that is
    // ん, the first is just な — so try every combination rather than all at
    // once. Combinations stay tiny in practice; the cap is pure safety.
    const out = [toKana(s)];
    if (!spots.length) return out;
    const combos = spots.length <= 4
      ? Array.from({ length: (1 << spots.length) - 1 }, (_, n) => n + 1)
      : [(1 << spots.length) - 1, ...spots.map((_, i) => 1 << i)];
    for (const mask of combos) {
      let v = "", last = 0;
      spots.forEach((pos, i) => {
        if (!(mask & (1 << i))) return;
        v += s.slice(last, pos + 1) + "'";
        last = pos + 1;
      });
      v += s.slice(last);
      out.push(toKana(v));
    }
    return out;
  }

  /* Which vowel each kana ends on — used to spell out the long mark below. */
  const VOWEL_OF = {};
  for (const [r, k] of PAIRS) {
    const v = r[r.length - 1];
    if (isVowel(v)) VOWEL_OF[k[k.length - 1]] = { a: "あ", i: "い", u: "う", e: "え", o: "お" }[v];
  }

  /* Comparison form: katakana → hiragana, the long mark spelled out, the three
   * mismatched particles folded, and everything that isn't a kana dropped.
   *
   * ー is why コーヒー needs the spelling-out: an IME wants "ko-hi-", but a
   * learner types what he hears, "koohii". Turning ー into the vowel it holds
   * makes both land on こおひい. */
  function norm(s) {
    let k = Parse.fold(String(s || ""));
    let out = "";
    for (const ch of k) {
      if (ch === "ー" || ch === "－") out += VOWEL_OF[out[out.length - 1]] || "";
      else out += ch;
    }
    return out
      .replace(/[はへを]/g, (c) => ({ "は": "わ", "へ": "え", "を": "お" }[c]))
      .replace(/[^ぁ-ゖ]/g, "");
  }

  /* `a` is what was typed (rōmaji or kana), `b` the expected reading. */
  function same(a, b) {
    const want = norm(b);
    if (!want) return false;
    const tries = isRomaji(a) ? variants(a) : [a];
    return tries.some(t => norm(t) === want);
  }

  return { toKana, variants, isRomaji, norm, same };
})();
if (typeof module !== "undefined") module.exports = { Kana };
