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

  /* ---------- matcher ---------- */
  const strip = (s) => Parse.fold((s || "")
    .replace(/[。、．，,.!?！？\s「」『』]/g, "")
    .toLowerCase());

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

  return { speak, stop, match, listen, cancel, available, strip };
})();
