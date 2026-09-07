/* Kakibun — station exams (駅スタンプ).
 * One checkpoint per arc, unlocked when every stop in it has been started.
 * No hints, no second try. 80 % earns the stamp; misses drop back into review.
 * "grand" = the final exam across all ten sections.
 */
const Exam = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const $ = (id) => document.getElementById(id);
  const MIN_Q = 10, MAX_Q = 14, GRAND_Q = 20;

  const arcOf = (id) => ARCS.find(a => a.id === id);
  const arcLabel = (id) => id === "grand" ? App.t("exam_grand")
    : `${arcOf(id).jp} ${arcOf(id).city[App.lang()]}`;

  function unlocked(arcId) {
    return arcId === "grand" ? Engine.grandUnlocked() : Engine.arcUnlocked(arcId);
  }

  /* Question length for an arc, so the picker can state it up front. */
  function length(arcId) {
    if (arcId === "grand") return GRAND_Q;
    const n = Engine.arcPoints(arcId).length;
    return Math.max(MIN_Q, Math.min(MAX_Q, n));
  }

  /* One question per point, hardest mode the sentence can host, no repeats. */
  function questionFor(gpId, slot, showAll) {
    const g = GRAMMAR.find(x => x.id === gpId);
    const sents = Engine.sentencesFor(gpId).slice().sort(() => Math.random() - 0.5);
    for (const s of sents) {
      const caps = Engine.sentenceCaps(s);
      const wheel = [];
      if (caps.prt) wheel.push("cloze");
      if (Engine.spotCandidates(s).length) wheel.push("spot");
      if (g.tf && caps.tf) wheel.push("transform");
      if (Engine.readingCandidates(s, showAll).length) wheel.push("reading");
      if (Engine.kanjiFillCandidates(s, showAll).length &&
          Engine.learnedKanjiPool(showAll).length >= 4) wheel.push("kanjifill");
      wheel.push("tiles");
      const kind = wheel[slot % wheel.length];
      return { kind, gp: gpId, sent: s.i, exam: true };
    }
    return null;
  }

  function build(arcId) {
    Engine.load();
    const showAll = Engine.state().settings.showAllKanji || !Bridge.hasInfo();
    let points;
    if (arcId === "grand") {
      points = GRAMMAR.filter(g => Engine.point(g.id).enc > 0);
    } else {
      points = Engine.arcPoints(arcId);
    }
    const want = length(arcId);
    const order = points.slice().sort(() => Math.random() - 0.5);
    const out = [];
    let slot = 0;
    for (const g of order) {
      if (out.length >= want) break;
      const q = questionFor(g.id, slot++, showAll);
      if (q) out.push(q);
    }
    // small arcs: add a second question on the shakiest points to reach MIN_Q
    if (out.length < want) {
      const extra = Engine.weakestPoints(want).filter(w => points.some(p => p.id === w.g.id));
      for (const w of extra) {
        if (out.length >= want) break;
        const q = questionFor(w.g.id, slot++, showAll);
        if (q) out.push(q);
      }
    }
    return out.sort(() => Math.random() - 0.5);
  }

  /* ---------- result screen ---------- */
  function finish(arcId, results, opts) {
    const outcome = Engine.recordExam(arcId, results);
    const lang = App.lang();
    const pct = Math.round(outcome.score / Math.max(1, outcome.total) * 100);
    if (outcome.passed) Sfx.master(); else Sfx.bad();

    const missRows = results.filter(r => !r.ok).map(r => {
      const g = GRAMMAR.find(x => x.id === r.gp);
      return `<div class="res-row" data-gp="${g.id}"><span>${esc(g.pat)}</span>
        <b style="font-weight:400;color:rgba(255,255,255,.7)">${esc(g.name[lang])}</b></div>`;
    }).join("");

    const solidRows = outcome.solidified.map(gp => {
      const g = GRAMMAR.find(x => x.id === gp);
      return `<div class="res-row"><span>🎖 ${esc(g.pat)}</span><b>${esc(App.t("res_solid"))}</b></div>`;
    }).join("");

    document.getElementById("sess-kind").textContent =
      App.t(outcome.passed ? "exam_pass" : "exam_fail");
    $("sess-body").innerHTML = `
      <div class="res-score">${outcome.score}<small>/${outcome.total}</small></div>
      <div class="res-line">${esc(outcome.passed ? App.t("exam_stamp") : App.t("exam_need")
        .replace("{n}", Math.round(Engine.EXAM_PASS * 100)))}</div>
      <div class="res-card">
        <div class="res-row"><span>${esc(App.t("exam_arc").replace("{a}", arcLabel(arcId)))}</span
          ><b class="accent">${pct} %</b></div>
        ${outcome.passed ? `<div class="res-row"><span>駅スタンプ</span
          ><b class="accent">${esc(arcId === "grand" ? "🎌" : (ARCS.find(a => a.id === arcId) || {}).jp || "")}</b></div>` : ""}
        ${solidRows}
        ${outcome.demoted.length ? `<div class="res-row"><span>${esc(App.t("exam_demoted")
          .replace("{n}", outcome.demoted.length))}</span><b>↺</b></div>` : ""}
        ${results.every(r => r.ok) ? `<div class="res-row"><span>${esc(App.t("exam_perfect"))}</span
          ><b class="accent">✓</b></div>` : ""}
      </div>
      ${missRows ? `<div class="res-card"><div class="eyebrow">${esc(App.t("exam_misses"))}</div>
        <div id="ex-misses">${missRows}</div></div>` : ""}`;
    $("sess-foot").innerHTML =
      `<button class="btn-primary finish" id="ex-done">${esc(App.t("res_back"))}</button>`;
    $("ex-done").addEventListener("click", () => Session.close());
  }

  /* ---------- the stamp ---------- */
  function stampHtml(arcId, earned, size) {
    const jp = arcId === "grand" ? "完" : arcOf(arcId).jp;
    return `<span class="stamp ${earned ? "got" : ""}">${esc(jp.length > 2 ? jp.slice(0, 2) : jp)}</span>`;
  }

  /* Card shown on the map at the end of each arc. */
  function cardHtml(arcId) {
    const lang = App.lang();
    const open = unlocked(arcId);
    const stamp = arcId === "grand" ? null : Engine.state().stamps[arcId];
    const n = length(arcId);
    const need = arcId === "grand" ? Engine.arcPoints("a1").length : Engine.arcPoints(arcId).length;
    let sub;
    if (!open) sub = arcId === "grand" ? App.t("exam_grand_locked") : App.t("exam_locked").replace("{n}", need);
    else if (stamp) sub = App.t("exam_stamp_have").replace("{d}", stamp.date);
    else sub = App.t("exam_len").replace("{n}", n);
    return `<div class="exam-card ${open ? "" : "locked"}" ${open ? `data-exam="${arcId}"` : ""}>
      ${stampHtml(arcId, !!stamp)}
      <div class="ex-main">
        <div class="ex-title">${esc(arcId === "grand" ? App.t("exam_grand") : App.t("exam_title"))}</div>
        <div class="ex-sub">${esc(sub)}</div>
      </div>
      ${open ? `<div class="ex-go">${esc(stamp ? App.t("exam_retake") : App.t("exam_start"))} ›</div>` : `<div class="ex-go">🔒</div>`}
    </div>`;
  }

  return { build, finish, unlocked, length, cardHtml, stampHtml, arcLabel };
})();
