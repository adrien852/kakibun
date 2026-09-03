/* Kakibun — app shell: nav, home, i18n, boot. */
const APP_VERSION = "1.2.0"; // keep in sync with sw.js VERSION
const App = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const $ = (id) => document.getElementById(id);

  const lang = () => Engine.state().settings.lang;
  const t = (key) => (I18N[lang()] && I18N[lang()][key] !== undefined) ? I18N[lang()][key] : key;
  const pickOk = () => { const v = t("ok_variants"); return v[Math.floor(Math.random() * v.length)]; };

  /* ---------- navigation ---------- */
  function nav(to) {
    ["home", "map", "strengthen", "library", "settings"].forEach(id => { $(id).hidden = id !== to; });
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("on", b.dataset.nav === to));
    WordPop.hide();
    if (to === "home") renderHome();
    if (to === "map") Journey.render();
    if (to === "strengthen") Strengthen.render();
    if (to === "library") Library.render();
    if (to === "settings") Settings.render();
  }

  function applyLang() {
    $("nav-home").textContent = t("nav_home");
    $("nav-map").textContent = t("nav_map");
    $("nav-strengthen").textContent = t("nav_strengthen");
    $("nav-library").textContent = t("nav_library");
    $("nav-settings").textContent = t("nav_settings");
    $("map-title").textContent = t("map_title");
    $("str-title").textContent = t("str_title");
    $("lib-title").textContent = t("lib_title");
    $("set-title").textContent = t("set_title");
    renderHome();
  }

  /* ---------- home ---------- */
  function renderHome() {
    const st = Engine.stats();
    const L = lang();
    const streak = Engine.streak();
    $("streak-pill").hidden = streak < 2;
    $("streak-n").textContent = streak;

    $("hero-title").textContent = t("hero_hello");
    $("hero-sub").textContent = t("hero_sub");
    const cur = st.cur;
    if (cur < GRAMMAR.length) {
      const g = GRAMMAR[cur];
      const arc = ARCS.find(a => a.id === g.arc);
      $("hero-station").innerHTML = `<span class="st-jp">${esc(arc.jp)}</span> · ${esc(g.pat)}<br>
        <span style="font-size:.85rem;color:var(--ink2)">${esc(g.name[L])}</span>`;
    } else {
      $("hero-station").innerHTML = `<span class="st-jp">🎌</span>`;
    }
    const due = Engine.duePoints();
    $("go-session").textContent = due.length && cur >= GRAMMAR.length ? t("hero_review") : t("hero_start");
    $("hero-day").textContent = "";

    $("stat-points").textContent = st.started;
    $("stat-mastered").textContent = st.solid ? `${st.mastered}·${st.solid}🎖` : st.mastered;
    $("stat-sentences").textContent = st.unlockedSent;
    $("stat-kanji").textContent = Bridge.hasInfo() ? Bridge.learnedCount() : "—";
    $("stat-points-l").textContent = t("stat_points");
    $("stat-mastered-l").textContent = t("stat_mastered");
    $("stat-sentences-l").textContent = t("stat_sentences");
    $("stat-kanji-l").textContent = t("stat_kanji");

    // due list
    const dueCard = $("due-card");
    if (due.length) {
      dueCard.hidden = false;
      $("due-title").textContent = t("due_title");
      $("due-list").innerHTML = due.slice(0, 6).map(g =>
        `<div class="due-row" data-gp="${g.id}"><div class="due-jp">${esc(g.pat)}</div>
        <div class="due-name">${esc(g.name[L])}</div><div>›</div></div>`).join("");
      $("due-list").querySelectorAll(".due-row").forEach(el =>
        el.addEventListener("click", () => Session.practice(el.dataset.gp)));
    } else dueCard.hidden = true;

    // new kanji arrived from Kakikana → offer to practise them in known grammar
    const nk = Engine.newKanji();
    const nkCard = $("newkanji-card");
    if (nk.length) {
      const lit = Engine.sentencesWith(nk, true).length;
      nkCard.hidden = false;
      $("newkanji-title").textContent = t("newkanji_title");
      $("newkanji-chars").textContent = nk.slice(0, 12).join(" ");
      // Nothing to drill yet if these kanji only appear in grammar he hasn't
      // reached — say so plainly instead of offering an empty session.
      $("newkanji-body").textContent = lit
        ? t("newkanji_body").replace("{n}", lit)
        : t("newkanji_soon");
      $("newkanji-go").textContent = t("newkanji_go");
      $("newkanji-go").hidden = lit === 0;
      $("newkanji-later").textContent = lit ? t("newkanji_later") : t("newkanji_ok");
    } else nkCard.hidden = true;

    // Kakikana banner
    const banner = $("kakikana-banner");
    if (Bridge.hasInfo()) {
      banner.hidden = false;
      $("kakikana-banner-txt").textContent = t("banner_linked").replace("{n}", Bridge.learnedCount());
      $("kakikana-import-btn").hidden = true;
    } else {
      banner.hidden = false;
      $("kakikana-banner-txt").textContent = t("banner_no_kakikana");
      const btn = $("kakikana-import-btn");
      btn.hidden = false;
      btn.textContent = t("banner_import");
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

  /* ---------- import ---------- */
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

  /* ---------- backup ---------- */
  function exportSave() {
    try {
      const blob = new Blob([JSON.stringify(Engine.exportSave(), null, 1)],
                            { type: "application/json" });
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
    applyLang();
    document.querySelectorAll(".nav-btn").forEach(b =>
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
      }
    };
    document.addEventListener("visibilitychange", recheck);
    window.addEventListener("focus", recheck);

    renderHome();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", boot);

  return { t, lang, pickOk, nav, renderHome, applyLang, toast, toastMaster,
           exportSave, VERSION: APP_VERSION };
})();
