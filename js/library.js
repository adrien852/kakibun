/* Kakibun — library: grammar points, unlocked sentences, kanji panel. */
const Library = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  let tab = "grammar";

  const dispOpts = () => ({
    showAll: Engine.state().settings.showAllKanji || !Bridge.hasInfo(),
    furi: Engine.state().settings.furi
  });

  /* Every drill-down replaces the whole panel, so the viewport has to go back
   * to the top or you land mid-way down the new screen. */
  const toTop = () => window.scrollTo({ top: 0, behavior: "auto" });

  /* One sentence row: tap words for the popup, 🔊 to hear it, 🎤 to read it aloud.
   * The mic is FREE practice — it never touches SRS scheduling. */
  function sentRow(s, gpId) {
    const lang = App.lang();
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
    const btns = document.createElement("div");
    btns.className = "lr-btns";
    const play = document.createElement("button");
    play.className = "audio-sm";
    play.textContent = "\u{1F50A}";
    play.title = App.t("replay");
    play.addEventListener("click", () => Voice.speak(parsed.surfK + "\u3002", 0.85));
    const mic = document.createElement("button");
    mic.className = "audio-sm mic";
    mic.textContent = "\u{1F3A4}";
    mic.title = App.t("lib_speak");
    mic.addEventListener("click", () => Session.readAloud(s.i, gpId));
    btns.appendChild(play); btns.appendChild(mic);
    row.appendChild(main); row.appendChild(btns);
    return row;
  }

  function jp(parsed, gpId) {
    const div = document.createElement("div");
    div.className = "lib-sent jp";
    const last = parsed.toks.length - 1;
    div.innerHTML = parsed.toks.map((t, i) => {
      // the final 。 rides along inside the last word: on these narrow rows it
      // would otherwise wrap onto a line of its own
      const tail = i === last ? "。" : "";
      if (t.type === "punct") return `<span class="tok">${esc(t.surfR)}${tail}</span>`;
      const segs = Bridge.display(t, dispOpts());
      const inner = segs.map(s => s.rt !== undefined ? `<ruby>${esc(s.t)}<rt>${esc(s.rt)}</rt></ruby>` : esc(s.t)).join("");
      return `<span class="tok tap${t.type === "p" ? " prt" : ""}" data-i="${i}">${inner}${tail}</span>`;
    }).join("");
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
      <button class="lib-tab ${tab === "dlg" ? "on" : ""}" data-t="dlg">${esc(App.t("lib_dlg"))}</button>
      <button class="lib-tab ${tab === "kanji" ? "on" : ""}" data-t="kanji">${esc(App.t("lib_kanji"))}</button>
    </div><div id="lib-content"></div>`;
    body.innerHTML = html;
    body.querySelectorAll(".lib-tab").forEach(b => b.addEventListener("click", () => { tab = b.dataset.t; render(); }));
    toTop();
    const c = document.getElementById("lib-content");
    if (tab === "grammar") renderGrammar(c, lang);
    else if (tab === "sent") renderSentences(c, lang);
    else if (tab === "dlg") renderDialogues(c, lang);
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
    toTop();
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
    for (const s of Engine.sentencesFor(gpId)) sents.appendChild(sentRow(s, gpId));
    document.getElementById("lib-practice").addEventListener("click", () => Session.practice(gpId));
    document.getElementById("lib-back").addEventListener("click", render);
  }

  function renderSentences(c, lang) {
    const cur = Engine.currentIndex();
    const unlocked = SENTENCES.filter(s => GRAMMAR.findIndex(g => g.id === s.gp) < cur);
    if (!unlocked.length) { c.innerHTML = `<div class="lr-sub" style="padding:20px;text-align:center">${esc(App.t("lib_no_sent"))}</div>`; return; }
    c.innerHTML = `<div class="lr-sub" style="margin-bottom:10px">${esc(App.t("lib_sent_count").replace("{n}", unlocked.length))}</div>`;
    for (const s of unlocked.slice().reverse()) c.appendChild(sentRow(s, s.gp));
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
    toTop();
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
      for (const s of sents.slice(0, 40)) box.appendChild(sentRow(s, s.gp));
    }
    document.getElementById("kj-back").addEventListener("click", render);
  }

  /* ---------- dialogues ---------- */
  function renderDialogues(c, lang) {
    const list = Engine.dialoguesUpTo();
    if (!list.length) { c.innerHTML = `<div class="lr-sub" style="padding:20px;text-align:center">${esc(App.t("lib_no_dlg"))}</div>`; return; }
    c.innerHTML = `<div class="lr-sub" style="margin-bottom:10px">${
      esc(App.t("lib_dlg_count").replace("{n}", list.length))}</div>`;
    // grouped by city, because that is what the settings are organised around
    for (const arc of ARCS) {
      const here = list.filter(d => {
        const g = GRAMMAR.find(x => x.id === d.gp);
        return g && g.arc === arc.id;
      });
      if (!here.length) continue;
      const h = document.createElement("div");
      h.className = "arc-head";
      h.innerHTML = `<span class="arc-jp">${esc(arc.jp)}</span>
        <span class="arc-name">${esc(arc.city[lang])}</span>`;
      c.appendChild(h);
      for (const d of here) {
        const b = document.createElement("button");
        b.className = "lib-dlg-row";
        b.innerHTML = `<div class="ld-where">${esc(d.where[lang])}</div>
          <div class="ld-sub">${d.lines.length} ${esc(App.t("lib_dlg_lines"))}</div>`;
        b.addEventListener("click", () => openDialogue(d, lang));
        c.appendChild(b);
      }
    }
  }

  function openDialogue(d, lang) {
    const c = document.getElementById("lib-content");
    c.innerHTML = `<button class="btn small" id="dlg-back">‹ ${esc(App.t("back"))}</button>
      <div class="dlg-where" style="margin-top:14px">${esc(d.where[lang])}</div>
      <div class="dlg-lines" id="dlg-lines"></div>
      <div class="why"><div class="why-t">💡</div>${esc(d.note[lang])}</div>
      <button class="btn big" id="dlg-play">🔊 ${esc(App.t("dlg_play"))}</button>`;
    toTop();
    const box = document.getElementById("dlg-lines");
    d.lines.forEach((l) => {
      const parsed = Parse.sentence(l.dsl);
      const row = document.createElement("div");
      row.className = "dlg-line " + (l.sp === "A" ? "a" : "b");
      const who = document.createElement("div");
      who.className = "dlg-who"; who.textContent = l.sp;
      const bub = document.createElement("div");
      bub.className = "dlg-bubble";
      bub.appendChild(jp(parsed, d.gp));
      const tr = document.createElement("div");
      tr.className = "dlg-fr"; tr.textContent = l[lang];
      bub.appendChild(tr);
      row.appendChild(who); row.appendChild(bub);
      box.appendChild(row);
    });
    document.getElementById("dlg-back").addEventListener("click", () => render());
    document.getElementById("dlg-play").addEventListener("click", () => {
      // read the whole exchange through, one line at a time
      let n = 0;
      const step = () => {
        if (n >= d.lines.length) return;
        Voice.speak(Parse.sentence(d.lines[n++].dsl).surfK + "。");
        setTimeout(step, 2000);
      };
      step();
    });
  }

  return { render };
})();
