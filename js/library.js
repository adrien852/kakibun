/* Kakibun — 帳面 le carnet.
 *
 * Five tabs over one row component. Everything here is browsing, never
 * scoring: tapping 🔊 speaks, tapping a row opens what it is, and nothing
 * touches the review schedule.
 *
 * Kanji is the one tab with an opinion: characters Kakikana has taught are at
 * full strength and the rest sit at 34 %, so the boundary of what you actually
 * know stays visible instead of being hidden.
 */
const Library = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const $ = (id) => document.getElementById(id);

  const TABS = ["grammaire", "phrases", "kanji", "dialogues", "mots"];
  let tab = "grammaire";
  let openGp = null, openDlg = null, openKanji = null;

  const dispOpts = () => {
    const s = Engine.state().settings;
    return { showAll: s.showAllKanji || !Bridge.hasInfo(), furi: s.furi };
  };
  const segHtml = (tok, d) => Bridge.display(tok, d).map(x => x.rt !== undefined
    ? `<ruby>${esc(x.t)}<rt>${esc(x.rt)}</rt></ruby>` : esc(x.t)).join("");
  /* Tokens stay tappable here exactly as they are in a session — the per-kanji
   * 音/訓 breakdown is half of what the library is for. */
  const jpHtml = (parsed) => {
    const d = dispOpts();
    return parsed.toks.map((t, i) => t.type === "punct"
      ? `<span class="tok">${esc(t.surfR)}</span>`
      : `<span class="tok tap${t.type === "p" ? " prt" : ""}" data-i="${i}">${segHtml(t, d)}</span>`
    ).join("") + `<span class="tok">。</span>`;
  };
  const speak = (text) => { Voice.speak(text); Sfx.voice(); };

  function render() {
    $("lib-tabs").innerHTML = TABS.map(id =>
      `<button class="lib-tab ${tab === id ? "on" : ""}" data-tab="${id}"
        >${esc(App.t("lib_tab_" + id))}</button>`).join("");
    $("lib-tabs").querySelectorAll(".lib-tab").forEach(el =>
      el.addEventListener("click", () => {
        tab = el.dataset.tab; openGp = openDlg = openKanji = null; Sfx.tap(); render();
      }));

    const lang = App.lang();
    const body = $("lib-body");
    if (openDlg !== null) body.innerHTML = dialogueDetail(openDlg, lang);
    else if (openKanji) body.innerHTML = kanjiDetail(openKanji, lang);
    else if (openGp) body.innerHTML = grammarDetail(openGp, lang);
    else if (tab === "grammaire") body.innerHTML = grammarList(lang);
    else if (tab === "phrases") body.innerHTML = sentenceList(lang);
    else if (tab === "kanji") body.innerHTML = kanjiGrid();
    else if (tab === "dialogues") body.innerHTML = dialogueList(lang);
    else body.innerHTML = wordList(lang);
    bind();
    $("library").scrollTop = 0;
  }

  /* ---------- one row component, five payloads ---------- */
  /* `mic` carries a sentence index: reading one aloud here is free practice and
   * must never move that grammar point's review schedule. */
  const row = (jp, fr, tag, attrs, say, mic) =>
    `<div class="lib-row" ${attrs || ""}>
      <span class="lib-main">
        <span class="lib-jp">${jp}</span>
        <span class="lib-fr">${esc(fr)}</span>
      </span>
      ${tag ? `<span class="lib-tag">${esc(tag)}</span>` : ""}
      ${say ? `<button class="say-btn" data-say="${esc(say)}">🔊</button>` : ""}
      ${mic != null ? `<button class="say-btn mic" data-read="${mic}">🎤</button>` : ""}
    </div>`;

  const arcOf = (gpId) => {
    const g = GRAMMAR.find(x => x.id === gpId);
    const a = g && ARCS.find(x => x.id === g.arc);
    return a ? a.jp : "";
  };

  function grammarList(lang) {
    const cur = Engine.currentIndex();
    const rows = GRAMMAR.slice(0, cur).reverse().map(g => {
      const p = Engine.point(g.id);
      const tag = p.tier === 2 ? "🎖" : p.tier === 1 ? "🏅" : App.t("state_current");
      return row(esc(g.pat), `${g.name[lang]} · ${arcOf(g.id)}`, tag, `data-gp="${g.id}"`);
    }).join("");
    return rows || empty(App.t("lib_no_sent"));
  }

  function grammarDetail(gpId, lang) {
    const g = GRAMMAR.find(x => x.id === gpId);
    const sents = Engine.sentencesFor(gpId);
    const rows = sents.map(s => {
      const p = Parse.sentence(s.dsl);
      return row(jpHtml(p), s[lang], "N°" + s.i,
                 `data-dsl="${esc(s.dsl)}" data-jgp="${esc(gpId)}"`, p.surfK + "。", s.i);
    }).join("");
    return `<button class="city-back" style="align-self:flex-start">← ${esc(App.t("lib_tab_grammaire"))}</button>
      <section class="card" style="margin-top:10px">
        <div class="eyebrow">${esc(arcOf(gpId))}</div>
        <div class="sess-pat">${esc(g.pat)}</div>
        <div class="sess-sub">${esc(g.name[lang])}</div>
        <div class="stamp-note" style="margin-top:10px">${esc(g.expl[lang])}</div>
      </section>${rows}`;
  }

  function sentenceList(lang) {
    const cur = Engine.currentIndex();
    const rows = SENTENCES.filter(s => GRAMMAR.findIndex(g => g.id === s.gp) < cur)
      .slice().reverse().map(s => {
        const p = Parse.sentence(s.dsl);
        return row(jpHtml(p), s[lang], "N°" + s.i,
                   `data-dsl="${esc(s.dsl)}" data-jgp="${esc(s.gp)}"`, p.surfK + "。", s.i);
      }).join("");
    return rows || empty(App.t("lib_no_sent"));
  }

  function kanjiGrid() {
    const showAll = Engine.state().settings.showAllKanji || !Bridge.hasInfo();
    const chars = Object.keys(KANJI_INFO);
    const cells = chars.map(ch => {
      const info = KANJI_INFO[ch];
      const known = showAll || Bridge.isLearned(ch);
      const read = (info.kun[0] && info.kun[0][0]) || (info.on[0] && info.on[0][0]) || "";
      return `<div class="kanji-cell ${known ? "" : "unknown"}" data-kanji="${esc(ch)}">
        <span class="ch">${esc(ch)}</span><span class="rd">${esc(read)}</span></div>`;
    }).join("");
    return `<div class="kanji-grid">${cells}</div>`;
  }

  /* The kanji lens: what the character means, how it is read here and there,
   * and — the part that makes it a lens rather than a dictionary — every
   * sentence in the journey where you actually meet it. */
  function kanjiDetail(ch, lang) {
    const info = KANJI_INFO[ch];
    if (!info) return empty(App.t("lib_no_sent"));
    const freq = (f) => f === 2 ? `<span class="lib-tag">★ ${esc(App.t("wp_main"))}</span>`
                     : f === 1 ? `<span class="lib-tag">${esc(App.t("wp_common"))}</span>`
                     : `<span class="lib-tag">${esc(App.t("wp_rare"))}</span>`;
    const list = (arr, label) => !arr.length ? "" : `<section class="card" style="margin-top:8px">
      <div class="eyebrow">${esc(label)}</div>
      ${arr.map(e => `<div class="kj-read-row">
        <div class="mis-top"><span class="lib-jp">${esc(e[0])}</span>${freq(e[1])}</div>
        ${e[2] ? `<div class="lib-fr">${esc(lang === "en" ? e[3] : e[2])}</div>` : ""}
      </div>`).join("")}</section>`;
    const sents = Engine.sentencesWith([ch], true);
    const rows = sents.map(s => {
      const p = Parse.sentence(s.dsl);
      return row(jpHtml(p), s[lang], "N°" + s.i,
                 `data-dsl="${esc(s.dsl)}" data-jgp="${esc(s.gp)}"`, p.surfK + "。", s.i);
    }).join("");
    return `<button class="city-back" style="align-self:flex-start">← ${esc(App.t("lib_tab_kanji"))}</button>
      <section class="card" style="margin-top:10px">
        <div class="city-name"><span class="jp" style="font-size:44px">${esc(ch)}</span>
          <span class="fr">${esc(info[lang])}</span></div>
      </section>
      ${list(info.on, "音 " + App.t("wp_on"))}${list(info.kun, "訓 " + App.t("wp_kun"))}
      <div class="eyebrow" style="margin:14px 0 4px">${esc(App.t("lib_kanji_sents")
        .replace("{n}", sents.length))}</div>
      ${rows || empty(App.t("lib_no_sent"))}`;
  }

  function dialogueList(lang) {
    const ds = Engine.dialoguesUpTo();
    if (!ds.length) return empty(App.t("lib_no_dlg"));
    return ds.slice().reverse().map(d => {
      const a = Parse.sentence(d.lines[0].dsl);
      const b = d.lines[1] ? Parse.sentence(d.lines[1].dsl) : null;
      const g = GRAMMAR.find(x => x.id === d.gp);
      return `<button class="dlg-card" data-dlg="${d.i}">
        <span class="dlg-top">
          <span class="dlg-where">${esc(d.where[lang])}</span>
          <span class="dlg-city">${esc(arcOf(d.gp))}</span>
        </span>
        <div class="dlg-a">${jpHtml(a)}</div>
        ${b ? `<div class="dlg-b">${jpHtml(b)}</div>` : ""}
        <div class="dlg-note">💡 ${esc(d.note[lang])}</div>
      </button>`;
    }).join("");
  }

  function dialogueDetail(i, lang) {
    const d = DIALOGUES[i];
    const lines = d.lines.map(l => {
      const p = Parse.sentence(l.dsl);
      return `<div class="tr-line ${l.sp === "B" ? "out" : ""}">
        <div class="tr-jp" data-dsl="${esc(l.dsl)}" data-jgp="${esc(d.gp)}">${jpHtml(p)}</div>
        <div class="tr-fr">${esc(l[lang])}</div></div>`;
    }).join("");
    const all = d.lines.map(l => Parse.sentence(l.dsl).surfK + "。").join(" ");
    return `<button class="city-back" style="align-self:flex-start">← ${esc(App.t("lib_tab_dialogues"))}</button>
      <section class="card" style="margin-top:10px">
        <div class="eyebrow">${esc(arcOf(d.gp))}</div>
        <div class="dlg-where" style="margin-top:6px">${esc(d.where[lang])}</div>
      </section>
      <div class="transcript" style="margin-top:10px">${lines}</div>
      <section class="card" style="margin-top:10px">
        <div class="dlg-note">💡 ${esc(d.note[lang])}</div>
      </section>
      <button class="btn-primary sm" data-say="${esc(all)}" style="margin-top:10px"
        >🔊 ${esc(App.t("dlg_play"))}</button>`;
  }

  /* the vocabulary tab: every word the journey has actually taught */
  function wordList(lang) {
    const cur = Engine.currentIndex();
    const first = {};                       // lexicon id → the arc that taught it
    for (const s of SENTENCES) {
      const gi = GRAMMAR.findIndex(g => g.id === s.gp);
      if (gi >= cur) continue;
      for (const tok of Parse.sentence(s.dsl).toks) {
        const id = tok.lex && tok.lex.id;
        if (id && first[id] === undefined) first[id] = s.gp;
      }
    }
    const ids = Object.keys(first);
    if (!ids.length) return empty(App.t("lib_no_sent"));
    return ids.map(id => {
      const w = LEXICON[id];
      const pos = App.t("pos_" + w.pos);
      const head = w.k ? `${esc(w.k)} <span style="opacity:.6">(${esc(w.r)})</span>` : esc(w.r);
      return row(head, `${w[lang]}${pos === "pos_" + w.pos ? "" : " · " + pos}`,
                 arcOf(first[id]), "", w.r);
    }).join("");
  }

  const empty = (msg) => `<section class="card"><div class="empty-note">${esc(msg)}</div></section>`;

  /* re-parse from the row's own dsl so a tap knows which token it hit */
  function bindTaps(root, parsed, gpId) {
    root.querySelectorAll(".tok.tap").forEach(el =>
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const t = parsed.toks[+el.dataset.i];
        if (t) WordPop.show(t, gpId);
      }));
  }

  function bind() {
    const body = $("lib-body");
    body.querySelectorAll("[data-dsl]").forEach(el =>
      bindTaps(el, Parse.sentence(el.dataset.dsl), el.dataset.jgp || null));
    body.querySelectorAll("[data-say]").forEach(el =>
      el.addEventListener("click", (e) => { e.stopPropagation(); speak(el.dataset.say); }));
    body.querySelectorAll("[data-read]").forEach(el =>
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        Session.readAloud(+el.dataset.read, SENTENCES[+el.dataset.read].gp);
      }));
    body.querySelectorAll("[data-gp]").forEach(el =>
      el.addEventListener("click", () => { openGp = el.dataset.gp; Sfx.tap(); render(); }));
    body.querySelectorAll("[data-dlg]").forEach(el =>
      el.addEventListener("click", () => { openDlg = +el.dataset.dlg; Sfx.tap(); render(); }));
    body.querySelectorAll("[data-kanji]").forEach(el =>
      el.addEventListener("click", () => { openKanji = el.dataset.kanji; Sfx.tap(); render(); }));
    const back = body.querySelector(".city-back");
    if (back) back.addEventListener("click", () => {
      openGp = openDlg = openKanji = null; Sfx.tap(); render();
    });
  }

  const toTop = () => { const s = $("library"); if (s) s.scrollTop = 0; };

  return { render, toTop };
})();
