# Kakibun ⛩

Sequel to KakiKana: Japanese N5 **sentences and grammar** as a journey across Japan —
100 grammar points in 10 cities (Tokyo → Hokkaido), 502 authored sentences each with its
own 💡 note, 50 dialogues, fourteen exercise modes, SRS reviews, section exams with their
駅スタンプ, daily missions, and a landscape that follows the real season and the real hour.

No build step, no framework, no network requests: the files are the sources.

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

## What's in v1.8 — answers you produce, not answers you spot

Tiles and four buttons leak. The option set *is* the answer, so a sentence can be
rebuilt from tile-count and shape without ever reading the prompt. Three new modes fix
that by changing the channel: the answer has to be **produced** — spoken or typed — or,
for listening, understood from audio alone.

- **👂 Écoute.** The sentence is played and *nothing is written on screen*. You pick what
  it meant among four French readings, and the distractors come from other sentences of
  the **same grammar point**, so the pattern can't be the clue — only the actual words
  settle it. Then the Japanese is revealed.
- **🗣 Dis-le en japonais.** A French sentence, a blank field, and a mic. Type it in
  rōmaji and the kana appear underneath as you go (`watashi wa` → わたしは), or just say
  it. No options, nothing to guess from.
- **📖 Vocabulaire.** A French word — *manger*, *étudiant* — said or typed back in
  Japanese. Drawn only from words the journey has actually introduced. These score in the
  session but never move a grammar point's review schedule: fumbling a word isn't
  evidence about a grammar point.

**Typing Japanese, forgivingly.** `js/kana.js` is a wāpuro rōmaji converter — the way
Japanese is really typed, and the same rōmaji you already read in the library. It accepts
both spellings of every ambiguous row (shi/si, tsu/tu, fu/hu, ji/zi), and it forgives the
three particles whose spelling and sound disagree: は read "wa", へ read "e", を read "o"
all accept either. What it does **not** forgive is a real mistake — が for は, で for に,
the wrong word — those still come out wrong.

**And the tile modes got harder.** Reviews now deal spare tiles: extra particles *and* a
plausible wrong word drawn from vocabulary you've met. The bank has to be read rather
than exhausted. First encounters are left gentle, because there the guided build is the
teaching.

## What's in v1.9 — every sentence explains itself

All **502 sentences** now carry a 💡 note. Before this, five did.

The rule the whole file follows: a note is about **that sentence**, never a restatement of
the lesson card above it — and the 4–6 notes under one grammar point deliberately say
different things. One takes apart a particle's job, one catches a word's shade of meaning
(母 is your own mother, お母さん is someone else's), one points at a trap you'd otherwise
walk into (✗私はも, ✗高いでした, ✗ねこがあります), one explains where a kanji's reading comes
from, one notes what a French speaker in particular will get wrong.

Some are cultural (pointing at people is rude, so あの人 does the work), some etymological
(月曜日 is the Moon's day, exactly like *lundi*), some are about how Japanese is actually
spoken (ちょっと before a request turns an order into a favour). They live in
**`data/notes.js`**, separate from the corpus, so a note can be reworded without touching
the sentence the engine schedules against.

Three things are checked mechanically on every release: every sentence has a note, every
note has both languages, and no grammar point repeats the same note across its sentences.

## What's in v2.0 — dialogues

**50 dialogues, 219 lines**, added alongside the 502 sentences — nothing replaced. A
sentence teaches a pattern in isolation; a dialogue shows what the pattern is *for*: who
says it, what comes back, and how an exchange holds together.

Five per city, and the setting is what finally makes the ten cities mean something —
東京 is introductions, 横浜 is finding your way and paying for things, 鎌倉 is what's
where and how many, 富士山 is getting about, 京都 is inviting and wanting, 大阪 is
opinions, 広島 is comparing, 福岡 is asking and permitting, 北海道 is thinking and
recounting.

Two new exercises come out of them:

- **💬 Que répond-il ?** The exchange so far is shown as a transcript and read aloud, and
  you pick the line that comes next — **from four Japanese options**, so it's real
  reading, not translation-matching. One distractor is usually another line from the same
  dialogue, which makes the *position* matter, not just the vocabulary.
- **🎭 À toi de parler.** Same transcript, but one line is yours: the French is given and
  you produce the Japanese, typed or spoken. Production with a reason to speak.

Both are marked as free practice — they score in the session but never move a grammar
point's review schedule.

**Browsable in the library**, under a Dialogues tab grouped by city, with the whole
exchange, its 💡 note and a button to hear it read through.

Each dialogue carries a note about the *pragmatics* — the part a grammar table can't
tell you: はじめまして is said once per person and never again; そうですか means "I see"
falling and "really?" rising; 日本語が上手ですね expects a modest denial, not a thank-you;
おねがいします accepts an offer where ください would demand one.

**Checked mechanically** (`dialogues_check.js`): every line parses, no dialogue uses
vocabulary from later in the journey, every line is translated both ways, speakers
alternate, and — after a real 「はじめまして、山田さんです」 slipped into the first draft —
nobody introduces themselves with さん.

## What's in v2.1 — the journey stops being a list

Three things that answer "where am I, and why open the app today?"

**The map has a traveller.** The rail down each city is drawn in two halves — the part
behind you in the season's colour, the part ahead in grey — with 🚶 standing on the stop
you're on, and the map scrolls straight to him instead of dumping you at the top of Japan.
Each city gets its landmark (東京 🗼, 横浜 ⚓, 鎌倉 🗿, 富士山 🗻, 京都 🏯, 大阪 ⛩,
広島 🍢, 福岡 🕊, 北海道 🍜❄️), and a header says where you are and how far you've come.
Stops that carry a dialogue are badged 💬.

**The app knows what month it is.** 春 March–May · 夏 June–August · 秋 September–November ·
冬 December–February, on the Japanese calendar-month convention. Deliberately restrained:
the vermillion-on-cream palette doesn't change. The season supplies *one* accent colour —
the rail you travel along, the traveller, the mission bars, the badge on the map header —
plus a motif and its name. Repainting the whole interface four times a year would be noise;
changing the thread you follow is enough. It's re-read whenever the app comes back to the
front, so a PWA left open across a month boundary keeps up.

**Three missions a day**, on the home screen. Finishing a session is always one of them;
the other two are drawn from listening, production, vocabulary, speaking, dialogue and
kanji readings — a nudge towards whichever mode you'd otherwise avoid. They're seeded off
the date, so a reload doesn't reshuffle them, and every correct answer feeds them from
`recordStats`, whatever mode it came from.

The rule that took the most care: **a mission is only offered if it can actually be
finished today.** Not just "the journey hasn't unlocked it yet" — the device counts too.
With no microphone every speak card degrades to production, so "say 2 sentences aloud"
would be a mission you're physically unable to complete, and it would block the day's
"all three done" with it. Same for listening without a voice to speak with, and for kanji
readings before any point is mastered. `v210.js` checks each of those, including that
excluding one doesn't starve the roll down to two.

## What's in v2.2 — three things the phone found

**A production prompt has to be answerable.** Two sentences both read *"Oui, c'est ça."*
and wanted different Japanese — はい、そうです in one place, ええ、そうです in the other —
with nothing on screen to say which. Three fixes, in order of how permanent they are:

- The familiar one now reads **"Oui (familier), c'est ça."**, which points at ええ.
- `ALT_WORDS` in `data/lexicon.js` lists words a translation genuinely cannot choose
  between — はい/ええ, 名前/お名前, 一回/一度 — and `Parse.altReadings()` rebuilds the
  sentence with the swap, so either answer is accepted. The feedback then says which word
  the sentence itself used, neutrally, with the 💡 note underneath explaining the
  difference. Deliberately short: なに/なん is **not** in it (the choice is phonologically
  determined, so accepting the other would teach a mistake) and neither is それ/あれ (near
  vs far is real, and the glosses already mark it).
- `release.js` now fails the build if any two sentences share a translation but want
  different Japanese, unless `ALT_WORDS` makes the two interchangeable. There were exactly
  two in the corpus — the はい/ええ pair, and "What is your job?" twice in English.

**A correctly said ええ was being marked as mispronounced.** Speech recognition writes
えー where the corpus writes ええ, and こおひい where it writes コーヒー — the same sound,
spelled the other way. `Voice.strip` now runs both sides through `Kana.speech()`, which
expands the long mark into the vowel it holds and folds は/へ/を to わ/え/お, because the
recogniser is transcribing *sound*. Before, a perfect ええ aligned as one character out of
two and got the red squiggle. Not his fault.

**A sentence you have never seen is always assembled from tiles first.** The old rule was
per grammar *point* (`p.enc <= 1`), so once a point was familiar one of its remaining
sentences could arrive as a blank production box on its very first appearance. Worse, the
new-point rotation ran four *different* sentences and put cloze on the third and transform
on the fourth — new vocabulary, new word order and no scaffolding, all on first sight.
Now `modeFor` returns tiles for any unseen sentence, and a new point introduces **two**
sentences and comes back to those same two with the harder questions. Two met properly
beat four met badly; the rest arrive in later reviews.

## What's in v2.3 — the recogniser doesn't know the curriculum

Say 「きのうははれでした」 perfectly and Android hands back 「昨日は晴れでした」. The app
stores that sentence kana-only on purpose — 昨 and 晴 lie outside Kakikana's 111 kanji —
so a flawless answer was being compared against a surface sharing two characters out of
eight, and marked wrong. The kana-only storage is right for *display*; it was never right
for *grading*.

**`SPEECH_K` in `data/lexicon.js`** now gives 177 words the spelling a recogniser is
likely to produce — 昨日, 晴れ, 待つ, 図書館, 美味しい, 大丈夫 — plus digit forms where
ASR prefers them (100円, 3時, 1週間). It is used **only** by the grader: never displayed,
never taught, never fed to the kanji exercises. An array covers a word with more than one
plausible spelling (速い / 早い).

`Parse.surfacePlans()` turns a parsed sentence into every surface it could legitimately
come back as — the app's own kanji, its kana, and one per speech spelling — with the
speech form conjugated in step (待つ → 待ちました, not a stray dictionary form). `Voice`
grades against all of them and keeps the best. The whole corpus and all 219 dialogue lines
are checked in every one of their spellings, and `release.js` fails if a spelling is
malformed or drifts from its reading.

The risk here is asymmetric and worth stating: a **missing** entry rejects a correct
answer, while a **wrong** one simply never matches and leaves the old behaviour. So the
table errs on the side of being generous — but only where kanji is genuinely what you
would see. Words Japanese writes in kana anyway (とても, ちょっと, ください, これ,
たくさん) are deliberately absent, and so are the katakana loanwords.

**And a hole this opened up on the way.** Testing whether the grader had become a rubber
stamp showed it had been one all along: a high overall score alone was enough to pass, and
on a short sentence that is far too generous — 「ははいしゃです」 and
「山田さんはかいしゃいんです」 share は・い・しゃ・です, scored 0.75, and the wrong
sentence came back correct. 52 of 402 neighbouring sentences were accepted in each other's
place. Two changes:

- Whatever the score, **at most one word may have been lost** — the one-slip tolerance the
  grader was always meant to have, now actually enforced.
- **`strict` mode for produce, roleplay and vocabulary**, where the Japanese is not on
  screen: no lost words at all, and no one-character leniency on the whole string (which
  had been waving 明日 through for 昨日). Reading a sentence aloud that you can *see* stays
  tolerant — there, only pronunciation is being graded.

False accepts in the production modes: **52 → 3 out of 402**, with no correct answer
rejected in any spelling.

## What's in v3.0 — 紅葉狩り, the seasonal redesign

A complete visual and interaction redesign, built to Claude Design's handoff. One idea
carries it:

> **The app is a place you are standing in, and that place follows the real season and
> the real hour.**

Every screen sits on one continuous landscape — three receding ridges under a sky derived
from the current month and hour — and the UI floats above it as dark translucent glass.
The landscape is rendered once and never re-rendered on navigation, so moving between
screens feels like turning around in one place rather than loading a page.

**Sixteen skies.** 4 seasons × 4 hour bands (dawn 05–07 · day 08–15 · dusk 16–18 · night
19–04), each a hand-picked gradient, with a light source that reads as a sun by day and a
moon at night. The season also supplies the accent colour, the hill palette, the ground
vignette, the headline ink and the sound. `js/season.js` derives all of it from
`(month, hour)` and writes a handful of custom properties; nothing else in the app knows
what month it is. There is no override and no simulated clock — the handoff's preview
harness is deliberately not shipped.

**Particles per season**: sakura petals falling, summer specks rising past a wind-chime,
maple leaves tumbling, slow snow. Seeded off the season so the same weather falls the same
way, and stopped entirely under `prefers-reduced-motion`.

**Screens.** *accueil* puts the season word at 68px over the landscape and pushes the day's
work to the bottom: one session panel, three missions, three ways further in. *voyage* is
the ten cities with their 駅スタンプ, drilling into one city's stops and its section exam.
*exercice* ranks what you actually confuse — particles by function, verb forms, grammar
points — with red under 55 %, amber to 74, green above. *carnet* gains a fifth tab, **Mots**,
built from every word the journey has taught you. *réglages* is four switches, a language
pair and the save.

**Sessions happen inside the season.** The overlay's scrim is translucent, so the sky and
hills stay visible behind every exercise. All fourteen modes were re-skinned onto the
handoff's nine card designs — assemble covers tiles and tiles_read, produce covers produce,
vocabulary and roleplay, reading covers reading and kanji-fill, dialogue covers reply.
Nothing was dropped.

**Type is self-hosted.** Zen Kaku Gothic New (400/500/700/900), Instrument Serif italic and
IBM Plex Mono (400/500/600), subsetted to exactly the 549 characters this corpus can
display plus headroom: **341 KB for eight faces**, and still no network requests.

**Where the handoff's data was a mock, the app's own data wins.** The prototype invents a
仙台 arc and gives every city ten stops; the journey actually runs 東京 横浜 鎌倉 富士山
名古屋 京都 大阪 広島 福岡 北海道 with 7–14 stops each. Everything on screen reads from
the engine.

Two deliberate departures from the handoff, both because the app already knew better:

- **The production card does not name its grammar pattern.** The design puts `〜たいです`
  above the answer box — but on a production card the pattern is made of the very kana the
  answer needs, so naming it hands over the shape of the answer. This is the same trap the
  transform prompts fell into in v1.1.2, and `v180.js` has guarded it ever since.
- **"Cet après-midi" does not start at 08:00.** The design maps three greetings onto four
  bands, which greets 10 a.m. as the afternoon. The `day` band is split at noon instead.

## Release checklist

Bump `VERSION` in `sw.js` **and** `APP_VERSION` in `js/app.js` together.
No build step — the files are the sources. Adding a file means updating both
`index.html` and the `PRECACHE` list in `sw.js`.

`release.js` in the test harness checks all of that mechanically: the two versions
match, `PRECACHE` and the disk agree in both directions (a listed file that doesn't
exist makes the service worker's install fail, which silently breaks updating),
every `<script>` is precached and loaded in a workable order, every cross-module
`Module.member` reference resolves, fr and en have the same i18n keys and every
`App.t()` key exists, every mission has a label and an icon in both languages (those
are looked up as `t("mission_" + id)`, so the static key scan can't see them), every
sentence carries a 💡 note that no other sentence under the same grammar point repeats,
no two sentences share a translation while wanting different Japanese, every `ALT_WORDS`
entry names real lexicon words, every speech spelling is well formed and conjugates in
step with its reading, and the word popup's centring isn't wiped by its animation.

`v300.js` covers the redesign itself: the sixteen sky states, the landscape, every screen,
all fourteen modes, the feedback panel and the result, and that the self-hosted faces
actually loaded rather than falling back.

## What's in v3.1 — six things the phone asked for

- **The feedback panel had an 86px hole in it.** `.fb>*{position:relative}` was catching
  `.fb-halo` too and restacking a decorative 70px circle as a block in the flow, so every
  graded card opened with an empty white band above "Bien joué !". The rule now excludes
  the halo, and the panel's padding came down a little on top of that.
- **The carnet's five tabs share the width** instead of sitting in a short scrolling row
  against the left edge.
- **The bottom nav has air above it** — it was flush against the screen it sits under.
- **The stations say their names in letters.** `ARCS` has carried `city.fr` / `city.en`
  since v1.0 and the journey simply never showed it; every city row now reads
  東京 · TOKYO · Se présenter, and an opened city repeats it under the big kanji. Quiet
  and uppercase, so it reads as a station sign rather than a translation.
- **A stale Kakikana link can no longer pass itself off as a live one.** The automatic
  sync is intact and tested end to end (`v310.js`): same-origin `localStorage`, re-read on
  `focus`/`visibilitychange`, the new characters diffed, toasted, saved and offered as a
  debut session. But that path only exists **when both apps are served from the same
  origin**. Import a copy once and the app looked identical from the inside while quietly
  serving month-old kanji forever. Now the home banner and a new Settings card name which
  of the two links is in force, with the export's date, and say plainly that an imported
  copy does not update on its own.

`v310.js` measures all six: the panel's first line sits at its padding, the tab row spans
the screen with evenly-shared tabs and no sideways scroll, the nav has a real gap, every
city carries its romaji smaller than the kanji beside it, new kanji cross from Kakikana
with no tap, and a stale import admits it in both places.

## What's in v3.2 — the kanji the carnet promised

The library grid listed 111 kanji. Twenty-six of them appeared in **no sentence at all**:
the lens opened on "0 phrases", and neither 読み nor 漢字-fill could ever ask about them,
since both draw their candidates from the corpus. Nothing in the checklist noticed, because
nothing in the checklist had ever asked.

Twenty-one of the twenty-six already had their word sitting in the lexicon — 六時 八時
一万円 木曜日 去年 男の人 女の人 目 耳 足 外 左 右 川 国 立つ 小さい 古い 長い 多い 白い —
and were simply never written into a sentence. Five had no word at all: 口 北 南 西 空.
Those are now in the lexicon, along with **東 (ひがし)**: the character was already covered
by 東京, but only ever with its ON reading, so as a word of its own it turns 東 into a
genuine two-reading candidate for the 読み exercise.

**55 new sentences**, each with its 💡 note, taking the corpus from 502 to **557**. Every
one of the 26 now has at least two sentences, several have four, and they sit at the
grammar point where they belong — 右 左 外 西 in the position lesson (g23), the directions
in から…まで and in the comparison arc, the body parts among the い-adjectives, 一万円 with
the other prices.

**They are appended at the end of `sentences.js`, not slotted in beside their own grammar
point, and that is deliberate.** A sentence's index *is* its identity: `notes.js` is keyed
by it and so is the save's `sentSeen` map. Inserting one in the middle would renumber every
sentence after it and silently rewrite what the learner has already seen. The engine reaches
sentences through `sentencesFor(gp)`, which filters rather than slices, so file position is
irrelevant to it.

`release.js` now **fails** if any kanji in the grid has no sentence, and warns on any that
rests on a single one (still 四 千 月 火 半 魚 新 — pre-existing, and next on the list).
`v320.js` checks the app rather than the data: every lens lists its sentences, the six new
words display in kanji with their reading, the 読み and 漢字-fill exercises can now reach
the characters they never could, and all 55 sentences render in every mode they qualify for.
