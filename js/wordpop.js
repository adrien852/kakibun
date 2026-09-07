/* Kakibun — tap-a-word popup: reading, meaning, per-kanji breakdown with
 * reading type (ON/KUN) and how common that reading is for the kanji
 * relative to its other readings (the frequency layer). */
const WordPop = (() => {
  const el = () => document.getElementById("wordpop");
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  function freqTag(f) {
    const L = App.t.bind(App);
    if (f === 2) return `<span class="wp-tag main">★ ${L("wp_main")}</span>`;
    if (f === 1) return `<span class="wp-tag">${L("wp_common")}</span>`;
    return `<span class="wp-tag">${L("wp_rare")}</span>`;
  }

  function kanjiRows(lex, surfK, surfR) {
    const lang = App.lang();
    const bd = Parse.kanjiBreakdown(lex, surfK, surfR);
    let html = "";
    for (const part of bd.parts) {
      if (part.fused) {
        const chars = part.chars.join("");
        const metas = part.chars.map(ch => KANJI_INFO[ch] ? KANJI_INFO[ch][lang] : "").filter(Boolean).join(" + ");
        html += `<div class="wp-sec"><div class="wp-kanji"><span class="wp-ch">${esc(chars)}</span>
          <span class="wp-tag">${App.t("wp_fused")}</span></div>
          <div class="wp-note">${esc(metas)} · ${esc(chars)} → ${esc(part.reading)}</div></div>`;
        continue;
      }
      const ch = part.chars[0];
      const meta = KANJI_INFO[ch];
      if (!meta) continue;
      const rt = Parse.readingType(ch, part.reading);
      const typeTag = rt ? `<span class="wp-tag ${rt.type}">${rt.type === "on" ? "音 " + App.t("wp_on") : "訓 " + App.t("wp_kun")}</span>` : "";
      const fTag = rt ? freqTag(rt.f) : "";
      const note = rt && rt.note ? `<div class="wp-note">${esc(rt.note[lang])}</div>` : "";
      html += `<div class="wp-sec"><div class="wp-kanji"><span class="wp-ch">${esc(ch)}</span>
        <b>${esc(part.reading)}</b>${typeTag}${fTag}</div>
        <div class="wp-note">${esc(meta[lang])}</div>${note}</div>`;
    }
    return html;
  }

  function showWord(tok) {
    const lang = App.lang();
    const lex = tok.lex || {};
    const gloss = lex[lang] || "";
    const formLine = tok.form && App.t("form_" + tok.form) !== "form_" + tok.form
      ? `<div class="wp-note">${esc(lex.r)} → ${esc(tok.surfR)} · ${esc(App.t("form_" + tok.form))}</div>` : "";
    const noteLine = lex.note ? `<div class="wp-note">${esc(lex.note[lang])}</div>` : "";
    const kanjiHtml = tok.surfK ? kanjiRows(lex, tok.surfK, tok.surfR) : "";
    open(`
      <div class="wp-top"><span class="wp-k">${esc(tok.surfK != null ? tok.surfK : tok.surfR)}</span>
        <span class="wp-r">${esc(tok.surfR)}</span>
        <button class="wp-close" data-wp-close>✕</button></div>
      <div class="wp-fr">${esc(gloss)}</div>${formLine}${noteLine}${kanjiHtml}`);
    // Speak the KANA reading, never the kanji surface: given an isolated kanji
    // a TTS engine falls back to its ON reading (雨 → «u», 私 → «shi») instead
    // of the reading this word actually uses. Sentences still use the kanji
    // surface, where surrounding context disambiguates correctly.
    Voice.speak(tok.surfR, 0.9);
  }

  function showParticle(tok) {
    const lang = App.lang();
    const fn = PARTICLES[tok.fn];
    if (!fn) return;
    open(`
      <div class="wp-top"><span class="wp-k">${esc(tok.p)}</span>
        <span class="wp-r">${esc(App.t("wp_particle"))} · ${esc(fn.name[lang])}</span>
        <button class="wp-close" data-wp-close>✕</button></div>
      <div class="wp-prt">${esc(fn.expl[lang])}</div>`);
  }

  function showGlue(tok, gpId) {
    const lang = App.lang();
    const g = GRAMMAR.find(x => x.id === gpId);
    if (!g) return;
    open(`
      <div class="wp-top"><span class="wp-k">${esc(tok.surfR)}</span>
        <span class="wp-r">${esc(g.pat)}</span>
        <button class="wp-close" data-wp-close>✕</button></div>
      <div class="wp-prt">${esc(g.expl[lang])}</div>`);
  }

  function show(tok, gpId) {
    if (tok.type === "p") return showParticle(tok);
    if (tok.type === "glue") return showGlue(tok, gpId);
    if (tok.type === "w") return showWord(tok);
  }

  function open(html) {
    const e = el(); e.innerHTML = html; e.hidden = false;
    const x = e.querySelector("[data-wp-close]");
    if (x) x.addEventListener("click", hide);
  }
  function hide() { el().hidden = true; }

  document.addEventListener("click", (ev) => {
    const e = el();
    if (!e.hidden && !e.contains(ev.target)
        && !ev.target.closest(".tok.tap,[data-kanji]")) hide();
  });

  return { show, hide };
})();
