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

## Release checklist

Bump `VERSION` in `sw.js` **and** `APP_VERSION` in `js/app.js` together.
No build step — the files are the sources. Adding a file means updating both
`index.html` and the `PRECACHE` list in `sw.js`.
