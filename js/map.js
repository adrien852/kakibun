/* Kakibun — the journey map: 10 arcs (stations across Japan), 100 stops,
 * with the arc's exam checkpoint and its 駅スタンプ at the end of each section. */
const Journey = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  function render() {
    const lang = App.lang();
    const cur = Engine.currentIndex();
    const root = document.getElementById("map-scroll");
    let html = `<div class="stamp-row">${ARCS.map(a =>
      Exam.stampHtml(a.id, Engine.hasStamp(a.id))).join("")}
      <div class="stamp-count">${esc(App.t("stamps_n")
        .replace("{a}", Engine.stampCount()).replace("{b}", ARCS.length))}</div></div>`;
    let gi = 0;
    for (const arc of ARCS) {
      const points = GRAMMAR.filter(g => g.arc === arc.id);
      const startIdx = gi;
      const arcUnlocked = startIdx <= cur;
      const doneCount = points.filter(g => Engine.point(g.id).tier >= 1).length;
      html += `<div class="arc ${arcUnlocked ? "" : "arc-locked"}">
        <div class="arc-head"><span class="arc-jp">${esc(arc.jp)}</span>
        <span class="arc-name">${esc(arc.city[lang])} — ${esc(arc.name[lang])}</span>
        <span class="arc-count">${doneCount}/${points.length}</span></div>
        <div class="stations">`;
      for (const g of points) {
        const i = gi++;
        const p = Engine.point(g.id);
        const mp = Engine.masteryProgress(g.id);
        const cls = p.tier >= 1 ? "done" : i === cur ? "cur" : i < cur ? "" : "locked";
        const rank = p.tier === 2 ? "🎖" : p.tier === 1 ? "🏅" : i === cur ? "📍" : i < cur ? "○" : "🔒";
        const bar = (i <= cur && p.tier === 0 && p.enc > 0)
          ? `<div class="mbar"><i style="width:${Math.round(mp.pct * 100)}%"></i></div>` : "";
        html += `<div class="station ${cls}" ${i <= cur ? `data-gp="${g.id}"` : ""}>
          <div class="dot"></div>
          <div class="st-card"><div class="st-rank">${rank}</div>
          <div class="st-main"><div class="st-pat">${esc(g.pat)}</div>
          <div class="st-name">${esc(g.name[lang])}</div>${bar}</div></div></div>`;
      }
      html += `</div>`;
      if (arcUnlocked) html += Exam.cardHtml(arc.id);
      html += `</div>`;
    }
    if (Engine.grandUnlocked()) html += Exam.cardHtml("grand");
    root.innerHTML = html;
    root.querySelectorAll(".station[data-gp]").forEach(el =>
      el.addEventListener("click", () => Session.practice(el.dataset.gp)));
    root.querySelectorAll(".exam-card[data-exam]").forEach(el =>
      el.addEventListener("click", () => Session.exam(el.dataset.exam)));
  }

  return { render };
})();
