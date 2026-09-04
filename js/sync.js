/* Kakibun — progress sync.
 *
 * The problem it solves: Kakibun lives on the phone, KakiBridge runs on the PC,
 * and shuttling a JSON file between them by hand after every session is not a
 * plan anybody keeps up.
 *
 * The channel is deliberately dumb — two named boxes behind one URL:
 *
 *   POST <base>/progress   body = {"data": <kakibun save>}     written by Kakibun
 *   GET  <base>/progress                                        read   by KakiBridge
 *   POST <base>/mined      body = {"data": <mined words>}       written by KakiBridge
 *   GET  <base>/mined                                           read   by Kakibun
 *
 * Each box has exactly ONE writer, so there is nothing to merge and no conflict
 * to resolve — that is the whole reason it is split in two.
 *
 * The base URL carries its own secret (…/s/<random>) and is typed into Settings
 * on the device, never committed to the repo, so nothing sensitive ships with
 * the app. Requests use text/plain bodies so they stay CORS-"simple" and skip
 * the preflight, which is one less thing to go wrong on a phone network.
 */
const Sync = (() => {
  const TIMEOUT = 12000;
  const DEBOUNCE = 4000;
  let pushTimer = null, busy = false;

  const cfg = () => Engine.state().sync || {};
  const configured = () => !!(cfg().url || "").trim();
  const base = () => (cfg().url || "").trim().replace(/\/+$/, "");

  /* The payload the relay stores, and the string we hash to decide whether it
   * is worth storing again. exportSave() stamps a fresh `date` on every call,
   * so hashing the envelope would make every save look new and re-upload the
   * whole thing on every trigger — the hash is over the state alone. The sync
   * block is stripped because the relay URL is per-device and has no business
   * travelling to the PC and back. */
  function payload() {
    const p = Engine.exportSave();
    if (p.state && p.state.sync) delete p.state.sync;
    return p;
  }
  const stateHash = (p) => hash(JSON.stringify(p.state));

  /* cheap change detector, so an unchanged save is never re-uploaded */
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return String(h >>> 0);
  }

  function withTimeout(promise, ms) {
    return new Promise((res, rej) => {
      const t = setTimeout(() => rej(new Error("timeout")), ms);
      promise.then(v => { clearTimeout(t); res(v); }, e => { clearTimeout(t); rej(e); });
    });
  }

  async function call(box, body) {
    if (!configured()) throw new Error("not configured");
    const url = base() + "/" + box;
    const opts = body === undefined
      ? { method: "GET", cache: "no-store" }
      : { method: "POST", cache: "no-store",
          // text/plain keeps this a "simple" request: no CORS preflight
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify(body) };
    const r = await withTimeout(fetch(url, opts), TIMEOUT);
    if (r.status === 404) return null;
    if (!r.ok) throw new Error("HTTP " + r.status);
    const text = await r.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch (e) { throw new Error("bad response"); }
  }

  function note(patch) {
    Object.assign(Engine.state().sync, patch);
    Engine.save();
  }

  /* ---------- push: our save goes up ---------- */
  async function push(force) {
    if (!configured() || busy) return false;
    const p = payload();
    const h = stateHash(p);
    if (!force && h === cfg().pushedHash) return false;   // nothing changed
    busy = true;
    try {
      await call("progress", { data: p });
      note({ lastPush: Date.now(), pushedHash: h, lastErr: "" });
      return true;
    } catch (e) {
      note({ lastErr: String(e.message || e) });
      return false;
    } finally { busy = false; }
  }

  /* last-gasp variant for pagehide: no promise to await, no state to write */
  function beacon() {
    if (!configured() || !navigator.sendBeacon) return false;
    const p = payload();
    // same hash basis as push(), so "nothing changed" means the same thing here
    if (stateHash(p) === cfg().pushedHash) return false;
    try {
      return navigator.sendBeacon(base() + "/progress",
        new Blob([JSON.stringify({ data: p })], { type: "text/plain;charset=UTF-8" }));
    } catch (e) { return false; }
  }

  const pushSoon = () => {
    if (!configured() || !cfg().auto) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(false), DEBOUNCE);
  };

  /* Hand freshly pulled words to the "Mots des jeux" panel, so the relay makes
   * the file import unnecessary rather than merely convenient. games.js only
   * exposes importFile(File), which is fine — wrapping the payload in a File
   * costs nothing and means that file stays byte-identical to KakiBridge's copy
   * instead of being forked for one extra entry point. */
  function feedGames(data) {
    if (typeof Games === "undefined" || typeof File === "undefined") return;
    const words = Array.isArray(data) ? data : (data && data.words);
    if (!Array.isArray(words) || !words.length) return;
    try {
      const f = new File([JSON.stringify({ words })], "mined.json", { type: "application/json" });
      Games.importFile(f, () => { try { Games.mount(); } catch (e) {} });
    } catch (e) { /* panel absent or storage full — the manual import still works */ }
  }

  /* ---------- pull: mined words come down ---------- */
  async function pull() {
    if (!configured() || busy) return false;
    busy = true;
    try {
      const got = await call("mined");
      const data = got && (got.data !== undefined ? got.data : got);
      let changed = false;
      if (data) {
        const before = JSON.stringify(Engine.state().mined);
        if (JSON.stringify(data) !== before) {
          Engine.state().mined = data;
          changed = true;
          feedGames(data);
        }
      }
      note({ lastPull: Date.now(), lastErr: "" });
      return changed;
    } catch (e) {
      note({ lastErr: String(e.message || e) });
      return false;
    } finally { busy = false; }
  }

  /* both directions, for the Settings button and for boot */
  async function syncNow(force) {
    const up = await push(force);
    const down = await pull();
    return { up, down };
  }

  /* ---------- lifecycle ---------- */
  const auto = () => configured() && cfg().auto !== false;

  function start() {
    // Listeners are registered unconditionally: the relay address can be typed
    // into Settings at any point, and it would be a poor surprise if sync only
    // woke up after a restart. Every handler re-checks.
    if (auto()) setTimeout(() => syncNow(false), 1500);
    document.addEventListener("visibilitychange", () => {
      if (!auto()) return;
      if (document.hidden) push(false);        // leaving: get the save out
      else pull();                             // coming back: collect anything new
    });
    window.addEventListener("focus", () => { if (auto()) pull(); });
    // A phone can be killed outright from the app switcher, and an in-flight
    // fetch dies with the page — sendBeacon is handed to the browser to deliver
    // after we're gone. Fire-and-forget, so it can't update lastPush.
    window.addEventListener("pagehide", () => { if (auto()) beacon(); });
  }

  const status = () => {
    const c = cfg();
    return { configured: configured(), auto: !!c.auto, lastPush: c.lastPush || 0,
             lastPull: c.lastPull || 0, err: c.lastErr || "", busy };
  };

  return { start, push, pull, syncNow, pushSoon, beacon, status, configured };
})();
