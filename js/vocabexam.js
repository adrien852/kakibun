/* Kakibun — 語彙テスト the vocabulary exam.
 *
 * Every other exam in this app tests a grammar point over a sentence. This one
 * tests words, and its corpus is not "the curriculum" but "what you have
 * actually met" — see Engine.metWords(): the words in sentences you have
 * answered a card about, plus every member of every list you have practised.
 * A word the journey has unlocked but never once shown you is not on it.
 *
 * Three ways of asking, one per word, rotating:
 *   v_mean   Japanese on screen → which translation?      (do you know it)
 *   v_write  translation on screen → say or type it in JP (can you produce it)
 *   v_say    the characters on screen → read them aloud   (can you pronounce it)
 *
 * No stamp, no demotion, nothing promoted: this is a measurement, not a stop on
 * the journey. It records the run so the score can be compared with the last
 * one, and that is all it touches.
 */
const VocabExam = (() => {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const $ = (id) => document.getElementById(id);

  const DEFAULT_N = 25;
  const SIZES = [10, 25, 50, 0];          // 0 = every word met
  const KINDS = ["v_mean", "v_write", "v_say"];

  const available = () => Engine.metWords().length;

  /* The chosen size, remembered — it is a preference, not a per-run decision. */
  function size() {
    const n = Engine.state().settings.vxSize;
    return n === undefined ? DEFAULT_N : n;
  }
  function setSize(n) {
    Engine.state().settings.vxSize = n;
    Engine.save();
  }

  /* How many questions a run of the chosen size would actually hold: 0 means
   * everything, and there may simply be fewer words than that. */
  function length(n) {
    const pool = available();
    const want = (n === undefined ? size() : n) || pool;
    return Math.max(0, Math.min(want, pool));
  }

  function build(n) {
    Engine.load();
    const want = length(n);
    if (!want) return [];
    const words = Engine.pickMet(want);
    const pool = Engine.metWords();
    /* v_say is only worth asking of a word with characters to read; a kana word
     * would just be "read this kana", which is KakiKana's job and not ours. */
    return words.map((w, i) => {
      let kind = KINDS[i % KINDS.length];
      if (kind === "v_say" && !w.k) kind = "v_write";
      const item = { kind, w, gp: "V:" + w.id, vocabExam: true };
      if (kind === "v_mean") {
        /* the distractors are other words you have met — a gloss you have never
           seen is not a distractor, it is a giveaway */
        item.others = pool.filter(x => x.id !== w.id && x.fr !== w.fr)
          .sort(() => Math.random() - 0.5).slice(0, 3);
      }
      return item;
    }).sort(() => Math.random() - 0.5);
  }

  /* ---------- the result ----------
   * An exam hides the answer while it runs, so this is the first chance to see
   * what the missed words actually were. That list is the point of the screen. */
  function finish(results, opts) {
    const lang = App.lang();
    const total = results.length;
    const score = results.filter(r => r.ok).length;
    const pct = Math.round(score / Math.max(1, total) * 100);
    const passed = pct >= Math.round(Engine.EXAM_PASS * 100);
    if (passed) Sfx.master(); else Sfx.bad();

    const prev = Engine.lastVocabExam();
    Engine.recordVocabExam(score, total);
    Engine.noteSession();

    const missRows = results.filter(r => !r.ok && r.w).map(r =>
      `<div class="res-row"><span>${esc(r.w.k || r.w.r)}${r.w.k
          ? ` <b class="ord-r">${esc(r.w.r)}</b>` : ""}</span>
        <b style="font-weight:400;color:rgba(255,255,255,.7)">${esc(r.w[lang])}</b></div>`).join("");

    /* against last time, in the same units — a vocabulary score only means
       something next to another one */
    const deltaRow = prev ? `<div class="res-row"><span>${esc(App.t("vx_last"))}</span
      ><b>${Math.round(prev.score / Math.max(1, prev.total) * 100)} %${
        pct > Math.round(prev.score / Math.max(1, prev.total) * 100) ? " ↑" : ""}</b></div>` : "";

    $("sess-kind").textContent = App.t("vx_title");
    $("sess-body").innerHTML = `
      <div class="res-score">${score}<small>/${total}</small></div>
      <div class="res-line">${esc(passed ? App.t("vx_good") : App.t("vx_again"))}</div>
      <div class="res-card">
        <div class="res-row"><span>${esc(App.t("vx_tested"))}</span><b class="accent">${pct} %</b></div>
        ${deltaRow}
        <div class="res-row"><span>${esc(App.t("vx_pool"))}</span><b>${available()}</b></div>
      </div>
      ${missRows ? `<div class="res-card"><div class="eyebrow">${esc(App.t("vx_missed"))}</div>
        ${missRows}</div>` : ""}`;
    $("sess-foot").innerHTML =
      `<button class="btn-primary finish" id="vx-done">${esc(App.t("back"))}</button>`;
    $("vx-done").addEventListener("click", () => Session.close());
  }

  /* ---------- the launcher, shown in Renforcer ---------- */
  function cardHtml() {
    const pool = available();
    const n = size();
    return `<section class="card" id="vx-card">
      <div class="mis-head">
        <span class="eyebrow">${esc(App.t("vx_title"))}</span>
        <span class="eyebrow-n">${pool}</span>
      </div>
      <div class="sess-sub" style="margin-top:6px;line-height:1.5">${esc(
        pool ? App.t("vx_d").replace("{n}", pool) : App.t("vx_empty"))}</div>
      ${pool ? `<div class="vx-sizes" id="vx-sizes">${SIZES.map(s =>
        `<button class="vx-size ${s === n ? "on" : ""}" data-n="${s}"
          >${s ? s : esc(App.t("vx_all"))}</button>`).join("")}</div>
        <button class="btn-primary sm" id="vx-go" style="margin-top:12px"
          >${esc(App.t("vx_go").replace("{n}", length()))}</button>` : ""}
    </section>`;
  }

  function bind(root) {
    const card = (root || document).querySelector("#vx-card");
    if (!card) return;
    card.querySelectorAll(".vx-size").forEach(b => b.addEventListener("click", () => {
      setSize(+b.dataset.n);
      Sfx.tap();
      Strengthen.render();
    }));
    const go = card.querySelector("#vx-go");
    if (go) go.addEventListener("click", () => Session.vocabExam(size(), "strengthen"));
  }

  return { build, finish, cardHtml, bind, size, setSize, length, available, SIZES, DEFAULT_N };
})();
if (typeof module !== "undefined") module.exports = { VocabExam };
