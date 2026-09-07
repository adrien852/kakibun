/* Kakibun — 旅 the journey.
 *
 * Two levels, not two screens: the ten cities, and one city opened. The
 * landscape behind never changes, so opening a city reads as stepping closer
 * rather than as navigating away.
 *
 * The 駅スタンプ card at the top is the whole journey at a glance — ten circles,
 * each rotated a fixed few degrees so the row looks hand-stamped rather than
 * printed.
 */
const Journey = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const $ = (id) => document.getElementById(id);

  /* the stamp row reads as hand-stamped, not printed */
  const ROT = [-7, 5, -4, 3, -6, 2, -3, 6, -5, 4];
  /* two characters is what fits a 41px circle */
  const abbr = (jp) => jp.length > 2 ? jp.slice(0, 2) : jp;

  let openCity = null;                 // arc id, or null for the list

  function render() {
    const lang = App.lang();
    const cur = Engine.currentIndex();
    $("journey-pill").textContent = `${Season.current().jp} · ${cur}/${GRAMMAR.length}`;
    $("journey-body").innerHTML = openCity ? cityHtml(openCity, lang) : listHtml(lang);
    bind();
    $("journey").scrollTop = 0;
  }

  /* ---------- the ten cities ---------- */
  function listHtml(lang) {
    const cur = Engine.currentIndex();
    const stamps = ARCS.map((a, i) => {
      const got = Engine.hasStamp(a.id);
      return `<span class="stamp ${got ? "got" : ""}" style="transform:rotate(${ROT[i] || 0}deg)"
        >${esc(abbr(a.jp))}</span>`;
    }).join("");

    let gi = 0;
    const rows = ARCS.map((a) => {
      const pts = GRAMMAR.filter(g => g.arc === a.id);
      const start = gi; gi += pts.length;
      const done = pts.filter(g => Engine.point(g.id).tier >= 1).length;
      const seen = pts.filter(g => Engine.point(g.id).enc > 0).length;
      const reached = start <= cur;
      const full = done === pts.length;
      // a city you have entered but mastered nothing in still reads as begun
      const pct = done ? Math.round(done / pts.length * 100) : (seen ? 4 : 0);
      const bar = full ? "var(--ok)" : seen ? "var(--accent)" : "rgba(255,255,255,.3)";
      const got = Engine.hasStamp(a.id);
      return `<button class="city-row" data-city="${a.id}">
        <span class="city-stamp ${got ? "got" : ""}">${esc(abbr(a.jp))}</span>
        <span class="city-main">
          <span class="city-top">
            <span class="city-jp ${reached ? "on" : ""}">${esc(a.jp)}</span>
            <span class="city-fr">${esc(a.name[lang])}</span>
          </span>
          <span class="city-track"><i style="width:${pct}%;background:${bar}"></i></span>
        </span>
        <span class="city-count">${done}/${pts.length}</span>
      </button>`;
    }).join("");

    /* the ten stamps open the grand journey — the row only exists once they do */
    const grand = Engine.grandUnlocked() ? `<div class="exam-row" style="margin-top:9px">
        <span class="lbl">${esc(App.t("exam_grand"))}<small>${esc(App.t("exam_grand_d"))}</small></span>
        <button class="exam-go" data-exam="grand">${esc(App.t("exam_pass_s"))}</button>
      </div>` : "";

    return `<section class="card stamp-card">
        <div class="mis-head">
          <span class="eyebrow">駅スタンプ</span>
          <span class="eyebrow-n">${Engine.stampCount()}/${ARCS.length}</span>
        </div>
        <div class="stamp-grid">${stamps}</div>
        <div class="stamp-note">${esc(App.t("stamp_note"))}</div>
      </section>
      <div class="city-list">${rows}${grand}</div>`;
  }

  /* ---------- one city opened ---------- */
  function cityHtml(arcId, lang) {
    const a = ARCS.find(x => x.id === arcId);
    const pts = GRAMMAR.filter(g => g.arc === arcId);
    const cur = Engine.currentIndex();
    const firstIdx = GRAMMAR.findIndex(g => g.arc === arcId);

    const stops = pts.map((g, n) => {
      const i = firstIdx + n;
      const p = Engine.point(g.id);
      const locked = i > cur;
      const isHere = i === cur;
      const mark = p.tier >= 1 ? "✓" : isHere ? "🚶" : locked ? "🔒" : "○";
      const dot = p.tier >= 1 ? "done" : isHere ? "cur" : "";
      const state = p.tier === 2 ? "state_solid" : p.tier === 1 ? "state_mastered"
                  : locked ? "state_locked" : isHere ? "state_current" : "state_learned";
      const cls = locked ? "locked" : isHere ? "cur" : "";
      const dlg = Engine.dialoguesFor(g.id).length;
      return `<button class="stop-row" ${locked ? "" : `data-gp="${g.id}"`}>
        <span class="stop-dot ${dot}">${mark}</span>
        <span class="stop-main">
          <span class="stop-pat">${esc(g.pat)}</span>
          <span class="stop-name">${esc(g.name[lang])}${dlg && !locked ? ` · 💬${dlg}` : ""}</span>
        </span>
        <span class="stop-state ${cls}">${esc(App.t(state))}</span>
      </button>`;
    }).join("");

    const open = Exam.unlocked(arcId);
    const stamp = Engine.state().stamps[arcId];
    const examSub = !open ? App.t("exam_locked").replace("{n}", pts.length)
                  : stamp ? App.t("exam_stamp_have").replace("{d}", stamp.date)
                  : App.t("exam_len").replace("{n}", Exam.length(arcId));

    return `<section class="city-detail">
      <button class="city-back">← ${esc(App.t("all_cities"))}</button>
      <div class="city-name">
        <span class="jp">${esc(a.jp)}</span>
        <span class="fr">${esc(a.name[lang])}</span>
      </div>
      <div class="stop-list">
        ${stops}
        <div class="exam-row">
          <span class="lbl">${esc(App.t("exam_section"))}<small>${esc(examSub)}</small></span>
          <button class="exam-go" data-exam="${arcId}" ${open ? "" : "disabled"}
            >${esc(open ? (stamp ? App.t("exam_retake_s") : App.t("exam_pass_s")) : "🔒")}</button>
        </div>
      </div>
    </section>`;
  }

  function bind() {
    const body = $("journey-body");
    body.querySelectorAll(".city-row").forEach(el =>
      el.addEventListener("click", () => { openCity = el.dataset.city; Sfx.tap(); render(); }));
    const back = body.querySelector(".city-back");
    if (back) back.addEventListener("click", () => { openCity = null; Sfx.tap(); render(); });
    body.querySelectorAll(".stop-row[data-gp]").forEach(el =>
      el.addEventListener("click", () => Session.practice(el.dataset.gp)));
    body.querySelectorAll(".exam-go[data-exam]").forEach(el =>
      el.addEventListener("click", () => { if (!el.disabled) Session.exam(el.dataset.exam); }));
  }

  /* the grand exam lives at the end of the list once all ten stamps are in */
  const close = () => { openCity = null; };

  return { render, close, ROT };
})();
