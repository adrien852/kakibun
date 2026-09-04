/* Kakibun — settings screen. */
const Settings = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

  function seg(id, options, value) {
    return `<div class="seg" id="${id}">` + options.map(o =>
      `<button data-v="${o.v}" class="${o.v === value ? "on" : ""}">${esc(o.l)}</button>`).join("") + `</div>`;
  }
  function sw(id, on) { return `<button class="switch ${on ? "on" : ""}" id="${id}"></button>`; }

  function render() {
    const s = Engine.state().settings;
    const body = document.getElementById("set-body");
    const kk = Bridge.importInfo();
    const kkLine = kk
      ? App.t("set_kakikana_d").replace("{n}", kk.n).replace("{d}", kk.date ? kk.date.slice(0, 10) : "—")
      : App.t("set_kakikana_none");

    body.innerHTML = `
    <div class="card">
      <div class="set-row"><div class="set-l">${esc(App.t("set_lang"))}</div>
        ${seg("set-lang", [{v:"fr",l:"Français"},{v:"en",l:"English"}], s.lang)}</div>
      <div class="set-row"><div><div class="set-l">${esc(App.t("set_furi"))}</div>
        <div class="set-d">${esc(App.t("set_furi_d"))}</div></div>
        ${seg("set-furi", [{v:"all",l:App.t("set_furi_all")},{v:"new",l:App.t("set_furi_new")},{v:"none",l:App.t("set_furi_none")}], s.furi)}</div>
      <div class="set-row"><div class="set-l">${esc(App.t("set_sound"))}</div>${sw("set-sound", s.sound)}</div>
      <div class="set-row"><div><div class="set-l">${esc(App.t("set_voice"))}</div>
        <div class="set-d">${esc(App.t("set_voice_d"))}</div></div>${sw("set-voicein", s.voiceIn)}</div>
      <div class="set-row"><div><div class="set-l">${esc(App.t("set_allkanji"))}</div>
        <div class="set-d">${esc(App.t("set_allkanji_d"))}</div></div>${sw("set-allkanji", s.showAllKanji)}</div>
    </div>
    <div class="card">
      <div class="set-row"><div><div class="set-l">${esc(App.t("set_backup"))}</div>
        <div class="set-d">${esc(App.t("set_backup_d"))}</div></div>
        <div style="display:flex;gap:6px">
          <button class="btn small" id="set-export">${esc(App.t("set_export"))}</button>
          <button class="btn small" id="set-restore">${esc(App.t("set_restore"))}</button>
        </div></div>
    </div>
    <div class="card">
      <div class="set-row"><div><div class="set-l">${esc(App.t("set_kakikana"))}</div>
        <div class="set-d">${esc(kkLine)}</div></div>
        <button class="btn small" id="set-import">${esc(App.t("set_import"))}</button></div>
    </div>
    <div class="card">
      <div class="set-row"><div class="set-l">${esc(App.t("set_version"))}</div><div class="set-d">${esc(App.VERSION)}</div></div>
      <div class="set-row"><div class="set-l" style="color:var(--red)">${esc(App.t("set_reset"))}</div>
        <button class="btn small" id="set-reset">🗑</button></div>
    </div>`;

    body.querySelectorAll("#set-lang button").forEach(b => b.addEventListener("click", () => {
      Engine.state().settings.lang = b.dataset.v; Engine.save(); App.applyLang(); render();
    }));
    body.querySelectorAll("#set-furi button").forEach(b => b.addEventListener("click", () => {
      Engine.state().settings.furi = b.dataset.v; Engine.save(); render();
    }));
    const toggle = (id, key) => document.getElementById(id).addEventListener("click", (e) => {
      Engine.state().settings[key] = !Engine.state().settings[key]; Engine.save();
      e.currentTarget.classList.toggle("on");
    });
    toggle("set-sound", "sound");
    toggle("set-voicein", "voiceIn");
    toggle("set-allkanji", "showAllKanji");
    document.getElementById("set-import").addEventListener("click", () =>
      document.getElementById("import-file").click());
    document.getElementById("set-export").addEventListener("click", () => App.exportSave());
    document.getElementById("set-restore").addEventListener("click", () =>
      document.getElementById("restore-file").click());
    document.getElementById("set-reset").addEventListener("click", () => {
      if (confirm(App.t("set_reset_confirm"))) {
        localStorage.removeItem("kakibun.state.v1");
        location.reload();
      }
    });
  }

  return { render };
})();
