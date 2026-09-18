/* Kakibun — 一覧 the finite lists.
 *
 * Grammar is open-ended: you meet a pattern and then meet it again in new
 * sentences forever. A LIST is the opposite shape — 曜日 has seven members and
 * will never have an eighth — and it wants a different kind of practice:
 * not "can you use this", but "do you know all of them, in order".
 *
 * That shape drives three rules, and they are the reason this is a separate
 * corpus rather than more grammar points:
 *   1. A list lesson shows EVERY member. No sampling, no rotation. A list you
 *      half-know is a list you don't know.
 *   2. Every list has ONE canonical order — smallest to largest, Monday to
 *      Sunday, past to future — because the closing exercise of every list
 *      session is putting it back in that order.
 *   3. The members are words, not sentences, so they carry their own kanji and
 *      reading instead of going through the sentence DSL.
 *
 * Per item: k = kanji surface (null where Japanese normally writes kana, or
 * where the carnet can't explain the character yet), r = reading, fr/en = the
 * gloss, sk = extra spellings a recogniser might return (see SPEECH_K in
 * lexicon.js — same idea, same reason).
 *
 * IRREGULARITY IS THE POINT of half these lists. 四時 is よじ and never よんじ,
 * 一日 is ついたち and has nothing to do with いち, 一分 is いっぷん but 二分 is
 * にふん. Where a member is irregular it is marked `odd: true`, which the
 * carnet renders with a mark — those are the ones worth a second look.
 */
const LISTS = (() => {
  /* k, r, fr, en, extra: {sk, odd} */
  const I = (k, r, fr, en, extra) => Object.assign({ k, r, fr, en }, extra || {});

  const L = (id, jp, fr, en, ordFr, ordEn, items) =>
    ({ id, jp, name: { fr, en }, ord: { fr: ordFr, en: ordEn }, items });

  return [
    /* ---------- numbers ---------- */
    L("num10", "数字", "Les nombres 1–10", "Numbers 1–10",
      "du plus petit au plus grand", "smallest to largest", [
      I("一", "いち", "un", "one"),
      I("二", "に", "deux", "two"),
      I("三", "さん", "trois", "three"),
      /* Both readings are alive for the BARE numeral: よん is the everyday one,
         し the older one that survives in counting aloud and in compounds. The
         list teaches よん and accepts either — unlike 四月/四時, which have
         exactly one reading each and are strict about it. */
      I("四", "よん", "quatre", "four", { sk: ["4", "し"], odd: true }),
      I("五", "ご", "cinq", "five"),
      I("六", "ろく", "six", "six"),
      I("七", "なな", "sept", "seven", { sk: ["7", "しち"], odd: true }),
      I("八", "はち", "huit", "eight"),
      I("九", "きゅう", "neuf", "nine", { sk: ["9", "く"], odd: true }),
      I("十", "じゅう", "dix", "ten")
    ]),

    L("num100", "大きい数", "Les dizaines, cent, mille", "Tens, hundreds, thousands",
      "du plus petit au plus grand", "smallest to largest", [
      I("十", "じゅう", "dix", "ten"),
      I("二十", "にじゅう", "vingt", "twenty"),
      I("三十", "さんじゅう", "trente", "thirty"),
      I("四十", "よんじゅう", "quarante", "forty"),
      I("五十", "ごじゅう", "cinquante", "fifty"),
      I("六十", "ろくじゅう", "soixante", "sixty"),
      I("七十", "ななじゅう", "soixante-dix", "seventy"),
      I("八十", "はちじゅう", "quatre-vingts", "eighty"),
      I("九十", "きゅうじゅう", "quatre-vingt-dix", "ninety"),
      I("百", "ひゃく", "cent", "one hundred"),
      /* 千 is せん bare — never いっせん — the way 百 is ひゃく bare */
      I("千", "せん", "mille", "one thousand", { odd: true }),
      /* ...but 万 never stands alone: it is always 一万 */
      I("一万", "いちまん", "dix mille", "ten thousand", { odd: true })
    ]),

    /* ---------- the clock ---------- */
    L("hours", "〜時", "Les heures", "Hours (o'clock)",
      "de 1 h à 12 h", "from 1 to 12", [
      I("一時", "いちじ", "une heure", "one o'clock"),
      I("二時", "にじ", "deux heures", "two o'clock"),
      I("三時", "さんじ", "trois heures", "three o'clock"),
      I("四時", "よじ", "quatre heures", "four o'clock", { odd: true }),
      I("五時", "ごじ", "cinq heures", "five o'clock"),
      I("六時", "ろくじ", "six heures", "six o'clock"),
      I("七時", "しちじ", "sept heures", "seven o'clock", { odd: true }),
      I("八時", "はちじ", "huit heures", "eight o'clock"),
      I("九時", "くじ", "neuf heures", "nine o'clock", { odd: true }),
      I("十時", "じゅうじ", "dix heures", "ten o'clock"),
      I("十一時", "じゅういちじ", "onze heures", "eleven o'clock"),
      I("十二時", "じゅうにじ", "douze heures", "twelve o'clock")
    ]),

    L("minutes", "〜分", "Les minutes", "Minutes",
      "de la plus petite à la plus grande", "smallest to largest", [
      /* ふん or ぷん is not a choice — it follows the number, and this list is
         the only reliable way to learn which is which */
      I("一分", "いっぷん", "une minute", "one minute", { odd: true }),
      I("二分", "にふん", "deux minutes", "two minutes"),
      I("三分", "さんぷん", "trois minutes", "three minutes", { odd: true }),
      I("四分", "よんぷん", "quatre minutes", "four minutes", { odd: true }),
      I("五分", "ごふん", "cinq minutes", "five minutes"),
      I("六分", "ろっぷん", "six minutes", "six minutes", { odd: true }),
      I("七分", "ななふん", "sept minutes", "seven minutes"),
      I("八分", "はっぷん", "huit minutes", "eight minutes", { odd: true }),
      I("九分", "きゅうふん", "neuf minutes", "nine minutes"),
      I("十分", "じゅっぷん", "dix minutes", "ten minutes", { sk: ["じっぷん"], odd: true }),
      I("十五分", "じゅうごふん", "quinze minutes", "fifteen minutes"),
      I("三十分", "さんじゅっぷん", "trente minutes", "thirty minutes", { sk: ["さんじっぷん"] }),
      I("四十五分", "よんじゅうごふん", "quarante-cinq minutes", "forty-five minutes")
    ]),

    /* ---------- the calendar ---------- */
    L("week", "曜日", "Les jours de la semaine", "Days of the week",
      "du lundi au dimanche", "Monday to Sunday", [
      I("月曜日", "げつようび", "lundi", "Monday"),
      I("火曜日", "かようび", "mardi", "Tuesday"),
      I("水曜日", "すいようび", "mercredi", "Wednesday"),
      I("木曜日", "もくようび", "jeudi", "Thursday"),
      I("金曜日", "きんようび", "vendredi", "Friday"),
      I("土曜日", "どようび", "samedi", "Saturday"),
      I("日曜日", "にちようび", "dimanche", "Sunday")
    ]),

    L("months", "〜月", "Les mois", "Months",
      "de janvier à décembre", "January to December", [
      I("一月", "いちがつ", "janvier", "January"),
      I("二月", "にがつ", "février", "February"),
      I("三月", "さんがつ", "mars", "March"),
      /* 四月 is しがつ — the one place よん never appears */
      I("四月", "しがつ", "avril", "April", { odd: true }),
      I("五月", "ごがつ", "mai", "May"),
      I("六月", "ろくがつ", "juin", "June"),
      I("七月", "しちがつ", "juillet", "July", { odd: true }),
      I("八月", "はちがつ", "août", "August"),
      I("九月", "くがつ", "septembre", "September", { odd: true }),
      I("十月", "じゅうがつ", "octobre", "October"),
      I("十一月", "じゅういちがつ", "novembre", "November"),
      I("十二月", "じゅうにがつ", "décembre", "December")
    ]),

    /* The hardest list in the app, and the one worth the most: the first ten
       days of the month are native counting words, not 日 + a number. */
    L("dates", "日にち", "Les jours du mois", "Days of the month",
      "du 1er au 24", "from the 1st to the 24th", [
      I("一日", "ついたち", "le 1er", "the 1st", { odd: true }),
      I("二日", "ふつか", "le 2", "the 2nd", { odd: true }),
      I("三日", "みっか", "le 3", "the 3rd", { odd: true }),
      I("四日", "よっか", "le 4", "the 4th", { odd: true }),
      I("五日", "いつか", "le 5", "the 5th", { odd: true }),
      I("六日", "むいか", "le 6", "the 6th", { odd: true }),
      I("七日", "なのか", "le 7", "the 7th", { odd: true }),
      I("八日", "ようか", "le 8", "the 8th", { odd: true }),
      I("九日", "ここのか", "le 9", "the 9th", { odd: true }),
      I("十日", "とおか", "le 10", "the 10th", { odd: true }),
      I("十四日", "じゅうよっか", "le 14", "the 14th", { odd: true }),
      I("二十日", "はつか", "le 20", "the 20th", { odd: true }),
      I("二十四日", "にじゅうよっか", "le 24", "the 24th", { odd: true })
    ]),

    /* ---------- money ---------- */
    /* Not "numbers with 円 after them" — these are the actual coins and notes
       in a Japanese wallet, which is what makes the list finite. */
    L("money", "お金", "L'argent", "Money",
      "de la plus petite pièce au plus gros billet", "smallest coin to largest note", [
      I("一円", "いちえん", "1 yen", "1 yen"),
      I("五円", "ごえん", "5 yens", "5 yen"),
      I("十円", "じゅうえん", "10 yens", "10 yen"),
      I("五十円", "ごじゅうえん", "50 yens", "50 yen"),
      I("百円", "ひゃくえん", "100 yens", "100 yen"),
      I("五百円", "ごひゃくえん", "500 yens", "500 yen"),
      I("千円", "せんえん", "1 000 yens", "1,000 yen"),
      I("五千円", "ごせんえん", "5 000 yens", "5,000 yen"),
      I("一万円", "いちまんえん", "10 000 yens", "10,000 yen")
    ]),

    /* ---------- counters ---------- */
    L("people", "〜人", "Compter les personnes", "Counting people",
      "de 1 à 10 personnes", "from 1 to 10 people", [
      I("一人", "ひとり", "une personne", "one person", { sk: ["1人"], odd: true }),
      I("二人", "ふたり", "deux personnes", "two people", { sk: ["2人"], odd: true }),
      I("三人", "さんにん", "trois personnes", "three people", { sk: ["3人"] }),
      I("四人", "よにん", "quatre personnes", "four people", { sk: ["4人", "よんにん"], odd: true }),
      I("五人", "ごにん", "cinq personnes", "five people", { sk: ["5人"] }),
      I("六人", "ろくにん", "six personnes", "six people", { sk: ["6人"] }),
      I("七人", "ななにん", "sept personnes", "seven people", { sk: ["7人", "しちにん"] }),
      I("八人", "はちにん", "huit personnes", "eight people", { sk: ["8人"] }),
      I("九人", "きゅうにん", "neuf personnes", "nine people", { sk: ["9人", "くにん"] }),
      I("十人", "じゅうにん", "dix personnes", "ten people", { sk: ["10人"] })
    ]),

    /* The generic counter: when you don't know the right one, this always works */
    L("things", "〜つ", "Compter les choses", "Counting things",
      "de 1 à 10 objets", "from 1 to 10 things", [
      I("一つ", "ひとつ", "une chose", "one thing", { sk: ["1つ"] }),
      I("二つ", "ふたつ", "deux choses", "two things", { sk: ["2つ"] }),
      I("三つ", "みっつ", "trois choses", "three things", { sk: ["3つ"] }),
      I("四つ", "よっつ", "quatre choses", "four things", { sk: ["4つ"] }),
      I("五つ", "いつつ", "cinq choses", "five things", { sk: ["5つ"] }),
      I("六つ", "むっつ", "six choses", "six things", { sk: ["6つ"] }),
      I("七つ", "ななつ", "sept choses", "seven things", { sk: ["7つ"] }),
      I("八つ", "やっつ", "huit choses", "eight things", { sk: ["8つ"] }),
      I("九つ", "ここのつ", "neuf choses", "nine things", { sk: ["9つ"] }),
      /* the one that breaks the pattern: no 〜つ at all */
      I("十", "とお", "dix choses", "ten things", { odd: true })
    ]),

    /* ---------- the day, and the year ---------- */
    /* 朝・昼・晩・夜 are not in the carnet yet, so they are written in kana
       here rather than shown as characters the app can't explain. */
    L("dayparts", "一日", "Les moments de la journée", "Parts of the day",
      "du matin à la nuit", "morning to night", [
      I(null, "あさ", "le matin", "morning"),
      I(null, "ひる", "le midi", "midday"),
      I("午後", "ごご", "l'après-midi", "afternoon"),
      I(null, "ゆうがた", "la fin d'après-midi", "late afternoon"),
      I(null, "ばん", "le soir", "evening"),
      I(null, "よる", "la nuit", "night")
    ]),

    L("seasons", "季節", "Les saisons", "Seasons",
      "du printemps à l'hiver", "spring to winter", [
      I(null, "はる", "le printemps", "spring"),
      I(null, "なつ", "l'été", "summer"),
      I(null, "あき", "l'automne", "autumn"),
      I(null, "ふゆ", "l'hiver", "winter")
    ]),

    /* One straight line from last year to next — the only list here whose
       order is a timeline rather than a size. */
    L("reltime", "いつ", "Hier, aujourd'hui, demain", "Yesterday, today, tomorrow",
      "du passé vers le futur", "past to future", [
      I("去年", "きょねん", "l'an dernier", "last year"),
      I("先月", "せんげつ", "le mois dernier", "last month"),
      I("先週", "せんしゅう", "la semaine dernière", "last week"),
      I(null, "おととい", "avant-hier", "the day before yesterday"),
      I(null, "きのう", "hier", "yesterday", { sk: ["昨日"] }),
      I("今日", "きょう", "aujourd'hui", "today", { odd: true }),
      I(null, "あした", "demain", "tomorrow", { sk: ["明日"] }),
      I(null, "あさって", "après-demain", "the day after tomorrow"),
      I("来週", "らいしゅう", "la semaine prochaine", "next week"),
      I("来月", "らいげつ", "le mois prochain", "next month"),
      I("来年", "らいねん", "l'an prochain", "next year")
    ])
  ];
})();

/* id → list, and a flat id for every member: "week:2" is Wednesday. A member's
 * INDEX is its identity, exactly as a sentence's index is — the order is the
 * content here, so nothing may ever be inserted into the middle of a list. */
const LIST_BY_ID = {};
for (const l of LISTS) {
  LIST_BY_ID[l.id] = l;
  l.items.forEach((it, i) => { it.list = l.id; it.i = i; it.id = l.id + ":" + i; });
}

if (typeof module !== "undefined") module.exports = { LISTS, LIST_BY_ID };
