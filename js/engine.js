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
    kanjiSeen: null, newKanji: [],
    vocabSeen: {},           // how often each word has been quizzed, for rotation
    missions: null           // today's three goals; regenerated when the date turns
  });

  function migrate(s) {
    const d = defaults();
    s.settings = Object.assign(d.settings, s.settings);
    s.stats = Object.assign({ prt: {}, form: {}, mode: {} }, s.stats);
    if (!s.stamps) s.stamps = {};
    if (!s.exams) s.exams = [];
    if (s.kanjiSeen === undefined) s.kanjiSeen = null;
    if (!s.newKanji) s.newKanji = [];
    if (!s.vocabSeen) s.vocabSeen = {};
    if (s.missions === undefined) s.missions = null;
    // v1.4–v1.6 kept a relay config and KakiBridge's mined words here; the sync
    // module is gone, so clear them out rather than carrying dead weight around
    // in every save (and, in sync's case, an old relay URL).
    delete s.sync;
    delete s.mined;
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

  /* ---------- daily missions (v2.1) ----------
   * Three small goals a day. The point is not the reward — there isn't one
   * beyond a tick — but having a reason to open the app on a day you weren't
   * planning to, and a nudge towards the modes you avoid.
   *
   * Every mission counts things the session already records, so nothing here
   * needs its own bookkeeping beyond a per-day counter bag.
   */
  const MISSIONS = [
    { id: "session",  target: 1,  ctr: "sessions", always: true },
    { id: "correct",  target: 12, ctr: "ok" },
    { id: "listen",   target: 3,  ctr: "listen" },
    { id: "produce",  target: 3,  ctr: "produce" },
    { id: "vocab",    target: 4,  ctr: "vocab" },
    { id: "speak",    target: 2,  ctr: "speak" },
    { id: "dialogue", target: 2,  ctr: "dialogue" },
    { id: "reading",  target: 3,  ctr: "reading" }
  ];

  /* A mission is only offered if the thing it asks for can actually happen
   * today. Two ways it might not: the journey hasn't unlocked that kind of
   * question yet, or the device can't do it — no microphone means every speak
   * card degrades to produce, so "say 2 sentences aloud" would be a mission you
   * are physically unable to finish. An impossible mission is worse than no
   * mission, because it also blocks the "all three done" of the whole day. */
  const hasTTS = () => typeof speechSynthesis !== "undefined";
  const hasMic = () => typeof Voice !== "undefined" && Voice.available() && state.settings.voiceIn;

  function missionAvailable(m) {
    const cur = currentIndex();
    if (m.id === "dialogue") return dialoguesUpTo().length > 0;
    if (m.id === "listen")
      return hasTTS() && GRAMMAR.slice(0, cur).some(g => point(g.id).enc >= 3);
    if (m.id === "produce") return GRAMMAR.slice(0, cur).some(g => point(g.id).enc >= 3);
    if (m.id === "vocab") return vocabPool().length >= 4;
    if (m.id === "speak") return cur > 0 && hasMic();
    if (m.id === "reading") {
      // reading questions only appear on a mastered point, and only where the
      // sentence actually contains a kanji with more than one reading
      const showAll = state.settings.showAllKanji || !Bridge.hasInfo();
      return GRAMMAR.slice(0, cur).some(g => point(g.id).tier >= 1 &&
        sentencesFor(g.id).some(s => readingCandidates(s, showAll).length));
    }
    return true;
  }

  /* Same three all day: seeded off the date so a reload doesn't reshuffle them. */
  function rollMissions() {
    const d = today();
    let h = 0;
    for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0;
    const pool = MISSIONS.filter(m => !m.always && missionAvailable(m));
    const picked = [MISSIONS.find(m => m.always)];
    for (let k = 0; k < 2 && pool.length; k++) {
      const idx = (h + k * 7) % pool.length;
      picked.push(pool.splice(idx, 1)[0]);
    }
    state.missions = { date: d, ids: picked.map(m => m.id), ctr: {}, hailed: false };
    return state.missions;
  }

  function missions() {
    if (!state.missions || state.missions.date !== today()) rollMissions();
    const m = state.missions;
    return m.ids.map(id => {
      const def = MISSIONS.find(x => x.id === id) || MISSIONS[0];
      const n = Math.min(def.target, m.ctr[def.ctr] || 0);
      return { id, n, target: def.target, done: n >= def.target };
    });
  }
  const missionsDone = () => missions().every(m => m.done);

  function bumpMission(ctr, by) {
    if (!state.missions || state.missions.date !== today()) rollMissions();
    const c = state.missions.ctr;
    c[ctr] = (c[ctr] || 0) + (by || 1);
  }
  /* called when a session finishes */
  function noteSession() { bumpMission("sessions"); save(); }
  /* true exactly once, the moment the third mission lands */
  function missionsJustFinished() {
    if (!missionsDone() || state.missions.hailed) return false;
    state.missions.hailed = true; save();
    return true;
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

  /* ---------- pools for the no-tile modes (v1.8) ----------
   * The common thread: the answer has to be produced or genuinely understood,
   * never inferred from the shape of the options. */

  /* Four French translations for a listening question: the real one plus three
   * from OTHER sentences of the same grammar point where possible. Same-point
   * distractors share the pattern, so the pattern can't be the clue — only
   * hearing the actual words settles it. */
  function listenChoices(sent, n) {
    const want = n || 4;
    const near = sentencesFor(sent.gp).filter(s => s.i !== sent.i);
    const gi = GRAMMAR.findIndex(g => g.id === sent.gp);
    const wider = SENTENCES.filter(s => {
      if (s.i === sent.i || s.gp === sent.gp) return false;
      const j = GRAMMAR.findIndex(g => g.id === s.gp);
      return j >= 0 && j <= Math.max(gi, 4) && Math.abs(j - gi) <= 12;
    });
    const seen = new Set([sent.fr]);
    const out = [];
    for (const pool of [near, wider]) {
      for (const s of pool.slice().sort(() => Math.random() - 0.5)) {
        if (out.length >= want - 1) break;
        if (seen.has(s.fr)) continue;         // never two options meaning the same
        seen.add(s.fr); out.push(s);
      }
    }
    return out;
  }

  /* Words met in sentences already unlocked — the vocabulary quiz's corpus.
   * Built from the sentences rather than the whole lexicon so it never asks
   * for a word the journey hasn't introduced yet. */
  let vocabCache = null;
  function vocabPool() {
    const cur = currentIndex();
    if (vocabCache && vocabCache.cur === cur) return vocabCache.list;
    const ids = new Set();
    for (const s of SENTENCES) {
      const gi = GRAMMAR.findIndex(g => g.id === s.gp);
      if (gi < 0 || gi > cur) continue;
      for (const tok of Parse.sentence(s.dsl).toks) {
        if (tok.type !== "w" || !tok.lex || !tok.lex.id) continue;
        const e = LEXICON[tok.lex.id];
        // skip the copula and bare numbers: "です" and "three" make poor prompts
        if (!e || !e.fr || e.pos === "cop" || e.pos === "num") continue;
        ids.add(tok.lex.id);
      }
    }
    const list = [...ids].map(id => LEXICON[id]);
    vocabCache = { cur, list };
    return list;
  }

  /* Least-recently-quizzed first, so the pool rotates instead of repeating. */
  function pickVocab(count) {
    const pool = vocabPool();
    if (!pool.length) return [];
    const seen = state.vocabSeen || (state.vocabSeen = {});
    return pool.slice()
      .sort((a, b) => (seen[a.id] || 0) - (seen[b.id] || 0) || Math.random() - 0.5)
      .slice(0, count || 1);
  }
  function noteVocab(id) {
    const seen = state.vocabSeen || (state.vocabSeen = {});
    seen[id] = (seen[id] || 0) + 1;
  }

  /* ---------- dialogues (v2.0) ----------
   * A sentence teaches a pattern; a dialogue shows what it is for. Two things
   * come out of them: "what does he say next?" (comprehension in context) and
   * "your turn to say it" (production with a reason to speak). */
  const dialoguesUpTo = () => {
    const cur = currentIndex();
    return DIALOGUES.filter(d => {
      const gi = GRAMMAR.findIndex(g => g.id === d.gp);
      return gi >= 0 && gi <= cur;
    });
  };
  const dialoguesFor = (gp) => DIALOGUES.filter(d => d.gp === gp);

  /* Wrong answers for "what comes next?". The best ones are real lines from
   * elsewhere: grammatical, plausible, and wrong only because of what was just
   * said. A line from the SAME dialogue is included when possible — it makes
   * the position matter, not just the vocabulary. */
  function replyChoices(dlg, lineIdx, n) {
    const want = (n || 4) - 1;
    const right = dlg.lines[lineIdx];
    const seen = new Set([right.fr]);
    const out = [];
    const sameDlg = dlg.lines.filter((l, i) => i !== lineIdx);
    const others = dialoguesUpTo().filter(d => d.i !== dlg.i)
      .reduce((a, d) => a.concat(d.lines), []);
    for (const pool of [sameDlg, others]) {
      for (const l of pool.slice().sort(() => Math.random() - 0.5)) {
        if (out.length >= want) break;
        if (seen.has(l.fr)) continue;
        seen.add(l.fr); out.push(l);
      }
    }
    return out;
  }

  /* Every line of the dialogue that is YOURS to produce — speaker B, and never
   * line 0, which has no conversation in front of it yet. A dialogue is drilled
   * as a whole conversation now: each of these becomes its own card, in order,
   * and the exchange runs to its end whatever you answered. */
  function replyLines(dlg) {
    const out = [];
    for (let i = 1; i < dlg.lines.length; i++) if (dlg.lines[i].sp === "B") out.push(i);
    return out;
  }
  /* the first answerable line — kept for callers that want a single card */
  function replyLine(dlg) {
    const all = replyLines(dlg);
    return all.length ? all[0] : null;
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
      // the word only has to be DISPLAYED in kanji (one learned kanji is enough);
      // the character being asked about is checked individually below
      if (!showAll && !Bridge.knowsSome(tok.surfK)) return;
      const bd = Parse.kanjiBreakdown(tok.lex, tok.surfK, tok.surfR);
      for (const part of bd.parts) {
        if (part.fused || part.chars.length !== 1) continue;
        const ch = part.chars[0];
        if (!showAll && !Bridge.isLearned(ch)) continue;
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

  /* ---------- fill in the missing kanji ----------
   * Blank ONE kanji inside a word already displayed in kanji (i.e. every kanji
   * in it is learned), show the word's reading, and choose the character.
   * Every option must also be a learned kanji — an unfamiliar-looking distractor
   * would be eliminated on sight rather than on knowledge. */
  function learnedKanjiPool(showAll) {
    const all = Object.keys(KANJI_INFO);
    return showAll ? all : all.filter(ch => Bridge.isLearned(ch));
  }

  function kanjiFillCandidates(sent, showAll) {
    const p = Parse.sentence(sent.dsl);
    const out = [];
    p.toks.forEach((tok, i) => {
      if (tok.type !== "w" || tok.surfK == null) return;
      if (!showAll && !Bridge.knowsSome(tok.surfK)) return;
      [...tok.surfK].forEach((ch, ci) => {
        if (!Parse.isKanji(ch) || !KANJI_INFO[ch]) return;
        if (!showAll && !Bridge.isLearned(ch)) return;   // never blank a kanji he hasn't met
        out.push({ tokIdx: i, ch, ci, reading: tok.surfR });
      });
    });
    return out;
  }

  const readingsOf = (ch) => {
    const k = KANJI_INFO[ch];
    return k ? k.on.concat(k.kun).map(e => e[0]) : [];
  };

  /* Distractors: prefer kanji that SHARE a reading with the answer (so the sound
   * alone doesn't settle it), then any other learned kanji. */
  function kanjiDistractors(ch, pool, n) {
    const mine = new Set(readingsOf(ch));
    const others = pool.filter(k => k !== ch);
    const near = others.filter(k => readingsOf(k).some(r => mine.has(r)));
    const far = others.filter(k => near.indexOf(k) < 0);
    return near.sort(() => Math.random() - 0.5)
      .concat(far.sort(() => Math.random() - 0.5)).slice(0, n);
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

  function modeFor(gpId, sent, slot) {
    const p = point(gpId);
    const caps = sentenceCaps(sent);
    const g = GRAMMAR.find(x => x.id === gpId);

    /* A sentence you have never seen is always assembled from tiles first.
     * The old rule was per GRAMMAR POINT (`p.enc <= 1`), which meant that once
     * a point was familiar, one of its remaining sentences could arrive as a
     * blank production box on its very first appearance — new vocabulary, new
     * word order and no scaffolding at once. Meeting new material is a reading
     * problem; producing it is the next visit's job. */
    if (!state.sentSeen[sent.i]) return p.enc === 0 && slot === 0 ? "tiles_read" : "tiles";

    const rot = [];
    if (p.tier >= 1) {
      // maintenance: recognition + production, never the easy guided tiles
      if (caps.prt) { rot.push("cloze"); if (spotCandidates(sent).length) rot.push("spot"); }
      if (g.tf && caps.tf) rot.push("transform");
      // produce and listen carry the most weight here: at maintenance the point
      // is whether it can be recalled and understood, not re-recognised
      rot.push("produce", "listen", "speak", "tiles");
      const showAll = state.settings.showAllKanji || !Bridge.hasInfo();
      if (readingCandidates(sent, showAll).length) rot.push("reading");
      if (kanjiFillCandidates(sent, showAll).length && learnedKanjiPool(showAll).length >= 4)
        rot.push("kanjifill");
    } else {
      if (caps.prt) rot.push("cloze");
      if (g.tf && caps.tf) rot.push("transform");
      rot.push("speak", "tiles");
      // once a point is no longer brand new, ask for it back rather than
      // offering it: production and listening arrive from the third encounter
      if (p.enc >= 3) rot.push("produce", "listen");
      const showAll2 = state.settings.showAllKanji || !Bridge.hasInfo();
      if (p.enc >= 3 && kanjiFillCandidates(sent, showAll2).length &&
          learnedKanjiPool(showAll2).length >= 4) rot.push("kanjifill");
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
      /* Two sentences, each met TWICE: assembled from tiles first, then asked
       * about once it has actually been read.
       *
       * The old rotation ran four DIFFERENT sentences and put cloze on the
       * third and transform on the fourth — new vocabulary, new word order and
       * no scaffolding, all on first sight. You cannot answer a question about
       * a sentence you have not read yet. Two sentences met properly beat four
       * met badly; the rest of the point's sentences arrive in later reviews. */
      const a = pickSentence(g.id, 1);
      const b = a ? (pickSentence(g.id, 1, a.i) || pickSentence(g.id, 2, a.i)) : null;
      const intro = [a, b].filter(Boolean);
      intro.forEach((s, n) =>
        items.push({ kind: n === 0 ? "tiles_read" : "tiles", gp: g.id, sent: s.i }));
      // second pass over the same sentences, now that they have been read
      const asked = [];
      for (const s of intro) {
        const caps = sentenceCaps(s);
        const opts = [];
        if (caps.prt) opts.push("cloze");
        if (g.tf && caps.tf) opts.push("transform");
        opts.push("speak");
        // prefer a kind this point hasn't already asked, so the pair varies
        const mode = opts.find(o => asked.indexOf(o) < 0) || opts[0];
        asked.push(mode);
        items.push({ kind: mode, gp: g.id, sent: s.i });
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
    // One dialogue question per session, once there are dialogues to draw on.
    const dpool = dialoguesUpTo();
    if (dpool.length && items.length >= 4) {
      const d = dpool[Math.floor(Math.random() * dpool.length)];
      const lines = replyLines(d);
      if (lines.length) {
        // One mode for the whole exchange, so a conversation has a consistent
        // character: either you follow it (reply) or you hold up your end
        // (roleplay). Every one of your lines is a card, in order — the last
        // one carries the closing lines so the dialogue always finishes.
        const kind = Math.random() < 0.5 ? "reply" : "roleplay";
        lines.forEach((li, n) => items.push({ kind, gp: d.gp, dlg: d.i, line: li,
          free: true, last: n === lines.length - 1 }));
      }
    }

    // A couple of vocabulary questions per session. They are marked `free`:
    // they score and feed the stats, but a word you fumble must not push a
    // grammar point's review schedule around — different thing being tested.
    const words = pickVocab(items.length >= 6 ? 2 : 1);
    for (const w of words) items.push({ kind: "vocab", word: w.id, free: true });

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
  /* every correct answer feeds today's missions, whatever mode it came from */
  function noteMissionAnswer(ctx, ok) {
    if (!ok || !ctx || !ctx.mode) return;
    bumpMission("ok");
    const m = ctx.mode;
    if (m === "reply" || m === "roleplay") bumpMission("dialogue");
    else if (["listen", "produce", "vocab", "speak", "reading"].includes(m)) bumpMission(m);
  }

  /* Every scored answer goes through here — record() calls it too — so this is
   * the one place the missions need to be fed from. */
  function recordStats(ctx, ok) {
    if (!ctx) return;
    bump("prt", ctx.prt, ok);
    bump("form", ctx.form, ok);
    bump("mode", ctx.mode, ok);
    noteMissionAnswer(ctx, ok);
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

  /* ---------- backup ----------
   * The whole point is that clearing site data (or losing a phone) is no longer
   * fatal, so the export carries the entire state verbatim. */
  function exportSave() {
    // deep copy: a live reference would keep changing under the caller, and a
    // backup that mutates after you take it is not a backup
    return { app: "kakibun", v: 1, date: new Date().toISOString(),
             version: (typeof APP_VERSION !== "undefined" ? APP_VERSION : null),
             state: JSON.parse(JSON.stringify(state)) };
  }
  function importSave(obj) {
    if (!obj || obj.app !== "kakibun" || !obj.state || typeof obj.state !== "object") return false;
    if (!obj.state.points || typeof obj.state.points !== "object") return false;
    state = migrate(Object.assign(defaults(), obj.state));
    save();
    return true;
  }

  const newKanji = () => (state.newKanji || []).slice();
  const clearNewKanji = () => { state.newKanji = []; save(); };

  return { load, save, state: () => state, point, currentIndex, isUnlocked, isLearned,
           duePoints, learningDue, sentencesFor, sentKanji, pickSentence, sentenceCaps,
           readingCandidates, spotCandidates, kanjiFillCandidates,
           listenChoices, vocabPool, pickVocab, noteVocab,
           dialoguesUpTo, dialoguesFor, replyChoices, replyLine, replyLines,
           kanjiDistractors, learnedKanjiPool, modeFor, buildSession, buildStrengthen, buildKanjiDebut,
           record, recordStats, noteSeen, masteryProgress, streak, stats,
           missions, missionsDone, noteSession, missionsJustFinished,
           arcPoints, arcUnlocked, hasStamp, stampCount, grandUnlocked, recordExam,
           weakestPoints, statTable, sentencesWith, newKanji, clearNewKanji, today,
           exportSave, importSave,
           EXAM_PASS, BOX_DAYS };
})();
if (typeof module !== "undefined") module.exports = { Engine };
