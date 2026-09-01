/* Kakibun — app shell: nav, home, i18n, boot. */
const APP_VERSION = "1.0.0"; // keep in sync with sw.js VERSION
const App = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const $ = (id) => document.getElementById(id);

  const lang = () => Engine.state().settings.lang;
  const t = (key) => (I18N[lang()] && I18N[lang()][key] !== undefined) ? I18N[lang()][key] : key;
  const pickOk = () => { const v = t("ok_variants"); return v[Math.floor(Math.random() * v.length)]; };

  /* ---------- navigation ---------- */
  function nav(to) {
    ["home", "map", "library", "settings"].forEach(id => { $(id).hidden = id !== to; });
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("on", b.dataset.nav === to));
    WordPop.hide();
    if (to === "home") renderHome();
    if (to === "map") Journey.render();
    if (to === "library") Library.render();
    if (to === "settings") Settings.render();
  }

  function applyLang() {
    $("nav-home").textContent = t("nav_home");
    $("nav-map").textContent = t("nav_map");
    $("nav-library").textContent = t("nav_library");
    $("nav-settings").textContent = t("nav_settings");
    $("map-title").textContent = t("map_title");
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
    $("stat-mastered").textContent = st.mastered;
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
    renderHome();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  document.addEventListener("DOMContentLoaded", boot);

  return { t, lang, pickOk, nav, renderHome, applyLang, toast, toastMaster, VERSION: APP_VERSION };
})();
