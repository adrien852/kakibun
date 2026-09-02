/* Kakibun — engine: state, SRS, session builder, mastery tiers, stats, streak.
 *
 * v2 state (migrated from v1 on load):
 *   points[id] = { enc, box, due, reps, days[], mastered, tier, ok, ko }
 *     tier 0 = still learning · 1 = 🏅 maîtrisé · 2 = 🎖 consolidé (exam-proven)
 *     A mastered point KEEPS coming back — boxes climb to 90 and 180 days.
 *   stats = { prt:{"に.exist":{ok,ko}}, form:{mashita:{ok,ko}}, mode:{cloze:{ok,ko}} }
 *   stamps = { a1:{date,score,total} }   exams = [ {arc,date,score,total,misses[]} ]
 *   kanjiSeen = [] kanji known at last Kakikana check · newKanji = [] pending debut
 */
const Engine = (() => {
  const KEY = "kakibun.state.v1"; // key kept: v2 migrates in place
  const BOX_DAYS = [0, 1, 2, 4, 7, 15, 30, 90, 180];
  const MASTER_BOX = 6;            // box index reached when a point is mastered
  const MASTERY_REPS = 5, MIN_DAYS = 3;
  const EXAM_PASS = 0.8;
  const MAX_EXAMS = 40;
  const DAY = 86400000;

  let state = null;
  const sentKanjiCache = {};

  const defaults = () => ({
    v: 2,
    settings: { lang: "fr", furi: "new", sound: true, voiceIn: true, showAllKanji: false },
    points: {}, days: [], totals: { ex: 0, ok: 0 }, sentSeen: {}, bestCombo: 0,
    kakikana: null,
    stats: { prt: {}, form: {}, mode: {} },
    stamps: {}, exams: [],
    kanjiSeen: null, newKanji: []
  });

  function migrate(s) {
    const d = defaults();
    s.settings = Object.assign(d.settings, s.settings);
    s.stats = Object.assign({ prt: {}, form: {}, mode: {} }, s.stats);
    if (!s.stamps) s.stamps = {};
    if (!s.exams) s.exams = [];
    if (s.kanjiSeen === undefined) s.kanjiSeen = null;
    if (!s.newKanji) s.newKanji = [];
    for (const id in s.points) {
      const p = s.points[id];
      if (p.tier === undefined) p.tier = p.mastered ? 1 : 0;
      if (p.ok === undefined) p.ok = p.reps || 0;
      if (p.ko === undefined) p.ko = Math.max(0, (p.enc || 0) - (p.reps || 0));
      // v1 retired mastered points with no due date worth keeping — schedule maintenance
      if (p.tier >= 1 && (!p.due || p.due < Date.now() - 365 * DAY)) {
        p.box = Math.max(p.box || 0, MASTER_BOX);
        p.due = Date.now() + BOX_DAYS[p.box] * DAY;
      }
    }
    s.v = 2;
    return s;
  }

  function load() {
    try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { state = defaults(); }
    state = migrate(state);
    return state;
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  const today = () => new Date().toISOString().slice(0, 10);

  function point(id) {
    if (!state.points[id]) state.points[id] = {
      enc: 0, box: 0, due: 0, reps: 0, days: [], mastered: false, tier: 0, ok: 0, ko: 0
    };
    return state.points[id];
  }

  /* ---------- progression ---------- */
  function currentIndex() {
    for (let i = 0; i < GRAMMAR.length; i++) if (point(GRAMMAR[i].id).enc === 0) return i;
    return GRAMMAR.length;
  }
  const isUnlocked = (i) => i <= currentIndex();
  const isLearned = (gpId) => point(gpId).enc > 0;
  const learnedPoints = () => GRAMMAR.filter(g => point(g.id).enc > 0);

  /* Every point whose review is due — INCLUDING mastered ones (maintenance). */
  function duePoints() {
    const now = Date.now(), cur = currentIndex();
    return GRAMMAR.filter((g, i) => i < cur && point(g.id).due <= now)
                  .sort((a, b) => point(a.id).due - point(b.id).due);
  }
  /* Only points still being learned — this is what gates starting a new point,
   * so a pile of long-interval maintenance reviews never stalls the journey. */
  function learningDue() {
    const now = Date.now(), cur = currentIndex();
    return GRAMMAR.filter((g, i) => i < cur && point(g.id).tier === 0 && point(g.id).due <= now);
  }

  /* ---------- sentences ---------- */
  const sentencesFor = (gp) => SENTENCES.filter(s => s.gp === gp);

  function sentKanji(sentIdx) {
    if (!sentKanjiCache[sentIdx]) {
      const p = Parse.sentence(SENTENCES[sentIdx].dsl);
      sentKanjiCache[sentIdx] = [...new Set([...p.surfK].filter(Parse.isKanji))];
    }
    return sentKanjiCache[sentIdx];
  }

  /* Least-seen wins, with a bonus for sentences showing off recently-learned kanji. */
  function pickSentence(gp, maxLvl, excludeIdx) {
    const pool = sentencesFor(gp).filter(s => s.lvl <= maxLvl && s.i !== excludeIdx);
    const all = pool.length ? pool : sentencesFor(gp);
    if (!all.length) return null;
    const fresh = new Set(state.newKanji || []);
    let best = null, bestScore = Infinity;
    for (const s of all.slice().sort(() => Math.random() - 0.5)) {
      let sc = state.sentSeen[s.i] || 0;
      if (fresh.size && sentKanji(s.i).some(k => fresh.has(k))) sc -= 2;
      if (sc < bestScore) { bestScore = sc; best = s; }
    }
    return best;
  }

  function sentenceCaps(sent) {
    const p = Parse.sentence(sent.dsl);
    const prt = p.toks.filter(t => t.type === "p");
    const conjTok = p.toks.find(t => t.type === "w" && t.form &&
      ["v1","v5","vk","vs","vs0","adji","cop"].includes(t.lex.pos));
    return { prt: prt.length > 0, nPrt: prt.length, tf: !!conjTok, parsed: p };
  }

  /* Can this sentence host a "which reading?" question right now?
   * Needs a displayed (learned) kanji whose reading we can pin down. */
  function readingCandidates(sent, showAll) {
    const p = Parse.sentence(sent.dsl);
    const out = [];
    p.toks.forEach((tok, i) => {
      if (tok.type !== "w" || tok.surfK == null) return;
      if (!showAll && !Bridge.knowsAll(tok.surfK)) return;
      const bd = Parse.kanjiBreakdown(tok.lex, tok.surfK, tok.surfR);
      for (const part of bd.parts) {
        if (part.fused || part.chars.length !== 1) continue;
        const ch = part.chars[0];
        const info = KANJI_INFO[ch];
        if (!info) continue;
        const rt = Parse.readingType(ch, part.reading);
        if (!rt) continue;
        if (info.on.length + info.kun.length < 2) continue; // needs alternatives
        out.push({ tokIdx: i, ch, reading: part.reading, rt });
      }
    });
    return out;
  }

  /* ---------- spot-the-error ----------
   * Keyed by particle FUNCTION, not by particle, so every swap is genuinely
   * wrong for that role. は↔が is deliberately absent in both directions:
   * swapping those usually shifts emphasis rather than creating an error. */
  const CONFUSE_FN = {
    "は.top":["を","に","で"], "は.contrast":["を","に"],
    "が.subj":["を","に","で"], "が.obj":["を","に"], "が.but":["を","に"],
    "を.obj":["が","に","で"], "を.path":["で","に"],
    "に.dest":["で","を"], "に.time":["で","を"], "に.exist":["で","を"],
    "に.iobj":["で","を"], "に.purpose":["で","を"], "に.freq":["で","を"],
    "に.become":["を","が"],
    "で.place":["に","を"], "で.means":["に","を"], "で.total":["に","を"],
    "へ.dir":["で","を"],
    "の.poss":["に","と","を"], "の.pron":["に","を"],
    "と.and":["に","を"], "と.with":["に","を","で"], "と.quote":["に","を"],
    "や.list":["を","に"],
    "も.also":["を","に"], "も.none":["は","を"],
    "か.q":["を","の"], "か.or":["を","に"], "か.some":["を","に"],
    "から.from":["まで","で"], "から.because":["まで","を"],
    "まで.until":["から","を"], "より.than":["から","まで"],
    "だけ.only":["から","まで"],
    "ごろ.about":["ぐらい"], "ぐらい.about":["ごろ"],
    "ね.agree":["を","の"], "よ.emph":["を","の"]
  };

  /* A sentence can host "spot the error" only when there are at least two
   * particles to choose between — otherwise the answer is the only tappable. */
  function spotCandidates(sent) {
    const p = Parse.sentence(sent.dsl);
    const prts = p.toks.map((t, i) => ({ t, i })).filter(x => x.t.type === "p");
    if (prts.length < 2) return [];
    return prts.map(x => {
      const alts = (CONFUSE_FN[x.t.fn] || []).filter(a => a !== x.t.surfR);
      return alts.length ? { i: x.i, fn: x.t.fn, surf: x.t.surfR, alts } : null;
    }).filter(Boolean);
  }

  /* ---------- mode selection ---------- */
  const LEARN_ROTATION = ["tiles_read", "tiles", "cloze", "transform", "speak"];

  function modeFor(gpId, sent, slot) {
    const p = point(gpId);
    const caps = sentenceCaps(sent);
    const g = GRAMMAR.find(x => x.id === gpId);
    const rot = [];
    if (p.tier >= 1) {
      // maintenance: recognition + production, never the easy guided tiles
      if (caps.prt) { rot.push("cloze"); if (spotCandidates(sent).length) rot.push("spot"); }
      if (g.tf && caps.tf) rot.push("transform");
      rot.push("speak", "tiles");
      if (readingCandidates(sent, state.settings.showAllKanji || !Bridge.hasInfo()).length) rot.push("reading");
    } else {
      if (caps.prt) rot.push("cloze");
      if (g.tf && caps.tf) rot.push("transform");
      rot.push("speak", "tiles");
      if (p.enc <= 1) return slot === 0 ? "tiles_read" : "tiles";
    }
    return rot[(p.enc + slot) % rot.length];
  }

  /* ---------- session building ---------- */
  function buildSession() {
    load();
    const items = [];
    const cur = currentIndex();
    const due = duePoints();
    const startNew = cur < GRAMMAR.length && learningDue().length <= 6;
    if (startNew) {
      const g = GRAMMAR[cur];
      items.push({ kind: "lesson", gp: g.id });
      let used = [], slot = 0;
      for (const m of LEARN_ROTATION) {
        if (slot >= 4) break;
        const sent = pickSentence(g.id, slot < 2 ? 1 : 2, used[used.length - 1]);
        if (!sent) break;
        const caps = sentenceCaps(sent);
        let mode = m;
        if (m === "cloze" && !caps.prt) mode = "tiles";
        if (m === "transform" && !(g.tf && caps.tf)) mode = caps.prt ? "cloze" : "speak";
        items.push({ kind: mode, gp: g.id, sent: sent.i });
        used.push(sent.i); slot++;
      }
    }
    const maxReviews = startNew ? 5 : 9;
    for (const g of due.slice(0, maxReviews)) {
      const p = point(g.id);
      const lvl = p.tier >= 1 ? 3 : p.enc <= 2 ? 1 : p.enc <= 4 ? 2 : 3;
      const sent = pickSentence(g.id, lvl);
      if (!sent) continue;
      items.push({ kind: modeFor(g.id, sent, items.length), gp: g.id, sent: sent.i,
                   maint: p.tier >= 1 });
    }
    const head = startNew ? Math.min(5, items.length) : 0;
    const tail = items.slice(head).sort(() => Math.random() - 0.5);
    return items.slice(0, head).concat(tail);
  }

  /* Weakest-first drill for the Renforcer tab. */
  function buildStrengthen(n) {
    load();
    const weak = weakestPoints(n || 10);
    const items = [];
    weak.forEach((w, i) => {
      const sent = pickSentence(w.g.id, 3);
      if (!sent) return;
      items.push({ kind: modeFor(w.g.id, sent, i + 1), gp: w.g.id, sent: sent.i, drill: true });
    });
    return items.sort(() => Math.random() - 0.5);
  }

  /* Sentences from ALREADY-LEARNED points that show off the given kanji. */
  function buildKanjiDebut(chars, max) {
    load();
    const set = new Set(chars);
    const cur = currentIndex();
    const cands = [];
    for (const s of SENTENCES) {
      const gi = GRAMMAR.findIndex(g => g.id === s.gp);
      if (gi >= cur) continue;                       // only grammar he has met
      const hits = sentKanji(s.i).filter(k => set.has(k)).length;
      if (!hits) continue;
      cands.push({ s, hits, seen: state.sentSeen[s.i] || 0 });
    }
    cands.sort((a, b) => (b.hits - a.hits) || (a.seen - b.seen) || (a.s.lvl - b.s.lvl));
    const items = [], usedGp = {};
    for (const c of cands) {
      if (items.length >= (max || 6)) break;
      usedGp[c.s.gp] = (usedGp[c.s.gp] || 0) + 1;
      if (usedGp[c.s.gp] > 2) continue;              // spread across points
      const showAll = state.settings.showAllKanji || !Bridge.hasInfo();
      const rc = readingCandidates(c.s, showAll).filter(r => set.has(r.ch));
      items.push({ kind: rc.length && items.length % 2 === 1 ? "reading" : "tiles_read",
                   gp: c.s.gp, sent: c.s.i, debut: true, focus: chars });
    }
    return items;
  }

  /* ---------- recording ---------- */
  function bump(bucket, key, ok) {
    if (!key) return;
    const b = state.stats[bucket] || (state.stats[bucket] = {});
    const e = b[key] || (b[key] = { ok: 0, ko: 0 });
    if (ok) e.ok++; else e.ko++;
  }
  /* ctx: {prt:"に.exist"} {form:"mashita"} {mode:"cloze"} — diagnostic only. */
  function recordStats(ctx, ok) {
    if (!ctx) return;
    bump("prt", ctx.prt, ok);
    bump("form", ctx.form, ok);
    bump("mode", ctx.mode, ok);
    save();
  }

  function record(gpId, ok, ctx) {
    const p = point(gpId);
    p.enc++;
    if (ok) p.ok++; else p.ko++;
    const d = today();
    let event = null;
    if (ok) {
      p.box = Math.min(p.box + 1, BOX_DAYS.length - 1);
      p.reps++;
      if (!p.days.includes(d)) p.days.push(d);
      if (p.tier === 0 && p.reps >= MASTERY_REPS && p.days.length >= MIN_DAYS) {
        p.tier = 1; p.mastered = true; p.box = Math.max(p.box, MASTER_BOX); event = "mastered";
      }
    } else {
      p.box = 1;
      if (p.tier > 0) { p.tier = 0; p.mastered = false; p.reps = Math.max(0, MASTERY_REPS - 2); }
    }
    p.due = Date.now() + BOX_DAYS[p.box] * DAY;
    if (!state.days.includes(d)) state.days.push(d);
    state.totals.ex++; if (ok) state.totals.ok++;
    recordStats(ctx, ok);
    save();
    return event;
  }

  const noteSeen = (sentIdx) => {
    if (sentIdx == null) return;
    state.sentSeen[sentIdx] = (state.sentSeen[sentIdx] || 0) + 1; save();
  };

  /* ---------- exams ---------- */
  function arcPoints(arcId) { return GRAMMAR.filter(g => g.arc === arcId); }
  function arcUnlocked(arcId) { return arcPoints(arcId).every(g => point(g.id).enc > 0); }
  const hasStamp = (arcId) => !!state.stamps[arcId];
  const stampCount = () => Object.keys(state.stamps).length;
  const grandUnlocked = () => ARCS.every(a => hasStamp(a.id));

  /* Apply an exam's outcome: passes promote to 🎖 consolidé, misses demote. */
  function recordExam(arcId, results) {
    const total = results.length;
    const okCount = results.filter(r => r.ok).length;
    const passed = total > 0 && okCount / total >= EXAM_PASS;
    const missed = [...new Set(results.filter(r => !r.ok).map(r => r.gp))];
    const tested = [...new Set(results.map(r => r.gp))];
    const demoted = [];
    for (const gp of missed) {
      const p = point(gp);
      if (p.tier > 0) { p.tier = 0; p.mastered = false; p.reps = Math.max(0, MASTERY_REPS - 2); }
      p.box = 1; p.due = Date.now(); p.ko++;
      demoted.push(gp);
    }
    const solidified = [];
    if (passed) {
      for (const gp of tested) {
        if (missed.includes(gp)) continue;
        const p = point(gp);
        p.ok++;
        if (p.tier === 1) { p.tier = 2; solidified.push(gp); }
      }
      if (arcId !== "grand") {
        state.stamps[arcId] = { date: today(), score: okCount, total };
      }
    }
    state.exams.unshift({ arc: arcId, date: today(), score: okCount, total,
                          misses: missed, passed });
    if (state.exams.length > MAX_EXAMS) state.exams.length = MAX_EXAMS;
    const d = today();
    if (!state.days.includes(d)) state.days.push(d);
    save();
    return { passed, score: okCount, total, demoted, solidified };
  }

  /* ---------- diagnostics ---------- */
  const acc = (o, k) => (o + 1) / (o + k + 2);     // Laplace-smoothed, never 0 or 1
  const rawAcc = (o, k) => (o + k) ? o / (o + k) : null;

  function weakestPoints(n) {
    const now = Date.now();
    return learnedPoints().map(g => {
      const p = point(g.id);
      const a = acc(p.ok, p.ko);
      const stale = Math.min(1, Math.max(0, (now - p.due) / (30 * DAY)));
      const tierBonus = p.tier === 2 ? 0.12 : p.tier === 1 ? 0.06 : 0;
      return { g, p, acc: a, score: (1 - a) + stale * 0.25 - tierBonus };
    }).sort((x, y) => y.score - x.score).slice(0, n || 10);
  }

  function statTable(bucket, minTries) {
    const b = state.stats[bucket] || {};
    return Object.keys(b).map(k => {
      const e = b[k];
      return { key: k, ok: e.ok, ko: e.ko, n: e.ok + e.ko, acc: rawAcc(e.ok, e.ko) };
    }).filter(r => r.n >= (minTries || 3)).sort((a, b2) => a.acc - b2.acc);
  }

  function masteryProgress(gpId) {
    const p = point(gpId);
    const reps = Math.min(p.reps, MASTERY_REPS), days = Math.min(p.days.length, MIN_DAYS);
    const pct = p.tier >= 1 ? 1 : Math.min(reps / MASTERY_REPS, days / MIN_DAYS);
    return { reps, repsNeed: MASTERY_REPS, days, daysNeed: MIN_DAYS, pct,
             done: p.tier >= 1, tier: p.tier, started: p.enc > 0 };
  }

  function streak() {
    const days = new Set(state.days);
    let n = 0, d = new Date();
    if (!days.has(d.toISOString().slice(0, 10))) d = new Date(Date.now() - DAY);
    while (days.has(d.toISOString().slice(0, 10))) { n++; d = new Date(d.getTime() - DAY); }
    return n;
  }

  function stats() {
    const started = learnedPoints().length;
    const mastered = GRAMMAR.filter(g => point(g.id).tier >= 1).length;
    const solid = GRAMMAR.filter(g => point(g.id).tier === 2).length;
    const cur = currentIndex();
    const unlockedSent = SENTENCES.filter(s => GRAMMAR.findIndex(g => g.id === s.gp) < cur).length;
    const t = state.totals;
    return { started, mastered, solid, unlockedSent, cur,
             overall: t.ex ? t.ok / t.ex : null, stamps: stampCount() };
  }

  /* how many unlocked sentences contain any of these kanji */
  function sentencesWith(chars, unlockedOnly) {
    const set = new Set(chars);
    const cur = currentIndex();
    return SENTENCES.filter(s => {
      if (unlockedOnly && GRAMMAR.findIndex(g => g.id === s.gp) >= cur) return false;
      return sentKanji(s.i).some(k => set.has(k));
    });
  }

  const newKanji = () => (state.newKanji || []).slice();
  const clearNewKanji = () => { state.newKanji = []; save(); };

  return { load, save, state: () => state, point, currentIndex, isUnlocked, isLearned,
           duePoints, learningDue, sentencesFor, sentKanji, pickSentence, sentenceCaps,
           readingCandidates, spotCandidates, modeFor, buildSession, buildStrengthen, buildKanjiDebut,
           record, recordStats, noteSeen, masteryProgress, streak, stats,
           arcPoints, arcUnlocked, hasStamp, stampCount, grandUnlocked, recordExam,
           weakestPoints, statTable, sentencesWith, newKanji, clearNewKanji,
           EXAM_PASS, BOX_DAYS };
})();
if (typeof module !== "undefined") module.exports = { Engine };
