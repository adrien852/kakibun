/* Kakibun — 設定 réglages.
 *
 * Four switches, a language pair, and the save. Everything writes straight
 * through to the engine's settings and re-renders whatever is affected — the
 * furigana and all-kanji switches change how sentences read everywhere, so the
 * library and home have to be told.
 */
const Settings = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  /* `furi` is a three-way setting in the engine but only ever used as
   * "show readings or don't", so the switch maps to its two useful ends. */
  const SWITCHES = [
    { id: "sound",       label: "set_sound",    desc: "set_sound_d" },
    { id: "furi",        label: "set_furi",     desc: "set_furi_d",
      get: (s) => s.furi !== "none", set: (s, v) => { s.furi = v ? "new" : "none"; } },
    { id: "showAllKanji",label: "set_allkanji", desc: "set_allkanji_d" },
    { id: "voiceIn",     label: "set_voice",    desc: "set_voice_d" }
  ];

  function render() {
    const s = Engine.state().settings;
    const body = document.getElementById("set-body");

    const rows = SWITCHES.map(w => {
      const on = w.get ? w.get(s) : !!s[w.id];
      return `<div class="sw-row">
        <span class="sw-main">
          <span class="sw-label">${esc(App.t(w.label))}</span>
          <span class="sw-desc">${esc(App.t(w.desc))}</span>
        </span>
        <button class="sw ${on ? "on" : ""}" data-sw="${w.id}"
          role="switch" aria-checked="${on}"
          aria-label="${esc(App.t(w.label))}"><i></i></button>
      </div>`;
    }).join("");

    const kanjiLine = Bridge.hasInfo()
      ? App.t("set_foot_kanji").replace("{n}", Bridge.learnedCount())
      : App.t("set_foot_nokanji");

    /* Say plainly which of the two links is in force. "auto" is the same-origin
     * localStorage read and is the only one that keeps itself up to date; a
     * file imported once looks identical from the inside, so it has to be named. */
    const li = Bridge.hasInfo() ? Bridge.importInfo() : null;
    const linkLine = !li ? App.t("set_link_none")
      : App.t(li.source === "auto" ? "set_link_auto" : "set_link_file")
          .replace("{n}", li.n).replace("{d}", App.fmtDate(li.date));

    body.innerHTML = `
      <div class="sw-card">${rows}</div>

      <section class="set-card">
        <div class="eyebrow">${esc(App.t("set_lang_eyebrow"))}</div>
        <div class="seg">
          <button data-lang="fr" class="${s.lang === "fr" ? "on" : ""}">Français</button>
          <button data-lang="en" class="${s.lang === "en" ? "on" : ""}">English</button>
        </div>
      </section>

      <section class="set-card">
        <div class="eyebrow">${esc(App.t("set_link_eyebrow"))}</div>
        <div class="set-foot" style="margin-top:0">${esc(linkLine)}</div>
        ${li && li.source === "auto" ? "" :
          `<button class="btn-ghost" id="set-link-import">${esc(App.t(li ? "banner_reimport" : "banner_import"))}</button>`}
      </section>

      <section class="set-card">
        <div class="eyebrow">${esc(App.t("set_progress_eyebrow"))}</div>
        <button class="btn-primary" id="set-export">${esc(App.t("set_export_long"))}</button>
        <button class="btn-ghost" id="set-restore">${esc(App.t("set_restore_long"))}</button>
        <button class="btn-ghost" id="set-import">${esc(App.t("set_import_long"))}</button>
        <div class="set-foot">Kakibun v${App.VERSION} · ${esc(App.t("set_foot_offline"))} · ${esc(kanjiLine)}</div>
      </section>

      <section class="set-card" style="align-items:center">
        ${Mark.signature()}
      </section>

      <section class="set-card">
        <div class="eyebrow">${esc(App.t("set_danger"))}</div>
        <button class="btn-ghost" id="set-reset">${esc(App.t("set_reset"))}</button>
      </section>
      <div class="scr-pad"></div>`;

    body.querySelectorAll("[data-sw]").forEach(el =>
      el.addEventListener("click", () => {
        const w = SWITCHES.find(x => x.id === el.dataset.sw);
        const st = Engine.state().settings;
        if (w.set) w.set(st, !(w.get(st))); else st[w.id] = !st[w.id];
        Engine.save();
        Sfx.tap();
        render();
        App.renderHome();
      }));

    body.querySelectorAll("[data-lang]").forEach(el =>
      el.addEventListener("click", () => {
        Engine.state().settings.lang = el.dataset.lang;
        Engine.save();
        Sfx.tap();
        App.applyLang();
        render();
      }));

    document.getElementById("set-export").addEventListener("click", App.exportSave);
    document.getElementById("set-restore").addEventListener("click",
      () => document.getElementById("restore-file").click());
    document.getElementById("set-import").addEventListener("click",
      () => document.getElementById("import-file").click());
    const relink = document.getElementById("set-link-import");
    if (relink) relink.addEventListener("click",
      () => document.getElementById("import-file").click());
    document.getElementById("set-reset").addEventListener("click", () => {
      if (!confirm(App.t("set_reset_confirm"))) return;
      localStorage.removeItem("kakibun.state.v1");
      location.reload();
    });
  }

  return { render };
})();
