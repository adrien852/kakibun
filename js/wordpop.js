/* Kakibun — tap-a-word popup: reading, meaning, per-kanji breakdown with
 * reading type (ON/KUN) and how common that reading is for the kanji
 * relative to its other readings (the frequency layer). */
const WordPop = (() => {
  const el = () => document.getElementById("wordpop");
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  function freqTag(f) {
    const L = App.t.bind(App);
    if (f === 2) return `<span class="wp-tag freq1">★ ${L("wp_main")}</span>`;
    if (f === 1) return `<span class="wp-tag freqr">${L("wp_common")}</span>`;
    return `<span class="wp-tag freqr">${L("wp_rare")}</span>`;
  }

  function kanjiRows(lex, surfK, surfR) {
    const lang = App.lang();
    const bd = Parse.kanjiBreakdown(lex, surfK, surfR);
    let html = "";
    for (const part of bd.parts) {
      if (part.fused) {
        const chars = part.chars.join("");
        const metas = part.chars.map(ch => KANJI_INFO[ch] ? KANJI_INFO[ch][lang] : "").filter(Boolean).join(" + ");
        html += `<div class="wp-krow"><div class="wp-kch">${esc(chars)}</div>
          <div class="wp-kmain">${esc(metas)}<span class="wp-tag freqr">${App.t("wp_fused")}</span>
          <div class="wp-note">${esc(chars)} → ${esc(part.reading)}</div></div></div>`;
        continue;
      }
      const ch = part.chars[0];
      const meta = KANJI_INFO[ch];
      if (!meta) continue;
      const rt = Parse.readingType(ch, part.reading);
      const typeTag = rt ? `<span class="wp-tag ${rt.type}">${rt.type === "on" ? "音 " + App.t("wp_on") : "訓 " + App.t("wp_kun")}</span>` : "";
      const fTag = rt ? freqTag(rt.f) : "";
      const note = rt && rt.note ? `<div class="wp-note">${esc(rt.note[lang])}</div>` : "";
      html += `<div class="wp-krow"><div class="wp-kch">${esc(ch)}</div>
        <div class="wp-kmain"><b>${esc(part.reading)}</b> — ${esc(meta[lang])}${typeTag}${fTag}${note}</div></div>`;
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
    const kanjiHtml = tok.surfK ? `<div class="wp-kanji">${kanjiRows(lex, tok.surfK, tok.surfR)}</div>` : "";
    open(`
      <button class="wp-close" onclick="WordPop.hide()">✕</button>
      <div class="wp-head"><span class="wp-word">${esc(tok.surfK != null ? tok.surfK : tok.surfR)}</span>
      <span class="wp-read">${esc(tok.surfR)}</span></div>
      <div class="wp-gloss">${esc(gloss)}</div>${formLine}${noteLine}${kanjiHtml}`);
    Voice.speak(tok.surfK != null ? tok.surfK : tok.surfR, 0.9);
  }

  function showParticle(tok) {
    const lang = App.lang();
    const fn = PARTICLES[tok.fn];
    if (!fn) return;
    open(`
      <button class="wp-close" onclick="WordPop.hide()">✕</button>
      <div class="wp-head"><span class="wp-word">${esc(tok.p)}</span>
      <span class="wp-read">${esc(App.t("wp_particle"))} · ${esc(fn.name[lang])}</span></div>
      <div class="wp-gloss">${esc(fn.expl[lang])}</div>`);
  }

  function showGlue(tok, gpId) {
    const lang = App.lang();
    const g = GRAMMAR.find(x => x.id === gpId);
    if (!g) return;
    open(`
      <button class="wp-close" onclick="WordPop.hide()">✕</button>
      <div class="wp-head"><span class="wp-word">${esc(tok.surfR)}</span>
      <span class="wp-read">${esc(g.pat)}</span></div>
      <div class="wp-gloss">${esc(g.expl[lang])}</div>`);
  }

  function show(tok, gpId) {
    if (tok.type === "p") return showParticle(tok);
    if (tok.type === "glue") return showGlue(tok, gpId);
    if (tok.type === "w") return showWord(tok);
  }

  function open(html) { const e = el(); e.innerHTML = html; e.hidden = false; }
  function hide() { el().hidden = true; }

  document.addEventListener("click", (ev) => {
    const e = el();
    if (!e.hidden && !e.contains(ev.target) && !ev.target.closest(".tok.tap")) hide();
  });

  return { show, hide };
})();
