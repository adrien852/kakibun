/* Kakibun — app shell: the landscape, navigation, home, i18n, boot. */
const APP_VERSION = "3.2.0"; // keep in sync with sw.js VERSION
const App = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const $ = (id) => document.getElementById(id);

  const SCREENS = ["home", "journey", "strengthen", "library", "settings"];

  const lang = () => Engine.state().settings.lang;
  const t = (key) => (I18N[lang()] && I18N[lang()][key] !== undefined) ? I18N[lang()][key] : key;
  const pickOk = () => { const v = t("ok_variants"); return v[Math.floor(Math.random() * v.length)]; };
  /* Kakikana stamps its export with an ISO date; show the day, never the clock */
  const fmtDate = (d) => {
    if (!d) return t("set_link_undated");
    const dt = new Date(d);
    return isNaN(dt) ? String(d).slice(0, 10)
      : dt.toLocaleDateString(lang() === "fr" ? "fr-FR" : "en-GB",
          { day: "numeric", month: "short", year: "numeric" });
  };

  /* ---------- navigation ----------
   * The landscape is a fixed sibling and is never touched here: moving between
   * screens should feel like turning around in one place. */
  function nav(to) {
    SCREENS.forEach(id => { $(id).hidden = id !== to; });
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("on", b.dataset.nav === to));
    WordPop.hide();
    Sfx.tap();
    if (to === "home") renderHome();
    if (to === "journey") Journey.render();
    if (to === "strengthen") Strengthen.render();
    if (to === "library") Library.render();
    if (to === "settings") Settings.render();
    const scr = $(to);
    if (scr) scr.scrollTop = 0;
  }

  function applyLang() {
    document.documentElement.lang = lang();
    $("nav-home").textContent = t("nav_home");
    $("nav-journey").textContent = t("nav_map");
    $("nav-strengthen").textContent = t("nav_strengthen");
    $("nav-library").textContent = t("nav_library");
    $("nav-settings").textContent = t("nav_settings");
    $("journey-title").textContent = t("map_title");
    $("str-title").textContent = t("str_title");
    $("str-sub").textContent = t("str_sub");
    $("lib-title").textContent = t("lib_title");
    $("set-title").textContent = t("set_title");
    renderHome();
  }

  /* ---------- home ---------- */
  function renderHome() {
    const st = Engine.stats();
    const L = lang();
    const S = Season.current();

    /* the status row: where you are, in what season, at what hour */
    const cur = st.cur;
    const hereArc = cur < GRAMMAR.length
      ? ARCS.find(a => a.id === GRAMMAR[cur].arc)
      : ARCS[ARCS.length - 1];
    $("status-place").textContent = `${S.jp} · ${Season.clock()} · ${hereArc.jp}`;
    const streak = Engine.streak();
    $("status-streak").hidden = streak < 2;
    $("status-streak").textContent = t("streak_days").replace("{n}", streak);

    /* the headline is the season word, and the poetic line names the place */
    $("head-season").textContent = S.head;
    $("head-poetic").textContent =
      Season.poetic(L).replace("Kyoto", hereArc.city[L]).replace("Kyoto", hereArc.city[L])
      + " — " + t("head_stop").replace("{n}", Math.min(cur + 1, GRAMMAR.length));

    /* the one obvious action */
    const due = Engine.duePoints();
    const sess = Engine.buildSession();
    const g = cur < GRAMMAR.length ? GRAMMAR[cur] : null;
    $("sess-eyebrow").textContent =
      t("daypart_" + Season.dayPart()) + " · " + t("n_cards").replace("{n}", sess.length);
    $("sess-pat").textContent = g ? g.pat : "🎌";
    $("sess-desc").textContent = (g ? g.name[L] : t("j_done"))
      + (due.length ? " · " + t("n_review").replace("{n}", due.length) : "");
    $("go-session").textContent = (due.length && cur >= GRAMMAR.length)
      ? t("hero_review") : t("hero_start");

    /* today's three missions */
    const mis = Engine.missions();
    const misCard = $("missions-card");
    misCard.hidden = !mis.length;
    if (mis.length) {
      const done = mis.filter(m => m.done).length;
      $("missions-title").textContent = t("missions_title");
      $("missions-count").textContent = done + "/" + mis.length;
      $("missions-list").innerHTML = mis.map(m => {
        // a mission that has just started still shows a sliver, so the row
        // reads as "begun" rather than "broken"
        const pct = m.n === 0 ? 5 : Math.round(m.n / m.target * 100);
        const col = m.done ? "var(--ok)" : "var(--accent)";
        return `<div><div class="mis-top">
            <span class="mis-label">${esc(t("mission_" + m.id).replace("{n}", m.target))}</span>
            <span class="eyebrow-n">${m.n}/${m.target}</span></div>
          <div class="mis-track"><i style="width:${pct}%;background:${col}"></i></div></div>`;
      }).join("");
    }

    /* three ways further in */
    $("stat-stops").innerHTML = `${cur}<small>/${GRAMMAR.length}</small>`;
    $("stat-stops-l").textContent = t("stat_stops");
    const weak = Engine.weakestPoints(40).filter(w => w.acc !== null && w.acc < 0.75).length;
    $("stat-weak").textContent = weak;
    $("stat-weak-l").textContent = t("stat_weak");
    $("stat-kanji").textContent = Bridge.hasInfo() ? Bridge.learnedCount() : Engine.learnedKanjiPool(true).length;
    $("stat-kanji-l").textContent = t("stat_kanji");

    /* new kanji arrived from Kakikana → offer to practise them in known grammar */
    const nk = Engine.newKanji();
    const nkCard = $("newkanji-card");
    nkCard.hidden = !nk.length;
    if (nk.length) {
      const lit = Engine.sentencesWith(nk, true).length;
      $("newkanji-title").textContent = t("newkanji_title");
      $("newkanji-chars").textContent = nk.slice(0, 12).join(" ");
      // nothing to drill yet if these kanji only appear in grammar he hasn't
      // reached — say so plainly instead of offering an empty session
      $("newkanji-body").textContent = lit ? t("newkanji_body").replace("{n}", lit) : t("newkanji_soon");
      $("newkanji-go").hidden = lit === 0;
      $("newkanji-go").textContent = t("newkanji_go");
      $("newkanji-later").textContent = lit ? t("newkanji_later") : t("newkanji_ok");
    }

    /* The Kakikana link. It shows while there is none — and, just as important,
     * while the link is only a file imported once: an old imported copy is
     * indistinguishable from a live link from the inside, so it has to say so
     * rather than quietly serving last month's kanji forever. Only the
     * same-origin localStorage read ("auto") updates by itself. */
    const banner = $("kakikana-banner");
    const link = Bridge.hasInfo() ? Bridge.importInfo() : null;
    const live = link && link.source === "auto";
    banner.hidden = !!live;
    if (!live) {
      $("kakikana-banner-txt").textContent = link
        ? t("banner_stale").replace("{d}", fmtDate(link.date))
        : t("banner_no_kakikana");
      $("kakikana-import-btn").textContent = t(link ? "banner_reimport" : "banner_import");
    }
  }

  /* ---------- toasts ---------- */
  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    $("toast-root").appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }
  function toastMaster(jp, label) {
    const el = document.createElement("div");
    el.className = "toast-master";
    el.innerHTML = `<div class="tm-jp">🏅 ${esc(jp)}</div><div class="tm-t">${esc(label)}</div>`;
    $("toast-root").appendChild(el);
    setTimeout(() => el.remove(), 2300);
  }

  /* ---------- import / backup ---------- */
  function handleImportFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (Bridge.importJSON(obj, Engine.state())) {
          Engine.save();
          toast(t("import_ok").replace("{n}", Bridge.learnedCount()));
          renderHome();
        } else toast(t("import_bad"));
      } catch (e) { toast(t("import_bad")); }
    };
    reader.readAsText(file);
  }

  function exportSave() {
    try {
      const blob = new Blob([JSON.stringify(Engine.exportSave(), null, 1)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kakibun-" + Engine.today() + ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
      toast(t("backup_ok"));
    } catch (e) { toast(t("restore_bad")); }
  }

  function handleRestoreFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let obj = null;
      try { obj = JSON.parse(reader.result); } catch (e) { return toast(t("restore_bad")); }
      if (!obj || obj.app !== "kakibun") return toast(t("restore_bad"));
      if (!confirm(t("restore_confirm"))) return;
      if (Engine.importSave(obj)) {
        Bridge.load(Engine.state());
        Engine.save();
        toast(t("restore_ok"));
        applyLang();
      } else toast(t("restore_bad"));
    };
    reader.readAsText(file);
  }

  /* ---------- boot ---------- */
  function boot() {
    Engine.load();
    Bridge.load(Engine.state());
    Engine.save();
    Scene.start();                       // sky, light, hills, particles
    applyLang();

    document.querySelectorAll("[data-nav]").forEach(b =>
      b.addEventListener("click", () => nav(b.dataset.nav)));
    $("go-session").addEventListener("click", () => Session.start());
    $("sess-quit").addEventListener("click", Session.close);
    $("kakikana-import-btn").addEventListener("click", () => $("import-file").click());
    $("import-file").addEventListener("change", (e) => {
      if (e.target.files[0]) handleImportFile(e.target.files[0]);
      e.target.value = "";
    });
    $("restore-file").addEventListener("change", (e) => {
      if (e.target.files[0]) handleRestoreFile(e.target.files[0]);
      e.target.value = "";
    });
    $("newkanji-go").addEventListener("click", () => Session.kanjiDebut(Engine.newKanji()));
    $("newkanji-later").addEventListener("click", () => { Engine.clearNewKanji(); renderHome(); });

    // Kakikana lives on the same origin, so its progress can change while this
    // app is merely backgrounded — re-read whenever we come back to the front.
    const recheck = () => {
      if (document.hidden) return;
      const r = Bridge.refresh(Engine.state());
      if (r.changed) {
        Engine.save();
        if (r.fresh.length) toast(t("import_ok").replace("{n}", Bridge.learnedCount()));
        if ($("session").hidden) renderHome();
      } else if ($("session").hidden && !$("home").hidden) {
        renderHome();                    // the clock in the status pill moves on
      }
    };
    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("focus", recheck);

    renderHome();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  document.addEventListener("DOMContentLoaded", boot);

  return { t, lang, pickOk, nav, renderHome, applyLang, toast, toastMaster, fmtDate,
           exportSave, esc, VERSION: APP_VERSION };
})();
