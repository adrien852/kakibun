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

    const st = Sync.status();
    const sy = Engine.state().sync || {};
    // relative, because "envoyé il y a 2 min" is the thing you actually want to
    // know here, and a full timestamp wraps the line on a phone
    const when = (ts) => {
      if (!ts) return App.t("sync_never");
      const m = Math.floor((Date.now() - ts) / 60000);
      if (m < 1) return App.t("sync_justnow");
      if (m < 60) return App.t("sync_min").replace("{n}", m);
      const h = Math.floor(m / 60);
      if (h < 24) return App.t("sync_hour").replace("{n}", h);
      return App.t("sync_day").replace("{n}", Math.floor(h / 24));
    };
    const syncErr = st.configured && st.err;
    const syncLine = !st.configured ? App.t("sync_off")
      : syncErr ? App.t("sync_err").replace("{e}", st.err)
      : App.t("sync_state").replace("{up}", when(st.lastPush));

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
      <div class="set-col">
        <div class="set-l">${esc(App.t("sync_title"))}</div>
        <div class="set-d">${esc(App.t("sync_d"))}</div>
        <input class="set-inp" id="set-sync-url" type="url" inputmode="url"
               autocapitalize="off" autocorrect="off" spellcheck="false"
               placeholder="${esc(App.t("sync_url_ph"))}" value="${esc(sy.url || "")}">
        <div class="set-actions">
          <button class="btn small" id="set-sync-save">${esc(App.t("sync_save"))}</button>
          <button class="btn small" id="set-sync-now">${esc(App.t("sync_now"))}</button>
        </div>
        <div class="set-note${syncErr ? " bad" : ""}" id="set-sync-note">${esc(syncLine)}</div>
      </div>
      <div class="set-row"><div><div class="set-l">${esc(App.t("sync_auto"))}</div>
        <div class="set-d">${esc(App.t("sync_auto_d"))}</div></div>${sw("set-sync-auto", sy.auto)}</div>
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
    /* ---- sync ---- */
    const saveUrl = () => {
      const v = document.getElementById("set-sync-url").value.trim();
      // https only — with the one exception browsers make: http://localhost is a
      // trustworthy origin, so it isn't blocked as mixed content. A LAN address
      // like http://192.168.1.40 IS blocked, silently, so refuse it here where
      // the reason can be explained instead of leaving a dead setting behind.
      const ok = /^https:\/\/\S+$/i.test(v) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/\S*)?$/i.test(v);
      if (v && !ok) { App.toast(App.t("sync_bad_url")); return false; }
      const s = Engine.state().sync;
      if (s.url !== v) { s.url = v; s.pushedHash = ""; s.lastErr = ""; }
      Engine.save();
      return true;
    };
    document.getElementById("set-sync-save").addEventListener("click", () => {
      if (saveUrl()) { App.toast(App.t("sync_saved")); render(); }
    });
    document.getElementById("set-sync-now").addEventListener("click", async (e) => {
      if (!saveUrl()) return;
      if (!Sync.configured()) { App.toast(App.t("sync_off")); return; }
      const btn = e.currentTarget;
      btn.disabled = true;
      await Sync.syncNow(true);
      btn.disabled = false;
      App.toast(Sync.status().err ? App.t("sync_fail") : App.t("sync_ok"));
      render();
    });
    document.getElementById("set-sync-auto").addEventListener("click", (e) => {
      const s = Engine.state().sync;
      s.auto = !s.auto; Engine.save();
      e.currentTarget.classList.toggle("on");
    });

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
