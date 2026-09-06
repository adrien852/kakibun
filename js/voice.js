/* Kakibun — TTS + speech recognition + the pronunciation matcher. */
const Voice = (() => {
  let jaVoice = null, loaded = false;

  function pickVoice() {
    if (!window.speechSynthesis) return;
    const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith("ja"));
    jaVoice = vs.find(v => /Kyoko|Otoya|Google 日本語|O-Ren/i.test(v.name)) || vs[0] || null;
    loaded = true;
  }
  if (window.speechSynthesis) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text, rate, cb) {
    if (!window.speechSynthesis) { if (cb) cb(); return; }
    if (!loaded) pickVoice();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    if (jaVoice) u.voice = jaVoice;
    u.rate = rate || 0.85;
    if (cb) { u.onend = cb; u.onerror = cb; }
    speechSynthesis.speak(u);
  }
  const stop = () => { if (window.speechSynthesis) speechSynthesis.cancel(); };

  /* ---------- matcher ----------
   * Speech recognition and the corpus spell the same sound two ways: the
   * recogniser hears ええ and writes えー, コーヒー where a reading says こおひい.
   * Both sides go through Kana.norm's long-mark expansion first, so ー becomes
   * the vowel it lengthens — otherwise a perfectly said ええ aligns as one
   * character out of two and gets flagged as mispronounced.
   *
   * は/へ/を are folded to わ/え/お for the same reason: those are the sounds,
   * and the recogniser is transcribing sound. */
  const strip = (s) => Kana.speech(Parse.fold((s || "")
    .replace(/[。、．，,.!?！？\s「」『』]/g, "")
    .toLowerCase()));

  // one-slip tolerance: long vowels (ー/duplicated vowel) and small-kana slips
  function lenient(a, b) {
    if (a === b) return true;
    const noLong = (s) => s.replace(/ー/g, "").replace(/([あいうえお])\1+/g, "$1");
    if (noLong(a) === noLong(b)) return true;
    if (Math.abs(a.length - b.length) <= 1 && a.length >= 4) {
      // allow a single char insertion/deletion/substitution
      let i = 0, j = 0, diff = 0;
      while (i < a.length && j < b.length) {
        if (a[i] === b[j]) { i++; j++; continue; }
        diff++;
        if (diff > 1) return false;
        if (a.length > b.length) i++;
        else if (b.length > a.length) j++;
        else { i++; j++; }
      }
      return diff + (a.length - i) + (b.length - j) <= 1;
    }
    return false;
  }

  /* Grade a recognition result against the sentence.
   * The recognizer may return kanji, kana, or a mix — compare against both surfaces. */
  function match(heard, surfK, surfR) {
    const h = strip(heard), k = strip(surfK), r = strip(surfR);
    if (!h) return false;
    if (h === k || h === r) return true;
    if (lenient(h, k) || lenient(h, r)) return true;
    // trailing particle (ね/よ/か) forgiveness, one only
    const tails = ["ね", "よ", "か"];
    for (const t of tails) {
      if (k.endsWith(t) && (h === k.slice(0, -1) || lenient(h, k.slice(0, -1)))) return true;
      if (h.endsWith(t) && (h.slice(0, -1) === k || lenient(h.slice(0, -1), k))) return true;
    }
    return false;
  }

  /* ---------- word-level grading ----------
   * A whole sentence is a lot to get perfectly right, and an all-or-nothing
   * verdict tells you nothing about WHERE you slipped. So: align the heard
   * string against the expected one character by character (Needleman–Wunsch
   * with a traceback), then attribute each expected character to the token it
   * came from. A token counts as mispronounced when under half of its
   * characters survived the alignment.
   *
   * PASS_RATIO 0.7, or a single wrong word in a sentence of >= MIN_TOKENS_FOR_ONE_SLIP.
   */
  const PASS_RATIO = 0.7;
  const MIN_TOKENS_FOR_ONE_SLIP = 4;
  /* A word counts as mispronounced below this share of surviving characters.
   * 0.8 rather than 0.5 because Japanese words share so many tails — 行きます
   * and 来ます already agree on ます, and 学校 / 大学 on 学. */
  const TOKEN_OK_RATIO = 0.8;

  /* Expected characters, each tagged with its token index. */
  function charMap(parsed, useKanji) {
    const chars = [], owner = [];
    parsed.toks.forEach((t, i) => {
      if (t.type === "punct") return;
      const surf = strip(useKanji && t.surfK != null ? t.surfK : t.surfR);
      for (const c of surf) { chars.push(c); owner.push(i); }
    });
    return { chars, owner };
  }

  /* → { matched: [bool per expected char], score } */
  function align(heardChars, expChars) {
    const n = heardChars.length, m = expChars.length;
    if (!m) return { matched: [], score: 0 };
    const MATCH = 2, MIS = -1, GAP = -1;
    // (n+1) x (m+1) score matrix + traceback
    const S = new Int32Array((n + 1) * (m + 1));
    const T = new Uint8Array((n + 1) * (m + 1)); // 1 diag, 2 up (skip heard), 3 left (skip expected)
    const at = (i, j) => i * (m + 1) + j;
    for (let i = 1; i <= n; i++) { S[at(i, 0)] = i * GAP; T[at(i, 0)] = 2; }
    for (let j = 1; j <= m; j++) { S[at(0, j)] = j * GAP; T[at(0, j)] = 3; }
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const d = S[at(i - 1, j - 1)] + (heardChars[i - 1] === expChars[j - 1] ? MATCH : MIS);
        const u = S[at(i - 1, j)] + GAP;
        const l = S[at(i, j - 1)] + GAP;
        let best = d, tb = 1;
        if (u > best) { best = u; tb = 2; }
        if (l > best) { best = l; tb = 3; }
        S[at(i, j)] = best; T[at(i, j)] = tb;
      }
    }
    const matched = new Array(m).fill(false);
    let i = n, j = m;
    while (i > 0 || j > 0) {
      const tb = T[at(i, j)];
      if (tb === 1) {
        if (heardChars[i - 1] === expChars[j - 1]) matched[j - 1] = true;
        i--; j--;
      } else if (tb === 2) i--;
      else j--;
    }
    const hits = matched.reduce((a, b) => a + (b ? 1 : 0), 0);
    return { matched, score: hits / m };
  }

  /* grade(heard, parsed) → { ok, score, bad:[tokenIdx], exact } */
  function grade(heard, parsed) {
    const h = strip(heard);
    if (!h) return { ok: false, score: 0, bad: [], exact: false, empty: true };
    // A near-perfect reading passes outright, but we still align it so a single
    // slipped particle gets pointed out rather than silently waved through.
    const fast = match(heard, parsed.surfK, parsed.surfR);

    const hc = [...h];
    let best = null;
    for (const useKanji of [true, false]) {
      const { chars, owner } = charMap(parsed, useKanji);
      const a = align(hc, chars);
      if (!best || a.score > best.a.score) best = { a, owner, chars };
    }
    // per-token survival
    const tally = {};
    best.owner.forEach((tok, idx) => {
      const t = tally[tok] || (tally[tok] = { hit: 0, n: 0 });
      t.n++; if (best.a.matched[idx]) t.hit++;
    });
    const bad = Object.keys(tally)
      .filter(k => tally[k].hit / tally[k].n < TOKEN_OK_RATIO)
      .map(Number);
    const nTok = Object.keys(tally).length;
    const ok = fast || best.a.score >= PASS_RATIO ||
               (bad.length <= 1 && nTok >= MIN_TOKENS_FOR_ONE_SLIP && best.a.score >= 0.5);
    return { ok, score: best.a.score, bad, exact: fast && bad.length === 0, nTok };
  }

  /* ---------- recognition ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const available = () => !!SR;
  let rec = null;

  function listen(onResult, onEnd, onError) {
    if (!SR) { if (onError) onError("unavailable"); return null; }
    stop();
    rec = new SR();
    rec.lang = "ja-JP";
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    let got = false;
    rec.onresult = (e) => {
      got = true;
      const alts = [];
      const res = e.results[e.results.length - 1];
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
      onResult(alts);
    };
    rec.onend = () => { if (onEnd) onEnd(got); };
    rec.onerror = (e) => { if (onError) onError(e.error); };
    try { rec.start(); } catch (e) { if (onError) onError("start"); return null; }
    return rec;
  }
  function cancel() { if (rec) { try { rec.abort(); } catch (e) {} rec = null; } }

  return { speak, stop, match, grade, listen, cancel, available, strip, PASS_RATIO };
})();
