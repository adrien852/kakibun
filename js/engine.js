/* Kakibun — engine: state, SRS, session builder, mastery, streak. */
const Engine = (() => {
  const KEY = "kakibun.state.v1";
  const BOX_DAYS = [0, 1, 2, 4, 7, 15, 30];
  const MASTERY_REPS = 5, MIN_DAYS = 3;
  const DAY = 86400000;

  let state = null;

  const defaults = () => ({
    v: 1,
    settings: { lang: "fr", furi: "new", sound: true, voiceIn: true, showAllKanji: false },
    points: {}, days: [], totals: { ex: 0, ok: 0 }, sentSeen: {}, bestCombo: 0,
    kakikana: null
  });

  function load() {
    try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { state = defaults(); }
    state.settings = Object.assign(defaults().settings, state.settings);
    return state;
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  const today = () => new Date().toISOString().slice(0, 10);

  function point(id) {
    if (!state.points[id]) state.points[id] = { enc: 0, box: 0, due: 0, reps: 0, days: [], mastered: false };
    return state.points[id];
  }

  // first grammar point not yet started = the "current stop"
  function currentIndex() {
    for (let i = 0; i < GRAMMAR.length; i++) if (point(GRAMMAR[i].id).enc === 0) return i;
    return GRAMMAR.length;
  }
  const isUnlocked = (i) => i <= currentIndex();

  function duePoints() {
    const now = Date.now(), cur = currentIndex();
    return GRAMMAR.filter((g, i) => i < cur && !point(g.id).mastered ? point(g.id).due <= now : false)
                  .sort((a, b) => point(a.id).due - point(b.id).due);
  }

  const sentencesFor = (gp) => SENTENCES.filter(s => s.gp === gp);

  function pickSentence(gp, maxLvl, excludeIdx) {
    const pool = sentencesFor(gp).filter(s => s.lvl <= maxLvl && s.i !== excludeIdx);
    const all = pool.length ? pool : sentencesFor(gp);
    let best = null, bestSeen = Infinity;
    const shuffled = all.slice().sort(() => Math.random() - 0.5);
    for (const s of shuffled) {
      const seen = state.sentSeen[s.i] || 0;
      if (seen < bestSeen) { bestSeen = seen; best = s; }
    }
    return best;
  }

  function sentenceCaps(sent) {
    const p = Parse.sentence(sent.dsl);
    const prt = p.toks.filter(t => t.type === "p");
    const conjTok = p.toks.find(t => t.type === "w" && t.form &&
      ["v1","v5","vk","vs","vs0","adji","cop"].includes(t.lex.pos));
    return { prt: prt.length > 0, tf: !!conjTok, parsed: p };
  }

  /* Mode ladder per encounter count:
   * 0-1 → tiles with text+audio · 2 → tiles from audio only · then rotate
   * cloze / transform / speak / tiles-audio, hardest sentences last. */
  function modeFor(g, sent, enc, slot) {
    const caps = sentenceCaps(sent);
    const gpt = GRAMMAR.find(x => x.id === g);
    const rotation = [];
    if (caps.prt) rotation.push("cloze");
    if (gpt.tf && caps.tf) rotation.push("transform");
    rotation.push("speak", "tiles");
    if (enc <= 1) return slot === 0 ? "tiles_read" : "tiles";
    return rotation[(enc + slot) % rotation.length];
  }

  function buildSession() {
    load();
    const items = [];
    const cur = currentIndex();
    const due = duePoints();
    const startNew = cur < GRAMMAR.length && due.length <= 6;
    if (startNew) {
      const g = GRAMMAR[cur];
      items.push({ kind: "lesson", gp: g.id });
      const seq = ["tiles_read", "tiles", "cloze", "transform", "speak"];
      let used = [];
      let slot = 0;
      for (const m of seq) {
        if (slot >= 4) break;
        const sent = pickSentence(g.id, slot < 2 ? 1 : 2, used[used.length - 1]);
        if (!sent) break;
        const caps = sentenceCaps(sent);
        let mode = m;
        if (m === "cloze" && !caps.prt) mode = "tiles";
        if (m === "transform" && !(g.tf && caps.tf)) mode = caps.prt ? "cloze" : "speak";
        items.push({ kind: mode, gp: g.id, sent: sent.i });
        used.push(sent.i);
        slot++;
      }
    }
    const maxReviews = startNew ? 5 : 9;
    for (const g of due.slice(0, maxReviews)) {
      const p = point(g.id);
      const lvl = p.enc <= 2 ? 1 : p.enc <= 4 ? 2 : 3;
      const sent = pickSentence(g.id, lvl);
      if (!sent) continue;
      items.push({ kind: modeFor(g.id, sent, p.enc, items.length), gp: g.id, sent: sent.i });
    }
    // shuffle review part (keep the lesson block in front)
    const head = startNew ? Math.min(5, items.length) : 0;
    const tail = items.slice(head).sort(() => Math.random() - 0.5);
    return items.slice(0, head).concat(tail);
  }

  function record(gpId, ok) {
    const p = point(gpId);
    p.enc++;
    const d = today();
    let masteredNow = false;
    if (ok) {
      p.box = Math.min(p.box + 1, BOX_DAYS.length - 1);
      p.reps++;
      if (!p.days.includes(d)) p.days.push(d);
      if (!p.mastered && p.reps >= MASTERY_REPS && p.days.length >= MIN_DAYS) { p.mastered = true; masteredNow = true; }
    } else {
      p.box = 1;
      if (p.mastered) { p.mastered = false; p.reps = Math.max(0, MASTERY_REPS - 2); }
    }
    p.due = Date.now() + BOX_DAYS[p.box] * DAY;
    if (!state.days.includes(d)) state.days.push(d);
    state.totals.ex++; if (ok) state.totals.ok++;
    save();
    return masteredNow;
  }

  const noteSeen = (sentIdx) => { state.sentSeen[sentIdx] = (state.sentSeen[sentIdx] || 0) + 1; save(); };

  function masteryProgress(gpId) {
    const p = point(gpId);
    const reps = Math.min(p.reps, MASTERY_REPS), days = Math.min(p.days.length, MIN_DAYS);
    const pct = p.mastered ? 1 : Math.min(reps / MASTERY_REPS, days / MIN_DAYS);
    return { reps, repsNeed: MASTERY_REPS, days, daysNeed: MIN_DAYS, pct, done: p.mastered, started: p.enc > 0 };
  }

  function streak() {
    const days = new Set(state.days);
    let n = 0;
    let d = new Date();
    if (!days.has(d.toISOString().slice(0, 10))) d = new Date(Date.now() - DAY);
    while (days.has(d.toISOString().slice(0, 10))) { n++; d = new Date(d.getTime() - DAY); }
    return n;
  }

  function stats() {
    const started = GRAMMAR.filter(g => point(g.id).enc > 0).length;
    const mastered = GRAMMAR.filter(g => point(g.id).mastered).length;
    const cur = currentIndex();
    const unlockedSent = SENTENCES.filter(s => {
      const idx = GRAMMAR.findIndex(g => g.id === s.gp);
      return idx < cur;
    }).length;
    return { started, mastered, unlockedSent, cur };
  }

  return { load, save, state: () => state, point, currentIndex, isUnlocked, duePoints,
           sentencesFor, buildSession, record, noteSeen, masteryProgress, streak, stats, today };
})();
if (typeof module !== "undefined") module.exports = { Engine };
