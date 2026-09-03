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
      return `<div class="due-row" data-gp="${g.id}"><div class="due-jp">${esc(g.pat)}</div>
        <div class="due-name">${esc(g.name[lang])}</div><div>›</div></div>`;
    }).join("");

    const solidRows = outcome.solidified.map(gp => {
      const g = GRAMMAR.find(x => x.id === gp);
      return `<div class="res-line">🎖 ${esc(g.pat)} — ${esc(App.t("res_solid"))}</div>`;
    }).join("");

    $("sess-body").innerHTML = `<div class="result">
      ${outcome.passed ? stampHtml(arcId, true, "big") : `<div class="res-big">🎫</div>`}
      <div class="res-score">${esc(outcome.passed ? App.t("exam_pass") : App.t("exam_fail"))}</div>
      <div class="res-line">${esc(App.t("res_score").replace("{a}", outcome.score).replace("{b}", outcome.total))} · ${pct} %</div>
      ${outcome.passed
        ? `<div class="res-line res-combo">${esc(App.t("exam_stamp"))}</div>`
        : `<div class="res-line">${esc(App.t("exam_need").replace("{n}", Math.round(Engine.EXAM_PASS * 100)))}</div>`}
      ${solidRows}
      ${outcome.demoted.length ? `<div class="res-line">${esc(App.t("exam_demoted").replace("{n}", outcome.demoted.length))}</div>` : ""}
      ${results.every(r => r.ok) ? `<div class="res-line res-combo">${esc(App.t("exam_perfect"))}</div>` : ""}
    </div>
    ${missRows ? `<div class="card"><div class="card-title">${esc(App.t("exam_misses"))}</div>
      <div class="due-list" id="ex-misses">${missRows}</div></div>` : ""}`;

    const box = $("ex-misses");
    if (box) box.querySelectorAll(".due-row").forEach(el =>
      el.addEventListener("click", () => Session.practice(el.dataset.gp)));

    $("sess-foot").innerHTML = `<div class="sess-foot-in">
      <button class="btn big primary" id="ex-done">${esc(App.t("cont"))}</button></div>`;
    $("ex-done").addEventListener("click", () => Session.close());
  }

  /* ---------- the stamp ---------- */
  function stampHtml(arcId, earned, size) {
    const jp = arcId === "grand" ? "完" : arcOf(arcId).jp;
    return `<div class="stamp ${earned ? "on" : "off"} ${size === "big" ? "stamp-big" : ""}">
      <div class="stamp-in"><span>${esc(jp)}</span></div></div>`;
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
