/* Kakibun — 稽古 renforcer.
 *
 * Not "practise more", but "practise THIS": the three tables below are built
 * from what has actually been got wrong, ranked worst-first, and every row is
 * a drill you can start on the spot.
 *
 * The threshold colours are the whole point — under 55 % is red, 55–74 amber,
 * 75 and up green — so a glance down the column tells you where the work is.
 */
const Strengthen = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const pct = (a) => Math.round(a * 100);
  const accCls = (p) => p < 55 ? "acc-lo" : p < 75 ? "acc-mid" : "acc-hi";
  const barCls = (p) => p < 55 ? "bar-lo" : p < 75 ? "bar-mid" : "bar-hi";

  function row(label, sub, p, attrs) {
    return `<button class="weak-row" ${attrs || ""}>
      <span class="weak-top">
        <span class="weak-label">${label}${sub ? ` <small>${esc(sub)}</small>` : ""}</span>
        <span class="weak-acc ${accCls(p)}">${p}%</span>
      </span>
      <span class="weak-track"><i class="${barCls(p)}" style="width:${p}%"></i></span>
    </button>`;
  }

  function group(title, rows) {
    if (!rows) return "";
    return `<section class="card">
      <div class="eyebrow">${esc(title)}</div>
      <div class="weak-list">${rows}</div>
    </section>`;
  }

  /* ---------- the finite lists ----------
   * Ranked by what actually needs doing: the ones falling due first, then the
   * ones never started, then the rest. A list you have mastered still appears —
   * 曜日 is seven words, and being able to open it is worth more than tidiness.
   */
  function listsCard(lang) {
    const now = Date.now();
    const rows = LISTS.map(l => {
      const p = Engine.listPoint(l.id);
      const due = p.enc > 0 && p.due <= now;
      const rank = due ? 0 : p.enc === 0 ? 1 : 2;
      const state = due ? App.t("list_due") : p.enc === 0 ? App.t("list_new")
                  : p.tier >= 1 ? "🏅" : App.t("list_ok");
      return { rank, due: p.due, html: `<button class="weak-row list-go" data-list="${esc(l.id)}">
          <span class="weak-top">
            <span class="weak-label">${esc(l.jp)} <small>${esc(l.name[lang])}</small></span>
            <span class="weak-acc ${due ? "acc-lo" : p.enc === 0 ? "acc-mid" : "acc-hi"}"
              >${esc(state)}</span>
          </span>
        </button>` };
    }).sort((a, b) => a.rank - b.rank || a.due - b.due).map(x => x.html).join("");
    return `<section class="card">
      <div class="mis-head">
        <span class="eyebrow">${esc(App.t("str_lists"))}</span>
        <span class="eyebrow-n">${Engine.listsStarted().length}/${LISTS.length}</span>
      </div>
      <div class="sess-sub" style="margin:4px 0 8px;line-height:1.5">${esc(App.t("str_lists_d"))}</div>
      <div class="weak-list">${rows}</div>
    </section>`;
  }

  function render() {
    const lang = App.lang();
    const body = document.getElementById("str-body");
    const weak = Engine.weakestPoints(8).filter(w => w.p.enc > 0);

    /* particles, by FUNCTION — に as a destination is a different skill from
       に as a point in time, and the stats have always been keyed that way */
    const prt = Engine.statTable("prt", 3).slice(0, 6).map(r => {
      const fn = PARTICLES[r.key];
      const p = r.key.split(".")[0];
      return row(`${esc(p)}`, fn ? fn.name[lang] : r.key, pct(r.acc), `data-prt="${esc(r.key)}"`);
    }).join("");

    /* the i18n label spells the form out — "polie passée (ました)". The kana in
       the parentheses is the row's real name; the rest is its gloss. */
    const form = Engine.statTable("form", 3).slice(0, 6).map(r => {
      const k = "form_" + r.key, l = App.t(k);
      const m = l === k ? null : l.match(/[（(]([^）)]+)[）)]/);
      const label = m ? "〜" + m[1] : r.key;
      const sub = l === k ? "" : l.replace(/[（(][^）)]*[）)]/g, "").trim();
      return row(esc(label), sub, pct(r.acc), `data-form="${esc(r.key)}"`);
    }).join("");

    const pts = weak.map(w =>
      row(esc(w.g.pat), w.g.name[lang], pct(w.acc), `data-gp="${w.g.id}"`)).join("");

    const nothing = !prt && !form && !pts;

    body.innerHTML = `
      <section class="panel" style="margin-top:16px">
        <div class="eyebrow">${esc(App.t("str_drill_eyebrow")
          .replace("{n}", Math.min(12, Math.max(4, weak.length * 2))))}</div>
        <div class="sess-sub" style="margin-top:8px;line-height:1.5">${esc(
          nothing ? App.t("str_none") : App.t("str_drill_d").replace("{n}", weak.length))}</div>
        ${nothing ? "" : `<button class="btn-primary sm" id="str-go" style="margin-top:12px"
          >${esc(App.t("str_drill_go"))}</button>`}
      </section>
      ${VocabExam.cardHtml()}
      ${listsCard(lang)}
      <div class="weak-groups">
        ${group(App.t("str_weak_prt"), prt)}
        ${group(App.t("str_weak_form"), form)}
        ${group(App.t("str_weak_points"), pts)}
        ${prt || form || pts ? "" : `<section class="card"><div class="empty-note"
          >${esc(App.t("str_no_data"))}</div></section>`}
      </div>`;

    VocabExam.bind(body);
    body.querySelectorAll("[data-list]").forEach(el =>
      el.addEventListener("click", () => Session.listSession(el.dataset.list, "strengthen")));
    const go = document.getElementById("str-go");
    if (go) go.addEventListener("click", () => Session.strengthen());
    body.querySelectorAll("[data-gp]").forEach(el =>
      el.addEventListener("click", () => Session.practice(el.dataset.gp)));
    /* a particle or form row drills the points where that thing is used */
    body.querySelectorAll("[data-prt],[data-form]").forEach(el =>
      el.addEventListener("click", () => Session.strengthen()));
  }

  return { render };
})();
