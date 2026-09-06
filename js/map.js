/* Kakibun — the journey map: 10 arcs (cities across Japan), 100 stops,
 * with the arc's exam checkpoint and its 駅スタンプ at the end of each section.
 *
 * v2.1 turns the list into an actual journey. The rail is drawn in two halves —
 * the part already travelled takes the season's colour, the part ahead stays
 * grey — and a traveller sits at the current stop, so the map answers "where am
 * I?" at a glance instead of asking you to count dots.
 */
const Journey = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  /* One landmark per city — what you would actually see when you arrived. */
  const LANDMARK = { a1:"🗼", a2:"⚓", a3:"🗿", a4:"🗻", a5:"🏯",
                     a6:"⛩", a7:"🍢", a8:"🕊", a9:"🍜", a10:"❄️" };

  function render() {
    const lang = App.lang();
    const cur = Engine.currentIndex();
    const total = GRAMMAR.length;
    const root = document.getElementById("map-scroll");
    const season = Season.current();
    const pct = Math.round(Math.min(cur, total) / total * 100);
    const here = cur < total ? GRAMMAR[cur] : null;
    const hereArc = here ? ARCS.find(a => a.id === here.arc) : null;

    let html = `
    <div class="j-head">
      <div class="j-season">${season.motif} ${esc(Season.label(lang))}</div>
      <div class="j-where">${hereArc
        ? `<span class="j-mark">${LANDMARK[hereArc.id]}</span>
           <span class="j-city">${esc(hereArc.jp)}</span>
           <span class="j-city-fr">${esc(hereArc.city[lang])}</span>`
        : `<span class="j-mark">🎌</span><span class="j-city">${esc(App.t("j_done"))}</span>`}</div>
      <div class="j-bar"><i style="width:${pct}%"></i></div>
      <div class="j-pct">${esc(App.t("j_progress").replace("{a}", Math.min(cur, total)).replace("{b}", total))}</div>
    </div>
    <div class="stamp-row">${ARCS.map(a =>
      Exam.stampHtml(a.id, Engine.hasStamp(a.id))).join("")}
      <div class="stamp-count">${esc(App.t("stamps_n")
        .replace("{a}", Engine.stampCount()).replace("{b}", ARCS.length))}</div></div>`;

    let gi = 0;
    for (const arc of ARCS) {
      const points = GRAMMAR.filter(g => g.arc === arc.id);
      const startIdx = gi;
      const arcUnlocked = startIdx <= cur;
      const doneCount = points.filter(g => Engine.point(g.id).tier >= 1).length;
      // how far down this arc's rail the traveller has come, as a percentage
      const travelled = Math.max(0, Math.min(points.length, cur - startIdx));
      const railPct = Math.round(travelled / points.length * 100);
      html += `<div class="arc ${arcUnlocked ? "" : "arc-locked"}">
        <div class="arc-head">
          <span class="arc-mark">${LANDMARK[arc.id]}</span>
          <span class="arc-jp">${esc(arc.jp)}</span>
          <span class="arc-name">${esc(arc.city[lang])} — ${esc(arc.name[lang])}</span>
          <span class="arc-count">${doneCount}/${points.length}</span></div>
        <div class="stations" style="--rail:${railPct}%">`;
      for (const g of points) {
        const i = gi++;
        const p = Engine.point(g.id);
        const mp = Engine.masteryProgress(g.id);
        const isHere = i === cur;
        const cls = p.tier >= 1 ? "done" : isHere ? "cur" : i < cur ? "" : "locked";
        const rank = p.tier === 2 ? "🎖" : p.tier === 1 ? "🏅" : isHere ? "📍" : i < cur ? "○" : "🔒";
        const bar = (i <= cur && p.tier === 0 && p.enc > 0)
          ? `<div class="mbar"><i style="width:${Math.round(mp.pct * 100)}%"></i></div>` : "";
        const dlg = Engine.dialoguesFor(g.id).length;
        html += `<div class="station ${cls}" ${i <= cur ? `data-gp="${g.id}"` : ""}>
          <div class="dot"></div>
          ${isHere ? `<div class="traveller" aria-hidden="true">🚶</div>` : ""}
          <div class="st-card"><div class="st-rank">${rank}</div>
          <div class="st-main"><div class="st-pat">${esc(g.pat)}</div>
          <div class="st-name">${esc(g.name[lang])}${dlg && i <= cur ? ` <span class="st-dlg">💬${dlg}</span>` : ""}</div>${bar}</div></div></div>`;
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

    // bring the traveller into view rather than dumping you at the top of Japan
    const me = root.querySelector(".station.cur");
    if (me) setTimeout(() => me.scrollIntoView({ block: "center", behavior: "auto" }), 30);
  }

  return { render, LANDMARK };
})();
