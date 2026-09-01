/* Kakibun — session runner: lessons + the four exercise modes. */
const Session = (() => {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  let items = [], idx = 0, combo = 0, bestCombo = 0, score = 0, total = 0;
  let masteredList = [], firstTry = true, curParsed = null, curItem = null;

  /* ---------- shared rendering ---------- */
  const dispOpts = () => ({
    showAll: Engine.state().settings.showAllKanji || !Bridge.hasInfo(),
    furi: Engine.state().settings.furi
  });

  function tokHtml(tok, i, opts) {
    const o = opts || {};
    if (tok.type === "punct") return `<span class="tok">${esc(tok.surfR)}</span>`;
    if (o.blank === i) return `<span class="tok blank" data-i="${i}">？</span>`;
    const segs = Bridge.display(tok, dispOpts());
    const inner = segs.map(s => s.rt !== undefined
      ? `<ruby>${esc(s.t)}<rt>${esc(s.rt)}</rt></ruby>` : esc(s.t)).join("");
    const cls = "tok tap" + (tok.type === "p" ? " prt" : "");
    return `<span class="${cls}" data-i="${i}">${inner}</span>`;
  }

  function jpHtml(parsed, opts) {
    const o = opts || {};
    const body = parsed.toks.map((t, i) => tokHtml(t, i, o)).join("");
    const tail = /[かねよ。]$/.test(parsed.surfR) && parsed.surfR.endsWith("か") ? "。" : "。";
    return `<div class="jp${o.noruby ? " noruby" : ""}">${body}<span class="tok">${tail}</span></div>`;
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

  function foot(buttons) {
    $("sess-foot").innerHTML = `<div class="sess-foot-in">${buttons}</div>`;
  }
  function setBar() { $("sess-bar-fill").style.width = (idx / items.length * 100) + "%"; }
  function kindLine(kind) {
    const icons = { lesson:"⛩", tiles:"🎧", tiles_read:"🧩", cloze:"✏️", speak:"🎤", transform:"🔁" };
    return `<div class="prompt-kind"><span class="pk-ico">${icons[kind] || ""}</span>${esc(App.t("kind_" + kind))}</div>`;
  }

  /* ---------- feedback ---------- */
  function feedback(ok, parsed, gpId, extraHtml) {
    combo = ok ? combo + 1 : 0;
    if (combo > bestCombo) bestCombo = combo;
    const cEl = $("combo");
    cEl.hidden = combo < 2;
    $("combo-n").textContent = combo;
    if (combo >= 4) cEl.classList.add("hot"); else cEl.classList.remove("hot");
    if (ok) { Sfx.good(combo); score++; } else Sfx.bad();
    total++;
    const box = document.createElement("div");
    box.className = "fb " + (ok ? "good" : "bad");
    const lang = App.lang();
    const sent = SENTENCES[curItem.sent];
    box.innerHTML = `<div class="fb-head">${ok ? esc(App.pickOk()) : esc(App.t("bad"))}</div>
      ${!ok ? `<div class="wp-note">${esc(App.t("answer_was"))}</div>` : ""}
      <div class="fb-jp"></div>
      <div class="translation">${esc(sent[lang === "fr" ? "fr" : "en"])}</div>
      ${sent.note ? `<div class="why"><div class="why-t">💡</div>${esc(sent.note[lang])}</div>` : ""}
      ${extraHtml || ""}`;
    box.querySelector(".fb-jp").innerHTML = jpHtml(parsed).replace('class="jp"', 'class="jp fbjp"');
    $("sess-body").appendChild(box);
    bindTaps(box, parsed, gpId);
    const masteredNow = Engine.record(gpId, ok);
    Engine.noteSeen(curItem.sent);
    if (masteredNow) {
      masteredList.push(gpId);
      setTimeout(() => {
        Sfx.master();
        const g = GRAMMAR.find(x => x.id === gpId);
        App.toastMaster(`${g.pat}`, App.t("master_toast"));
      }, 500);
    }
    foot(`<button class="btn big primary" id="fb-next">${esc(App.t("cont"))}</button>`);
    $("fb-next").addEventListener("click", next);
    $("fb-next").focus();
    box.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  /* ---------- item renderers ---------- */
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

  function showTiles(item, withText) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    const lang = App.lang();
    const target = parsed.toks.filter(t => t.type !== "punct");
    const p = Engine.point(item.gp);
    // distractors once the point is warm
    let distract = [];
    if (p.enc >= 2) {
      const usedPrt = new Set(target.filter(t => t.type === "p").map(t => t.surfR));
      const pool = ["は","が","を","に","で","へ","と","も"].filter(x => !usedPrt.has(x));
      distract = pool.sort(() => Math.random() - 0.5).slice(0, 2)
        .map(x => ({ type: "p", surfK: null, surfR: x, distract: true }));
    }
    const tiles = target.concat(distract).map((t, n) => ({ t, n }))
      .sort(() => Math.random() - 0.5);
    $("sess-body").innerHTML = `${kindLine(withText ? "tiles_read" : "tiles")}
      <button class="audio-big" id="t-play">🔊</button>
      ${withText ? `<div class="translation" style="text-align:center">${esc(sent[lang])}</div>` : ""}
      <div class="answer-row" id="t-answer"></div>
      <div class="tile-bank" id="t-bank">${tiles.map(x => {
        const segs = Bridge.display(x.t, dispOpts());
        const inner = segs.map(s => s.rt !== undefined ? `<ruby>${esc(s.t)}<rt>${esc(s.rt)}</rt></ruby>` : esc(s.t)).join("");
        return `<button class="tile" data-n="${x.n}">${inner}</button>`;
      }).join("")}</div>`;
    const seq = [];
    const bank = $("t-bank"), ans = $("t-answer");
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
        checkBtnState();
      });
      ans.appendChild(clone);
      seq.push(clone);
      checkBtnState();
    }));
    const combined = target.concat(distract); // data-n indexes THIS array (pre-shuffle)
    function checkBtnState() {
      $("t-check").disabled = seq.length === 0;
    }
    $("t-play").addEventListener("click", () => tts(parsed));
    setTimeout(() => tts(parsed), 500);
    foot(`<button class="btn ghost" id="t-replay">${esc(App.t("replay"))}</button>
          <button class="btn big primary" id="t-check" disabled>${esc(App.t("check"))}</button>`);
    $("t-replay").addEventListener("click", () => tts(parsed, 0.7));
    $("t-check").addEventListener("click", () => {
      const built = seq.map(c => combined[+c.dataset.n].surfR).join("");
      const want = target.map(t => t.surfR).join("");
      const ok = built === want;
      $("sess-foot").innerHTML = "";
      bank.querySelectorAll(".tile").forEach(b => b.classList.add("used"));
      feedback(ok && firstTry, parsed, item.gp);
    });
  }

  function showCloze(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
    const lang = App.lang();
    const prtIdx = parsed.toks.map((t, i) => t.type === "p" ? i : -1).filter(i => i >= 0);
    // prefer a particle that appears in the grammar point's pattern
    const g = GRAMMAR.find(x => x.id === item.gp);
    const pref = prtIdx.filter(i => g.pat.includes(parsed.toks[i].surfR));
    const blank = (pref.length ? pref : prtIdx)[Math.floor(Math.random() * (pref.length ? pref.length : prtIdx.length))];
    const tok = parsed.toks[blank];
    const correct = tok.surfR;
    const pool = ["は","が","を","に","で","へ","と","も","か","の","や","から","まで","より","だけ"]
      .filter(x => x !== correct).sort(() => Math.random() - 0.5).slice(0, 5);
    const choices = pool.concat([correct]).sort(() => Math.random() - 0.5);
    $("sess-body").innerHTML = `${kindLine("cloze")}
      <div id="c-jp"></div>
      <div class="translation">${esc(sent[lang])}</div>
      <div class="choices prt-choices" id="c-choices">${choices.map(c =>
        `<button class="choice" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>`;
    $("c-jp").innerHTML = jpHtml(parsed, { blank });
    bindTaps($("sess-body"), parsed, item.gp);
    foot("");
    let done = false;
    $("c-choices").querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
      if (done) return;
      const ok = b.dataset.c === correct;
      if (!ok) {
        b.classList.add("ko");
        firstTry = false;
        Sfx.bad();
        return; // let him try again — the explanation comes with the right pick
      }
      done = true;
      b.classList.add("ok");
      $("c-choices").querySelectorAll(".choice").forEach(x => { if (x !== b) x.classList.add("dim"); });
      const fn = PARTICLES[tok.fn];
      const why = `<div class="why"><div class="why-t">${esc(App.t("why").replace("{p}", correct))} — ${esc(fn.name[lang])}</div>${esc(fn.expl[lang])}</div>`;
      tts(parsed);
      feedback(firstTry, parsed, item.gp, why);
    }));
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
    const formsPool = tok.lex.pos === "adji" ? Conj.ADJ_FORMS
      : tok.lex.pos === "cop" ? Conj.COP_FORMS : Conj.VERB_FORMS;
    const seen = new Set([answer.r]);
    const distract = [];
    for (const f of formsPool.slice().sort(() => Math.random() - 0.5)) {
      if (distract.length >= 3) break;
      try {
        const c = Conj.conj(tok.lex, f);
        if (!seen.has(c.r)) { seen.add(c.r); distract.push(c); }
      } catch (e) {}
    }
    const show = (c) => {
      const t2 = { type: "w", lex: tok.lex, form: null, surfK: c.k, surfR: c.r };
      return Bridge.display(t2, dispOpts()).map(s => s.rt !== undefined
        ? `<ruby>${esc(s.t)}<rt>${esc(s.rt)}</rt></ruby>` : esc(s.t)).join("");
    };
    const choices = distract.concat([answer]).sort(() => Math.random() - 0.5);
    const fLabel = App.t("form_" + to) !== "form_" + to ? App.t("form_" + to) : g.pat;
    $("sess-body").innerHTML = `${kindLine("transform")}
      <div class="lesson"><div class="les-pat">${show(base)} →&nbsp;?</div>
      <div class="les-name">${esc(App.t("trans_q").replace("{w}", "").replace("{f}", fLabel)).replace("→", "")}</div></div>
      <div class="choices" id="tr-choices">${choices.map((c, i) =>
        `<button class="choice" data-i="${i}">${show(c)}</button>`).join("")}</div>`;
    foot("");
    let done = false;
    $("tr-choices").querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
      if (done) return;
      const ok = choices[+b.dataset.i].r === answer.r;
      if (!ok) { b.classList.add("ko"); firstTry = false; Sfx.bad(); return; }
      done = true;
      b.classList.add("ok");
      $("tr-choices").querySelectorAll(".choice").forEach(x => { if (x !== b) x.classList.add("dim"); });
      const why = `<div class="why"><div class="why-t">${esc(g.pat)}</div>${esc(g.expl[lang])}</div>`;
      tts(parsed);
      feedback(firstTry, parsed, item.gp, why);
    }));
  }

  function showSpeak(item) {
    const sent = SENTENCES[item.sent];
    const parsed = Parse.sentence(sent.dsl);
    curParsed = parsed;
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
    $("s-skip").addEventListener("click", () => {
      Voice.cancel();
      feedback(false, parsed, item.gp);
    });
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
          const ok = alts.some(a => Voice.match(a, parsed.surfK, parsed.surfR));
          heard.textContent = App.t("speak_heard") + " " + (alts[0] || "");
          listening = false;
          mic.classList.remove("rec");
          if (ok) {
            finished = true;
            feedback(firstTry, parsed, item.gp);
          } else {
            tries++;
            firstTry = false;
            Sfx.bad();
            hint.textContent = App.t("speak_close");
            if (tries >= 2) {
              finished = true;
              setTimeout(() => feedback(false, parsed, item.gp), 900);
            }
          }
        },
        (got) => {
          listening = false;
          mic.classList.remove("rec");
          if (!got && !finished) hint.textContent = App.t("speak_nothing") + " " + App.t("speak_tap");
        },
        () => {
          listening = false;
          mic.classList.remove("rec");
          hint.textContent = App.t("speak_no_sr");
        }
      );
    });
  }

  /* ---------- flow ---------- */
  function render() {
    WordPop.hide();
    firstTry = true;
    setBar();
    const it = items[idx];
    curItem = it;
    if (!it) return finish();
    if (it.kind === "lesson") return showLesson(it);
    if (it.kind === "tiles_read") return showTiles(it, true);
    if (it.kind === "tiles") return showTiles(it, false);
    if (it.kind === "cloze") return showCloze(it);
    if (it.kind === "transform") return showTransform(it);
    if (it.kind === "speak") return showSpeak(it);
    return showTiles(it, false);
  }

  function next() { Voice.stop(); Voice.cancel(); idx++; render(); }

  function finish() {
    Sfx.complete();
    const st = Engine.state();
    if (bestCombo > st.bestCombo) { st.bestCombo = bestCombo; Engine.save(); }
    const lang = App.lang();
    const mastered = masteredList.map(id => {
      const g = GRAMMAR.find(x => x.id === id);
      return `<div class="res-line">🏅 ${esc(g.pat)} — ${esc(App.t("res_mastered"))}</div>`;
    }).join("");
    const streak = Engine.streak();
    $("sess-bar-fill").style.width = "100%";
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

  function mapSpeakAvailability(list) {
    const ok = Voice.available() && Engine.state().settings.voiceIn;
    return list.map(it => (!ok && it.kind === "speak") ? Object.assign({}, it, { kind: "tiles" }) : it);
  }

  function start(list) {
    items = mapSpeakAvailability(list || Engine.buildSession());
    if (!items.length) return;
    idx = 0; combo = 0; bestCombo = 0; score = 0; total = 0; masteredList = [];
    $("combo").hidden = true;
    $("session").hidden = false;
    document.getElementById("nav").style.display = "none";
    render();
  }

  /* focused practice on one grammar point (from map / library) */
  function practice(gpId) {
    const p = Engine.point(gpId);
    const list = [];
    if (p.enc === 0) list.push({ kind: "lesson", gp: gpId });
    const sents = Engine.sentencesFor(gpId).slice().sort(() => Math.random() - 0.5).slice(0, 5);
    const g = GRAMMAR.find(x => x.id === gpId);
    sents.forEach((s, i) => {
      const caps = (() => { const pr = Parse.sentence(s.dsl); return {
        prt: pr.toks.some(t => t.type === "p"),
        tf: pr.toks.some(t => t.type === "w" && t.form) }; })();
      let kind = i === 0 ? "tiles_read" : i === 1 ? "tiles" : i === 2 && caps.prt ? "cloze"
        : i === 3 && g.tf && caps.tf ? "transform" : "speak";
      if (kind === "cloze" && !caps.prt) kind = "tiles";
      list.push({ kind, gp: gpId, sent: s.i });
    });
    start(list);
  }

  function close() {
    Voice.stop(); Voice.cancel();
    $("session").hidden = true;
    document.getElementById("nav").style.display = "";
    App.renderHome();
    Journey.render();
  }

  return { start, practice, close, _debug: () => ({ item: curItem, parsed: curParsed, idx, items }) };
})();
