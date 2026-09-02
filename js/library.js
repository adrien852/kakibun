/* Kakibun — library: grammar points, unlocked sentences, kanji panel. */
const Library = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  let tab = "grammar";

  const dispOpts = () => ({
    showAll: Engine.state().settings.showAllKanji || !Bridge.hasInfo(),
    furi: Engine.state().settings.furi
  });

  function jp(parsed, gpId) {
    const div = document.createElement("div");
    div.className = "lib-sent jp";
    div.innerHTML = parsed.toks.map((t, i) => {
      if (t.type === "punct") return `<span class="tok">${esc(t.surfR)}</span>`;
      const segs = Bridge.display(t, dispOpts());
      const inner = segs.map(s => s.rt !== undefined ? `<ruby>${esc(s.t)}<rt>${esc(s.rt)}</rt></ruby>` : esc(s.t)).join("");
      return `<span class="tok tap${t.type === "p" ? " prt" : ""}" data-i="${i}">${inner}</span>`;
    }).join("") + `<span class="tok">。</span>`;
    div.querySelectorAll(".tok.tap").forEach(el =>
      el.addEventListener("click", () => WordPop.show(parsed.toks[+el.dataset.i], gpId)));
    return div;
  }

  function render() {
    const body = document.getElementById("lib-body");
    const lang = App.lang();
    let html = `<div class="lib-tabs">
      <button class="lib-tab ${tab === "grammar" ? "on" : ""}" data-t="grammar">${esc(App.t("lib_grammar"))}</button>
      <button class="lib-tab ${tab === "sent" ? "on" : ""}" data-t="sent">${esc(App.t("lib_sent"))}</button>
      <button class="lib-tab ${tab === "kanji" ? "on" : ""}" data-t="kanji">${esc(App.t("lib_kanji"))}</button>
    </div><div id="lib-content"></div>`;
    body.innerHTML = html;
    body.querySelectorAll(".lib-tab").forEach(b => b.addEventListener("click", () => { tab = b.dataset.t; render(); }));
    const c = document.getElementById("lib-content");
    if (tab === "grammar") renderGrammar(c, lang);
    else if (tab === "sent") renderSentences(c, lang);
    else renderKanji(c, lang);
  }

  function renderGrammar(c, lang) {
    const cur = Engine.currentIndex();
    let html = "";
    let gi = 0;
    for (const arc of ARCS) {
      const points = GRAMMAR.filter(g => g.arc === arc.id);
      html += `<div class="arc-head"><span class="arc-jp">${esc(arc.jp)}</span><span class="arc-name">${esc(arc.name[lang])}</span></div>`;
      for (const g of points) {
        const i = gi++;
        const locked = i > cur;
        const p = Engine.point(g.id);
        html += `<div class="lib-row" ${locked ? 'style="opacity:.45"' : `data-gp="${g.id}"`}>
          <div class="lr-main"><div class="lr-jp">${esc(g.pat)}</div>
          <div class="lr-sub">${esc(g.name[lang])}</div></div>
          <div>${p.mastered ? "🏅" : locked ? "🔒" : i === cur ? "📍" : ""}</div></div>`;
      }
    }
    c.innerHTML = html;
    c.querySelectorAll(".lib-row[data-gp]").forEach(el =>
      el.addEventListener("click", () => detail(el.dataset.gp)));
  }

  function detail(gpId) {
    const lang = App.lang();
    const g = GRAMMAR.find(x => x.id === gpId);
    const c = document.getElementById("lib-content");
    let html = `<div class="lesson"><div class="les-pat">${esc(g.pat)}</div>
      <div class="les-name">${esc(g.name[lang])}</div>
      <div class="les-expl">${esc(g.expl[lang])}</div></div>
      <button class="btn primary" id="lib-practice" style="width:100%;margin-bottom:14px">⛩ ${esc(App.t("hero_review"))}</button>
      <div id="lib-sents"></div>
      <button class="btn ghost" id="lib-back" style="width:100%;margin-top:8px">←</button>`;
    c.innerHTML = html;
    const sents = document.getElementById("lib-sents");
    for (const s of Engine.sentencesFor(gpId)) {
      const parsed = Parse.sentence(s.dsl);
      const row = document.createElement("div");
      row.className = "lib-row";
      const main = document.createElement("div");
      main.className = "lr-main";
      main.appendChild(jp(parsed, gpId));
      const tr = document.createElement("div");
      tr.className = "lr-sub";
      tr.textContent = s[lang];
      main.appendChild(tr);
      const play = document.createElement("button");
      play.className = "audio-sm";
      play.textContent = "🔊";
      play.addEventListener("click", () => Voice.speak(parsed.surfK + "。", 0.85));
      row.appendChild(main); row.appendChild(play);
      sents.appendChild(row);
    }
    document.getElementById("lib-practice").addEventListener("click", () => Session.practice(gpId));
    document.getElementById("lib-back").addEventListener("click", render);
  }

  function renderSentences(c, lang) {
    const cur = Engine.currentIndex();
    const unlocked = SENTENCES.filter(s => GRAMMAR.findIndex(g => g.id === s.gp) < cur);
    if (!unlocked.length) { c.innerHTML = `<div class="lr-sub" style="padding:20px;text-align:center">${esc(App.t("lib_no_sent"))}</div>`; return; }
    c.innerHTML = `<div class="lr-sub" style="margin-bottom:10px">${esc(App.t("lib_sent_count").replace("{n}", unlocked.length))}</div>`;
    for (const s of unlocked.slice().reverse()) {
      const parsed = Parse.sentence(s.dsl);
      const row = document.createElement("div");
      row.className = "lib-row";
      const main = document.createElement("div");
      main.className = "lr-main";
      main.appendChild(jp(parsed, s.gp));
      const tr = document.createElement("div");
      tr.className = "lr-sub";
      tr.textContent = s[lang];
      main.appendChild(tr);
      const play = document.createElement("button");
      play.className = "audio-sm";
      play.textContent = "🔊";
      play.addEventListener("click", () => Voice.speak(parsed.surfK + "。", 0.85));
      row.appendChild(main); row.appendChild(play);
      c.appendChild(row);
    }
  }

  function renderKanji(c, lang) {
    const chars = Object.keys(KANJI_INFO);
    const learned = chars.filter(ch => Bridge.isLearned(ch));
    let html = Bridge.hasInfo()
      ? `<div class="lr-sub" style="margin-bottom:10px">${esc(App.t("lib_kanji_learned").replace("{n}", learned.length))}</div>`
      : `<div class="lr-sub" style="margin-bottom:10px">${esc(App.t("set_kakikana_none"))}</div>`;
    html += `<div class="kj-grid">` + chars.map(ch => {
      const on = Bridge.isLearned(ch) || Engine.state().settings.showAllKanji || !Bridge.hasInfo();
      return `<div class="kj-cell ${on ? "" : "off"}" data-ch="${esc(ch)}">${esc(ch)}<span class="kj-r">${esc(KANJI_INFO[ch][lang].split(/[;,；]/)[0])}</span></div>`;
    }).join("") + `</div>`;
    c.innerHTML = html;
    c.querySelectorAll(".kj-cell").forEach(el =>
      el.addEventListener("click", () => kanjiDetail(el.dataset.ch)));
  }

  /* One kanji: readings ranked by how common they are, then every unlocked
   * sentence where you actually meet it. */
  function kanjiDetail(ch) {
    const lang = App.lang();
    const meta = KANJI_INFO[ch];
    const c = document.getElementById("lib-content");
    const rows = [["on", meta.on], ["kun", meta.kun]].map(([type, list]) =>
      list.map(e => {
        const fTag = e[1] === 2 ? `<span class="wp-tag freq1">★ ${esc(App.t("wp_main"))}</span>`
          : e[1] === 1 ? `<span class="wp-tag freqr">${esc(App.t("wp_common"))}</span>`
          : `<span class="wp-tag freqr">${esc(App.t("wp_rare"))}</span>`;
        const note = e[2] ? `<div class="wp-note">${esc(lang === "fr" ? e[2] : e[3])}</div>` : "";
        return `<div class="wp-krow"><div class="wp-kch"><span class="wp-tag ${type}">${type === "on" ? "音" : "訓"}</span></div>
          <div class="wp-kmain"><b>${esc(e[0])}</b>${fTag}${note}</div></div>`;
      }).join("")).join("");
    const sents = Engine.sentencesWith([ch], true);
    c.innerHTML = `<div class="kj-detail">
        <div class="kj-big">${esc(ch)}</div>
        <div class="kj-mean">${esc(meta[lang])}</div>
        <div class="wp-kanji" style="border:none">${rows}</div>
      </div>
      <div class="card-title" style="margin-top:6px">${esc(App.t("kj_in_sent"))} · ${esc(App.t("kj_sentences").replace("{n}", sents.length))}</div>
      <div id="kj-sents"></div>
      <button class="btn ghost" id="kj-back" style="width:100%;margin-top:8px">← ${esc(App.t("back"))}</button>`;
    const box = document.getElementById("kj-sents");
    if (!sents.length) {
      box.innerHTML = `<div class="lr-sub" style="padding:10px 2px">${esc(App.t("kj_none_yet"))}</div>`;
    } else {
      for (const s of sents.slice(0, 40)) {
        const parsed = Parse.sentence(s.dsl);
        const row = document.createElement("div");
        row.className = "lib-row";
        const main = document.createElement("div");
        main.className = "lr-main";
        main.appendChild(jp(parsed, s.gp));
        const tr = document.createElement("div");
        tr.className = "lr-sub";
        tr.textContent = s[lang];
        main.appendChild(tr);
        const play = document.createElement("button");
        play.className = "audio-sm";
        play.textContent = "🔊";
        play.addEventListener("click", () => Voice.speak(parsed.surfK + "。", 0.85));
        row.appendChild(main); row.appendChild(play);
        box.appendChild(row);
      }
    }
    document.getElementById("kj-back").addEventListener("click", render);
  }

  return { render };
})();
