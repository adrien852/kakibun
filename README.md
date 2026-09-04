# Kakibun ⛩

Sequel to KakiKana: Japanese N5 **sentences and grammar** as a journey across Japan —
100 grammar points in 10 arcs (Tokyo → Hokkaido), 500+ authored sentences, four exercise
modes (listen → assemble tiles, particle cloze, transform drills, read aloud), particle
and kanji-in-context explanations, SRS reviews, streaks, combos and mastery ranks.

## Install on your phone (GitHub Pages)

Serve this folder from the **same GitHub Pages site as KakiKana**, in its own
subfolder — e.g. `https://<you>.github.io/<repo>/kakibun/`:

1. Copy this whole folder into your Pages repo (e.g. as `kakibun/`), commit, push.
2. Open the URL on your phone and *Add to Home Screen*, like KakiKana.
3. After an update, open the app **twice** so the new service worker takes over.

## Kakikana link

Because both apps share the same origin, Kakibun reads Kakikana's progress
automatically from `localStorage["kakikana.export.v1"]` (once Kakikana is updated to
write it — planned). Until then, use *Réglages → Importer un fichier* with a JSON
export, or enable *Afficher tous les kanji*. Words whose kanji you haven't learned
yet are shown in kana; tap any word for its reading, meaning, and whether that
reading is the kanji's main one or a rare one.

## What's in v1.1

- **Mastery that lasts.** A mastered point no longer retires: it returns at 30, 90 and
  180 days, and comes back harder (level-3 sentences, no translation, spot-the-error and
  reading questions rather than guided tiles). Two tiers: 🏅 *maîtrisé* (5 correct across
  3 days) and 🎖 *consolidé* (mastered **and** proven in a section exam).
- **Station exams + 駅スタンプ.** Finish every stop in a section and its checkpoint
  unlocks: 10–14 questions, no hints, no second try. 80 % earns the section's stamp;
  missed points drop straight back into review. All ten stamps unlock the Grand voyage.
- **Renforcer tab.** A targeted drill built from your shakiest points in random order,
  plus a panel showing what you actually confuse — accuracy per particle *function*
  (に destination vs で lieu d'action…), per verb form, and per grammar point.
- **Two new exercises.** *Trouve l'erreur*: one particle is swapped for a plausible wrong
  one, tap it (only offered where the sentence has 2+ particles, and swaps are chosen by
  the particle's function so they're genuinely wrong). *Quelle lecture ?*: a kanji in the
  sentence is highlighted and you pick the reading it takes **here** — the drill that
  turns the reading-frequency data into practice.
- **New kanji from Kakikana.** Kakikana's progress is re-read whenever you come back to
  the app, and newly learned kanji get a home-screen card ("3 nouveaux kanji : 山 母 父 —
  13 phrases s'affichent maintenant en kanji") that opens a short session drilling them
  inside grammar you already know. Sentence picking also favours them for a while, and
  the library's kanji grid now opens onto every sentence where you meet that kanji.

## Fixes since 1.1.0

- **1.1.1** — the word popup flew in from the right at half width: it was centred with
  `left:50% + translateX(-50%)`, but the `rise` animation ends on `transform:none`,
  wiping the centring for the animation's duration. It centres with auto margins now,
  so the transform belongs to the animation alone.
- **1.1.2** — tapping a word spoke the *kanji*, and TTS reads an isolated kanji with its
  ON reading (雨 → « u », 私 → « shi »). The popup now speaks the kana reading; sentence
  playback still uses the kanji surface, where context disambiguates. Also: transform
  prompts printed the answer — the popup labels spell the form out ("passée (でした)")
  because there they explain it, which as a quiz prompt gave the game away. Prompts are
  now stripped of the form itself and guarded against ever containing the answer, and the
  copula is shown attached to its noun (先生です → ?) instead of floating alone.

## What's in v1.2

- **Kanji readings now always explain themselves.** Every reading worth knowing (186 of
  them) carries an example word *and* its translation — かあ → お母さん = maman, すい →
  水曜日 = mercredi. Readings used on their own restate the meaning (水 = l'eau); ones
  confined to compounds say so (に → presque uniquement dans 日本 = le Japon). Rare
  readings stay flagged rare without the noise.
- **New exercise: which kanji is missing?** One kanji is blanked inside a word, the
  word's reading is given, and you choose among four kanji — all of them ones you've
  learned in Kakikana, with distractors that deliberately share a reading with the answer
  so the sound alone doesn't settle it.
- **Read-aloud is tolerant and specific.** A reading passes at 70 % of the sentence, or on
  a single slipped word in a longer one — and either way the words you missed are
  underlined in red, so you learn where you went wrong instead of just "not quite".
- **Read aloud from the library.** Every sentence row has a 🎤 next to its 🔊. This is free
  practice: it never affects review scheduling.
- **Back up your progress.** Réglages → Sauvegarder ma progression exports a JSON file and
  restores it, so clearing site data is no longer fatal and progress can move between
  devices.
- Library drill-downs scroll back to the top, and a sentence-final 。 no longer wraps onto
  a line of its own.

## What's in v1.3

- **Rōmaji in the library's usage examples.** Every example word made of more than the
  headword kanji now carries its reading in rōmaji: お母さん (okaasan) = maman,
  水曜日 (suiyoubi) = mercredi, 学生 (gakusei) = étudiant. A standalone example that *is*
  the kanji (水 = l'eau) is left alone — its reading is already on the row.
- **Kanji you know stay in kanji, even in words you only half know.** A word is now
  written in kanji as soon as *one* of its characters is learned, with furigana over the
  ones that aren't: 学生 shows as 学(がく)生 once you know 生, and 先生 as 先(せん)生.
  Words like 今年 that have a single fused reading take furigana across the whole word,
  since ことし can't be split between 今 and 年. A word with no learned kanji still falls
  back to kana, and so does any partly-known word when furigana is switched off — there
  would be nothing left to read it by.
- Reading and kanji-fill questions now only need *the character being asked about* to be
  learned rather than the whole word, which roughly doubles how many of them exist.

## v1.4–v1.7: the sync experiment, and its removal

v1.4 added an automatic progress sync — a Cloudflare Worker relay in `sync/`, a settings
card, and uploads on session end. v1.5 added KakiBridge's *Mots des jeux* panel on top.
Both are **gone**, and this is the reasoning, kept so nobody rebuilds them here by
accident:

Kakibun never introduces a kanji. It drills grammar over a fixed corpus — 502 hand-written
sentences, each permanently attached to one grammar point, and 111 kanji. Nothing can add
a sentence, a word or a kanji at runtime. So a pipeline that harvests vocabulary from
games had almost nothing to act on here: the panel could only nudge which of a point's
4–6 existing sentences came up, and only when a mined kanji happened to be one of the 111.
That work belongs in **KakiKana**, which owns the curriculum and the learning order, and
that is where it went.

With the panel gone the sync had no counterpart either, so v1.7 removes the relay
entirely. **Kakibun now makes no network requests at all** — it is once again a purely
local app. Progress still moves between devices through *Réglages → Sauvegarder ma
progression* (export / restore), which is what v1.2 added and what never needed a server.

Upgrading is safe: a save carrying the old relay URL and mined-word list has both
stripped on load, and nothing else is touched.

## Release checklist

Bump `VERSION` in `sw.js` **and** `APP_VERSION` in `js/app.js` together.
No build step — the files are the sources. Adding a file means updating both
`index.html` and the `PRECACHE` list in `sw.js`.

`release.js` in the test harness checks all of that mechanically: the two versions
match, `PRECACHE` and the disk agree in both directions (a listed file that doesn't
exist makes the service worker's install fail, which silently breaks updating),
every `<script>` is precached and loaded in a workable order, every cross-module
`Module.member` reference resolves, fr and en have the same i18n keys and every
`App.t()` key exists, and the word popup's centring isn't wiped by its animation.
`sync/` is exempt — it's the relay's source, not part of the app.
