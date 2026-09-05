/* Kakibun — session runner.
 * Modes: lesson · tiles_read · tiles · cloze · transform · speak · spot · reading
 *        kanjifill · listen · produce · vocab   (the last three answer without tiles)
 * Variants via opts: {exam:{arc}} no hints / no retries / scored
 *                    {drill:true} Renforcer   {debut:{chars}} new-kanji session
 */
const Session = (() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  let items = [], idx = 0, combo = 0, bestCombo = 0, score = 0, total = 0;
  let events = [], firstTry = true, curParsed = null, curItem = null, curCtx = null;
  let opts = {}, results = [], curBad = [];

  const isExam = () => !!opts.exam;

  /* ---------- shared rendering ---------- */
  function dispOpts(over) {
    const s = Engine.state().settings;
    return Object.assign({
      showAll: s.showAllKanji || !Bridge.hasInfo(),
      furi: s.furi
    }, over || {});
  }

  function segHtml(tok, d) {
    return Bridge.display(tok, d).map(s => s.rt !== undefined
      ? `<ruby>${esc(s.t)}<rt>${esc(s.rt)}</rt></ruby>` : esc(s.t)).join("");
  }

  /* o: {blank, swap:{i,surf}, target:{i,ch}, pick:"p", d} */
  function tokHtml(tok, i, o) {
    o = o || {};
    const d = o.d || dispOpts();
    if (tok.type === "punct") return `<span class="tok">${esc(tok.surfR)}</span>`;
    if (o.blank === i) return `<span class="tok blank" data-i="${i}">？</span>`;
    if (o.swap && o.swap.i === i)
      return `<span class="tok prt pick" data-i="${i}">${esc(o.swap.surf)}</span>`;
    if (o.pick === "p" && tok.type === "p")
      return `<span class="tok prt pick" data-i="${i}">${esc(tok.surfR)}</span>`;
    if (o.kfill && o.kfill.i === i && tok.surfK != null) {
      // the word stays visible so its shape is a clue — one character is gone
      const html = [...tok.surfK].map((c, k) => k === o.kfill.ci
        ? `<span class="kf-blank">＿</span>` : esc(c)).join("");
      return `<span class="tok" data-i="${i}">${html}</span>`;
    }
    let inner = segHtml(tok, d);
    if (o.target && o.target.i === i) {
      const ch = o.target.ch;
      // this one word shows bare kanji (no ruby — it would print the answer);
      // the rest of the sentence keeps its normal furigana help
      inner = segHtml(tok, Object.assign({}, d, { furi: "none", forceKanji: true }))
        .replace(esc(ch), `<span class="rk">${esc(ch)}</span>`);
      return `<span class="tok" data-i="${i}">${inner}</span>`;
    }
    const cls = "tok tap" + (tok.type === "p" ? " prt" : "")
      + (o.bad && o.bad.indexOf(i) >= 0 ? " bad" : "");
    return `<span class="${cls}" data-i="${i}">${inner}</span>`;
  }

  function jpHtml(parsed, o) {
    o = o || {};
    const body = parsed.toks.map((t, i) => tokHtml(t, i, o)).join("");
    return `<div class="jp">${body}<span class="tok">。</span></div>`;
  }

  function bindTaps(container, parsed, gpId) {
    container.querySelectorAll(".tok.tap").forEach(el => {
      el.addEventListener("click", () => {
        const t = parsed.toks[+el.dataset.i];
        if (t) WordPop.show(t, gpId);
      });
    });
  }

  const tts = (parsed, rate) => Voice.speak(parsed.surfK + "。", rate);
  const foot = (b) => { $("sess-foot").innerHTML = `<div class="sess-foot-in">${b}</div>`; };
  const setBar = () => { $("sess-bar-fill").style.width = (idx / items.length * 100) + "%"; };

  function kindLine(kind, extra) {
    const icons = { lesson:"⛩", tiles:"🎧", tiles_read:"🧩", cloze:"✏️", speak:"🎤",
                    transform:"🔁", spot:"🔍", reading:"🈯", debut:"✨",
                    listen:"👂", produce:"🗣", vocab:"📖", kanjifill:"🈳" };
    const label = extra || App.t("kind_" + kind);
    return `<div class="prompt-kind"><span class="pk-ico">${icons[kind] || ""}</span>${esc(label)}</div>`;
  }

  /* ---------- feedback ---------- */
  function feedback(ok, parsed, gpId, extraHtml) {
    combo = ok ? combo + 1 : 0;
    if (combo > bestCombo) bestCombo = combo;
    const cEl = $("combo");
    cEl.hidden = combo < 2;
    $("combo-n").textContent = combo;
    cEl.classList.toggle("hot", combo >= 4);
    if (ok) { Sfx.good(combo); score++; } else Sfx.bad();
    total++;
    results.push({ gp: gpId, ok, sent: curItem.sent, kind: curItem.kind });

    const lang = App.lang();
    const sent = curItem.sent != null ? SENTENCES[curItem.sent] : null;
    const gloss = sent ? sent[lang] : (curItem.word && LEXICON[curItem.word] ? LEXICON[curItem.word][lang] : "");
    const box = document.createElement("div");
    box.className = "fb " + (ok ? "good" : "bad");
    box.innerHTML = `<div class="fb-head">${ok ? esc(App.pickOk()) : esc(App.t("bad"))}</div>
      ${!ok ? `<div class="wp-note">${esc(App.t("answer_was"))}</div>` : ""}
      <div class="fb-jp"></div>
      ${gloss ? `<div class="translation">${esc(gloss)}</div>` : ""}
      ${!isExam() && sent && sent.note ? `<div class="why"><div class="why-t">💡</div>${esc(sent.note[lang])}</div>` : ""}
      ${curBad.length && ok ? `<div class="fb-expl">${esc(App.t("speak_watch"))} <b>${
          curBad.map(i => esc(parsed.toks[i].surfK != null ? parsed.toks[i].surfK : parsed.toks[i].surfR)).join(" · ")}</b></div>` : ""}
      ${isExam() ? "" : (extraHtml || "")}`;
    box.querySelector(".fb-jp").innerHTML = jpHtml(parsed, { bad: curBad });
    $("sess-body").appendChild(box);
    bindTaps(box, parsed, gpId);

    if (opts.free || curItem.free) {
      // library read-aloud, and the vocabulary quiz: these score inside the
      // session and feed the stats, but never move a grammar point's schedule
      Engine.recordStats(curCtx, ok);
    } else if (!isExam()) {
      const ev = Engine.record(gpId, ok, curCtx);
      Engine.noteSeen(curItem.sent);
      if (ev === "mastered") {
        events.push({ gp: gpId, kind: "mastered" });
        setTimeout(() => {
          Sfx.master();
          const g = GRAMMAR.find(x => x.id === gpId);
          App.toastMaster(g.pat, App.t("master_toast"));
        }, 500);
      }
    } else {
      Engine.recordStats(curCtx, ok);
      Engine.noteSeen(curItem.sent);
    }
    foot(`<button class="btn big primary" id="fb-next">${esc(App.t("cont"))}</button>`);
    $("fb-next").addEventListener("click", next);
    box.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  /* ---------- lesson ---------- */
  function showLesson(item) {
    const g = GRAMMAR.find(x => x.id === item.gp);
    const lang = App.lang();
    const exSent = Engine.sentencesFor(g.id).filter(s => s.lvl === 1)[0] || Engine.sentencesFor(g.id)[0];
    const parsed = Parse.sentence(exSent.dsl);
    curParsed = parsed;
    $("sess-body").innerHTML = `${kindLine("lesson")}
      <div class="lesson">
        <div class="les-pat">${esc(g.pat)}</div>
        <div class="les-name">${esc(g.name[lang])}</div>
        <div class="les-expl">${esc(g.expl[lang])}</div>
        <div class="les-ex">
          <div class="card-title">${esc(App.t("les_example"))}</div>
          <div class="audio-row"><button class="audio-sm" id="les-play">🔊</button></div>
          <div id="les-jp"></div>
          <div class="translation">${esc(exSent[lang])}</div>
        </div>
        <div class="les-tip">${esc(App.t("les_tip"))}</div>
      </div>`;
    $("les-jp").innerHTML = jpHtml(parsed);
    bindTaps($("sess-body"), parsed, g.id);
    $("les-play").addEventListener("click", () => tts(parsed));
    setTimeout(() => tts(parsed), 600);
    foot(`<button class="btn big primary" id="les-go">${esc(App.t("les_start"))}</button>`);
    $("les-go").addEventListener("click", next);
  }

  /* ---------- tiles ---------- */
  function showTiles(item, withText) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    curCtx = { mode: "tiles" };
    const lang = App.lang();
    const showTr = withText && !isExam();
    const target = parsed.toks.filter(t => t.type !== "punct");
    const p = Engine.point(item.gp);
    /* Decoys, for a reason worth stating: without them the bank IS the answer.
     * Every tile gets used exactly once, so the count alone tells you how long
     * the sentence is, and a lone particle in the bank is obviously the one
     * that goes in. Spare tiles — particles AND words — mean the bank has to be
     * read rather than exhausted. Kept off the very first encounters, where the
     * guided build is the teaching. */
    let distract = [];
    if (p.enc >= 2 || isExam()) {
      const usedP = new Set(target.filter(t => t.type === "p").map(t => t.surfR));
      const pool = ["は","が","を","に","で","へ","と","も","か","の"].filter(x => !usedP.has(x));
      distract = pool.sort(() => Math.random() - 0.5).slice(0, 2)
        .map(x => ({ type: "p", surfK: null, surfR: x }));
      // a plausible wrong WORD too, drawn from vocabulary he has actually met
      const usedW = new Set(target.filter(t => t.type === "w").map(t => t.surfR));
      const wordPool = Engine.vocabPool().filter(e => !usedW.has(e.r));
      if (wordPool.length) {
        const e = wordPool[Math.floor(Math.random() * wordPool.length)];
        distract.push({ type: "w", surfK: e.k || null, surfR: e.r, lex: e });
      }
    }
    const combined = target.concat(distract);      // data-n indexes THIS array
    const shuffled = combined.map((t, n) => ({ t, n })).sort(() => Math.random() - 0.5);
    const d = dispOpts();
    $("sess-body").innerHTML = `${kindLine(withText ? "tiles_read" : "tiles",
        item.debut ? App.t("kind_debut") : null)}
      <button class="audio-big" id="t-play">🔊</button>
      ${showTr ? `<div class="translation" style="text-align:center">${esc(sent[lang])}</div>` : ""}
      <div class="answer-row" id="t-answer"></div>
      <div class="tile-bank" id="t-bank">${shuffled.map(x =>
        `<button class="tile" data-n="${x.n}">${segHtml(x.t, d)}</button>`).join("")}</div>`;
    const seq = [], bank = $("t-bank"), ans = $("t-answer");
    const sync = () => { $("t-check").disabled = seq.length === 0; };
    bank.querySelectorAll(".tile").forEach(b => b.addEventListener("click", () => {
      if (b.classList.contains("used")) return;
      Sfx.tap();
      b.classList.add("used");
      const clone = document.createElement("button");
      clone.className = "tile in-answer";
      clone.innerHTML = b.innerHTML;
      clone.dataset.n = b.dataset.n;
      clone.addEventListener("click", () => {
        Sfx.tap();
        ans.removeChild(clone);
        bank.querySelector(`.tile[data-n="${clone.dataset.n}"]`).classList.remove("used");
        seq.splice(seq.indexOf(clone), 1);
        sync();
      });
      ans.appendChild(clone);
      seq.push(clone);
      sync();
    }));
    $("t-play").addEventListener("click", () => tts(parsed));
    setTimeout(() => tts(parsed), 500);
    foot(`<button class="btn ghost" id="t-replay">${esc(App.t("replay"))}</button>
          <button class="btn big primary" id="t-check" disabled>${esc(App.t("check"))}</button>`);
    $("t-replay").addEventListener("click", () => tts(parsed, 0.7));
    $("t-check").addEventListener("click", () => {
      const built = seq.map(c => combined[+c.dataset.n].surfR).join("");
      const want = target.map(t => t.surfR).join("");
      $("sess-foot").innerHTML = "";
      bank.querySelectorAll(".tile").forEach(b => b.classList.add("used"));
      feedback(built === want && firstTry, parsed, item.gp);
    });
  }

  /* ---------- particle cloze ---------- */
  function showCloze(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    const lang = App.lang();
    const prtIdx = parsed.toks.map((t, i) => t.type === "p" ? i : -1).filter(i => i >= 0);
    const g = GRAMMAR.find(x => x.id === item.gp);
    const pref = prtIdx.filter(i => g.pat.includes(parsed.toks[i].surfR));
    const src = pref.length ? pref : prtIdx;
    const blank = src[Math.floor(Math.random() * src.length)];
    const tok = parsed.toks[blank];
    const correct = tok.surfR;
    curCtx = { mode: "cloze", prt: tok.fn };
    const pool = ["は","が","を","に","で","へ","と","も","か","の","や","から","まで","より","だけ"]
      .filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, 5);
    const choices = pool.concat([correct]).sort(() => Math.random() - 0.5);
    $("sess-body").innerHTML = `${kindLine("cloze")}
      <div id="c-jp"></div>
      ${isExam() ? "" : `<div class="translation">${esc(sent[lang])}</div>`}
      <div class="choices prt-choices" id="c-choices">${choices.map(c =>
        `<button class="choice" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>`;
    $("c-jp").innerHTML = jpHtml(parsed, { blank });
    bindTaps($("sess-body"), parsed, item.gp);
    foot("");
    let done = false;
    $("c-choices").querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
      if (done) return;
      const ok = b.dataset.c === correct;
      if (!ok && !isExam()) { b.classList.add("ko"); firstTry = false; Sfx.bad(); return; }
      done = true;
      b.classList.add(ok ? "ok" : "ko");
      $("c-choices").querySelectorAll(".choice").forEach(x => {
        if (x !== b) x.classList.add(x.dataset.c === correct ? "ok" : "dim");
      });
      const fn = PARTICLES[tok.fn];
      const why = fn ? `<div class="why"><div class="why-t">${esc(App.t("why").replace("{p}", correct))} — ${esc(fn.name[lang])}</div>${esc(fn.expl[lang])}</div>` : "";
      tts(parsed);
      feedback(ok && firstTry, parsed, item.gp, why);
    }));
  }

  /* ---------- spot the wrong particle ---------- */
  function showSpot(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    const lang = App.lang();
    const cands = Engine.spotCandidates(sent);
    if (!cands.length) return showCloze(item);   // needs 2+ particles to be fair
    const c = cands[Math.floor(Math.random() * cands.length)];
    const good = c.surf;
    const bad = c.alts[Math.floor(Math.random() * c.alts.length)];
    curCtx = { mode: "spot", prt: c.fn };
    $("sess-body").innerHTML = `${kindLine("spot")}
      <div id="sp-jp"></div>
      <div class="mic-hint spot-hint">${esc(App.t("spot_hint"))}</div>`;
    $("sp-jp").innerHTML = jpHtml(parsed, { swap: { i: c.i, surf: bad }, pick: "p" });
    foot("");
    let done = false;
    $("sp-jp").querySelectorAll(".tok.pick").forEach(el => el.addEventListener("click", () => {
      if (done) return;
      const ok = +el.dataset.i === c.i;
      if (!ok && !isExam()) { el.classList.add("ko"); firstTry = false; Sfx.bad(); return; }
      done = true;
      $("sp-jp").querySelector(`.tok.pick[data-i="${c.i}"]`).classList.add("ok");
      if (!ok) el.classList.add("ko");
      const fn = PARTICLES[c.fn];
      const why = `<div class="why"><div class="why-t">${esc(App.t("spot_why").replace("{good}", good).replace("{bad}", bad))}</div>${fn ? esc(fn.expl[lang]) : ""}</div>`;
      tts(parsed);
      feedback(ok && firstTry, parsed, item.gp, why);
    }));
  }

  /* ---------- which reading? ---------- */
  function showReading(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    const lang = App.lang();
    const d = dispOpts();
    let cands = Engine.readingCandidates(sent, d.showAll);
    if (item.focus) {
      const f = cands.filter(c => item.focus.includes(c.ch));
      if (f.length) cands = f;
    }
    if (!cands.length) return showTiles(item, true);
    const c = cands[Math.floor(Math.random() * cands.length)];
    const info = KANJI_INFO[c.ch];
    curCtx = { mode: "reading" };
    const correct = c.reading;
    const own = info.on.concat(info.kun).map(e => e[0]).filter(r => r !== correct);
    let pool = [...new Set(own)];
    if (pool.length < 3) {
      const others = Object.keys(KANJI_INFO)
        .filter(k => k !== c.ch).sort(() => Math.random() - 0.5).slice(0, 6)
        .flatMap(k => KANJI_INFO[k].on.concat(KANJI_INFO[k].kun).map(e => e[0]));
      pool = [...new Set(pool.concat(others))].filter(r => r !== correct);
    }
    const choices = pool.sort(() => Math.random() - 0.5).slice(0, 3).concat([correct])
      .sort(() => Math.random() - 0.5);
    $("sess-body").innerHTML = `${kindLine("reading")}
      <div id="rd-jp"></div>
      ${isExam() ? "" : `<div class="translation">${esc(sent[lang])}</div>`}
      <div class="rd-target">${esc(c.ch)}</div>
      <div class="mic-hint">${esc(App.t("reading_q"))}</div>
      <div class="choices" id="rd-choices">${choices.map(r =>
        `<button class="choice" data-r="${esc(r)}">${esc(r)}</button>`).join("")}</div>`;
    $("rd-jp").innerHTML = jpHtml(parsed, { target: { i: c.tokIdx, ch: c.ch }, d });
    foot("");
    let done = false;
    $("rd-choices").querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
      if (done) return;
      const ok = b.dataset.r === correct;
      if (!ok && !isExam()) { b.classList.add("ko"); firstTry = false; Sfx.bad(); return; }
      done = true;
      b.classList.add(ok ? "ok" : "ko");
      $("rd-choices").querySelectorAll(".choice").forEach(x => {
        if (x !== b) x.classList.add(x.dataset.r === correct ? "ok" : "dim");
      });
      const tag = c.rt.type === "on" ? "音 " + App.t("wp_on") : "訓 " + App.t("wp_kun");
      const fq = c.rt.f === 2 ? App.t("wp_main") : c.rt.f === 1 ? App.t("wp_common") : App.t("wp_rare");
      const note = c.rt.note ? `<br>${esc(c.rt.note[lang])}` : "";
      const why = `<div class="why"><div class="why-t">${esc(c.ch)} → ${esc(correct)} · ${esc(tag)} · ${esc(fq)}</div>
        ${esc(info[lang])}${note}<br><span class="wp-note">${esc(App.t("reading_why").replace("{k}", c.ch))}</span></div>`;
      tts(parsed);
      feedback(ok && firstTry, parsed, item.gp, why);
    }));
  }

  /* ---------- fill in the missing kanji ---------- */
  function showKanjiFill(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    const lang = App.lang();
    const d = dispOpts();
    let cands = Engine.kanjiFillCandidates(sent, d.showAll);
    if (item.focus) {
      const f = cands.filter(c => item.focus.indexOf(c.ch) >= 0);
      if (f.length) cands = f;
    }
    const pool = Engine.learnedKanjiPool(d.showAll);
    if (!cands.length || pool.length < 4) return showTiles(item, true);
    const c = cands[Math.floor(Math.random() * cands.length)];
    const info = KANJI_INFO[c.ch];
    curCtx = { mode: "kanjifill" };
    const choices = Engine.kanjiDistractors(c.ch, pool, 3).concat([c.ch])
      .sort(() => Math.random() - 0.5);
    $("sess-body").innerHTML = `${kindLine("kanjifill")}
      <div id="kf-jp"></div>
      ${isExam() ? "" : `<div class="translation">${esc(sent[lang])}</div>`}
      <div class="kf-read">${esc(c.reading)}</div>
      <div class="mic-hint">${esc(App.t("kanjifill_q"))}</div>
      <div class="choices" id="kf-choices">${choices.map(k =>
        `<button class="choice kf-choice" data-k="${esc(k)}">${esc(k)}</button>`).join("")}</div>`;
    $("kf-jp").innerHTML = jpHtml(parsed, { kfill: { i: c.tokIdx, ci: c.ci }, d });
    foot("");
    let done = false;
    $("kf-choices").querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
      if (done) return;
      const ok = b.dataset.k === c.ch;
      if (!ok && !isExam()) { b.classList.add("ko"); firstTry = false; Sfx.bad(); return; }
      done = true;
      b.classList.add(ok ? "ok" : "ko");
      $("kf-choices").querySelectorAll(".choice").forEach(x => {
        if (x !== b) x.classList.add(x.dataset.k === c.ch ? "ok" : "dim");
      });
      const rt = Parse.readingType(c.ch, c.reading);
      const tag = rt ? (rt.type === "on" ? "音 " + App.t("wp_on") : "訓 " + App.t("wp_kun")) : "";
      const note = rt && rt.note ? `<br>${esc(rt.note[lang])}` : "";
      const why = `<div class="why"><div class="why-t">${esc(c.ch)} — ${esc(info[lang])} ${esc(tag)}</div>
        ${esc(App.t("kanjifill_why").replace("{w}", parsed.toks[c.tokIdx].surfK)
          .replace("{r}", c.reading))}${note}</div>`;
      tts(parsed);
      feedback(ok && firstTry, parsed, item.gp, why);
    }));
  }

  /* ---------- transform ---------- */
  /* Name the target form WITHOUT printing it. The word-popup labels spell the
   * form out ("passée (でした)") because there they EXPLAIN it — as a quiz
   * prompt that is the answer, so strip the parenthetical and, if the result
   * still contains the answer, fall back to the grammar point's own name. */
  function formPrompt(to, g, answerR) {
    const lang = App.lang();
    const key = "form_" + to;
    let label = App.t(key);
    if (label === key) label = g.name[lang];
    label = label.replace(/[（(][^）)]*[）)]/g, "").replace(/\s+/g, " ").trim();
    if (!label || (answerR && label.indexOf(answerR) >= 0)) {
      label = g.name[lang];
      if (answerR && label.indexOf(answerR) >= 0) label = g.pat;
      if (answerR && label.indexOf(answerR) >= 0) label = App.t("kind_transform");
    }
    return label;
  }

  function showTransform(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    const lang = App.lang();
    const g = GRAMMAR.find(x => x.id === item.gp);
    const tok = parsed.toks.find(t => t.type === "w" && t.form &&
      ["v1","v5","vk","vs","vs0","adji","cop"].includes(t.lex.pos));
    if (!tok) return showTiles(item, false);
    const to = tok.form;
    let from = g.tf && g.tf.to === to ? g.tf.from
      : tok.lex.pos === "adji" ? "base" : tok.lex.pos === "cop" ? "desu" : "masu";
    if (from === to) from = tok.lex.pos === "adji" ? "base" : "dict";
    let base, answer;
    try { base = Conj.conj(tok.lex, from); answer = Conj.conj(tok.lex, to); }
    catch (e) { return showTiles(item, false); }
    curCtx = { mode: "transform", form: to };
    const formsPool = tok.lex.pos === "adji" ? Conj.ADJ_FORMS
      : tok.lex.pos === "cop" ? Conj.COP_FORMS : Conj.VERB_FORMS;
    const seen = new Set([answer.r]);
    const distract = [];
    for (const f of formsPool.slice().sort(() => Math.random() - 0.5)) {
      if (distract.length >= 3) break;
      try {
        const cc = Conj.conj(tok.lex, f);
        if (!seen.has(cc.r)) { seen.add(cc.r); distract.push(cc); }
      } catch (e) {}
    }
    const d = dispOpts();
    // The copula on its own ("です → ?") is a floating suffix; show the noun it
    // attaches to in the sentence so the drill reads as real Japanese.
    let ctxTok = null;
    if (tok.lex.pos === "cop") {
      const ti = parsed.toks.indexOf(tok);
      const prev = ti > 0 ? parsed.toks[ti - 1] : null;
      if (prev && prev.type === "w") ctxTok = prev;
    }
    const show = (cc) => {
      const main = segHtml({ type: "w", lex: tok.lex, form: null, surfK: cc.k, surfR: cc.r }, d);
      return ctxTok ? segHtml(ctxTok, d) + main : main;
    };
    const choices = distract.concat([answer]).sort(() => Math.random() - 0.5);
    const fLabel = formPrompt(to, g, answer.r);
    $("sess-body").innerHTML = `${kindLine("transform")}
      <div class="lesson"><div class="les-pat">${show(base)} →&nbsp;?</div>
      <div class="les-name">${esc(fLabel)}</div></div>
      <div class="choices" id="tr-choices">${choices.map((cc, i) =>
        `<button class="choice" data-i="${i}">${show(cc)}</button>`).join("")}</div>`;
    foot("");
    let done = false;
    $("tr-choices").querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
      if (done) return;
      const ok = choices[+b.dataset.i].r === answer.r;
      if (!ok && !isExam()) { b.classList.add("ko"); firstTry = false; Sfx.bad(); return; }
      done = true;
      b.classList.add(ok ? "ok" : "ko");
      $("tr-choices").querySelectorAll(".choice").forEach(x => {
        if (x !== b && choices[+x.dataset.i].r === answer.r) x.classList.add("ok");
        else if (x !== b) x.classList.add("dim");
      });
      const why = `<div class="why"><div class="why-t">${esc(g.pat)}</div>${esc(g.expl[lang])}</div>`;
      tts(parsed);
      feedback(ok && firstTry, parsed, item.gp, why);
    }));
  }

  /* ---------- read aloud ---------- */
  function showSpeak(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    curCtx = { mode: "speak" };
    const lang = App.lang();
    let tries = 0;
    $("sess-body").innerHTML = `${kindLine("speak")}
      <div id="s-jp"></div>
      <div class="translation">${esc(sent[lang])}</div>
      <button class="mic-btn" id="s-mic">🎤</button>
      <div class="mic-hint" id="s-hint">${esc(App.t("speak_tap"))}</div>
      <div class="heard" id="s-heard"></div>`;
    $("s-jp").innerHTML = jpHtml(parsed);
    bindTaps($("sess-body"), parsed, item.gp);
    foot(`<button class="btn ghost" id="s-replay">🔊 ${esc(App.t("replay"))}</button>
          <button class="btn ghost" id="s-skip">${esc(App.t("skip"))}</button>`);
    $("s-replay").addEventListener("click", () => tts(parsed, 0.8));
    $("s-skip").addEventListener("click", () => { Voice.cancel(); feedback(false, parsed, item.gp); });
    const mic = $("s-mic"), hint = $("s-hint"), heard = $("s-heard");
    let listening = false, finished = false;
    mic.addEventListener("click", () => {
      if (listening || finished) return;
      Voice.stop();
      listening = true;
      mic.classList.add("rec");
      hint.textContent = App.t("speak_listening");
      Voice.listen(
        (alts) => {
          // score every alternative the recogniser offers, keep the kindest
          let best = null;
          for (const a of alts) {
            const g = Voice.grade(a, parsed);
            if (!best || (g.ok && !best.g.ok) || (g.ok === best.g.ok && g.score > best.g.score))
              best = { g, text: a };
          }
          heard.textContent = App.t("speak_heard") + " " + (best ? best.text : "");
          listening = false; mic.classList.remove("rec");
          if (!best) return;
          curBad = best.g.bad;
          // show WHERE it slipped, whether or not the attempt passed
          $("s-jp").innerHTML = jpHtml(parsed, { bad: curBad });
          bindTaps($("s-jp"), parsed, item.gp);
          if (best.g.ok) { finished = true; feedback(firstTry, parsed, item.gp); }
          else {
            tries++; firstTry = false; Sfx.bad();
            hint.textContent = App.t("speak_close") + " (" + Math.round(best.g.score * 100) + " %)";
            if (tries >= 2 || isExam()) {
              finished = true;
              setTimeout(() => feedback(false, parsed, item.gp), 900);
            }
          }
        },
        (got) => {
          listening = false; mic.classList.remove("rec");
          if (!got && !finished) hint.textContent = App.t("speak_nothing") + " " + App.t("speak_tap");
        },
        () => {
          listening = false; mic.classList.remove("rec");
          hint.textContent = App.t("speak_no_sr");
        }
      );
    });
  }

  /* ================= no-tile modes (v1.8) =================
   * Tiles and four buttons leak: the options ARE the answer, so a sentence can
   * be rebuilt from tile-count and shape without reading the prompt. These
   * three make the answer something you produce — spoken or typed — or, for
   * listening, something only the audio can tell you.
   */

  /* Shared answer bar: a rōmaji field with a live kana preview, and a mic when
   * one is available. Either channel can answer; whichever he uses first wins. */
  function answerPanel(target, parsed, onGraded, o) {
    o = o || {};
    const canSpeak = Voice.available() && Engine.state().settings.voiceIn;
    return {
      html: `<div class="ans-wrap">
        <div class="ans-bar">
          <input class="ans-inp" id="a-inp" type="text" inputmode="latin"
                 autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                 placeholder="${esc(App.t("ans_placeholder"))}">
          ${canSpeak ? `<button class="mic-btn small" id="a-mic">🎤</button>` : ""}
        </div>
        <div class="ans-kana" id="a-kana"></div>
        <div class="mic-hint" id="a-hint">${esc(canSpeak ? App.t("ans_hint_both") : App.t("ans_hint_type"))}</div>
        <div class="heard" id="a-heard"></div>
      </div>`,
      bind() {
        const inp = $("a-inp"), kana = $("a-kana"), hint = $("a-hint"), heard = $("a-heard");
        let done = false;
        // seeing "watashi wa" become わたしは as you type is half the lesson
        const preview = () => {
          const v = inp.value.trim();
          kana.textContent = v ? Kana.toKana(v) : "";
          const btn = $("a-check");
          if (btn) btn.disabled = !v;
        };
        inp.addEventListener("input", preview);
        inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submitTyped(); } });
        setTimeout(() => { if (!o.noFocus) inp.focus(); }, 250);

        function submitTyped() {
          if (done) return;
          const v = inp.value.trim();
          if (!v) return;
          done = true;
          const ok = Kana.same(v, target.r);
          onGraded({ ok, how: "typed", text: Kana.toKana(v) });
        }
        function markUndone() { done = false; }

        if (canSpeak) {
          let listening = false;
          $("a-mic").addEventListener("click", () => {
            if (listening || done) return;
            Voice.stop();
            listening = true;
            $("a-mic").classList.add("rec");
            hint.textContent = App.t("speak_listening");
            Voice.listen(
              (alts) => {
                listening = false; $("a-mic").classList.remove("rec");
                let best = null;
                for (const a of alts) {
                  // a single word has no sentence to align against, so grade the
                  // reading directly; a full sentence gets the token-level matcher
                  const g = parsed
                    ? Voice.grade(a, parsed)
                    : { ok: Voice.match(a, target.k, target.r), score: 1, bad: [] };
                  if (!best || (g.ok && !best.g.ok) || (g.ok === best.g.ok && g.score > best.g.score))
                    best = { g, text: a };
                }
                if (!best) return;
                heard.textContent = App.t("speak_heard") + " " + best.text;
                if (done) return;
                done = true;
                curBad = best.g.bad || [];
                onGraded({ ok: best.g.ok, how: "spoken", text: best.text, grade: best.g });
              },
              (got) => {
                listening = false; $("a-mic").classList.remove("rec");
                if (!got && !done) hint.textContent = App.t("speak_nothing");
              },
              () => {
                listening = false; $("a-mic").classList.remove("rec");
                hint.textContent = App.t("speak_no_sr");
              }
            );
          });
        }
        return { submitTyped, markUndone, value: () => inp.value.trim() };
      }
    };
  }

  /* ---------- listen: no text on screen at all ---------- */
  function showListen(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    curCtx = { mode: "listen" };
    const lang = App.lang();
    const others = Engine.listenChoices(sent, 4);
    const options = [sent, ...others].sort(() => Math.random() - 0.5);
    $("sess-body").innerHTML = `${kindLine("listen")}
      <div class="listen-hint">${esc(App.t("listen_q"))}</div>
      <button class="audio-big" id="l-play">🔊</button>
      <div class="opt-list" id="l-opts">${options.map((s, n) =>
        `<button class="opt" data-n="${n}">${esc(s[lang])}</button>`).join("")}</div>`;
    const play = (rate) => tts(parsed, rate);
    $("l-play").addEventListener("click", () => play());
    setTimeout(() => play(), 450);
    foot(`<button class="btn ghost" id="l-slow">🐢 ${esc(App.t("replay"))}</button>`);
    $("l-slow").addEventListener("click", () => play(0.6));
    $("l-opts").querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
      if ($("l-opts").classList.contains("locked")) return;
      $("l-opts").classList.add("locked");
      const chosen = options[+b.dataset.n];
      const ok = chosen.i === sent.i;
      b.classList.add(ok ? "right" : "wrong");
      if (!ok) $("l-opts").querySelectorAll(".opt").forEach((x, n) => {
        if (options[n].i === sent.i) x.classList.add("right");
      });
      setTimeout(() => feedback(ok && firstTry, parsed, item.gp), ok ? 350 : 800);
    }));
  }

  /* ---------- produce: French in, Japanese out ---------- */
  function showProduce(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    curCtx = { mode: "produce" };
    const lang = App.lang();
    const panel = answerPanel({ k: parsed.surfK, r: parsed.surfR }, parsed, graded);
    $("sess-body").innerHTML = `${kindLine("produce")}
      <div class="prod-fr">${esc(sent[lang])}</div>
      ${panel.html}`;
    const api = panel.bind();
    foot(`<button class="btn ghost" id="p-skip">${esc(App.t("skip"))}</button>
          <button class="btn big primary" id="a-check" disabled>${esc(App.t("check"))}</button>`);
    $("a-check").addEventListener("click", api.submitTyped);
    $("p-skip").addEventListener("click", () => { Voice.cancel(); feedback(false, parsed, item.gp); });
    function graded(r) {
      Voice.cancel();
      $("sess-foot").innerHTML = "";
      if (!r.ok) firstTry = false;
      feedback(r.ok && firstTry, parsed, item.gp,
        r.how === "typed" ? `<div class="fb-expl">${esc(App.t("ans_you_typed"))} ${esc(r.text)}</div>` : "");
    }
  }

  /* ---------- vocabulary: a French word, said or typed in Japanese ---------- */
  function showVocab(item) {
    const w = LEXICON[item.word];
    if (!w) return next();
    const lang = App.lang();
    // one-token stand-in so the feedback screen can render and speak the word
    const tok = { type: "w", surfK: w.k || null, surfR: w.r, lex: w };
    const parsed = { toks: [tok], surfK: w.k || w.r, surfR: w.r };
    curParsed = parsed;
    curCtx = { mode: "vocab" };
    Engine.noteVocab(w.id);
    const panel = answerPanel({ k: w.k || w.r, r: w.r }, null, graded);
    $("sess-body").innerHTML = `${kindLine("vocab")}
      <div class="vocab-card">
        <div class="vocab-fr">${esc(w[lang])}</div>
        <div class="vocab-pos">${esc(App.t("pos_" + w.pos) !== "pos_" + w.pos ? App.t("pos_" + w.pos) : "")}</div>
      </div>
      ${panel.html}`;
    const api = panel.bind();
    foot(`<button class="btn ghost" id="v-skip">${esc(App.t("skip"))}</button>
          <button class="btn big primary" id="a-check" disabled>${esc(App.t("check"))}</button>`);
    $("a-check").addEventListener("click", api.submitTyped);
    $("v-skip").addEventListener("click", () => { Voice.cancel(); feedback(false, parsed, item.gp); });
    function graded(r) {
      Voice.cancel();
      $("sess-foot").innerHTML = "";
      if (!r.ok) firstTry = false;
      feedback(r.ok && firstTry, parsed, item.gp,
        r.how === "typed" ? `<div class="fb-expl">${esc(App.t("ans_you_typed"))} ${esc(r.text)}</div>` : "");
    }
  }

  /* ---------- flow ---------- */
  function render() {
    WordPop.hide();
    firstTry = true; curCtx = null; curBad = [];
    setBar();
    const it = items[idx];
    curItem = it;
    if (!it) return finish();
    switch (it.kind) {
      case "lesson": return showLesson(it);
      case "tiles_read": return showTiles(it, true);
      case "tiles": return showTiles(it, false);
      case "cloze": return showCloze(it);
      case "transform": return showTransform(it);
      case "speak": return showSpeak(it);
      case "spot": return showSpot(it);
      case "reading": return showReading(it);
      case "kanjifill": return showKanjiFill(it);
      case "listen": return showListen(it);
      case "produce": return showProduce(it);
      case "vocab": return showVocab(it);
      default: return showTiles(it, false);
    }
  }

  function next() { Voice.stop(); Voice.cancel(); idx++; render(); }

  function finish() {
    $("sess-bar-fill").style.width = "100%";
    if (isExam()) return Exam.finish(opts.exam.arc, results, opts);
    Sfx.complete();
    const st = Engine.state();
    if (bestCombo > st.bestCombo) { st.bestCombo = bestCombo; Engine.save(); }
    const mastered = events.filter(e => e.kind === "mastered").map(e => {
      const g = GRAMMAR.find(x => x.id === e.gp);
      return `<div class="res-line">🏅 ${esc(g.pat)} — ${esc(App.t("res_mastered"))}</div>`;
    }).join("");
    const streak = Engine.streak();
    if (opts.debut) Engine.clearNewKanji();
    $("sess-body").innerHTML = `<div class="result">
      <div class="res-big">⛩</div>
      <div class="res-score">${esc(App.t("res_title"))}</div>
      <div class="res-line">${esc(App.t("res_score").replace("{a}", score).replace("{b}", total))}</div>
      ${bestCombo >= 2 ? `<div class="res-line res-combo">${esc(App.t("res_combo").replace("{n}", bestCombo))}</div>` : ""}
      ${mastered}
      ${streak >= 2 ? `<div class="res-line">🔥 ${esc(App.t("res_streak").replace("{n}", streak))}</div>` : ""}
    </div>`;
    foot(`<button class="btn big primary" id="res-done">${esc(App.t("cont"))}</button>`);
    $("res-done").addEventListener("click", close);
  }

  /* speak needs a mic + the setting on; listen needs a voice to speak WITH.
   * produce and vocab always work — the typed answer needs neither. */
  function fixModes(list) {
    if (opts.noVoiceFallback) return list;
    const mic = Voice.available() && Engine.state().settings.voiceIn;
    const tts = typeof speechSynthesis !== "undefined";
    return list.map(it => {
      if (!mic && it.kind === "speak") return Object.assign({}, it, { kind: "produce" });
      if (!tts && (it.kind === "listen" || it.kind === "tiles"))
        return Object.assign({}, it, { kind: it.kind === "listen" ? "produce" : "tiles_read" });
      return it;
    });
  }

  function start(list, o) {
    opts = o || {};
    items = fixModes(list || Engine.buildSession());
    if (!items.length) return;
    idx = 0; combo = 0; bestCombo = 0; score = 0; total = 0; events = []; results = [];
    $("combo").hidden = true;
    $("session").hidden = false;
    document.getElementById("nav").style.display = "none";
    render();
  }

  /* focused practice on one grammar point (map / library / home due list) */
  function practice(gpId) {
    const p = Engine.point(gpId);
    const list = [];
    if (p.enc === 0) list.push({ kind: "lesson", gp: gpId });
    const sents = Engine.sentencesFor(gpId).slice().sort(() => Math.random() - 0.5).slice(0, 5);
    sents.forEach((s, i) => list.push({ kind: Engine.modeFor(gpId, s, i), gp: gpId, sent: s.i }));
    start(list);
  }

  function strengthen() {
    const list = Engine.buildStrengthen(10);
    if (!list.length) return;
    start(list, { drill: true, back: "strengthen" });
  }

  function kanjiDebut(chars) {
    const list = Engine.buildKanjiDebut(chars, 6);
    if (!list.length) { Engine.clearNewKanji(); App.renderHome(); return; }
    start(list, { debut: true });
  }

  /* Library mic: read one sentence aloud, feedback only, no SRS side effects. */
  function readAloud(sentIdx, gpId) {
    if (!Voice.available()) { App.toast(App.t("speak_no_sr")); return; }
    start([{ kind: "speak", gp: gpId, sent: sentIdx }],
          { free: true, back: "library", noVoiceFallback: true });
  }

  function exam(arcId) {
    const list = Exam.build(arcId);
    if (!list.length) return;
    start(list, { exam: { arc: arcId }, back: "map" });
  }

  function close() {
    Voice.stop(); Voice.cancel();
    $("session").hidden = true;
    document.getElementById("nav").style.display = "";
    App.renderHome();
    if (opts.back === "map") { Journey.render(); App.nav("map"); }
    else if (opts.back === "strengthen") { Strengthen.render(); App.nav("strengthen"); }
    else if (opts.back === "library") { App.nav("library"); }
    else Journey.render();
    opts = {};
  }

  return { start, practice, strengthen, kanjiDebut, exam, readAloud, close, formPrompt,
           _debug: () => ({ item: curItem, parsed: curParsed, idx, items, opts }) };
})();
