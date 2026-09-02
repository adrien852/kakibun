/* Kakibun — Renforcer: targeted drill on the shakiest points + what you confuse. */
const Strengthen = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const pct = (a) => Math.round(a * 100) + " %";

  function accBar(a) {
    const v = Math.round(a * 100);
    const cls = v >= 85 ? "ab-good" : v >= 65 ? "ab-mid" : "ab-bad";
    return `<div class="abar"><i class="${cls}" style="width:${v}%"></i></div>`;
  }

  function tableCard(title, rows, labelFn) {
    if (!rows.length) return "";
    return `<div class="card"><div class="card-title">${esc(title)}</div>
      ${rows.slice(0, 6).map(r => `<div class="wrow">
        <div class="wr-main">
          <div class="wr-top"><span class="wr-label">${labelFn(r)}</span>
            <span class="wr-acc">${esc(pct(r.acc))}</span></div>
          ${accBar(r.acc)}
          <div class="wr-sub">${esc(App.t("str_attempts").replace("{n}", r.n))}</div>
        </div></div>`).join("")}</div>`;
  }

  function render() {
    const lang = App.lang();
    const body = document.getElementById("str-body");
    const st = Engine.stats();
    const learned = Engine.weakestPoints(50);

    if (!learned.length) {
      body.innerHTML = `<div class="card"><div class="lr-sub" style="text-align:center;padding:20px">
        ${esc(App.t("str_none"))}</div></div>`;
      return;
    }

    const weak = learned.slice(0, 8);
    const drillN = Math.min(10, learned.length);
    const overall = st.overall != null
      ? `<div class="statrow" style="margin-bottom:0;padding:4px 8px 12px">
          <div class="stat"><div class="stat-n">${esc(pct(st.overall))}</div>
            <div class="stat-l">${esc(App.t("str_overall"))}</div></div>
          <div class="stat"><div class="stat-n">${st.mastered}</div>
            <div class="stat-l">${esc(App.t("tier_mastered"))}</div></div>
          <div class="stat"><div class="stat-n">${st.solid}</div>
            <div class="stat-l">${esc(App.t("tier_solid"))}</div></div>
          <div class="stat"><div class="stat-n">${st.stamps}/${ARCS.length}</div>
            <div class="stat-l">${esc(App.t("stamps"))}</div></div>
        </div>` : "";

    const prtRows = Engine.statTable("prt", 3);
    const formRows = Engine.statTable("form", 3);

    const pointRows = weak.map(w => {
      const tier = w.p.tier === 2 ? "🎖" : w.p.tier === 1 ? "🏅" : "○";
      return `<div class="wrow" data-gp="${w.g.id}">
        <div class="wr-main">
          <div class="wr-top"><span class="wr-label">${tier} ${esc(w.g.pat)}</span>
            <span class="wr-acc">${esc(pct(w.acc))}</span></div>
          ${accBar(w.acc)}
          <div class="wr-sub">${esc(w.g.name[lang])}</div>
        </div><div class="wr-go">›</div></div>`;
    }).join("");

    body.innerHTML = `
      <div class="card">${overall}
        <button class="btn big primary" id="str-go">🎯 ${esc(App.t("str_drill"))}</button>
        <div class="hero-day" style="text-align:center">${esc(App.t("str_drill_d").replace("{n}", drillN))}</div>
      </div>
      <div class="card"><div class="card-title">${esc(App.t("str_weak_points"))}</div>${pointRows}</div>
      ${prtRows.length || formRows.length ? "" :
        `<div class="card"><div class="lr-sub" style="padding:10px 2px">${esc(App.t("str_no_data"))}</div></div>`}
      ${tableCard(App.t("str_weak_prt"), prtRows, (r) => {
          const fn = PARTICLES[r.key];
          const p = r.key.split(".")[0];
          return `<b class="wr-prt">${esc(p)}</b> <span class="wr-fn">${esc(fn ? fn.name[lang] : r.key)}</span>`;
        })}
      ${tableCard(App.t("str_weak_form"), formRows, (r) => {
          const k = "form_" + r.key;
          const l = App.t(k);
          return esc(l === k ? r.key : l);
        })}`;

    document.getElementById("str-go").addEventListener("click", () => Session.strengthen());
    body.querySelectorAll(".wrow[data-gp]").forEach(el =>
      el.addEventListener("click", () => Session.practice(el.dataset.gp)));
  }

  return { render };
})();
