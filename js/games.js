/* games.js — "Mots des jeux" for Kakibun.
 *
 * Reads mined/kakibun-import.json produced by KakiBridge and turns it into a
 * focus list: the kanji you actually meet while playing, ordered by how often
 * you met them. Self-mounting — it builds its own panel in Réglages and its
 * own CSS, so integrating it is one <script> tag plus one PRECACHE line.
 *
 * Storage keys (same origin as KakiKana, so KakiKana can read them too):
 *   kakibun.games.v1        the imported word list
 *   kakibridge.focus.v1     { kanji:[...], words:[...], date }  <- the focus list
 *
 * Public API:
 *   Games.focusKanji()      kanji ordered by game frequency, rarest-known first
 *   Games.focusWords()      full word records, most-seen first
 *   Games.isFocus(ch)       is this kanji on the focus list
 *   Games.count()           how many words are loaded
 */
const Games = (() => {
  'use strict';

  const KEY_WORDS = 'kakibun.games.v1';
  const KEY_FOCUS = 'kakibridge.focus.v1';

  const FALLBACK = {
    games_title: 'Mots des jeux',
    games_hint: 'Importe kakibun-import.json (dossier mined/ de KakiBridge).',
    games_import: 'Importer',
    games_clear: 'Vider',
    games_empty: 'Aucun mot importé pour le moment.',
    games_count: 'mots · ',
    games_kanji: 'kanji en priorité',
    games_focus_on: 'Prioriser ces kanji',
    games_focus_off: 'Priorité désactivée',
    games_seen: 'vus',
    games_new: 'nouveau',
    games_imported: 'Importé : ',
    games_bad: 'Fichier non reconnu.'
  };
  const tr = (k) => {
    try { if (typeof t === 'function') { const v = t(k); if (v && v !== k) return v; } } catch (e) {}
    return FALLBACK[k] || k;
  };

  const RE_KANJI = /[一-龯㐀-䶿]/g;

  let words = [];
  let focusOn = false;

  /* ------------------------------------------------------------- storage */

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY_WORDS) || 'null');
      words = (raw && Array.isArray(raw.words)) ? raw.words : [];
    } catch (e) { words = []; }
    try {
      const f = JSON.parse(localStorage.getItem(KEY_FOCUS) || 'null');
      focusOn = !!(f && f.on);
    } catch (e) { focusOn = false; }
    return words;
  }

  function persist() {
    try {
      localStorage.setItem(KEY_WORDS, JSON.stringify({ app: 'kakibun.games', v: 1, date: new Date().toISOString(), words }));
    } catch (e) { console.warn('games: could not save', e); }
    writeFocus();
  }

  // The focus list is deliberately a separate, tiny key so KakiKana can read it
  // without parsing the whole word list.
  function writeFocus() {
    try {
      localStorage.setItem(KEY_FOCUS, JSON.stringify({
        app: 'kakibridge', v: 1, on: focusOn, date: new Date().toISOString(),
        kanji: focusKanji(), words: words.slice(0, 200).map(w => w.w)
      }));
    } catch (e) {}
  }

  /* --------------------------------------------------------------- model */

  // Kanji ordered by total game frequency. A kanji met in three different
  // words counts three times over, which is what you want: it is the kanji
  // that keeps blocking you, not the single word.
  function focusKanji() {
    const score = new Map();
    for (const w of words) {
      const ks = Array.isArray(w.kanji) && w.kanji.length ? w.kanji : (String(w.w || '').match(RE_KANJI) || []);
      const n = Math.max(1, Number(w.seen) || 1);
      for (const c of new Set(ks)) score.set(c, (score.get(c) || 0) + n);
    }
    return Array.from(score.entries()).sort((a, b) => b[1] - a[1]).map(e => e[0]);
  }

  function focusWords() {
    return words.slice().sort((a, b) => (Number(b.seen) || 0) - (Number(a.seen) || 0));
  }

  function isFocus(ch) { return focusOn && focusKanji().indexOf(ch) !== -1; }

  function merge(incoming) {
    const by = new Map(words.map(w => [w.w, w]));
    let added = 0;
    for (const w of incoming) {
      if (!w || !w.w) continue;
      const prev = by.get(w.w);
      if (prev) {
        prev.seen = Math.max(Number(prev.seen) || 0, Number(w.seen) || 0);
        if (w.r && !prev.r) prev.r = w.r;
        if (w.s && !prev.s) prev.s = w.s;
        if (Array.isArray(w.g) && w.g.length) prev.g = Array.from(new Set((prev.g || []).concat(w.g))).slice(0, 8);
        if (w.game && !prev.game) prev.game = w.game;
      } else { by.set(w.w, Object.assign({}, w)); added++; }
    }
    words = Array.from(by.values());
    persist();
    return added;
  }

  function importFile(file, done) {
    const rd = new FileReader();
    rd.onload = () => {
      let obj = null;
      try { obj = JSON.parse(rd.result); } catch (e) {}
      if (!obj || !Array.isArray(obj.words)) { done({ ok: false, msg: tr('games_bad') }); return; }
      const added = merge(obj.words);
      done({ ok: true, added, total: words.length });
    };
    rd.onerror = () => done({ ok: false, msg: tr('games_bad') });
    rd.readAsText(file);
  }

  function clear() {
    words = []; focusOn = false;
    try { localStorage.removeItem(KEY_WORDS); localStorage.removeItem(KEY_FOCUS); } catch (e) {}
  }

  /* ------------------------------------------------------------------ ui */

  const CSS = `
.games-panel{margin-top:18px}
.games-panel .games-head{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap}
.games-panel .games-sub{font-size:.82em;opacity:.7}
.games-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.games-kanji{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}
.games-kanji span{font-size:1.35em;line-height:1;padding:6px 9px;border-radius:8px;background:rgba(127,127,127,.13)}
.games-kanji span.gk-on{background:#e8b84b;color:#1c1a17}
.games-list{max-height:320px;overflow:auto;margin-top:8px}
.games-row{display:flex;align-items:baseline;gap:10px;padding:7px 2px;border-bottom:1px solid rgba(127,127,127,.18)}
.games-row .gw{font-size:1.12em}
.games-row .gr{font-size:.8em;opacity:.65}
.games-row .gg{flex:1;font-size:.85em;opacity:.8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.games-row .gn{font-size:.78em;opacity:.6;font-variant-numeric:tabular-nums}
.games-row .gnew{font-size:.7em;padding:1px 6px;border-radius:99px;background:#e8b84b;color:#1c1a17}
.games-msg{font-size:.85em;margin-top:8px;opacity:.85}
`;

  function injectCss() {
    if (document.getElementById('games-css')) return;
    const s = document.createElement('style');
    s.id = 'games-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  function render(root) {
    const kanji = focusKanji();
    const list = focusWords();
    root.innerHTML =
      '<div class="games-head"><h3 style="margin:0">' + esc(tr('games_title')) + '</h3>' +
      '<span class="games-sub">' + list.length + ' ' + esc(tr('games_count')) + kanji.length + ' ' + esc(tr('games_kanji')) + '</span></div>' +
      '<p class="games-sub" style="margin:6px 0 0">' + esc(tr('games_hint')) + '</p>' +
      '<div class="games-actions">' +
        '<input type="file" id="games-file" accept="application/json,.json" style="display:none">' +
        '<button type="button" id="games-import">' + esc(tr('games_import')) + '</button>' +
        '<button type="button" id="games-focus">' + esc(focusOn ? tr('games_focus_off') : tr('games_focus_on')) + '</button>' +
        '<button type="button" id="games-clear">' + esc(tr('games_clear')) + '</button>' +
      '</div>' +
      (kanji.length ? '<div class="games-kanji">' + kanji.slice(0, 40).map(c => '<span class="' + (focusOn ? 'gk-on' : '') + '">' + esc(c) + '</span>').join('') + '</div>' : '') +
      (list.length
        ? '<div class="games-list">' + list.slice(0, 150).map(w =>
            '<div class="games-row"><span class="gw">' + esc(w.w) + '</span>' +
            (w.r ? '<span class="gr">' + esc(w.r) + '</span>' : '') +
            '<span class="gg">' + esc((w.g || []).join(' ; ')) + '</span>' +
            (Array.isArray(w.new) && w.new.length ? '<span class="gnew">' + esc(tr('games_new')) + '</span>' : '') +
            '<span class="gn">' + (w.seen || 0) + ' ' + esc(tr('games_seen')) + '</span></div>').join('') + '</div>'
        : '<p class="games-msg">' + esc(tr('games_empty')) + '</p>') +
      '<p class="games-msg" id="games-msg"></p>';

    const file = root.querySelector('#games-file');
    root.querySelector('#games-import').onclick = () => file.click();
    file.onchange = () => {
      if (!file.files || !file.files[0]) return;
      importFile(file.files[0], (r) => {
        render(root);
        const m = root.querySelector('#games-msg');
        if (m) m.textContent = r.ok ? (tr('games_imported') + r.added + ' / ' + r.total) : r.msg;
      });
    };
    root.querySelector('#games-focus').onclick = () => { focusOn = !focusOn; writeFocus(); render(root); };
    root.querySelector('#games-clear').onclick = () => { clear(); render(root); };
  }

  // Find the settings screen without needing to know its exact markup.
  function mountPoint() {
    const sels = ['#settings-extra', '#screen-settings', '#settings', '[data-screen="settings"]', '#view-settings', '.settings'];
    for (const s of sels) { const el = document.querySelector(s); if (el) return el; }
    return null;
  }

  function mount() {
    injectCss();
    load();
    const host = mountPoint();
    if (!host) return false;
    let root = document.getElementById('games-panel');
    if (!root) {
      root = document.createElement('section');
      root.id = 'games-panel';
      root.className = 'games-panel';
      host.appendChild(root);
    }
    render(root);
    return true;
  }

  function init() {
    if (mount()) return;
    // Settings screen may be built lazily — retry a few times, then give up quietly.
    let tries = 0;
    const iv = setInterval(() => { if (mount() || ++tries > 40) clearInterval(iv); }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return { init, mount, load, focusKanji, focusWords, isFocus, clear, importFile,
           count: () => words.length, isOn: () => focusOn,
           setOn: (v) => { focusOn = !!v; writeFocus(); } };
})();
