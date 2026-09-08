/* Kakibun — the 💡 note under each sentence.
 *
 * Kept apart from sentences.js on purpose: the corpus is the thing the engine
 * indexes and schedules against, and it should not have to be rewritten every
 * time a note is reworded. Keyed by sentence index, merged in at load.
 *
 * What makes a good note here — the rule the whole file follows:
 *   - it is about THIS sentence, not a restatement of the lesson above it;
 *   - the 4-6 notes under one grammar point say different things — one about a
 *     particle's job, one about a word's shade of meaning, one about a trap,
 *     one about what a French speaker will get wrong;
 *   - one or two sentences. It renders in a small box under the answer, read
 *     in the two seconds before tapping Continuer.
 */
const NOTES = {

/* ============ ARC 1 — 東京 ============ */

/* g01 AはBです */
0:  { fr: "は n'est pas le verbe : c'est です qui fait « être ». は annonce seulement de quoi on parle — « moi, eh bien : étudiant ».",
      en: "は is not the verb — です is. は only announces what we're talking about: “me, well: student.”" },
1:  { fr: "Pas d'article en japonais : 先生です dit « est professeur », sans « un ». Rien non plus ne marque le masculin ou le féminin.",
      en: "No articles in Japanese: 先生です says “is teacher”, with no “a”. Nothing marks gender either." },
2:  { fr: "フランス s'écrit en katakana parce que c'est un mot venu de l'étranger. 人 accroché derrière en fait la nationalité.",
      en: "フランス is written in katakana because it came from abroad. 人 stuck on the end turns it into a nationality." },
3:  { fr: "母 désigne sa propre mère quand on en parle à quelqu'un d'autre. La mère de l'interlocuteur, elle, se dit お母さん.",
      en: "母 is your own mother, when speaking about her to someone else. The listener's mother is お母さん." },
4:  { fr: "かいしゃいん = 会社 (entreprise) + 員 (membre) : « membre d'une entreprise ». Beaucoup de métiers japonais se fabriquent ainsi.",
      en: "かいしゃいん = 会社 (company) + 員 (member): “company member”. A lot of Japanese job words are built this way." },

/* g02 じゃありません */
5:  { fr: "です disparaît entièrement : on ne dit jamais ✗先生じゃありませんです. じゃありません contient déjà le « être ».",
      en: "です disappears completely — never ✗先生じゃありませんです. じゃありません already contains the “be”." },
6:  { fr: "父 = mon père, quand j'en parle à un tiers. Le père de quelqu'un d'autre, c'est お父さん — même paire que 母 / お母さん.",
      en: "父 = my father, talking about him to someone else. Somebody else's father is お父さん — the same pair as 母 / お母さん." },
7:  { fr: "じゃ est la contraction de では. À l'écrit formel on trouve では ありません : même sens, ton plus soutenu.",
      en: "じゃ is a contraction of では. Formal writing uses では ありません — same meaning, stiffer tone." },
8:  { fr: "子ども s'écrit moitié kanji moitié kana. On rencontre aussi 子供, entièrement en kanji : c'est le même mot.",
      en: "子ども is written half in kanji, half in kana. You'll also meet 子供, all kanji — the same word." },
9:  { fr: "Dans une phrase négative, は prend souvent une nuance de contraste : « Tanaka, lui, n'est pas étudiant » — sous-entendu, quelqu'un d'autre l'est.",
      en: "In a negative sentence は often turns contrastive: “Tanaka, at least, isn't a student” — implying somebody else is." },

/* g03 でした */
10: { fr: "でした, c'est です au passé — un seul mot. Là où le français ajoute un auxiliaire, le japonais change juste la fin.",
      en: "でした is simply です in the past — one word. Where French adds an auxiliary, Japanese just changes the ending." },
11: { fr: "Littéralement « hier était pluie ». Le japonais traite la météo comme un nom : 雨です = il pleut, 雨でした = il pleuvait.",
      en: "Literally “yesterday was rain”. Japanese treats weather as a noun: 雨です = it's raining, 雨でした = it was raining." },
12: { fr: "休み est un nom tiré du verbe 休む (se reposer) : « le repos » — donc le congé, les vacances, le jour de fermeture.",
      en: "休み is a noun made from the verb 休む (to rest): “rest” — so a day off, a holiday, a closing day." },
13: { fr: "Vous tenez maintenant les quatre formes : です / じゃありません / でした / じゃありませんでした. Toute la conjugaison polie de « être ».",
      en: "You now have all four forms: です / じゃありません / でした / じゃありませんでした. That's the whole polite conjugation of “be”." },
14: { fr: "Trois は de suite : きのう + は + はれ. Le premier se lit « wa » (c'est la particule), celui de はれ se lit « ha » — même signe, deux sons.",
      en: "Three は in a row: きのう + は + はれ. The first is read “wa” (the particle), the one inside はれ is “ha” — same sign, two sounds." },

/* g04 ～か */
15: { fr: "Rien ne bouge dans la phrase : on ajoute か et c'est une question. Méfiez-vous d'あなた, qui sonne distant — les Japonais préfèrent le nom.",
      en: "Nothing moves in the sentence: add か and it's a question. Go easy on あなた though — it sounds distant; Japanese prefers the person's name." },
16: { fr: "Le japonais n'a pas besoin de « ? » : か fait déjà le travail. On écrit d'ailleurs 。 à la fin, même pour une question.",
      en: "Japanese needs no “?” — か already does that job. A full stop 。 is written at the end even for a question." },
17: { fr: "À l'oral, la voix monte sur か. C'est souvent la seule chose qui sépare la question de l'affirmation.",
      en: "Spoken, the voice rises on か. Often that's the only thing separating a question from a statement." },
18: { fr: "お母さん et non 母 : il s'agit de la mère de l'interlocuteur, donc la forme respectueuse. Parler de la sienne, c'est 母.",
      en: "お母さん, not 母: this is the listener's mother, so the respectful form. Your own is 母." },
19: { fr: "Une question fermée : on y répond はい ou いいえ — le plus souvent en reprenant le mot, はい、フランス人です.",
      en: "A yes/no question: answer はい or いいえ — usually echoing the word, はい、フランス人です." },

/* g05 はい・いいえ */
20: { fr: "そう veut dire « ainsi, comme ça ». そうです = « c'est ainsi » : la façon la plus courante de confirmer sans répéter la phrase.",
      en: "そう means “that way, so”. そうです = “that's how it is” — the usual way to confirm without repeating the sentence." },
21: { fr: "ちがいます est un verbe : « ça diffère ». Le japonais dit « c'est différent » là où le français dirait « non, ce n'est pas ça ».",
      en: "ちがいます is a verb: “it differs”. Japanese says “that's different” where English says “no, that's not it”." },
22: { fr: "Répondre en reprenant le mot est plus naturel qu'un はい tout seul, qui peut sonner sec.",
      en: "Answering by echoing the word sounds more natural than a bare はい, which can come out curt." },
23: { fr: "いいえ suivi de la négation complète : c'est la façon polie de corriger. いいえ seul serait abrupt.",
      en: "いいえ followed by the full negative is the polite way to correct someone. いいえ on its own would be blunt." },
24: { fr: "ええ est un « oui » plus souple que はい, très courant à l'oral entre gens qui se connaissent. はい reste le neutre passe-partout.",
      en: "ええ is a softer “yes” than はい, common in speech between people who know each other. はい stays the neutral all-purpose one." },

/* g06 AのB */
25: { fr: "私の本 se dit わたしのほん, chaque syllabe pesant le même poids. Le japonais n'élide ni ne lie jamais ses voyelles comme le français.",
      en: "私の本 is said わたしのほん, every syllable carrying equal weight. Japanese never elides or runs its vowels together the way English does." },
26: { fr: "の ne dit pas seulement « à qui ». Ici c'est bien la possession, mais 日本の車 veut dire « une voiture japonaise », pas « la voiture du Japon ».",
      en: "の doesn't only mean “whose”. Here it is ownership, but 日本の車 means “a Japanese car”, not “Japan's car”." },
27: { fr: "Aucun sujet exprimé : le « c'est » est entièrement porté par です. Le japonais laisse tomber tout ce que le contexte fournit.",
      en: "No subject stated at all: the “it is” is carried entirely by です. Japanese drops whatever the context supplies." },
28: { fr: "日本語の先生 = professeur de japonais. の précise ici la matière enseignée, pas le propriétaire — un même petit mot pour beaucoup de liens.",
      en: "日本語の先生 = teacher of Japanese. Here の marks the subject taught, not an owner — one small word for many kinds of link." },
29: { fr: "私の友だち forme un bloc, et は se pose après le bloc entier. 友だち ne marque pas le nombre : un ami ou des amis, le contexte tranche.",
      en: "私の友だち forms one block, and は attaches after the whole block. 友だち doesn't mark number — one friend or several, context decides." },

/* g07 ～も */
30: { fr: "も prend la place de は : on ne dit jamais ✗私はも. C'est une règle générale — も remplace は et が, il ne s'y ajoute pas.",
      en: "も takes は's place — never ✗私はも. That's a general rule: も replaces は and が rather than joining them." },
31: { fr: "も suppose qu'on vient de parler de quelqu'un d'autre. Sans ce contexte la phrase surprend : « aussi » que qui ?",
      en: "も assumes someone else was just mentioned. Without that context the sentence is odd — “too” compared to whom?" },
32: { fr: "Ici « aussi » porte sur ma mère, pas sur le métier. C'est la position de も qui le dit : il marque le mot qui s'ajoute.",
      en: "Here “too” is about my mother, not about the job. も's position says so — it marks the item being added." },
33: { fr: "今日も = « aujourd'hui aussi », c'est-à-dire encore. Avec un mot de temps, も prend souvent ce goût de répétition lassée.",
      en: "今日も = “today too”, meaning yet again. With a time word, も often carries that weary sense of repetition." },
34: { fr: "も se place après le groupe entier 私の友だち, jamais à l'intérieur. Les particules suivent le bloc, pas le mot isolé.",
      en: "も goes after the whole group 私の友だち, never inside it. Particles follow the block, not the single word." },

/* g08 ～人・～語 */
35: { fr: "人 se lit じん dans les nationalités (日本人 にほんじん) mais ひと quand il est seul et veut dire « personne ». Même kanji, deux vies.",
      en: "人 is read じん in nationalities (日本人 にほんじん) but ひと on its own meaning “person”. Same kanji, two lives." },
36: { fr: "フランス人 mélange katakana (le pays, mot étranger) et kanji (人). Ce mélange dans un même mot est parfaitement normal.",
      en: "フランス人 mixes katakana (the country, a foreign word) with kanji (人). Mixing scripts inside one word is completely normal." },
37: { fr: "語 (ご) désigne la langue : 日本語, フランス語, 英語. Le même kanji revient dans 単語 (mot) — il tourne toujours autour du langage.",
      en: "語 (ご) means language: 日本語, フランス語, 英語. The same kanji turns up in 単語 (word) — it always circles around speech." },
38: { fr: "Question banale entre gens qui viennent de se rencontrer. Entre proches, on remplacerait あなた par le nom de la personne.",
      en: "An ordinary question between people who've just met. Among friends you'd replace あなた with the person's name." },
39: { fr: "Trois briques d'un coup : の relie, は pose le thème, じゃありません nie. L'ordre ne bouge jamais — la négation reste à la fin.",
      en: "Three bricks at once: の links, は sets the topic, じゃありません negates. The order never changes — the negative stays at the end." },

/* g09 何ですか */
40: { fr: "お devant 名前 rend le mot respectueux : c'est le nom de l'autre. Pour donner le sien, on dit simplement 名前, ou rien du tout.",
      en: "お in front of 名前 makes the word respectful — it's the other person's name. To give your own you just say 名前, or nothing at all." },
41: { fr: "何 se lit なん devant です : jamais ✗なにです. Devant を ou が il redevient なに — 何を (なにを) 食べますか.",
      en: "何 is read なん before です — never ✗なにです. Before を or が it goes back to なに: 何を (なにを) 食べますか." },
42: { fr: "Sans お, la question porte plutôt sur un tiers, ou sonne familière. Ce petit お change à qui l'on s'adresse.",
      en: "Without お the question is more about a third party, or sounds casual. That small お changes who you're addressing." },
43: { fr: "あなたの est souvent inutile : しごとは何ですか suffit, le contexte dit de qui on parle. Le japonais préfère l'implicite.",
      en: "あなたの is usually unnecessary: しごとは何ですか is enough, context says whose. Japanese prefers to leave it unsaid." },

/* g10 だれですか・～さん */
44: { fr: "Une phrase sans thème ni sujet : だれですか se suffit. Ajouter ce que le contexte fournit déjà sonnerait lourd.",
      en: "A sentence with no topic and no subject: だれですか stands alone. Adding what context already supplies would sound heavy." },
45: { fr: "だれ occupe exactement la place de la réponse : 田中さんは先生です → 田中さんはだれですか. Le mot interrogatif ne se déplace pas.",
      en: "だれ sits exactly where the answer would: 田中さんは先生です → 田中さんはだれですか. The question word doesn't move." },
46: { fr: "さん sur 田中, jamais sur soi-même : on ne s'attribue pas un titre de respect. ✗私さん n'existe pas.",
      en: "さん on 田中, never on yourself: you don't award yourself a respectful title. ✗私さん doesn't exist." },
47: { fr: "先生 est aussi un titre : on appelle son professeur 山田先生 — et alors さん disparaît, un titre suffit.",
      en: "先生 is also a title: you address your teacher as 山田先生 — and then さん drops, one title is enough." },
/* ============ ARC 2 — 横浜 ============ */

/* g11 これ・それ・あれ */
49: { fr: "これ est un pronom complet : il remplace le nom, on ne dit pas ✗これ本. Pour « ce livre-ci » il faudra この本, au point suivant.",
      en: "これ is a full pronoun standing in for the noun — never ✗これ本. For “this book” you'll need この本, at the next point." },
50: { fr: "それ se règle sur l'interlocuteur, pas sur soi : c'est ce qui est près de toi. Le japonais partage l'espace en trois, le français en deux.",
      en: "それ is measured from the listener, not from you: it's what's near them. Japanese splits space three ways, English two." },
51: { fr: "ふじさん s'écrit 富士山 : le さん final est le kanji 山 (montagne), pas le さん de politesse. Piège classique.",
      en: "ふじさん is written 富士山 — that final さん is the kanji 山 (mountain), not the polite さん. A classic trap." },
52: { fr: "何 se glisse exactement là où irait la réponse : これは本です → これは何ですか. Rien d'autre ne bouge dans la phrase.",
      en: "何 slots in exactly where the answer would go: これは本です → これは何ですか. Nothing else in the sentence moves." },
53: { fr: "それ parce que l'objet est du côté de la personne à qui on parle. Si on le tenait soi-même, ce serait これ.",
      en: "それ because the thing is on the listener's side. If you were holding it yourself, it would be これ." },
54: { fr: "あれ = loin de nous deux, souvent quelque chose qu'on aperçoit au loin. Ni près de moi (これ), ni près de toi (それ).",
      en: "あれ = far from both of us, often something spotted in the distance. Neither near me (これ) nor near you (それ)." },

/* g12 この・その・あの＋名詞 */
55: { fr: "この ne vit jamais seul : il lui faut un nom derrière. Et 人 se lit ici ひと (personne), pas じん comme dans 日本人.",
      en: "この never stands alone — it needs a noun after it. And 人 is read ひと here (person), not じん as in 日本人." },
56: { fr: "あの人 = « cette personne là-bas ». Montrer quelqu'un du doigt est impoli au Japon : on le désigne par あの人.",
      en: "あの人 = “that person over there”. Pointing at someone is rude in Japan; you refer to them as あの人 instead." },
57: { fr: "日本の車 : の marque ici l'origine, pas le propriétaire. Et répéter 車 ne gêne personne — le japonais y répugne moins que le français.",
      en: "日本の車: here の marks origin, not an owner. And repeating 車 bothers nobody — Japanese minds repetition far less than English." },
58: { fr: "日本語の本 = un livre de japonais. Le の relie une matière à un objet, exactement comme dans 日本語の先生.",
      en: "日本語の本 = a Japanese-language book. の links a subject to an object, exactly as in 日本語の先生." },
59: { fr: "山 seul se lit やま, mais soudé dans 富士山 il se lit さん. Un même kanji change de lecture selon qu'il est isolé ou en composé.",
      en: "山 alone is read やま, but welded into 富士山 it becomes さん. The same kanji changes reading depending on whether it stands alone." },

/* g13 ここ・そこ・あそこ */
60: { fr: "Trois lieux sur le même modèle — sauf あそこ, qui s'allonge au lieu de faire ✗あこ. C'est la seule irrégularité de la série.",
      en: "Three places on one pattern — except あそこ, which stretches instead of giving ✗あこ. The series' only irregularity." },
61: { fr: "学校 = 学 (étudier) + 校 (établissement). Beaucoup de mots japonais se laissent lire ainsi, kanji par kanji.",
      en: "学校 = 学 (study) + 校 (institution). A great many Japanese words can be read like this, kanji by kanji." },
62: { fr: "としょかん s'écrit 図書館 : « la salle des livres ». Le 館 revient dans 映画館 (cinéma) et 大使館 (ambassade) — c'est le bâtiment.",
      en: "としょかん is written 図書館: “hall of books”. That 館 returns in 映画館 (cinema) and 大使館 (embassy) — it's the building." },
63: { fr: "Le lieu devient le thème : « ici, eh bien : le Japon ». は se comporte pareil avec un lieu qu'avec une personne.",
      en: "The place becomes the topic: “here, well: Japan”. は behaves the same with a place as with a person." },
64: { fr: "トイレ vient de l'anglais « toilet », d'où le katakana. Le japonais raccourcit volontiers les emprunts trop longs.",
      en: "トイレ comes from English “toilet”, hence the katakana. Japanese happily clips borrowings that run long." },

/* g14 どこですか */
65: { fr: "駅はあそこです → 駅はどこですか : どこ prend la place exacte de la réponse. C'est la mécanique de toutes les questions japonaises.",
      en: "駅はあそこです → 駅はどこですか: どこ takes the answer's exact slot. That's the mechanism behind every Japanese question." },
66: { fr: "Probablement la phrase la plus utile de tout le voyage. On l'entend telle quelle partout, gares comprises.",
      en: "Probably the single most useful sentence in the whole journey. You'll hear it exactly like this everywhere, stations included." },
67: { fr: "どこ marche aussi pour les personnes : « où est Tanaka ? ». Pas besoin d'un verbe séparé — です suffit.",
      en: "どこ works for people too: “where is Tanaka?”. No separate verb needed — です carries it." },
68: { fr: "コンビニ est l'abrégé de « convenience store ». Le japonais tronque presque tous les longs emprunts : パソコン, リモコン, エアコン.",
      en: "コンビニ is short for “convenience store”. Japanese clips nearly every long borrowing: パソコン, リモコン, エアコン." },
69: { fr: "La réponse reprend la structure de la question, en remplaçant どこ par le lieu. Question et réponse sont jumelles.",
      en: "The answer reuses the question's structure, swapping どこ for the place. Question and answer are twins." },

/* g15 どれ・どの */
70: { fr: "どれ suppose un choix parmi trois objets ou plus. Entre deux seulement, le japonais préfère どちら.",
      en: "どれ assumes a choice among three or more. For just two, Japanese prefers どちら." },
71: { fr: "Les deux séries se répondent : これ/それ/あれ/どれ d'un côté, この/その/あの/どの de l'autre. La forme en -れ est seule, celle en -の attend un nom.",
      en: "The two series mirror each other: これ/それ/あれ/どれ on one side, この/その/あの/どの on the other. The -れ form stands alone, the -の form waits for a noun." },
72: { fr: "Pas de thème ici : la question tient en deux mots. Le japonais n'ajoute pas le « c'est » que le français réclame.",
      en: "No topic here — the question is two words. Japanese doesn't add the “is it” that English wants." },
73: { fr: "田中さんの車 forme un bloc et は se pose derrière lui. On ne glisse jamais une particule entre le の et son nom.",
      en: "田中さんの車 forms one block and は goes behind it. You never slip a particle between の and its noun." },

/* g16 だれの・私の */
74: { fr: "だれの + nom = « le … de qui ». C'est exactement le の de 私のかさ, avec だれ à la place du propriétaire.",
      en: "だれの + noun = “whose …”. It's precisely the の of 私のかさ, with だれ standing in for the owner." },
75: { fr: "私のです, sans nom derrière : の remplace le mot déjà connu, comme « le mien ». On évite ainsi de répéter かさ.",
      en: "私のです, with no noun after it: の replaces the word already established, like “mine”. It saves repeating かさ." },
76: { fr: "だれのですか = « à qui ? » — le nom est sous-entendu, il vient d'être dit. Le japonais efface tout ce qui est déjà clair.",
      en: "だれのですか = “whose?” — the noun is understood, it was just said. Japanese erases whatever is already clear." },
77: { fr: "田中さんの = « celle de Tanaka ». Le nom propre garde son さん même devant の.",
      en: "田中さんの = “Tanaka's”. The name keeps its さん even in front of の." },
78: { fr: "ペン vient de l'anglais « pen ». Ici あなたの passe bien : on désigne un objet, pas la personne elle-même.",
      en: "ペン comes from English “pen”. あなたの is fine here — you're pointing at an object, not at the person." },

/* g17 いくらですか */
79: { fr: "いくら ne sert qu'aux prix et aux quantités. Pour compter des objets, il faudra des compteurs — plus loin dans le voyage.",
      en: "いくら is only for prices and amounts. Counting objects needs counters — further along the journey." },
80: { fr: "その parce que le parapluie est du côté du vendeur. Dans un magasin, cette distinction sert vraiment.",
      en: "その because the umbrella is on the shopkeeper's side. In a shop that distinction earns its keep." },
81: { fr: "三百 se lit さんびゃく, pas ✗さんひゃく : le son change après 三. De même 六百 ろっぴゃく et 八百 はっぴゃく.",
      en: "三百 is read さんびゃく, not ✗さんひゃく — the sound shifts after 三. Likewise 六百 ろっぴゃく and 八百 はっぴゃく." },
82: { fr: "百 seul se dit ひゃく, sans « un » devant, contrairement au français « cent ». Idem pour 千 (せん).",
      en: "百 on its own is ひゃく, with no “one” in front, unlike English “a hundred”. Same for 千 (せん)." },
83: { fr: "Le billet de 千円 est le plus petit du Japon ; en dessous, ce sont des pièces. Bon à savoir avant de tendre un billet.",
      en: "The 千円 note is the smallest in Japan; below that it's coins. Worth knowing before you hand one over." },

/* g18 何時ですか */
84: { fr: "何時 se lit なんじ : encore なん, comme devant です. La règle tient — なん devant d, t, n.",
      en: "何時 is read なんじ — なん again, as before です. The rule holds: なん before d, t, n." },
85: { fr: "時 se lit じ pour l'heure (三時 さんじ) mais とき quand il signifie « moment ». Même kanji, deux emplois.",
      en: "時 is read じ for clock time (三時 さんじ) but とき when it means “moment”. Same kanji, two jobs." },
86: { fr: "七時 se dit しちじ, pas ✗ななじ. Avec 四時 (よじ) et 九時 (くじ), ce sont les trois heures irrégulières à retenir.",
      en: "七時 is しちじ, not ✗ななじ. With 四時 (よじ) and 九時 (くじ), those are the three irregular hours to memorise." },
87: { fr: "午後 = après-midi, 午前 = matin. À l'oral on compte de 1 à 12 avec ces deux mots plutôt qu'en 24 heures.",
      en: "午後 = afternoon, 午前 = morning. In speech you count 1 to 12 with these two words rather than using a 24-hour clock." },
88: { fr: "九時 se dit くじ, jamais ✗きゅうじ. Et 午前 signifie littéralement « avant midi » — le 午 est le milieu du jour.",
      en: "九時 is くじ, never ✗きゅうじ. And 午前 literally means “before noon” — 午 is midday." },

/* g19 何曜日ですか */
89: { fr: "曜日 (ようび) est le suffixe commun aux sept jours. Le retenir une fois, c'est retenir la moitié de chaque jour.",
      en: "曜日 (ようび) is the suffix shared by all seven days. Learn it once and you have half of every day name." },
90: { fr: "月曜日 = le jour de la Lune, exactement comme « lundi » (lunae dies). Les sept jours suivent les mêmes astres qu'en français.",
      en: "月曜日 = the Moon's day, exactly like “Monday”. The seven days follow the same heavenly bodies as in English." },
91: { fr: "火曜日 = le jour du Feu, et le feu c'est Mars — d'où « mardi ». La correspondance tient pour les cinq jours du milieu.",
      en: "火曜日 = the day of Fire, and fire is Mars — hence French “mardi”. The match holds for the five middle days." },
92: { fr: "日曜日 = le jour du Soleil. Le français dit « dimanche » (jour du Seigneur), mais l'anglais Sunday a gardé le soleil.",
      en: "日曜日 = the day of the Sun, which is exactly what “Sunday” says. French went the other way with “dimanche”, the Lord's day." },
93: { fr: "土曜日 = le jour de la Terre, l'astre visé étant Saturne. たんじょうび s'écrit 誕生日 : « le jour où l'on naît ».",
      en: "土曜日 = the day of Earth, the planet meant being Saturn — which is what “Saturday” says too. たんじょうび is written 誕生日: “the day one is born”." },

48: { fr: "だれ vient là où irait la réponse, juste avant です. C'est la règle générale des mots interrogatifs en japonais.",
      en: "だれ goes where the answer would go, right before です. That's the general rule for question words in Japanese." },

/* ============ ARC 3 — 鎌倉 ============ */

/* g20 ～があります */
94:  { fr: "が, pas は : la chose qui apparaît dans la phrase est une information neuve. は servirait à en reparler ensuite.",
       en: "が, not は: the thing being introduced is new information. は would be for talking about it again afterwards." },
95:  { fr: "水 est indénombrable, et le japonais s'en moque : あります ne change pas selon la quantité ni le nombre.",
       en: "水 is uncountable, and Japanese doesn't care: あります never changes for quantity or number." },
96:  { fr: "La question ne déplace rien : on ajoute か derrière あります. La particule interrogative reste toujours en dernier.",
       en: "The question moves nothing: か goes on the end of あります. The question particle is always last." },
97:  { fr: "お金 porte un お de politesse soudé au mot — on ne dit presque jamais 金 seul pour « argent ». Même お que dans お名前.",
       en: "お金 carries a polite お fused to the word — bare 金 is almost never used for “money”. The same お as in お名前." },
98:  { fr: "時間がありません, littéralement « du temps n'existe pas ». Le japonais dit ce que le français rend par « je n'ai pas » — il n'y a pas de verbe « avoir ».",
       en: "時間がありません is literally “time does not exist”. Japanese has no verb “to have”; existence does the work." },

/* g21 ～がいます */
99:  { fr: "います pour ce qui bouge de soi-même. C'est la seule chose qui sépare います d'あります — pas le sens de « il y a ».",
       en: "います for whatever moves under its own power. That's the only thing separating います from あります — not the meaning “there is”." },
100: { fr: "L'erreur classique du débutant : ✗ねこがあります. Un chat se déplace, donc います. Une plante, elle, prend あります.",
       en: "The classic beginner's slip: ✗ねこがあります. A cat moves, so います. A plant, though, takes あります." },
101: { fr: "子ども ne marque pas le pluriel : « un enfant » ou « des enfants », seul le contexte tranche. Le nombre viendra des compteurs.",
       en: "子ども doesn't mark plural: “a child” or “children”, only context decides. Number comes later, from counters." },
102: { fr: "だれ prend が et non は : on demande qui existe là, pas ce qu'on peut dire de quelqu'un. Les mots interrogatifs refusent は.",
       en: "だれ takes が, not は: you're asking who exists there, not what can be said about someone. Question words refuse は." },
103: { fr: "いません, la négation d'います : le い reste, seul ます devient ません. Rien à voir avec ありません.",
       en: "いません is います negated — the い stays, only ます becomes ません. Nothing to do with ありません." },

/* g22 場所に～があります */
104: { fr: "Le japonais pose d'abord le décor, puis ce qui s'y trouve : [lieu]に [chose]が. L'inverse exact du français « il y a des gens à la gare ».",
       en: "Japanese sets the scene first, then what's in it: [place]に [thing]が. The exact reverse of “there are people at the station”." },
105: { fr: "に marque le lieu où quelque chose SE TROUVE. Pour le lieu où l'on agit, ce sera で — la confusion に/で est la plus tenace.",
       en: "に marks where something IS. For where something HAPPENS it will be で — the に/で mix-up is the most persistent of all." },
106: { fr: "Un seul に pour tous les lieux, quel que soit le français : « à », « dans », « chez », « sur ». Le japonais ne distingue pas.",
       en: "One single に for every location, whatever English uses: “at”, “in”, “on”. Japanese doesn't distinguish." },
107: { fr: "テレビ vient de « television », coupé en deux syllabes. Comme コンビニ ou パソコン : le japonais garde le début et jette la fin.",
       en: "テレビ comes from “television”, clipped to two syllables — like コンビニ or パソコン. Japanese keeps the front and drops the rest." },
108: { fr: "にわ (庭) est le jardin attenant à la maison, pas le parc public — celui-là, c'est こうえん (公園).",
       en: "にわ (庭) is the garden attached to a house, not a public park — that one is こうえん (公園)." },
109: { fr: "たくさん se met juste avant le verbe, pas contre le nom : ✗たくさんの本があります est possible mais moins naturel ici.",
       en: "たくさん sits just before the verb, not against the noun: ✗たくさんの本があります is possible but less natural here." },

/* g23 上・下・中・前・後ろ */
110: { fr: "つくえ (机) est le bureau-meuble. Le bureau-lieu-de-travail se dit 会社 ou じむしょ — le français confond les deux, le japonais non.",
       en: "つくえ (机) is the desk you sit at. The office you work in is 会社 or じむしょ — English blurs the two, Japanese doesn't." },
111: { fr: "中 = l'intérieur. かばんの中に = « dans l'intérieur du sac ». Le même 中 se lit なか ici, mais ちゅう dans 中国.",
       en: "中 is the inside. かばんの中に = “in the interior of the bag”. That same 中 is なか here but ちゅう in 中国." },
112: { fr: "前 sert pour l'espace ET pour le temps : 駅の前 = devant la gare, 三時前 = avant trois heures.",
       en: "前 covers both space and time: 駅の前 = in front of the station, 三時前 = before three o'clock." },
113: { fr: "Deux の d'affilée seraient lourds, un seul suffit : いすの下に. Et c'est います, parce qu'un chat bouge.",
       en: "Two の in a row would be heavy; one is enough: いすの下に. And it's います, because a cat moves." },
114: { fr: "ちかく n'est pas un point mais une zone : « les environs de ». D'où le の, comme pour 上 ou 中.",
       en: "ちかく isn't a point but a zone: “the vicinity of”. Hence the の, just like 上 or 中." },

/* g24 AとB */
115: { fr: "と ferme la liste : du pain et des œufs, un point c'est tout. S'il y avait autre chose, il faudrait や.",
       en: "と closes the list: bread and eggs, and that's all of it. If there were other things you'd need や." },
116: { fr: "と ne relie que des noms. Pour enchaîner deux phrases (« et puis »), le japonais utilise la forme て, bien plus loin.",
       en: "と only links nouns. To chain two clauses (“and then”) Japanese uses the て form, much further on." },
117: { fr: "Trois particules dans une phrase, chacune à son poste : の relie, に situe, と énumère, が désigne ce qui existe.",
       en: "Three particles in one sentence, each at its post: の links, に locates, と lists, が marks what exists." },
118: { fr: "おちゃ porte l'お poli comme お金. Sans lui, ちゃ seul ne s'emploie pas — l'お a fusionné avec le mot.",
       en: "おちゃ carries the polite お like お金. Bare ちゃ isn't used — the お has fused into the word." },
119: { fr: "と relie aussi les personnes. Chacune garde son さん : 田中さんと山田さん, jamais un seul さん pour les deux.",
       en: "と links people too, and each keeps their さん: 田中さんと山田さん, never one さん covering both." },

/* g25 AやB */
120: { fr: "ペン est un emprunt, 本 un mot japonais, et la liste les mélange sans que cela choque. Les emprunts sont pleinement assimilés.",
       en: "ペン is a borrowing, 本 a native word, and the list mixes them without a second thought. Borrowings are fully naturalised." },
121: { fr: "Utile au supermarché : や évite d'énumérer tout le rayon. Le français rend souvent ce や par des points de suspension.",
       en: "Handy in a supermarket: や saves listing the whole aisle. English usually renders it as “and so on”." },
122: { fr: "Choisir や plutôt que と, c'est dire discrètement « il y a d'autres choses ». Le choix de particule porte du sens à lui seul.",
       en: "Choosing や over と quietly says “there's more”. The particle choice carries meaning on its own." },
123: { fr: "レストラン et コンビニ viennent tous deux de l'anglais, d'où le katakana pour les deux mots de la liste.",
       en: "レストラン and コンビニ both come from English, which is why both items in the list are in katakana." },

/* g26 一つ・二人・三本… */
124: { fr: "三つ (みっつ) suit le comptage japonais d'origine, pas le sino-japonais さん. Ces compteurs-là sont les plus anciens de la langue.",
       en: "三つ (みっつ) follows the native Japanese count, not the Sino-Japanese さん. These counters are the oldest in the language." },
125: { fr: "五つ se dit いつつ. La série ひとつ・ふたつ・みっつ・よっつ・いつつ ne ressemble pas du tout à いち・に・さん — ce sont deux systèmes.",
       en: "五つ is いつつ. The series ひとつ・ふたつ・みっつ・よっつ・いつつ looks nothing like いち・に・さん — they are two separate systems." },
126: { fr: "二人 se dit ふたり, pas ✗ににん. 一人 ひとり et 二人 ふたり sont irréguliers ; à partir de trois, tout redevient régulier en ～にん.",
       en: "二人 is ふたり, not ✗ににん. 一人 ひとり and 二人 ふたり are irregular; from three on, everything is regular ～にん." },
127: { fr: "Le nombre se place APRÈS le nom et sa particule, juste avant le verbe : 学生が三人います. Jamais devant le nom.",
       en: "The number goes AFTER the noun and its particle, right before the verb: 学生が三人います. Never in front of the noun." },
128: { fr: "二つ = ふたつ, du même comptage natif que みっつ. On l'entend partout dans les magasins.",
       en: "二つ = ふたつ, from the same native count as みっつ. You'll hear it constantly in shops." },

/* g27 いくつ・何人 */
129: { fr: "Ici は et non が : on ne signale plus l'existence des pommes, on interroge sur celles dont on parle déjà.",
       en: "は here, not が: we're no longer announcing that apples exist, we're asking about ones already under discussion." },
130: { fr: "いくつ vient du même いく- que いくら. L'un compte les objets, l'autre compte l'argent.",
       en: "いくつ shares its いく- with いくら. One counts objects, the other counts money." },
131: { fr: "何人 se lit なんにん : encore le なん devant une consonne d/t/n. Deux ん de suite, prononcés bien nettement.",
       en: "何人 is read なんにん — なん again before a d/t/n consonant. Two ん in a row, each clearly pronounced." },
132: { fr: "Question et réponse partagent la structure : 何人いますか → 三人います. Il suffit de remplacer le mot interrogatif.",
       en: "Question and answer share a structure: 何人いますか → 三人います. You just swap out the question word." },

/* g28 何も～ません */
133: { fr: "何も exige un verbe négatif : ✗何もあります est impossible. Le も et le ません travaillent en paire.",
       en: "何も demands a negative verb — ✗何もあります is impossible. The も and the ません work as a pair." },
134: { fr: "だれも + négatif = personne. Le même も qui voulait dire « aussi » sert ici à balayer la totalité.",
       en: "だれも + negative = nobody. The same も that meant “too” is here sweeping the whole set to zero." },
135: { fr: "何も remplace le nom ET sa particule : on ne dit pas ✗何もがありません. も chasse が comme il chassait は.",
       en: "何も replaces the noun AND its particle — never ✗何もがありません. も drives out が just as it drove out は." },
136: { fr: "Deux négations en français (« personne… ne »), une seule en japonais : le ません porte tout.",
       en: "English needs a single negative here; French needs two. Japanese puts it all in the ません." },

/* ============ ARC 4 — 富士山 ============ */

/* g29 ～へ行きます */
137: { fr: "へ se prononce « e », jamais « he ». C'est le troisième signe à double vie, avec は (wa) et を (o) — tous les trois sont des particules.",
       en: "へ is pronounced “e”, never “he”. It's the third sign with a double life, alongside は (wa) and を (o) — all three are particles." },
138: { fr: "あした ouvre la phrase sans particule : les mots de temps relatifs se posent là, nus. Le sujet « je » n'est même pas dit.",
       en: "あした opens the sentence with no particle: relative time words sit there bare. The “I” isn't stated at all." },
139: { fr: "来ます = venir vers là où je suis. Si Tanaka allait ailleurs, il faudrait 行きます — le japonais choisit selon l'endroit où l'on parle.",
       en: "来ます = come towards where I am. If Tanaka were going elsewhere it would be 行きます — Japanese picks by where the speaker stands." },
140: { fr: "かえります veut dire rentrer chez soi ou d'où l'on vient — pas simplement « retourner ». うち, c'est le foyer, plus que la maison-bâtiment (いえ).",
       en: "かえります means to return home or to where you came from, not merely “to go back”. うち is the home, more than the house-building (いえ)." },
141: { fr: "どこ prend へ comme n'importe quelle destination. Le mot interrogatif garde toujours la particule qu'aurait la réponse.",
       en: "どこ takes へ like any destination. A question word always keeps the particle the answer would have had." },

/* g30 ～に行きます */
142: { fr: "に vise le point d'arrivée, へ la direction empruntée. Ici les deux passent — c'est l'un des rares endroits où le japonais laisse le choix.",
       en: "に targets the arrival point, へ the direction taken. Both work here — one of the rare places Japanese offers a free choice." },
143: { fr: "Deux compléments de suite, temps puis lieu : あした、としょかんに. Le japonais va du plus large au plus précis.",
       en: "Two complements in a row, time then place: あした、としょかんに. Japanese moves from the broadest frame to the narrowest." },
144: { fr: "びょういん (病院) = l'hôpital ; ne pas confondre avec びよういん (美容院), le salon de coiffure. Une seule voyelle longue les sépare.",
       en: "びょういん (病院) is the hospital; don't confuse it with びよういん (美容院), the hairdresser. One long vowel apart." },
145: { fr: "来ます parce que Tanaka vient vers le lieu où se tient celui qui parle. Le verbe encode le point de vue.",
       en: "来ます because Tanaka is coming towards where the speaker is. The verb encodes the point of view." },
146: { fr: "Pas de futur en japonais : 行きます sert pour maintenant et pour l'an prochain. C'est 来年 qui situe la phrase dans le temps.",
       en: "Japanese has no future tense: 行きます covers now and next year alike. It's 来年 that places the sentence in time." },

/* g31 ～で行きます */
147: { fr: "で = par quel moyen. C'est le même で que dans « écrire au stylo » ou « manger avec des baguettes » — l'instrument, au sens large.",
       en: "で = by what means. It's the same で as in “write with a pen” or “eat with chopsticks” — the instrument, broadly." },
148: { fr: "Deux particules, deux rôles : で dit comment, に dit où. Elles cohabitent sans se gêner, chacune collée à son mot.",
       en: "Two particles, two jobs: で says how, に says where. They sit side by side without interfering, each glued to its word." },
149: { fr: "じてんしゃ (自転車) = « véhicule qui tourne tout seul ». Le japonais décrit souvent l'objet plutôt que de l'emprunter à l'anglais.",
       en: "じてんしゃ (自転車) = “vehicle that turns by itself”. Japanese often describes the object rather than borrowing an English word." },
150: { fr: "ひこうき (飛行機) = « machine qui vole ». Attention : à pied se dit あるいて, SANS で — c'est la seule exception de la série.",
       en: "ひこうき (飛行機) = “flying machine”. Note the exception: on foot is あるいて, with NO で — the only one in the set." },
151: { fr: "会社 = l'entreprise ; c'est le mot qu'on trouve dans かいしゃいん, l'employé. Ici il désigne le lieu de travail.",
       en: "会社 is the company — the word inside かいしゃいん, the employee. Here it stands for the workplace." },

/* g32 ～と行きます */
152: { fr: "Encore と, mais un autre emploi : ici « avec », plus « et ». Une même particule change de sens selon ce qu'elle relie.",
       en: "と again, but a different job: “with” here, not “and”. One particle shifts meaning depending on what it joins." },
153: { fr: "スーパー est l'abrégé de « supermarket ». Le japonais garde la première moitié — comme デパート pour « department store ».",
       en: "スーパー is short for “supermarket”. Japanese keeps the front half — like デパート for “department store”." },
154: { fr: "きっさてん (喫茶店) = le café à l'ancienne, silencieux, où l'on s'assoit. Différent de カフェ, plus moderne.",
       en: "きっさてん (喫茶店) is the old-fashioned quiet coffee house where you sit a while. Different from カフェ, which is modern." },
155: { fr: "Trois compléments empilés — qui, avec qui, vers où — et le verbe toujours en dernier. C'est la charpente de toute phrase japonaise.",
       en: "Three complements stacked — who, with whom, to where — and the verb always last. That's the frame of every Japanese sentence." },
156: { fr: "一人で et non ✗一人と : « seul » se dit avec で, la particule du moyen. Piège classique, puisque と signifie « avec ».",
       en: "一人で, not ✗一人と: “alone” takes で, the means particle. A classic trap, since と is the one that means “with”." },

/* g33 から・まで */
157: { fr: "から et まで encadrent le trajet, comme « de… à… ». Ils fonctionnent pareil pour l'espace et pour le temps.",
       en: "から and まで bracket the journey, like “from… to…”. They work identically for space and for time." },
158: { fr: "から peut s'employer seul, sans まで : on donne le début et on laisse la fin ouverte. です suffit à finir la phrase.",
       en: "から can stand alone without まで: you give the start and leave the end open. です is enough to close the sentence." },
159: { fr: "まで seul marque la limite : « jusqu'à 17 h et pas au-delà ». Le point de départ est sous-entendu.",
       en: "まで alone marks the limit: “until 5pm and no later”. The starting point is left implied." },
160: { fr: "Quatre particules à la file : から、まで、で. Chacune colle au mot qui la précède, jamais à celui qui suit.",
       en: "Several particles in a row: から, まで, で. Each clings to the word before it, never to the one after." },
161: { fr: "から…まで…です : sans verbe. En japonais, です suffit à dire « c'est ouvert de… à… ».",
       en: "から…まで…です, with no verb at all. In Japanese です is enough to say “it's open from… to…”." },

/* g34 何で行きますか */
162: { fr: "何で se lit なんで ici : « par quel moyen ». Attention, なんで peut aussi vouloir dire « pourquoi » — le contexte tranche.",
       en: "何で is read なんで here: “by what means”. Careful — なんで can also mean “why”; context decides." },
163: { fr: "La réponse remplacera なんで par 電車で : le mot interrogatif occupe la place et la particule de la réponse.",
       en: "The answer will swap なんで for 電車で: the question word holds the answer's slot and its particle." },
164: { fr: "Réponse minimale, sans sujet ni destination : tout ce qui vient d'être dit disparaît. Le japonais ne répète pas.",
       en: "A minimal answer, no subject, no destination: everything just said drops away. Japanese doesn't repeat." },
165: { fr: "だれと = avec qui. Comparez avec だれの (à qui) et だれが (qui) : c'est la particule qui fait la question.",
       en: "だれと = with whom. Compare だれの (whose) and だれが (who): the particle is what makes the question." },
166: { fr: "だれと et へ dans la même phrase : compagnon puis destination. L'ordre est souple, seul le verbe est fixé à la fin.",
       en: "だれと and へ in one sentence: companion then destination. The order is flexible; only the verb is pinned to the end." },

/* g35 いつ・今日・明日 */
167: { fr: "いつ ne prend jamais に : ✗いつに n'existe pas. C'est le mot interrogatif du temps relatif, et le temps relatif refuse に.",
       en: "いつ never takes に — ✗いつに doesn't exist. It's the question word for relative time, and relative time refuses に." },
168: { fr: "あした sans に, mais 東京 avec に : le temps relatif est nu, la destination non. Deux règles qui se croisent dans la même phrase.",
       en: "あした with no に, but 東京 with に: relative time goes bare, destinations don't. Two rules crossing in one sentence." },
169: { fr: "今 est le plus relatif des mots de temps : ✗今に est impossible. Il se pose seul, comme あした ou きのう.",
       en: "今 is the most relative time word of all — ✗今に is impossible. It stands bare, like あした or きのう." },
170: { fr: "毎日 (まいにち) = « chaque jour ». Le 毎 revient dans 毎週, 毎月, 毎年 — un kanji qui rend n'importe quelle unité répétitive.",
       en: "毎日 (まいにち) = “every day”. That 毎 returns in 毎週, 毎月, 毎年 — one kanji that makes any unit repeat." },
171: { fr: "来週 = la semaine qui vient ; le même 来 que dans 来ます (venir) et 来年. Le temps « vient » vers nous en japonais.",
       en: "来週 = the coming week; the same 来 as in 来ます (to come) and 来年. In Japanese, time “comes” towards you." },

/* g36 七時に */
172: { fr: "Voici l'autre moitié de la règle : une heure PRÉCISE prend に, un temps relatif n'en prend pas. Pointable sur une horloge → に.",
       en: "Here's the other half of the rule: a PRECISE time takes に, relative time doesn't. If you can point at it on a clock → に." },
173: { fr: "十時 = 22 h ici : le japonais compte de 1 à 12 et laisse le contexte, ou 午前/午後, préciser la moitié du jour.",
       en: "十時 means 10pm here: Japanese counts 1 to 12 and lets context, or 午前/午後, sort out which half of the day." },
174: { fr: "Deux に aux rôles différents dans une phrase : le premier situe dans le temps, le second désigne la destination.",
       en: "Two に with different jobs in one sentence: the first places it in time, the second marks the destination." },
175: { fr: "午前九時に : les jours de la semaine et les heures précises prennent に, parce qu'on peut les pointer sur un calendrier.",
       en: "午前九時に: weekdays and clock times take に, because you can point at them on a calendar." },
176: { fr: "出かけます (でかけます) = sortir de chez soi pour aller quelque part, pas simplement « sortir d'une pièce ».",
       en: "出かけます (でかけます) means to head out from home to go somewhere, not simply “to leave a room”." },

/* g37 公園を散歩します */
177: { fr: "Un を surprenant : il ne marque pas un objet mais l'espace PARCOURU. Réservé aux verbes de déplacement.",
       en: "A surprising を: it marks not an object but the space TRAVERSED. Reserved for verbs of movement." },
178: { fr: "道 se lit みち seul, mais どう en composé : 書道 (calligraphie), 柔道 (judo) — « la voie ». C'est le même kanji que dans 北海道.",
       en: "道 is read みち alone but どう in compounds: 書道 (calligraphy), 柔道 (judo) — “the way”. The same kanji as in 北海道." },
179: { fr: "毎日 en tête, sans particule, puis こうえんを : le temps relatif d'abord, le parcours ensuite.",
       en: "毎日 up front with no particle, then こうえんを: relative time first, the path travelled second." },
180: { fr: "さんぽします vient du nom さんぽ (散歩, la promenade) + します. Des centaines de verbes japonais se fabriquent ainsi.",
       en: "さんぽします is the noun さんぽ (散歩, a walk) + します. Hundreds of Japanese verbs are built this way." },

/* ============ ARC 5 — 名古屋 ============ */

/* g38 ～を＋ます */
181: { fr: "を ne se prononce pas « wo » mais « o ». Il ne sert qu'à une chose : marquer l'objet — on ne le rencontre jamais ailleurs qu'en particule.",
       en: "を is pronounced “o”, not “wo”. It does exactly one job — marking the object — and never appears outside that role." },
182: { fr: "飲みます couvre boire au sens large : eau, thé, mais aussi « prendre » un médicament (くすりを飲みます).",
       en: "飲みます covers drinking broadly: water, tea — and also “taking” medicine (くすりを飲みます)." },
183: { fr: "読みます (よみます) partage son 読 avec 読書 (la lecture). Le verbe et le nom savant se répondent souvent ainsi.",
       en: "読みます (よみます) shares its 読 with 読書 (reading, as a pursuit). Verb and bookish noun often echo each other like this." },
184: { fr: "見ます = voir et regarder à la fois. Le japonais ne sépare pas les deux comme le français.",
       en: "見ます means both to see and to watch. Japanese doesn't split the two the way English does." },
185: { fr: "べんきょうします = べんきょう (l'étude) + します. Le nom porte le sens, します le conjugue — d'où la négation べんきょうしません.",
       en: "べんきょうします = べんきょう (study) + します. The noun carries the meaning, します does the conjugating — hence べんきょうしません." },
186: { fr: "聞きます veut dire écouter ET demander. Au point g43 vous le retrouverez avec に : 先生に聞きます = demander au professeur.",
       en: "聞きます means both to listen and to ask. At g43 you'll meet it with に: 先生に聞きます = to ask the teacher." },

/* g39 ～ません */
187: { fr: "Rien ne s'ajoute : ます devient ません, un seul mot change. Le français, lui, encadre le verbe de « ne… pas ».",
       en: "Nothing is added: ます becomes ません, one word changing. English needs a whole auxiliary, “do not”." },
188: { fr: "ビール vient du néerlandais « bier », pas de l'anglais : les Néerlandais commerçaient au Japon bien avant les autres.",
       en: "ビール comes from Dutch “bier”, not English — the Dutch were trading with Japan long before anyone else." },
189: { fr: "今日は avec は et non pas nu : le は marque un contraste, « aujourd'hui du moins, je ne regarde pas ». Très fréquent en phrase négative.",
       en: "今日は with は rather than bare: the は adds contrast, “today at least, I'm not watching”. Very common in negatives." },
190: { fr: "Le présent négatif vaut aussi pour le futur : 行きません dit « je n'y vais pas » et « je n'irai pas ». C'est あした qui tranche.",
       en: "The negative present covers the future too: 行きません is both “I don't go” and “I won't go”. あした settles which." },
191: { fr: "りょうりしません, sur le même moule que べんきょうします. Notez que la négation frappe le します, jamais le nom.",
       en: "りょうりしません, on the same pattern as べんきょうします. The negative lands on します, never on the noun." },

/* g40 ～ました */
192: { fr: "Un seul ました pour tous les verbes, sans exception. Après le français et ses participes, c'est presque un cadeau.",
       en: "One single ました for every verb, no exceptions. After English's irregular pasts, it's almost a gift." },
193: { fr: "あさごはん = 朝 (matin) + ごはん (riz cuit, repas). Le riz est si central qu'il donne son nom à tous les repas : ひるごはん, ばんごはん.",
       en: "あさごはん = 朝 (morning) + ごはん (cooked rice, meal). Rice is so central it names every meal: ひるごはん, ばんごはん." },
194: { fr: "先週 = la semaine passée ; le 先 signifie ici « avant ». Le même kanji que dans 先生 — celui qui est né avant, donc le maître.",
       en: "先週 = last week; here 先 means “previous”. The same kanji as in 先生 — the one born before you, hence the teacher." },
195: { fr: "きのう en tête sans particule, comme tous les temps relatifs. Le verbe au passé suffit, きのう ne fait que préciser.",
       en: "きのう up front with no particle, like every relative time word. The past verb does the work; きのう just pins it down." },
196: { fr: "すし s'écrit souvent 寿司, mais on le voit aussi en hiragana sur les enseignes. Et と marque ici le compagnon, pas la liste.",
       en: "すし is often written 寿司, but you'll see plain hiragana on shop signs too. And と here marks the companion, not a list." },

/* g41 ～ませんでした */
197: { fr: "ません + でした : la négation d'abord, le passé ensuite. Le japonais empile les briques dans cet ordre, toujours.",
       en: "ません + でした: negative first, past second. Japanese stacks the pieces in that order, always." },
198: { fr: "Vous tenez les quatre formes des verbes : ます / ません / ました / ませんでした. Exactement le schéma de です vu à l'arc 1.",
       en: "You now have all four verb forms: ます / ません / ました / ませんでした. Exactly the です pattern from arc 1." },
199: { fr: "先週 marque le passé, et ませんでした le confirme. Le japonais accepte cette redondance sans broncher.",
       en: "先週 signals the past and ませんでした confirms it. Japanese is perfectly happy with that redundancy." },
200: { fr: "来ませんでした : le verbe 来る est irrégulier ailleurs, mais ici tout est régulier — 来ます、来ません、来ました.",
       en: "来ませんでした: 来る is irregular elsewhere, but here everything is regular — 来ます, 来ません, 来ました." },
201: { fr: "何も appelle le négatif, et きのうは porte le contraste : « hier au moins ». Deux mécanismes dans une phrase courte.",
       en: "何も demands the negative, and きのうは carries contrast: “yesterday at least”. Two mechanisms in one short sentence." },

/* g42 場所で～ます */
202: { fr: "で pour le lieu de l'ACTION, に pour le lieu de la PRÉSENCE. 駅にいます = je suis à la gare ; 駅で待ちます = j'attends à la gare.",
       en: "で for where the ACTION happens, に for where something IS. 駅にいます = I'm at the station; 駅で待ちます = I wait at the station." },
203: { fr: "としょかんで, pas ✗としょかんに : étudier est une action. Cette paire に/で est la difficulté la plus tenace du niveau N5.",
       en: "としょかんで, not ✗としょかんに: studying is an action. This に/で pair is the most stubborn difficulty at N5." },
204: { fr: "うち = chez soi, le foyer. いえ désigne plutôt le bâtiment. « À la maison » se dit presque toujours うちで.",
       en: "うち = one's home, the household. いえ is more the building. “At home” is nearly always うちで." },
205: { fr: "コーヒー s'écrit avec deux ー : こおひい ne s'écrit pas ainsi. Au clavier, on tape « ko-hi- » avec les tirets.",
       en: "コーヒー has two ー marks. On a keyboard you type “ko-hi-” with the dashes to get them." },
206: { fr: "Trois compléments : lieu de l'action (で), compagnon (と), puis le verbe. Chaque particule tient son mot par la main.",
       en: "Three complements: place of action (で), companion (と), then the verb. Each particle holds its own word by the hand." },
207: { fr: "デパート est l'abrégé de « department store ». かいものします = かいもの (les courses) + します, encore le même moule.",
       en: "デパート is short for “department store”. かいものします = かいもの (shopping) + します — the same mould again." },

/* g43 友だちに会います */
208: { fr: "Un troisième emploi de に : le destinataire de l'action. 電話します s'emploie toujours avec に, jamais avec を.",
       en: "A third job for に: the person an action is aimed at. 電話します always takes に, never を." },
209: { fr: "Deux particules autour du verbe : に dit à qui, を dit quoi. L'ordre habituel place le destinataire avant l'objet.",
       en: "Two particles around the verb: に says to whom, を says what. The usual order puts the recipient before the object." },
210: { fr: "聞きます signifie ici « demander ». Avec を c'était « écouter » (おんがくを聞きます) : la particule change le sens du verbe.",
       en: "聞きます means “ask” here. With を it was “listen” (おんがくを聞きます): the particle changes the verb's meaning." },
211: { fr: "会います prend に et non を : en japonais on rencontre « à » quelqu'un. ✗友だちを会います est une faute fréquente.",
       en: "会います takes に, not を: in Japanese you meet “to” someone. ✗友だちを会います is a common mistake." },
212: { fr: "あげます = donner de moi vers l'autre. Le japonais a des verbes différents selon la direction du don — vous les verrez plus tard.",
       en: "あげます = give, outward from me. Japanese has different verbs depending on which way a gift travels — more on that later." },

/* g44 ～ね */
213: { fr: "On dit 雨ですね en levant les yeux : ね ne fonctionne que sur du partagé. Seul chez soi, on marmonnerait plutôt 雨だなあ.",
       en: "You say 雨ですね while looking up: ね only works on something shared. Alone at home you'd mutter 雨だなあ instead." },
214: { fr: "ね sert aussi à vérifier poliment ce qu'on croit savoir : « c'est bien Tanaka ? ». Plus doux qu'une question en か.",
       en: "ね also politely checks something you think you know: “that's Tanaka, right?”. Gentler than a straight か question." },
215: { fr: "À l'oral, ね s'allonge : ですねぇ. Plus il traîne, plus il cherche la connivence.",
       en: "In speech ね stretches out: ですねぇ. The longer it lingers, the more it fishes for agreement." },
216: { fr: "ね crée de la complicité — un des mots les plus fréquents de la conversation japonaise, et l'un des plus vite naturels.",
       en: "ね builds rapport — one of the most frequent words in Japanese conversation, and one of the first to feel natural." },
217: { fr: "Une phrase longue peut se terminer par ね : la particule finale s'attache à toute la phrase, pas au dernier mot.",
       en: "Even a long sentence can end in ね: a final particle attaches to the whole sentence, not to the last word." },

/* g45 ～よ */
218: { fr: "よ apporte du neuf, ね partage du connu. Dire ですね à propos d'un prix que l'autre ignore sonnerait faux.",
       en: "よ brings news, ね shares what's known. Saying ですね about a price the other person doesn't know would ring false." },
219: { fr: "Attention au dosage : よ affirmé peut sembler donner une leçon. Entre amis c'est parfait, avec un supérieur on l'évite.",
       en: "Mind the dose: a firm よ can sound like you're lecturing. Fine among friends, avoided with a superior." },
220: { fr: "よ typique du renseignement rendu à un inconnu : on lui apprend quelque chose d'utile qu'il ne sait pas.",
       en: "A typical よ for helping a stranger: you're telling them something useful they didn't know." },
221: { fr: "よ après une négation prévient d'un fait contraire à ce que l'autre attend. C'est presque « je te préviens ».",
       en: "よ after a negative warns of something contrary to what the listener expects. Almost “fair warning”." },

/* g46 毎日・よく・時々 */
222: { fr: "Les mots de fréquence se placent avant le verbe, mais leur position est souple. Seul le verbe est cloué à la fin.",
       en: "Frequency words come before the verb, but their position is flexible. Only the verb is nailed to the end." },
223: { fr: "時々 s'écrit avec 々, le signe de répétition : il redouble le kanji précédent. On le retrouve dans 人々 (les gens).",
       en: "時々 uses 々, the repetition mark, which doubles the preceding kanji. You'll see it again in 人々 (people)." },
224: { fr: "毎日 devant, こうえんを au milieu : le を du parcours, vu à l'arc 4. Les briques s'empilent sans se gêner.",
       en: "毎日 first, こうえんを in the middle: the path を from arc 4. The pieces stack without interfering." },
225: { fr: "あまり EXIGE un verbe négatif : ✗あまり見ます est impossible. Le mot ne vit qu'en compagnie d'une négation.",
       en: "あまり REQUIRES a negative verb — ✗あまり見ます is impossible. The word only lives alongside a negative." },
226: { fr: "ぜんぜん est encore plus strict qu'あまり : toujours négatif, et il signifie « pas du tout », zéro absolu.",
       en: "ぜんぜん is stricter still than あまり: always negative, and it means “not at all” — absolute zero." },
227: { fr: "まいあさ = 毎 (chaque) + あさ (matin), sur le modèle de 毎日. Le 毎 se recolle à presque n'importe quelle unité de temps.",
       en: "まいあさ = 毎 (every) + あさ (morning), on the 毎日 pattern. That 毎 glues onto almost any unit of time." },

/* g47 もう・まだ */
228: { fr: "もう + passé = « déjà ». Le même もう avec un présent voudra dire « encore un » — もう一つ.",
       en: "もう + past = “already”. The same もう with a present means “another” — もう一つ, one more." },
229: { fr: "La réponse reprend もう : c'est naturel, et cela confirme qu'on a bien compris la question.",
       en: "The answer echoes もう: natural, and it confirms the question was understood." },
230: { fr: "まだです est la réponse attendue, et non ✗食べませんでした — qui voudrait dire « je n'ai pas mangé du tout ». まだ laisse la porte ouverte.",
       en: "まだです is the expected answer, not ✗食べませんでした, which would mean “I didn't eat at all”. まだ leaves the door open." },
231: { fr: "もう九時 : ici « déjà » porte sur l'heure, avec une nuance d'alarme. Le よ ajoute l'avertissement.",
       en: "もう九時: here “already” is about the time, with a note of alarm. The よ adds the warning." },
232: { fr: "まだ + négatif = « pas encore ». Avec un affirmatif, まだ voudrait dire « encore » : まだいます = il est encore là.",
       en: "まだ + negative = “not yet”. With an affirmative, まだ means “still”: まだいます = he's still here." },

/* g48 ごろ・ぐらい */
233: { fr: "ごろ pour un MOMENT approximatif. Il se colle directement à l'heure, sans に : ✗七時ごろに est possible mais lourd.",
       en: "ごろ for an approximate MOMENT. It sticks straight onto the time with no に — ✗七時ごろに is possible but clunky." },
234: { fr: "ごろ remplace ici le に de l'heure précise. Approximatif et précis ne se cumulent pas.",
       en: "Here ごろ replaces the に of an exact time. Approximate and exact don't stack." },
235: { fr: "一時間 se lit いちじかん. Attention : 時間 est la DURÉE, 時 l'heure qu'il est — 三時 = 15 h, 三時間 = trois heures de durée.",
       en: "一時間 is read いちじかん. Careful: 時間 is a DURATION, 時 is the time on the clock — 三時 = 3 o'clock, 三時間 = three hours long." },
236: { fr: "十分 se lit じゅっぷん : le ふん devient ぷん après certains nombres. 一分 いっぷん, 三分 さんぷん, 六分 ろっぷん.",
       en: "十分 is read じゅっぷん — ふん becomes ぷん after certain numbers: 一分 いっぷん, 三分 さんぷん, 六分 ろっぷん." },
237: { fr: "On écrit aussi くらい : les deux formes coexistent, ぐらい après un nombre, くらい un peu partout ailleurs.",
       en: "You'll also see くらい: both forms coexist, ぐらい tending to follow a number, くらい turning up elsewhere." },

/* g49 一週間に三回 */
238: { fr: "Encore un に, un cinquième emploi : le rythme. いっかい s'écrit 一回, avec le っ qui apparaît après 一.",
       en: "Another に, a fifth job: rhythm. いっかい is written 一回, with the っ that shows up after 一." },
239: { fr: "L'ordre est fixe : période, に, puis le nombre de fois. Jamais l'inverse — ✗三回に一週間 ne veut rien dire.",
       en: "The order is fixed: period, に, then the number of times. Never the reverse — ✗三回に一週間 means nothing." },
240: { fr: "一日 se lit ici いちにち, « une journée ». Mais le premier du mois s'écrit pareil et se lit ついたち — l'une des lectures les plus irrégulières de la langue.",
       en: "一日 is read いちにち here, “one day”. But the first of the month is written identically and read ついたち — one of the most irregular readings in the language." },
241: { fr: "はしります (走ります) et あるきます (歩きます) prennent tous deux le を du parcours : こうえんを走ります.",
       en: "はしります (走ります) and あるきます (歩きます) both take the path を: こうえんを走ります." },

/* ============ ARC 6 — 京都 ============ */

/* g50 ～ませんか */
242: { fr: "Une invitation à la forme NÉGATIVE : « ne mangeriez-vous pas ? ». Le négatif laisse à l'autre une porte de sortie — c'est ce qui la rend polie.",
       en: "An invitation in the NEGATIVE: “wouldn't you eat?”. The negative leaves the other person a way out, and that's what makes it polite." },
243: { fr: "ませんか se distingue de ません + か par l'intonation et par le contexte : ici on propose, on n'interroge pas sur un fait.",
       en: "ませんか differs from plain ません + か by intonation and context: here you're proposing, not asking about a fact." },
244: { fr: "Proposer plutôt qu'ordonner : ませんか est l'outil de base pour inviter sans imposer. Très fréquent au travail.",
       en: "Proposing rather than ordering: ませんか is the basic tool for inviting without imposing. Very common at work." },
245: { fr: "日曜日に garde son に (jour précis), et さんぽしませんか reste au négatif interrogatif. Les règles se combinent sans exception.",
       en: "日曜日に keeps its に (a precise day) and さんぽしませんか stays in the negative question form. The rules combine without exception." },
246: { fr: "いっしょに renforce l'invitation : « ensemble ». Sans lui, la phrase resterait correcte mais plus froide.",
       en: "いっしょに strengthens the invitation: “together”. Without it the sentence is still correct, just cooler." },

/* g51 ～ましょう */
247: { fr: "ましょう suppose l'accord déjà acquis. Lancé à quelqu'un qui n'a rien accepté, il sonnerait autoritaire.",
       en: "ましょう assumes agreement is already in place. Thrown at someone who hasn't agreed, it sounds bossy." },
248: { fr: "L'enchaînement typique : ませんか pour proposer, ましょう pour accepter. Deux répliques d'un même échange.",
       en: "The typical exchange: ませんか to propose, ましょう to accept. Two halves of one conversation." },
249: { fr: "で et non に : se retrouver est une action, elle a lieu quelque part. Le 駅の前 est le décor de l'action.",
       en: "で, not に: meeting up is an action that takes place somewhere. 駅の前 is the setting of that action." },
250: { fr: "かえりましょう : le verbe « rentrer » suppose un chez-soi commun ou un même chemin. Très courant en fin de journée.",
       en: "かえりましょう: the verb assumes a shared home or a shared route. Very common at the end of a working day." },
251: { fr: "三時に garde le に de l'heure précise, même dans une proposition. La particule ne dépend pas de la forme du verbe.",
       en: "三時に keeps the に of an exact time even in a proposal. The particle doesn't depend on the verb's form." },

/* g52 ～ましょうか */
252: { fr: "ましょうか propose son aide. Le か transforme le « faisons » en question, donc en offre — sans lui, ce serait une décision unilatérale.",
       en: "ましょうか offers help. The か turns “let's” into a question, and so into an offer — without it you'd be deciding alone." },
253: { fr: "何を食べましょうか : on décide ensemble. Comparez avec 何を食べますか, qui demande simplement ce que l'autre va manger.",
       en: "何を食べましょうか: deciding together. Compare 何を食べますか, which just asks what the other person will eat." },
254: { fr: "まど (窓) = la fenêtre. Proposer d'ouvrir plutôt que l'annoncer : le japonais préfère demander avant d'agir sur l'espace commun.",
       en: "まど (窓) is the window. Offering rather than announcing: Japanese prefers to ask before acting on shared space." },
255: { fr: "どこで avec で : le lieu d'une action à venir. どこに demanderait où l'on se trouve, pas où l'on se retrouvera.",
       en: "どこで with で: the place of an action to come. どこに would ask where something is, not where you'll meet." },
256: { fr: "ドア vient de l'anglais « door » ; まど est japonais. Le japonais a emprunté le mot pour la porte occidentale à battant.",
       en: "ドア comes from English “door”, while まど is native. Japanese borrowed the word for the Western hinged door." },

/* g53 ～たいです */
257: { fr: "たい s'accroche au radical, la forme ます sans ます : 食べます → 食べ → 食べたい. Ce radical va resservir souvent.",
       en: "たい attaches to the stem, the ます form minus ます: 食べます → 食べ → 食べたい. That stem will come back often." },
258: { fr: "たい n'exprime QUE son propre désir. Pour celui d'un tiers, le japonais utilise d'autres tournures — on ne présume pas de ce que veut autrui.",
       en: "たい expresses only your OWN desire. For someone else's, Japanese uses different forms — you don't presume to know what others want." },
259: { fr: "見たいです se conjugue comme un adjectif en い, pas comme un verbe : 見たくないです, 見たかったです.",
       en: "見たいです conjugates like an i-adjective, not a verb: 見たくないです, 見たかったです." },
260: { fr: "L'objet d'un たい peut aussi prendre が : 水がのみたいです est correct et même plus classique que を.",
       en: "The object of a たい can take が instead: 水がのみたいです is correct, and rather more classical than を." },
261: { fr: "したくない : la négation de たい suit les adjectifs en い — たい devient たくない. Et 何も appelle bien ce négatif.",
       en: "したくない: negating たい follows the i-adjective rule — たい becomes たくない. And 何も duly demands that negative." },
262: { fr: "日本語で : ici で marque le moyen, la langue employée. Le même で que pour les transports.",
       en: "日本語で: here で marks the means, the language used. The same で as for transport." },

/* g54 見に行きます */
263: { fr: "Encore le radical, suivi de に : « aller POUR voir ». Ce に-là marque le but, un sixième emploi de la particule.",
       en: "The stem again, followed by に: “go IN ORDER TO see”. That に marks purpose — a sixth job for the particle." },
264: { fr: "食べに行きます = partir dans le but de manger. Sans le に, 食べて行きます voudrait dire tout autre chose.",
       en: "食べに行きます = set off in order to eat. Without the に, 食べて行きます would mean something else entirely." },
265: { fr: "かいものに行きます : avec un nom d'action, pas besoin de radical — le nom suffit devant に.",
       en: "かいものに行きます: with an action noun there's no stem needed — the noun alone goes before に." },
266: { fr: "Deux に de sens différents dans une phrase : 友だちに (destinataire) et 会いに (but). Le contexte les sépare sans peine.",
       en: "Two に with different meanings in one sentence: 友だちに (recipient) and 会いに (purpose). Context separates them easily." },
267: { fr: "およぎ est le radical d'およぎます (nager). Le japonais dit « aller à la nage-but », le français « aller pour nager ».",
       en: "およぎ is the stem of およぎます (to swim). Japanese says “go to the swimming-purpose”, English “go to swim”." },

/* g55 ～がほしいです */
268: { fr: "ほしい prend が, pas を : la chose désirée est traitée comme un sujet. Rappel — pour une ACTION, c'est たい.",
       en: "ほしい takes が, not を: the wanted thing is treated as a subject. Remember — for an ACTION it's たい." },
269: { fr: "スマホ est l'abrégé de « smartphone ». Les emprunts récents suivent la même règle de troncature que コンビニ ou パソコン.",
       en: "スマホ is short for “smartphone”. Recent borrowings follow the same clipping rule as コンビニ or パソコン." },
270: { fr: "ほしい est un adjectif, pas un verbe : ほしくないです pour nier, ほしかったです pour le passé.",
       en: "ほしい is an adjective, not a verb: ほしくないです to negate, ほしかったです for the past." },
271: { fr: "何が et non ✗何を : la particule suit ほしい, pas le sens français « vouloir quelque chose ».",
       en: "何が, not ✗何を: the particle follows ほしい, not the English feel of “want something”." },
272: { fr: "Comme たい, ほしい ne dit que son propre désir. Pour un tiers, on dira ほしがっています — « il a l'air d'en vouloir ».",
       en: "Like たい, ほしい states only your own desire. For someone else you'd say ほしがっています — “they seem to want one”." },

/* g56 何か・どこか・だれか */
273: { fr: "何 + か = « quelque chose », l'indéfini. Comparez : 何も + négatif = rien du tout. Le petit か ouvre, le も ferme.",
       en: "何 + か = “something”, the indefinite. Compare 何も + negative = nothing at all. The little か opens, も closes." },
274: { fr: "何か avale la particule : on ne dit pas ✗何かを飲みたい. L'indéfini se passe de を.",
       en: "何か swallows the particle: never ✗何かを飲みたい. The indefinite does without を." },
275: { fr: "どこか = quelque part. La série est complète : 何か, どこか, だれか, いつか — un か derrière chaque mot interrogatif.",
       en: "どこか = somewhere. The set is complete: 何か, どこか, だれか, いつか — a か behind each question word." },
276: { fr: "だれかいますか : la phrase qu'on lance en entrant dans une maison. On l'entend aussi sous la forme すみません.",
       en: "だれかいますか: what you call out on entering a house. You'll also hear すみません used the same way." },
277: { fr: "何か買いましょうか combine trois choses vues récemment : l'indéfini, la proposition, et la question. Elles s'empilent sans heurt.",
       en: "何か買いましょうか combines three recent pieces: the indefinite, the proposal, and the question. They stack cleanly." },

/* g57 AかB */
278: { fr: "Ce か-ci relie deux noms : « ou ». Rien à voir avec le か final de la question, malgré le signe identique.",
       en: "This か links two nouns: “or”. Nothing to do with the sentence-final question か, despite the identical sign." },
279: { fr: "La particule de fonction (で) se met après le groupe entier 電車かバス, jamais après chaque terme.",
       en: "The functional particle (で) goes after the whole group 電車かバス, never after each item." },
280: { fr: "Même règle avec に : 土曜日か日曜日に. Le か lie les deux jours, le に s'applique à l'ensemble.",
       en: "Same rule with に: 土曜日か日曜日に. The か joins the two days, and に applies to the pair." },
281: { fr: "ごはん signifie « riz cuit » et, par extension, « le repas ». Opposer パン et ごはん, c'est opposer deux façons de manger.",
       en: "ごはん means “cooked rice” and, by extension, “the meal”. Setting パン against ごはん contrasts two ways of eating." },

/* g58 一緒に・みんなで */
282: { fr: "いっしょに (一緒に) est un adverbe : il se pose devant le verbe, sans particule supplémentaire.",
       en: "いっしょに (一緒に) is an adverb: it sits before the verb, with no extra particle." },
283: { fr: "みんなで avec で : ce で marque le groupe agissant comme un tout. Ni un lieu ni un moyen — un septième emploi.",
       en: "みんなで with で: that で marks a group acting as one body. Not a place, not a means — a seventh job for it." },
284: { fr: "と et いっしょに ensemble : le と dit avec qui, le いっしょに insiste. Redondant en français, naturel en japonais.",
       en: "と and いっしょに together: と says with whom, いっしょに underlines it. Redundant in English, natural in Japanese." },
285: { fr: "みんなで + passé : le groupe a agi collectivement. Avec と, on aurait énuméré les participants un à un.",
       en: "みんなで + past: the group acted as one. With と you'd have listed the participants one by one." },
286: { fr: "かぞく (家族) désigne sa propre famille. Celle d'autrui se dit ごかぞく, avec le préfixe respectueux ご.",
       en: "かぞく (家族) is your own family. Someone else's is ごかぞく, with the respectful prefix ご." },

/* ============ ARC 7 — 大阪 ============ */

/* g59 高いです */
287: { fr: "L'adjectif porte déjà tout le sens : おもしろい se suffit. Le です n'ajoute que la politesse, pas le verbe « être ».",
       en: "The adjective already carries everything: おもしろい stands alone. です adds only politeness, not the verb “to be”." },
288: { fr: "高い veut dire « haut » ET « cher » — la même idée d'élévation. Le contexte tranche : une montagne ou un prix.",
       en: "高い means both “tall” and “expensive” — one idea of height. Context decides: a mountain or a price." },
289: { fr: "あつい se dit du temps (暑い) et des objets (熱い), avec deux kanji différents mais la même prononciation.",
       en: "あつい covers hot weather (暑い) and hot objects (熱い): two different kanji, one pronunciation." },
290: { fr: "おいしい est le compliment universel à table. Son contraire, まずい, est si direct qu'on l'évite en société.",
       en: "おいしい is the universal compliment at the table. Its opposite, まずい, is so blunt that it's avoided in company." },
291: { fr: "むずかしい (難しい) : un adjectif long, mais régulier. Tous les adjectifs en い se conjuguent exactement pareil.",
       en: "むずかしい (難しい): a long adjective, but a regular one. Every i-adjective conjugates in exactly the same way." },
292: { fr: "安い = bon marché, et c'est l'opposé de 高い au sens « cher ». Pour « bas », le contraire de 高い est ひくい.",
       en: "安い = cheap, the opposite of 高い in its “expensive” sense. For “low”, 高い's opposite is ひくい instead." },

/* g60 高くないです */
293: { fr: "い devient くない : c'est l'adjectif qui se conjugue. ✗高いじゃありません n'existe pas — cette forme-là est réservée aux noms.",
       en: "い becomes くない — the adjective itself conjugates. ✗高いじゃありません doesn't exist; that form belongs to nouns." },
294: { fr: "さむい pour le temps froid ; pour un objet froid, on dit つめたい. Le japonais sépare les deux, le français non.",
       en: "さむい for cold weather; for a cold object it's つめたい. Japanese splits the two, English doesn't." },
295: { fr: "おもしろくない : le く s'insère avant ない. Repérez le い d'origine, remplacez-le, le reste ne bouge pas.",
       en: "おもしろくない: the く slots in before ない. Find the original い, swap it, and nothing else moves." },
296: { fr: "大きい a une négation régulière (大きくない) mais devient irrégulier devant un nom : on dit aussi 大きな.",
       en: "大きい negates regularly (大きくない) but turns irregular before a noun, where 大きな also appears." },
297: { fr: "La seule exception de tout le système : いい devient よくない, jamais ✗いくない. Son passé aussi : よかった.",
       en: "The one exception in the whole system: いい becomes よくない, never ✗いくない. Its past too: よかった." },

/* g61 高かったです */
298: { fr: "い devient かった : encore l'adjectif qui se conjugue. ✗あついでした n'existe pas — c'est l'erreur la plus fréquente ici.",
       en: "い becomes かった — the adjective conjugating again. ✗あついでした doesn't exist, and it's the commonest slip here." },
299: { fr: "おもしろかった : quatre syllabes de terminaison, mais parfaitement régulier. Le です qui suit reste invariable.",
       en: "おもしろかった: a long ending, but perfectly regular. The です that follows never changes." },
300: { fr: "おいしかったです est la phrase à dire en sortant de table — plus encore que おいしいです pendant le repas.",
       en: "おいしかったです is what you say on leaving the table — even more than おいしいです during the meal." },
301: { fr: "いそがしい (忙しい) contient le kanji du cœur 心 sous une forme comprimée : « le cœur qui se perd », c'est être occupé.",
       en: "いそがしい (忙しい) contains the heart kanji 心 in squeezed form: “the heart getting lost” is what being busy is." },
302: { fr: "よかった, passé de いい : l'exception se poursuit au passé. À l'oral, よかった seul veut dire « ouf, tant mieux ».",
       en: "よかった, the past of いい: the exception carries into the past. On its own, よかった means “oh good, what a relief”." },
303: { fr: "Le passé négatif : くなかった, soit くない passé au passé. Les briques s'emboîtent toujours dans le même ordre.",
       en: "The past negative: くなかった — that is, くない itself put into the past. The pieces always slot together in the same order." },

/* g62 元気です */
304: { fr: "元気 est un nom-adjectif : il emprunte toute la famille de です. C'est pour cela qu'on l'appelle adjectif en な.",
       en: "元気 is a noun-adjective: it borrows the whole です family. That's why it's called a na-adjective." },
305: { fr: "しずか (静か) garde son か dans l'écriture — d'où la confusion possible avec un adjectif en い. Fiez-vous au sens, pas au son.",
       en: "しずか (静か) keeps its か in writing, which can look like an i-adjective ending. Trust the meaning, not the sound." },
306: { fr: "しんせつ (親切) = « proche et tranchant » à la lettre, mais le sens est « gentil, prévenant ». Les kanji ne disent pas toujours tout.",
       en: "しんせつ (親切) is literally “close and cutting”, but it means kind and considerate. Kanji don't always tell the whole story." },
307: { fr: "ひま = avoir du temps libre. Le contraire d'いそがしい, et lui aussi un adjectif en な.",
       en: "ひま = having free time. The opposite of いそがしい, and also a na-adjective." },
308: { fr: "にぎやか décrit une animation joyeuse, pas le bruit. Pour le vrai bruit désagréable, c'est うるさい, adjectif en い.",
       en: "にぎやか describes lively bustle, not noise. For genuinely unpleasant noise it's うるさい, an i-adjective." },
309: { fr: "La négation d'un adjectif en な est celle d'un nom : じゃありません. Comparez avec くないです des adjectifs en い.",
       en: "A na-adjective negates like a noun: じゃありません. Compare with the くないです of i-adjectives." },

/* g63 大きい犬・元気な人 */
310: { fr: "L'adjectif en い se colle au nom sans rien ajouter : 大きい犬. C'est là que les deux familles se séparent.",
       en: "An i-adjective attaches straight to the noun with nothing added: 大きい犬. This is where the two families part ways." },
311: { fr: "きれい prend な devant un nom, malgré son い final : c'est un adjectif en な déguisé. Piège classique, avec きらい.",
       en: "きれい takes な before a noun despite ending in い: it's a na-adjective in disguise. A classic trap, along with きらい." },
312: { fr: "新しい s'oppose à ふるい pour les objets. Mais pour une personne âgée, jamais ふるい — ce serait としより.",
       en: "新しい pairs with ふるい for objects. For an elderly person, though, never ふるい — that would be としより." },
313: { fr: "ゆうめい (有名) = « qui a un nom ». Adjectif en な, donc ゆうめいな devant un nom.",
       en: "ゆうめい (有名) means “having a name”. A na-adjective, so ゆうめいな before a noun." },
314: { fr: "Un adjectif devant le nom, un たい après le verbe : les deux couches se posent sans se gêner.",
       en: "An adjective before the noun, a たい after the verb: the two layers sit together without interfering." },
315: { fr: "しんせつな人ですね : le な apparaît seulement devant le nom. Seul en fin de phrase, ce serait しんせつです.",
       en: "しんせつな人ですね: the な shows up only before a noun. Standing at the end it would just be しんせつです." },

/* g64 とても・あまり */
316: { fr: "とても se place devant l'adjectif, jamais après. C'est un adverbe : il modifie ce qui le suit.",
       en: "とても goes before the adjective, never after. It's an adverb, modifying what comes next." },
317: { fr: "とても marche avec les deux familles d'adjectifs, en い comme en な. Il ne se soucie pas de la conjugaison.",
       en: "とても works with both adjective families, い and な alike. It doesn't care about the conjugation." },
318: { fr: "あまり EXIGE la négation : ✗あまりおもしろいです est faux. Le mot n'existe qu'en paire avec une fin négative.",
       en: "あまり REQUIRES the negative — ✗あまりおもしろいです is wrong. The word only exists paired with a negative ending." },
319: { fr: "あまり atténue : « pas très ». Pour « pas du tout », il faudrait ぜんぜん, lui aussi toujours négatif.",
       en: "あまり softens: “not very”. For “not at all” you'd want ぜんぜん, likewise always negative." },
320: { fr: "とても + adjectif en な : rien ne change, pas de な ici puisque にぎやか est en fin de phrase.",
       en: "とても + na-adjective: nothing changes, and no な here since にぎやか sits at the end of the sentence." },

/* g65 どうですか・どんな */
321: { fr: "どうですか demande une impression, pas une définition. C'est « alors, ça te plaît ? » plutôt que « décris-le ».",
       en: "どうですか asks for an impression, not a definition. It's “so, how is it?” rather than “describe it”." },
322: { fr: "Question de politesse quotidienne, l'équivalent japonais de « ça va, le boulot ? ».",
       en: "An everyday courtesy question, the Japanese equivalent of “how's work going?”." },
323: { fr: "どんな ne vit jamais seul : il lui faut un nom derrière, comme この. Pour « comment », c'est どう.",
       en: "どんな never stands alone — it needs a noun after it, like この. For “how”, use どう." },
324: { fr: "どんなまちですか : pas de thème, la question se suffit. Le sujet est celui dont on vient de parler.",
       en: "どんなまちですか: no topic needed, the question stands alone. The subject is whatever was just being discussed." },
325: { fr: "ケーキ vient de l'anglais « cake ». Le japonais rend le « k » final par un ー plutôt qu'une consonne sèche.",
       en: "ケーキ comes from English “cake”. Japanese renders it with a long ー rather than a bare final consonant." },

/* g66 ～が好きです */
326: { fr: "好き prend が, pas を : ce n'est pas un verbe mais un adjectif. Littéralement « les chiens sont plaisants ».",
       en: "好き takes が, not を: it isn't a verb but an adjective. Literally “dogs are pleasing”." },
327: { fr: "Deux particules et deux rôles : は pose le thème (moi), が désigne ce qui plaît. Elles ne se concurrencent pas.",
       en: "Two particles, two roles: は sets the topic (me), が marks what pleases. They aren't competing." },
328: { fr: "どんな + nom + が好き : la structure complète pour demander les goûts de quelqu'un.",
       en: "どんな + noun + が好き: the full structure for asking about someone's tastes." },
329: { fr: "好き étant un adjectif en な, sa négation est じゃありません. Il existe aussi きらい, mais il est nettement plus dur.",
       en: "好き being a na-adjective, it negates with じゃありません. There's also きらい, but it lands much harder." },
330: { fr: "大好き = 大 (grand) + 好き. Le même 大 que dans 大きい : le japonais fabrique l'intensité avec ce kanji.",
       en: "大好き = 大 (big) + 好き. The same 大 as in 大きい: Japanese builds intensity with that kanji." },
331: { fr: "Parler des goûts d'un tiers avec 好き passe très bien — contrairement à たい et ほしい, réservés à soi.",
       en: "Talking about someone else's likes with 好き is perfectly fine — unlike たい and ほしい, which stay first-person." },

/* g67 ～が上手です */
332: { fr: "上手 se dit des autres, presque jamais de soi : se déclarer 上手 sonne vantard. Pour soi, on dira plutôt 下手 par modestie.",
       en: "上手 is said of others, almost never of yourself — calling yourself 上手 sounds boastful. About yourself you'd modestly say 下手." },
333: { fr: "分かります s'écrit avec 分, le kanji de « diviser, distinguer ». Comprendre, en japonais, c'est savoir séparer les choses.",
       en: "分かります is written with 分, the kanji for “divide, distinguish”. To understand, in Japanese, is to be able to tell things apart." },
334: { fr: "下手 = 下 (bas) + 手 (main). 上手, c'est 上 (haut) + 手 : le japonais place l'habileté dans la main.",
       en: "下手 = 下 (low) + 手 (hand); 上手 is 上 (high) + 手. Japanese locates skill in the hand." },
335: { fr: "えいご (英語) : le 英 vient de 英国, l'Angleterre. Le même 語 que dans 日本語 et フランス語.",
       en: "えいご (英語): the 英 comes from 英国, England. The same 語 as in 日本語 and フランス語." },
336: { fr: "少し (すこし) se glisse juste avant le verbe. C'est l'atténuateur poli par excellence — très utile pour parler de son niveau.",
       en: "少し (すこし) slips in right before the verb. It's the polite hedge par excellence — very handy for describing your own level." },

/* g68 ～から、～ */
337: { fr: "から se prononce sans pause, collé au です qui précède. La virgule japonaise 、 marque le souffle, pas une frontière grammaticale.",
       en: "から is said with no pause, glued to the です before it. The Japanese comma 、 marks a breath, not a grammatical boundary." },
338: { fr: "から se pose après une phrase complète, です compris. Ce n'est pas une particule de nom comme を ou に.",
       en: "から attaches to a complete sentence, です included. It isn't a noun particle like を or に." },
339: { fr: "Attention : c'est un autre から que celui de 東京から (le point de départ). Même mot, deux fonctions bien distinctes.",
       en: "Careful: this is a different から from the one in 東京から (a starting point). Same word, two quite separate jobs." },
340: { fr: "Deux propositions complètes, articulées par から et séparées par une virgule japonaise 、.",
       en: "Two complete clauses, hinged on から and separated by the Japanese comma 、." },
341: { fr: "L'adjectif seul suffit avant から : おいしいですから. Pas besoin de sujet, le contexte le fournit.",
       en: "The adjective alone is enough before から: おいしいですから. No subject needed — context supplies it." },

/* g69 どうしてですか */
342: { fr: "どうしてですか, phrase entière en deux mots. On l'adoucit souvent en どうしてですか… avec la voix qui descend.",
       en: "どうしてですか — a whole sentence in two words. It's often softened by letting the voice fall at the end." },
343: { fr: "なぜ est l'équivalent écrit et plus formel de どうして. À l'oral, なんで est le plus familier des trois.",
       en: "なぜ is the written, more formal counterpart of どうして. In speech, なんで is the most casual of the three." },
344: { fr: "La question complète garde son を : どうして ne remplace aucun mot, il s'ajoute devant.",
       en: "The full question keeps its を: どうして replaces nothing, it's simply added at the front." },
345: { fr: "La réponse à どうして se termine par から. On dit rarement からです — le から seul suffit.",
       en: "An answer to どうして ends in から. からです is rarely said — the bare から is enough." },
346: { fr: "どうして devant un passé négatif : l'ordre ne bouge pas, le mot interrogatif reste en tête.",
       en: "どうして in front of a past negative: the order doesn't shift, the question word stays at the front." },

/* ============ ARC 8 — 広島 ============ */

/* g70 AはBより */
347: { fr: "ひこうき servait à l'arc 4 de moyen de transport, avec で. Ici il est thème, avec は — un même mot change de rôle selon sa particule.",
       en: "ひこうき was a means of transport back in arc 4, with で. Here it's the topic, with は — one word changing role by its particle." },
348: { fr: "はやい veut dire rapide (速い) et tôt (早い). Deux kanji, une seule prononciation — ici c'est la vitesse.",
       en: "はやい means fast (速い) and early (早い): two kanji, one pronunciation. Here it's speed." },
349: { fr: "この本 et その本 : le premier est près de moi, le second près de toi. La comparaison utilise la distance de l'arc 2.",
       en: "この本 and その本: the first near me, the second near you. The comparison reuses the distances from arc 2." },
350: { fr: "L'ordre décide du sens : AはBより = A dépasse B. Inverser A et B inverse la phrase.",
       en: "The order decides the meaning: AはBより = A beats B. Swap A and B and the sentence flips." },
351: { fr: "En question, より reste à sa place et か se met à la fin. Le squelette de la phrase ne bouge jamais.",
       en: "In a question より stays put and か goes to the end. The skeleton of the sentence never moves." },

/* g71 どちらが～ですか */
352: { fr: "Deux と puis une virgule : c'est la mise en place des deux candidats. Le second と est facultatif mais très courant.",
       en: "Two と then a comma: that's how the two candidates are set up. The second と is optional but very common." },
353: { fr: "のほう = « le côté de ». On compare des côtés, pas des objets : « le côté café est préférable ».",
       en: "のほう = “the side of”. You compare sides rather than objects: “the coffee side is preferable”." },
354: { fr: "どちら prend が, comme tous les mots interrogatifs sujets. ✗どちらは serait une faute.",
       en: "どちら takes が, like every question word in subject position. ✗どちらは would be wrong." },
355: { fr: "La réponse reprend のほうが. On peut aussi dire simplement 電車です — plus bref, tout aussi correct.",
       en: "The answer echoes のほうが. You could also just say 電車です — shorter and equally correct." },
356: { fr: "どちら sert pour DEUX options. Au-delà, il faudrait どれ, revu à l'arc 2.",
       en: "どちら is for TWO options. Beyond that you'd want どれ, back from arc 2." },

/* g72 ～がいちばん */
357: { fr: "いちばん (一番) = « numéro un ». Le japonais n'a pas de superlatif : il ajoute simplement « le plus » devant l'adjectif.",
       en: "いちばん (一番) means “number one”. Japanese has no superlative form — it just puts “most” in front of the adjective." },
358: { fr: "が et non は : on désigne l'élu du groupe. Le が sert précisément à trancher entre plusieurs.",
       en: "が, not は: you're singling out the winner. が is exactly the particle for picking one from several." },
359: { fr: "日本で avec で : ici le で délimite un domaine, « parmi le Japon ». On trouve aussi 日本の中で.",
       en: "日本で with で: here で bounds a domain, “within Japan”. You'll also see 日本の中で." },
360: { fr: "いちばん se glisse juste avant l'adjectif, jamais avant le nom. Il modifie la qualité, pas l'objet.",
       en: "いちばん slips in just before the adjective, never before the noun. It modifies the quality, not the thing." },
361: { fr: "だれが et non ✗だれは : les mots interrogatifs en position de sujet prennent toujours が.",
       en: "だれが, not ✗だれは: question words in subject position always take が." },

/* g73 ～は～が、～は～ */
362: { fr: "Deux は face à face : c'est le は de contraste, et il remplace même le を attendu. にくは食べます, littéralement « quant à la viande, je mange ».",
       en: "Two は set against each other: this is contrastive は, and it even displaces the を you'd expect. にくは食べます = “as for meat, I eat it”." },
363: { fr: "Le が central signifie « mais ». Rien à voir avec le が sujet : celui-ci relie deux propositions.",
       en: "The が in the middle means “but”. Nothing to do with subject が — this one joins two clauses." },
364: { fr: "Le contraste peut porter sur le temps : 今日は… あしたは…. Deux は, deux volets opposés.",
       en: "The contrast can be about time: 今日は… あしたは…. Two は, two opposing halves." },
365: { fr: "が relie ici deux jugements sur la même chose. Le second n'a même pas besoin de reprendre le sujet.",
       en: "Here が links two judgements about the same thing. The second doesn't even need to restate the subject." },
366: { fr: "Un seul は suffit à créer le contraste : « la télé, elle, non ». L'autre terme reste sous-entendu.",
       en: "A single は is enough to create contrast: “the TV, at least, no”. The other half stays implied." },

/* g74 ～だけ */
367: { fr: "だけ laisse la phrase AFFIRMATIVE : « il y en a seulement un ». Le français passe par une négation, « il n'y en a qu'un ».",
       en: "だけ keeps the sentence AFFIRMATIVE: “there is only one”. French needs a negative for the same idea." },
368: { fr: "だけ chasse la particule : 水だけ飲みます, sans を. Comme も et 何か, il prend la place du を.",
       en: "だけ drives the particle out: 水だけ飲みます, no を. Like も and 何か, it takes the を's place." },
369: { fr: "だけ peut suivre un adverbe : 少しだけ = « juste un peu ». Très utile pour parler modestement de son niveau.",
       en: "だけ can follow an adverb: 少しだけ = “just a little”. Very handy for modestly describing your level." },
370: { fr: "今日だけ = aujourd'hui seulement. Le mot des vitrines de soldes, avec le よ qui vous prévient.",
       en: "今日だけ = today only. The phrase on sale signs, with a よ to let you know." },
371: { fr: "一人だけ : だけ se pose après le compteur, pas avant. Le nombre garde sa place habituelle.",
       en: "一人だけ: だけ goes after the counter, not before. The number keeps its usual position." },

/* g75 ～くなります・になります */
372: { fr: "い devient く devant なります : さむい → さむく. C'est la forme adverbiale de l'adjectif — elle resservira.",
       en: "い becomes く before なります: さむい → さむく. That's the adjective's adverbial form, and it will come back." },
373: { fr: "なりました au passé : le changement est accompli. Au présent, なります décrirait un changement à venir ou habituel.",
       en: "なりました in the past: the change has happened. In the present, なります would describe a coming or habitual change." },
374: { fr: "Adjectif en な et nom prennent に, pas く : 元気になりました. Les deux familles divergent encore ici.",
       en: "Na-adjectives and nouns take に, not く: 元気になりました. The two families diverge here as well." },
375: { fr: "大きくなりました se dit surtout des enfants : « il a grandi ». La phrase que toute famille japonaise prononce.",
       en: "大きくなりました is mostly said of children: “he's grown”. The phrase every Japanese family says." },
376: { fr: "Un nom + に + なりたい : « je veux devenir professeur ». On empile le なる et le たい sans difficulté.",
       en: "A noun + に + なりたい: “I want to become a teacher”. なる and たい stack without trouble." },

/* g76 そして・でも・それから */
377: { fr: "でも s'emploie en DÉBUT de phrase, après un point. Le が de l'arc précédent, lui, reste à l'intérieur.",
       en: "でも goes at the START of a sentence, after a full stop. The が from the previous point stays inside one." },
378: { fr: "そして relie deux faits ; それから insiste sur la succession dans le temps. Nuance fine mais réelle.",
       en: "そして links two facts; それから stresses that one followed the other in time. A fine but real distinction." },
379: { fr: "それから = « et à partir de là ». On y reconnaît le から du point de départ, vu à l'arc 4.",
       en: "それから = “and from there”. You can see the から of a starting point in it, from arc 4." },
380: { fr: "でも en tête, puis un thème avec は : la phrase repart proprement après l'opposition.",
       en: "でも at the front, then a topic with は: the sentence restarts cleanly after the contrast." },
381: { fr: "ばんごはん = 晩 (le soir) + ごはん. La série est complète : あさごはん, ひるごはん, ばんごはん.",
       en: "ばんごはん = 晩 (evening) + ごはん. The set is complete: あさごはん, ひるごはん, ばんごはん." },

/* ============ ARC 9 — 福岡 ============ */

/* g77 て形 */
382: { fr: "La forme て ne porte AUCUN temps : c'est le dernier verbe qui décide si toute la phrase est au présent ou au passé.",
       en: "The て form carries NO tense: the final verb decides whether the whole sentence is present or past." },
383: { fr: "かえって vient de かえる, un verbe en る du groupe 1 — d'où って et non ✗かえて. Le る final ne garantit rien.",
       en: "かえって comes from かえる, a group 1 る-verb — hence って, not ✗かえて. A final る guarantees nothing." },
384: { fr: "のります prend に : on monte « dans » un train. Un mouvement vers l'intérieur, donc に et non を.",
       en: "のります takes に: you board “into” a train. A movement inward, so に rather than を." },
385: { fr: "買って vient de 買う : les verbes en う font って. Même moule que 待つ → 待って et ある → あって.",
       en: "買って comes from 買う: う-verbs give って. The same mould as 待つ → 待って and ある → あって." },
386: { fr: "会って : encore un verbe en う. Et le に de 友だちに est bien le destinataire, vu à l'arc 5.",
       en: "会って: another う-verb. And the に of 友だちに is the recipient marker from arc 5." },

/* g78 ～てください */
387: { fr: "ちょっと adoucit tout ce qu'il précède. Sans lui, まってください serait un ordre net ; avec, c'est une demande.",
       en: "ちょっと softens whatever follows it. Without it, まってください is a flat order; with it, it's a request." },
388: { fr: "てください reste une demande, pas une supplique. À un supérieur, on préférera des formes encore plus indirectes.",
       en: "てください is a request, not a plea. To a superior you'd reach for something even more indirect." },
389: { fr: "もういちど = « encore une fois ». La phrase la plus utile quand on n'a rien compris — apprenez-la par cœur.",
       en: "もういちど = “one more time”. The most useful sentence there is when you've understood nothing — learn it by heart." },
390: { fr: "書いて vient de 書く : les verbes en く font いて. Seule exception de tout le groupe : 行く → 行って.",
       en: "書いて comes from 書く: く-verbs give いて. The single exception in the whole group is 行く → 行って." },
391: { fr: "ゆっくり = lentement, doucement. À dire dès qu'un Japonais parle trop vite — bien plus efficace que de répéter.",
       en: "ゆっくり = slowly, gently. Say it the moment someone speaks too fast — far more effective than asking again." },
392: { fr: "あけて vient d'あける, verbe en る du groupe 2 : る tombe, て s'ajoute. Comparez avec かえって du point précédent.",
       en: "あけて comes from あける, a group 2 る-verb: drop the る, add て. Compare かえって from the previous point." },

/* g79 ～ています (en train de) */
393: { fr: "ています = l'action est en cours. Sans le て, 食べます pourrait vouloir dire « je mange » comme habitude ou comme futur.",
       en: "ています = the action is underway. Without the て, 食べます could mean “I eat” as a habit or as a future." },
394: { fr: "La question de base pour savoir ce que quelqu'un fait à l'instant. À l'oral, on entend souvent 何してる ?, familier.",
       en: "The basic question for what someone is doing right now. In casual speech you'll hear 何してる?" },
395: { fr: "電話しています : le nom + します passe à la forme て comme n'importe quel verbe — しています.",
       en: "電話しています: a noun + します takes the て form like any other verb — しています." },
396: { fr: "あそんで vient de あそぶ : les verbes en ぶ font んで. Comme 飲む → 飲んで et 死ぬ → 死んで.",
       en: "あそんで comes from あそぶ: ぶ-verbs give んで. Like 飲む → 飲んで and 死ぬ → 死んで." },
397: { fr: "読んで, de 読む : les verbes en む font んで aussi. く/ぐ, む/ぶ/ぬ, う/つ/る — trois familles à retenir.",
       en: "読んで, from 読む: む-verbs give んで as well. く/ぐ, む/ぶ/ぬ, う/つ/る — three families to remember." },

/* g80 ～ています (état) */
398: { fr: "すむ ne s'emploie qu'à la forme ている : ✗東京に住みます ne se dit pas pour « j'habite ». Certains verbes n'existent qu'à l'état.",
       en: "すむ is only used in the ている form: ✗東京に住みます isn't how you say “I live there”. Some verbs exist only as states." },
399: { fr: "はたらいて vient de はたらく : encore く → いて. Et で marque le lieu de l'activité.",
       en: "はたらいて comes from はたらく: く → いて again. And で marks the place of the activity." },
400: { fr: "知っています = je connais. En japonais, la connaissance est un état ACQUIS, d'où la forme ている. La négation est irrégulière : 知りません.",
       en: "知っています = I know. In Japanese, knowing is an ACQUIRED state, hence the ている form. Its negative is irregular: 知りません." },
401: { fr: "ぎんこう (銀行) = « la maison de l'argent », 銀 étant l'argent-métal. Le 行 se lit ici こう.",
       en: "ぎんこう (銀行) is “the silver house”, 銀 being the metal. That 行 is read こう here." },
402: { fr: "すんでいます prend に et non で : habiter est un état de présence, pas une action. Retour de la distinction に/で.",
       en: "すんでいます takes に, not で: living somewhere is a state of presence, not an action. The に/で split returns." },

/* g81 ～てもいいですか */
403: { fr: "入って vient de 入る, verbe en る du groupe 1 malgré les apparences — d'où って. Le る est décidément traître.",
       en: "入って comes from 入る, a group 1 る-verb despite appearances — hence って. That る really is treacherous." },
404: { fr: "しゃしんをとる = « prendre » une photo, avec le même とる que « saisir ». Question à poser dans tout temple.",
       en: "しゃしんをとる = to “take” a photo, the same とる as “to grasp”. Worth asking in any temple." },
405: { fr: "La permission porte sur toute l'action, particules comprises : ここで食べて + もいいですか.",
       en: "The permission covers the whole action, particles included: ここで食べて + もいいですか." },
406: { fr: "つかって vient de つかう : les verbes en う font って. Un troisième verbe du même moule après 買う et 会う.",
       en: "つかって comes from つかう: う-verbs give って. A third verb from the same mould after 買う and 会う." },
407: { fr: "La réponse type. Un simple どうぞ ferait aussi l'affaire — c'est le mot qui accompagne tout ce qu'on offre.",
       en: "The stock answer. A simple どうぞ would do just as well — the word that accompanies anything offered." },

/* g82 ～てはいけません */
408: { fr: "L'interdiction, en trois morceaux : て + は + いけません. Le は y est de contraste, comme à l'arc 8.",
       en: "The prohibition in three pieces: て + は + いけません. That は is contrastive, as in arc 8." },
409: { fr: "Sur les panneaux, on trouve plutôt 立入禁止 ou 禁止. La forme complète s'entend surtout à l'oral.",
       en: "On signs you'll more often see 立入禁止 or just 禁止. The full form is mostly spoken." },
410: { fr: "話して vient de 話す : les verbes en す font して. C'est la famille la plus régulière.",
       en: "話して comes from 話す: す-verbs give して. The most regular family of all." },
411: { fr: "てはいけません est direct. Un Japonais préférera souvent une tournure plus vague — ちょっと… suffit à refuser.",
       en: "てはいけません is direct. A Japanese speaker will often prefer something vaguer — a trailing ちょっと… is enough to refuse." },
412: { fr: "飲んで, de 飲む : む → んで. À l'oral familier, la contraction 飲んじゃだめ est très courante.",
       en: "飲んで, from 飲む: む → んで. In casual speech the contraction 飲んじゃだめ is very common." },

/* g83 ～て、～て */
413: { fr: "Trois actions, un seul temps : seul 行きます porte le présent. Les て qui précèdent restent neutres.",
       en: "Three actions, one tense: only 行きます carries the present. The て forms before it stay neutral." },
414: { fr: "L'ordre des て est l'ordre chronologique — on ne peut pas les permuter comme en français.",
       en: "The order of the て forms is the order of events — you can't shuffle them the way English sometimes allows." },
415: { fr: "Mettre 見ました au passé suffit : 会って reste inchangé et hérite du passé. Une seule marque pour toute la phrase.",
       en: "Putting 見ました in the past is enough: 会って stays as it is and inherits the past. One marker for the whole sentence." },
416: { fr: "きっぷ (切符) = le billet de transport. À ne pas confondre avec チケット, réservé aux spectacles.",
       en: "きっぷ (切符) is a transport ticket. Not to be confused with チケット, which is for shows and events." },
417: { fr: "しごとに行きます : le travail traité comme une destination. Le に de l'arc 4, appliqué à un lieu abstrait.",
       en: "しごとに行きます: work treated as a destination. The に from arc 4, applied to an abstract place." },

/* g84 ～てから */
418: { fr: "てから est plus explicite qu'un simple て : il insiste sur « une fois ceci fini ». Retour du から de l'origine.",
       en: "てから is more explicit than a plain て: it insists on “once this is done”. The origin から, back again." },
419: { fr: "Le japonais dit « après s'être lavé les mains » là où le français dit « avant de manger ». Même fait, angle inverse.",
       en: "Japanese says “after washing my hands” where English says “before eating”. The same fact, seen from the other end." },
420: { fr: "おわる est intransitif : la chose finit d'elle-même, d'où が. Son jumeau transitif おわる/おえる prendrait を.",
       en: "おわる is intransitive: the thing ends by itself, hence が. Its transitive twin would take を." },
421: { fr: "てから peut se traduire par « une fois que » : l'accent est mis sur l'achèvement de la première action.",
       en: "てから can be read as “once”: the emphasis falls on the first action being complete." },
422: { fr: "さんぽします après un てから : le nom + します se comporte comme n'importe quel verbe.",
       en: "さんぽします after a てから: a noun + します behaves like any other verb." },

/* g85 ～をください */
423: { fr: "ください s'écrit presque toujours en kana après を. Le kanji 下さい existe, mais l'usage moderne le réserve à d'autres contextes.",
       en: "ください is nearly always written in kana after を. The kanji 下さい exists, but modern usage keeps it for other contexts." },
424: { fr: "ください est en fait la forme polie de くださる, « donner » vers moi. On le retrouve dans てください.",
       en: "ください is the polite form of くださる, “to give” towards me. The same one inside てください." },
425: { fr: "Au café, la formule complète serait コーヒーをおねがいします — un peu plus doux que ください.",
       en: "In a café the fuller phrase would be コーヒーをおねがいします — slightly softer than ください." },
426: { fr: "Le compteur se glisse entre を et ください : りんごを三つください. Il ne colle jamais au nom.",
       en: "The counter slots between を and ください: りんごを三つください. It never attaches to the noun." },
427: { fr: "それ pour désigner ce qui est du côté du vendeur — la distinction de l'arc 2 sert vraiment dans un magasin.",
       en: "それ for what's on the seller's side — the arc 2 distinction genuinely earns its keep in a shop." },

/* g86 安くて、おいしいです */
428: { fr: "店 se lit みせ seul et てん en composé : きっさてん (喫茶店), しょてん (書店, la librairie). Vous connaissiez déjà le premier.",
       en: "店 is read みせ alone and てん in compounds: きっさてん (喫茶店), しょてん (書店, a bookshop). You already knew the first one." },
429: { fr: "ひろい (広い) = spacieux. Son contraire, せまい, décrit une pièce exiguë — mot très utile au Japon.",
       en: "ひろい (広い) = spacious. Its opposite せまい describes a cramped room — a very useful word in Japan." },
430: { fr: "Adjectif en な : c'est で et non くて. しんせつで、おもしろい — les deux familles se séparent encore.",
       en: "Na-adjective: で, not くて. しんせつで、おもしろい — the two families part ways once more." },
431: { fr: "まち (町) désigne la ville moyenne ou le quartier. Pour une métropole, le mot exact serait とし (都市) — mais l'usage reste souple.",
       en: "まち (町) is a town or a neighbourhood. For a metropolis the exact word would be とし (都市) — though usage stays loose." },
432: { fr: "Les deux adjectifs doivent aller dans le même sens : くて lie des qualités compatibles. Pour opposer, il faudrait が.",
       en: "The two adjectives must pull the same way: くて links compatible qualities. To contrast them you'd need が." },

/* ============ ARC 10 — 北海道 ============ */

/* g87 辞書形 */
433: { fr: "行く est la forme du dictionnaire : c'est sous celle-là qu'on cherche un verbe. Entre amis, elle remplace 行きます.",
       en: "行く is the dictionary form — the one you look a verb up under. Among friends it replaces 行きます." },
434: { fr: "ねる perd simplement son ます : groupe 2, la règle la plus facile. Le る était déjà là dans 寝る.",
       en: "ねる just drops its ます: group 2, the easiest rule. The る was already there in 寝る." },
435: { fr: "する est irrégulier, comme 来る. Ces deux-là sont les seuls verbes vraiment irréguliers du japonais — deux en tout.",
       en: "する is irregular, like 来る. Those two are the only genuinely irregular verbs in Japanese — two, in the whole language." },
436: { fr: "飲みます → 飲む : le i devient u. C'est la règle du groupe 1, et elle vaut pour des centaines de verbes.",
       en: "飲みます → 飲む: the i becomes u. That's the group 1 rule, and it covers hundreds of verbs." },
437: { fr: "来る se lit くる ici, mais きます au poli et こない au négatif. Un même kanji pour trois sons — le verbe le plus retors.",
       en: "来る is read くる here, きます in the polite form and こない in the negative. One kanji, three sounds — the trickiest verb there is." },

/* g88 ～ことができます */
438: { fr: "Plus court et tout aussi correct : 日本語ができます, sans こと ni 話す. La forme longue insiste sur l'acte plutôt que sur la langue.",
       en: "Shorter and just as correct: 日本語ができます, with no こと and no 話す. The long form stresses the act rather than the language." },
439: { fr: "ことができます dit la capacité acquise. Pour une possibilité ponctuelle, le japonais a d'autres tournures.",
       en: "ことができます states an acquired ability. For a one-off possibility Japanese has other constructions." },
440: { fr: "つくる = fabriquer, préparer. Verbe en る du groupe 1 : sa forme て est つくって, pas ✗つくて.",
       en: "つくる = to make, to prepare. A group 1 る-verb: its て form is つくって, not ✗つくて." },
441: { fr: "Sans sujet, la phrase devient impersonnelle : « on peut ». Le japonais n'a pas besoin d'un « on ».",
       en: "With no subject the sentence turns impersonal: “one can”. Japanese needs no word for “one”." },
442: { fr: "フランスご (フランス語) : le 語 de l'arc 1, toujours à l'œuvre. Katakana pour le pays, kanji pour la langue.",
       en: "フランスご (フランス語): the 語 from arc 1, still at work. Katakana for the country, kanji for “language”." },

/* g89 ～前に */
443: { fr: "Le verbe devant 前に reste TOUJOURS au présent, même si la phrase entière est au passé. Règle sans exception.",
       en: "The verb before 前に always stays in the present, even when the whole sentence is past. No exceptions." },
444: { fr: "C'est le même 前 que dans 駅の前 (devant la gare) : le japonais utilise un seul mot pour l'espace et le temps.",
       en: "It's the same 前 as in 駅の前 (in front of the station): Japanese uses one word for space and time alike." },
445: { fr: "天気を見ます, littéralement « regarder le temps ». Le japonais dit ainsi ce que le français rend par « la météo ».",
       en: "天気を見ます, literally “look at the weather”. Japanese says it that way where English says “check the forecast”." },
446: { fr: "Après un NOM, il faut の前に et non simplement 前に : しごとの前に. Verbe → forme du dictionnaire, nom → の.",
       en: "After a NOUN you need の前に, not bare 前に: しごとの前に. Verb → dictionary form, noun → の." },
447: { fr: "La négation frappe le verbe principal, pas celui du 前に : 見ません à la fin, ねる au présent devant.",
       en: "The negative lands on the main verb, not the one before 前に: 見ません at the end, ねる staying present in front." },

/* g90 ない形 */
448: { fr: "行かない : la voyelle devient a avant ない. 行きます → 行かない, le i cède la place.",
       en: "行かない: the vowel becomes a before ない. 行きます → 行かない, the i steps aside." },
449: { fr: "食べない : groupe 2, le る tombe et ない s'ajoute. Comparez avec 行かない — les deux groupes divergent nettement.",
       en: "食べない: group 2, the る drops and ない is added. Compare 行かない — the two groups clearly diverge." },
450: { fr: "見ない est court parce que 見る l'est déjà. Les verbes courts du groupe 2 donnent les négations les plus brèves.",
       en: "見ない is short because 見る already is. Short group 2 verbs give the briefest negatives." },
451: { fr: "飲まない : le む devient ま. Le japonais fait glisser la dernière syllabe sur la ligne des a.",
       en: "飲まない: the む becomes ま. Japanese slides the final syllable onto the a row." },
452: { fr: "分からない, familier de 分かりません. Et ぜんぜん exige toujours son négatif, poli ou pas.",
       en: "分からない, the casual form of 分かりません. And ぜんぜん still demands its negative, polite or not." },

/* g91 ～ないでください */
453: { fr: "しんぱいしないでください : la phrase à offrir à quelqu'un d'inquiet. Elle s'entend aussi en 大丈夫ですよ.",
       en: "しんぱいしないでください: the sentence to offer someone who's worried. You'll also hear 大丈夫ですよ." },
454: { fr: "とらないで vient de とる, groupe 1 : る → ら + ない. Ne pas confondre avec les る du groupe 2.",
       en: "とらないで comes from とる, group 1: る → ら + ない. Don't confuse it with the group 2 る verbs." },
455: { fr: "入らない : encore 入る, ce verbe en る qui appartient au groupe 1 malgré les apparences.",
       en: "入らない: 入る again, that る-verb that belongs to group 1 despite appearances." },
456: { fr: "あけない : cette fois c'est bien un verbe du groupe 2, le る tombe simplement.",
       en: "あけない: this time it really is a group 2 verb, and the る simply drops." },
457: { fr: "わすれないでください se dit en fin de conversation, comme un « n'oubliez pas ! » chaleureux.",
       en: "わすれないでください is said at the end of a conversation, a warm “don't forget!”." },

/* g92 ～なければなりません */
458: { fr: "もう veut dire ici « déjà », avec une nuance de regret. C'est la phrase qu'on prononce en se levant de table trop tôt.",
       en: "もう here means “already”, with a note of regret. It's what you say as you get up from the table too soon." },
459: { fr: "À l'oral, on entend surtout la contraction なきゃ : べんきょうしなきゃ. La forme longue reste celle de l'écrit et du poli.",
       en: "In speech you'll mostly hear the contraction なきゃ: べんきょうしなきゃ. The long form is for writing and politeness." },
460: { fr: "くすりを飲む : en japonais on « boit » un médicament, même un comprimé. Le verbe 飲む couvre tout ce qui descend.",
       en: "くすりを飲む: in Japanese you “drink” medicine, even a tablet. 飲む covers everything that goes down." },
461: { fr: "はやく est la forme adverbiale de はやい : い → く. La même transformation que devant なります.",
       en: "はやく is the adverbial form of はやい: い → く. The same change as before なります." },
462: { fr: "Littéralement « si je n'y vais pas, ça ne devient pas » : le japonais exprime l'obligation par une double négation.",
       en: "Literally “if I don't go, it won't do”: Japanese expresses obligation through a double negative." },

/* g93 ～なくてもいいです */
463: { fr: "Le miroir exact de なければなりません. Là où l'un impose, l'autre dispense — et tous deux partent de la forme ない.",
       en: "The exact mirror of なければなりません. One imposes, the other excuses — and both start from the ない form." },
464: { fr: "いそぐ (急ぐ) : verbe en ぐ, dont la forme て est いそいで. Les ぐ suivent les く, avec un だくてん.",
       en: "いそぐ (急ぐ): a ぐ-verb, whose て form is いそいで. ぐ follows く, with a voicing mark." },
465: { fr: "ぜんぶ (全部) = la totalité. Utile à table, où l'on vous resservira volontiers.",
       en: "ぜんぶ (全部) = the whole lot. Useful at the table, where you'll be offered more." },
466: { fr: "はたらかなくて : はたらく est un verbe en く, donc か + ない. La règle du groupe 1 tient jusqu'au bout.",
       en: "はたらかなくて: はたらく is a く-verb, so か + ない. The group 1 rule holds all the way through." },
467: { fr: "買わなくて : les verbes en う font わ devant ない, pas ✗あ. C'est la seule irrégularité de la série.",
       en: "買わなくて: う-verbs take わ before ない, not ✗あ. The one irregularity in the set." },

/* g94 た形 */
468: { fr: "えいが (映画) = « images projetées ». Le 映 est celui de 映画館, le cinéma en tant que bâtiment.",
       en: "えいが (映画) = “projected pictures”. That 映 is the one in 映画館, the cinema as a building." },
469: { fr: "食べた, de 食べて. La correspondance est parfaite, sans une seule exception dans toute la langue.",
       en: "食べた, from 食べて. The correspondence is perfect, with not a single exception in the whole language." },
470: { fr: "行った, de 行って : l'exception de 行く se transmet telle quelle à la forme た.",
       en: "行った, from 行って: the 行く exception carries straight over into the た form." },
471: { fr: "話した, de 話して. Les verbes en す gardent leur し partout — le groupe le plus prévisible.",
       en: "話した, from 話して. す-verbs keep their し throughout — the most predictable group of all." },
472: { fr: "Les adjectifs ont aussi une forme neutre passée : あつかった, sans です. C'est le passé familier.",
       en: "Adjectives have a plain past too: あつかった, with no です. That's the casual past." },

/* g95 ～たことがあります */
473: { fr: "こと + が + あります : « il existe le fait d'être allé ». Le japonais traite l'expérience comme une chose qu'on possède.",
       en: "こと + が + あります: “the fact of having gone exists”. Japanese treats experience as a thing you hold." },
474: { fr: "Ne pas confondre avec le simple passé : 食べました dit une fois précise, 食べたことがあります dit « au moins une fois dans ma vie ».",
       en: "Don't confuse it with the plain past: 食べました is one specific time, 食べたことがあります is “at least once in my life”." },
475: { fr: "見たことがあります s'emploie pour ce qui vaut la peine d'être vu. Pour le quotidien, la tournure serait étrange.",
       en: "見たことがあります is for things worth having seen. For everyday sights the construction would sound odd." },
476: { fr: "La question sur l'expérience : la première qu'on vous posera sur le Japon. Réponse négative : ありません.",
       en: "The experience question — the first one you'll be asked about Japan. The negative answer is ありません." },
477: { fr: "会ったことがあります : encore le に de 会います, conservé devant la forme た.",
       en: "会ったことがあります: the に of 会います again, kept in front of the た form." },

/* g96 ～たり～たりします */
478: { fr: "たり est au verbe ce que や est au nom : une liste d'exemples, volontairement incomplète.",
       en: "たり is to verbs what や is to nouns: a list of examples, deliberately incomplete." },
479: { fr: "Le します final porte le temps pour toute la phrase. Les たり restent neutres, comme les て.",
       en: "The final します carries the tense for the whole sentence. The たり forms stay neutral, like て forms." },
480: { fr: "聞いたり, de 聞いて : la forme た dérive de la forme て, et la forme たり s'en déduit à son tour.",
       en: "聞いたり, from 聞いて: the た form derives from the て form, and たり follows from that in turn." },
481: { fr: "しました au passé : c'est le seul mot à changer. Deux たり devant, un seul temps à la fin.",
       en: "しました in the past: it's the only word that changes. Two たり in front, one tense at the end." },

/* g97 ～と思います */
482: { fr: "だ devant と : un nom ne peut pas être cité nu. C'est le だ familier, obligatoire ici même en phrase polie.",
       en: "だ before と: a noun can't be quoted bare. That's the casual だ, required here even in a polite sentence." },
483: { fr: "Un adjectif en い se cite tel quel, sans だ : おもしろいと思います. Seuls les noms ont besoin du だ.",
       en: "An i-adjective is quoted as it stands, with no だ: おもしろいと思います. Only nouns need the だ." },
484: { fr: "La pensée citée passe en forme NEUTRE : 来る et non 来ます. Le poli est réservé à la phrase principale.",
       en: "The quoted thought goes into the PLAIN form: 来る, not 来ます. Politeness belongs to the main clause." },
485: { fr: "むずかしくない, neutre, devant と思います. La négation aussi se déshabille avant d'être citée.",
       en: "むずかしくない, plain, before と思います. The negative also sheds its politeness before being quoted." },
486: { fr: "かえった, forme た neutre : on peut citer un passé. Le 思います, lui, reste au présent — on pense maintenant.",
       en: "かえった, the plain past: a past can be quoted. The 思います stays present — you're thinking now." },

/* g98 ～と言いました */
487: { fr: "Même mécanique que と思います : forme neutre citée, verbe principal poli. Une seule règle pour les deux.",
       en: "The same mechanism as と思います: plain form quoted, main verb polite. One rule covers both." },
488: { fr: "Le japonais ne recule pas le temps du discours rapporté : いそがしい reste au présent, même si c'était hier.",
       en: "Japanese doesn't shift the tense in reported speech: いそがしい stays present, even though it was yesterday." },
489: { fr: "何と se lit なんと : encore le なん devant un t. La règle de l'arc 1 continue de servir.",
       en: "何と is read なんと: なん again before a t. The arc 1 rule is still earning its keep." },
490: { fr: "Deux は dans la citation : celui du thème et celui du contraste. Le だ reste obligatoire devant と.",
       en: "Two は inside the quotation: topic and contrast. The だ is still required before と." },
491: { fr: "Une citation peut contenir son propre thème : このえいがは… vit à l'intérieur de ce qu'a dit l'ami.",
       en: "A quotation can carry its own topic: このえいがは… lives inside what the friend said." },

/* g99 ～でしょう */
492: { fr: "でしょう est le ton de la météo japonaise : on annonce sans jamais affirmer. Écoutez-le à la télévision.",
       en: "でしょう is the voice of the Japanese weather forecast: announcing without ever asserting. Listen for it on TV." },
493: { fr: "でしょう remplace です et en garde la politesse. Sa version familière est だろう.",
       en: "でしょう replaces です and keeps its politeness. Its casual counterpart is だろう." },
494: { fr: "Après un adjectif en い, pas de です : さむいでしょう. Le でしょう prend toute la place.",
       en: "After an i-adjective there's no です: さむいでしょう. The でしょう takes over entirely." },
495: { fr: "Après un verbe, la forme neutre : 来るでしょう. Encore la règle des formes citées.",
       en: "After a verb, the plain form: 来るでしょう. The quoted-form rule once more." },
496: { fr: "Avec l'intonation montante, でしょう ? devient « n'est-ce pas ? » — proche du ね, mais plus insistant.",
       en: "With rising intonation, でしょう? becomes “right?” — close to ね, but more insistent." },

/* g100 だ・普通体 */
497: { fr: "だ est le です familier. Entre amis on l'omet souvent : 私、学生 suffit largement.",
       en: "だ is the casual です. Among friends it's often dropped entirely: 私、学生 does the job." },
498: { fr: "だ après un nom, mais jamais après un adjectif en い : ✗おいしいだ n'existe pas.",
       en: "だ after a noun, but never after an i-adjective: ✗おいしいだ doesn't exist." },
499: { fr: "また = de nouveau. Et le verbe seul, sans です ni ます : c'est tout le parler familier en une phrase.",
       en: "また = again. And the bare verb, no です, no ます: that's casual speech in a single sentence." },
500: { fr: "Pas de だ ici : おいしい se suffit, et le ね fait le reste. Le familier retire, il n'ajoute pas.",
       en: "No だ here: おいしい stands alone and the ね does the rest. Casual speech removes, it doesn't add." },
501: { fr: "いる, forme du dictionnaire d'います. Vous voilà au bout du voyage : vous savez enlever la politesse, donc la remettre.",
       en: "いる, the dictionary form of います. And here the journey ends: you can strip the politeness away, which means you can put it back." },

/* ===== APPENDIX — the kanji-coverage sentences (v3.2.0) =====
 * Same order as the appendix in sentences.js. Many of these notes point at the
 * character itself, since these sentences exist so that the carnet's kanji lens
 * has something to show. */

/* g06 AのB */
502:{ fr: "国 seul se lit くに, mais こく dans 中国 (la Chine) ou 外国 (l'étranger). Un kanji change souvent de lecture selon qu'il est seul ou en composé.",
      en: "国 on its own reads くに, but こく inside 中国 (China) or 外国 (abroad). A kanji's reading often changes between standing alone and sitting in a compound." },
/* g14 どこですか */
503:{ fr: "En vrai, on évite あなた : on demande plutôt お国はどちらですか, ou on emploie le nom de la personne. あなた s'apprend, mais s'utilise peu.",
      en: "In practice あなた is avoided: お国はどちらですか is the polite way, or you use the person's name. あなた is worth knowing but little used." },
/* g17 いくらですか */
504:{ fr: "Le japonais compte par tranches de quatre chiffres : 10 000, c'est 一万 (un « man »), pas « dix mille ». Au-dessus, 100 000 se dit 十万 — dix man.",
      en: "Japanese counts in groups of four digits: 10,000 is 一万 (one man), not 'ten thousand'. Above it, 100,000 is 十万 — ten man." },
505:{ fr: "一万 garde son 一, contrairement à 百 (ひゃく) et 千 (せん) qui s'emploient nus. On ne dit jamais ✗まん円 tout seul.",
      en: "一万 keeps its 一, unlike 百 (ひゃく) and 千 (せん), which stand bare. You never say ✗まん円 on its own." },
/* g18 何時ですか */
506:{ fr: "六時 est régulier : ろくじ, comme 二時 にじ et 五時 ごじ. Les seules heures piégeuses sont 四時 よじ, 七時 しちじ et 九時 くじ.",
      en: "六時 is regular — ろくじ, like 二時 にじ and 五時 ごじ. The only tricky hours are 四時 よじ, 七時 しちじ and 九時 くじ." },
507:{ fr: "八時 se dit はちじ sans surprise, mais le ち de 八 se transforme devant d'autres sons : 八百 はっぴゃく, 八分 はっぷん. Devant じ, rien ne bouge.",
      en: "八時 is はちじ, no surprise — but the ち of 八 shifts before other sounds: 八百 はっぴゃく, 八分 はっぷん. Before じ nothing moves." },
/* g19 何曜日ですか */
508:{ fr: "木 se lit き quand c'est l'arbre, もく dans 木曜日. Kun tout seul, on en composé : c'est la règle la plus utile pour deviner une lecture.",
      en: "木 reads き for the tree itself, もく in 木曜日. Kun alone, on in a compound — the most useful rule of thumb for guessing a reading." },
509:{ fr: "来週の木曜日 : の relie deux repères de temps, « le jeudi de la semaine prochaine ». Le français dit « jeudi prochain », plus court et plus flou.",
      en: "来週の木曜日: の links two time markers — 'the Thursday of next week'. English says 'next Thursday', shorter and vaguer." },
/* g21 ～がいます */
510:{ fr: "男の人 plutôt que 男 tout seul : 男 nu sonne brusque, presque « un mâle ». On ajoute の人 par politesse, exactement comme pour 女の人.",
      en: "男の人 rather than plain 男: bare 男 sounds blunt, almost 'a male'. Adding の人 is the polite default, just as for 女の人." },
511:{ fr: "女 se lit おんな seul, mais じょ en composé : 女性 (じょせい) est le mot neutre des formulaires. Et le 人 final se lit ひと, pas にん.",
      en: "女 reads おんな alone but じょ in compounds: 女性 (じょせい) is the neutral word on forms. The final 人 here reads ひと, not にん." },
/* g22 場所に～があります */
512:{ fr: "外 peut se passer de の : 外に = dehors, sans préciser dehors de quoi. Avec の il devient relatif : 家の外 = à l'extérieur de la maison.",
      en: "外 works on its own: 外に just means outside, with no reference point. With の it turns relative: 家の外 = outside the house." },
513:{ fr: "川 se lit かわ seul, mais devient がわ à la fin d'un nom : 鴨川 かもがわ, la rivière de Kyoto. Ce voisement en composé s'appelle le rendaku.",
      en: "川 reads かわ alone but turns into がわ at the end of a name: 鴨川 かもがわ, Kyoto's river. That voicing in compounds is called rendaku." },
514:{ fr: "東 seul se lit ひがし, mais とう dans 東京 — « la capitale de l'est ». Vous connaissiez déjà ce kanji sans connaître son nom.",
      en: "東 on its own reads ひがし, but とう in 東京 — 'the eastern capital'. You already knew this kanji without knowing its own name." },
/* g23 上・下・中・前・後ろ */
515:{ fr: "右 et 左 se construisent comme 上 ou 中 : un nom, の, puis la position. Le japonais n'a pas de préposition — tout passe par ce の.",
      en: "右 and 左 build like 上 or 中: a noun, then の, then the position. Japanese has no prepositions — it all runs through that の." },
516:{ fr: "左 se lit ひだり, mais 左右 ensemble se disent さゆう et signifient « les deux côtés ». Deux kanji connus donnent souvent un mot qu'on ne devine pas.",
      en: "左 reads ひだり, but 左右 together is さゆう and means 'both sides'. Two familiar kanji often make a word you'd never guess." },
517:{ fr: "Le même 外 donne 外国 (がいこく), « le pays du dehors », c'est-à-dire l'étranger. Ici il se lit そと ; en composé, がい.",
      en: "The same 外 gives 外国 (がいこく), 'the outside country' — abroad. Here it reads そと; in compounds, がい." },
518:{ fr: "西 se lit にし seul et さい dans 関西 (かんさい), la région d'Osaka et de Kyoto — littéralement « à l'ouest de la barrière ».",
      en: "西 reads にし alone and さい in 関西 (かんさい), the Osaka–Kyoto region — literally 'west of the barrier'." },
519:{ fr: "Le japonais énumère les points cardinaux dans l'ordre 東西南北 (とうざいなんぼく) : est, ouest, sud, nord. Le français préfère nord-sud-est-ouest.",
      en: "Japanese lists the compass points as 東西南北 (とうざいなんぼく) — east, west, south, north. English prefers north-south-east-west." },
/* g26 一つ・二人・三本… */
520:{ fr: "Le kanji 人 apparaît deux fois et se lit deux fois autrement : ひと dans 女の人, り dans 二人 (ふたり). Le contexte décide, pas le caractère.",
      en: "人 shows up twice here and reads differently each time: ひと in 女の人, り in 二人 (ふたり). Context decides, not the character." },
521:{ fr: "男 se lit おとこ seul et だん en composé : 男性 (だんせい) est le mot neutre — celui des formulaires et des portes de toilettes.",
      en: "男 reads おとこ alone and だん in compounds: 男性 (だんせい) is the neutral word — the one on forms and restroom doors." },
/* g33 から・まで */
522:{ fr: "北 se lit きた seul et ほっ dans 北海道 (ほっかいどう), la dernière étape du voyage. Ici から…まで mesure un pays entier, pas un trajet.",
      en: "北 reads きた alone and ほっ in 北海道 (ほっかいどう), the last stop of the journey. Here から…まで measures a whole country, not a trip." },
/* g36 七時に */
523:{ fr: "六 se lit ろく, mais devient ろっ devant certains sons : 六本 ろっぽん, 六分 ろっぷん. Devant じ il reste entier — ろくじ.",
      en: "六 reads ろく but becomes ろっ before certain sounds: 六本 ろっぽん, 六分 ろっぷん. Before じ it stays whole — ろくじ." },
524:{ fr: "へ ou に pour la destination : les deux passent. へ insiste un peu plus sur la direction, に sur le point d'arrivée — la nuance est mince.",
      en: "へ or に for a destination: both work. へ leans on the direction, に on the arrival point — the difference is slight." },
/* g40 ～ました */
525:{ fr: "去 veut dire « qui s'en est allé » : 去年, c'est l'année partie. À l'écrit soigné on rencontre aussi 昨年 (さくねん), plus formel.",
      en: "去 means 'gone by': 去年 is the year that left. In careful writing you'll also meet 昨年 (さくねん), which is more formal." },
/* g41 ～ませんでした */
526:{ fr: "去年は avec は, et non nu : le は met l'année dernière en contraste — « l'an dernier au moins, non ». Sans lui, ce serait un simple constat.",
      en: "去年は with は rather than bare: the は sets last year in contrast — 'last year at any rate, no'. Without it it's a flat statement." },
/* g42 場所で～ます */
527:{ fr: "川で et non ✗川に : on joue DANS la rivière, c'est une action. Comparez avec 京都に川があります, où に situe la rivière elle-même.",
      en: "川で, not ✗川に: playing is an action, so で. Compare 京都に川があります, where に places the river itself." },
/* g59 高いです */
528:{ fr: "空 dit à la fois le ciel et le vide : そら pour le ciel, くう dans 空気 (くうき, l'air) et 空港 (くうこう, l'aéroport).",
      en: "空 means both sky and empty: そら for the sky, くう in 空気 (くうき, air) and 空港 (くうこう, airport)." },
529:{ fr: "La partie du corps prend が, pas は : 目がいたい. Le japonais fait de ce qui fait mal le sujet, là où le français dit « j'ai mal à… ».",
      en: "The body part takes が, not は: 目がいたい. Japanese makes the aching part the subject, where English says 'my eyes hurt'." },
530:{ fr: "長 sert bien au-delà de la longueur : 社長 (しゃちょう) est le patron d'une entreprise, celui qui « est en tête ». Ici, c'est la lecture なが.",
      en: "長 goes well beyond length: 社長 (しゃちょう) is a company president, the one at the head. Here it takes the なが reading." },
531:{ fr: "古 en composé donne 中古 (ちゅうこ), « d'occasion » — le mot qu'on lit sur toutes les vitrines de voitures et de livres au Japon.",
      en: "In compounds 古 gives 中古 (ちゅうこ), 'second-hand' — the word in every used-car and used-book window in Japan." },
532:{ fr: "Deux marques en cascade : は pose le thème (les enfants), が désigne ce qui est grand (les yeux). Ce moule 「AはBが～」 décrit tout ce qu'on possède.",
      en: "Two markers in sequence: は sets the topic (children), が names what is big (the eyes). This 「AはBが～」 frame describes anything you possess." },
533:{ fr: "足 désigne le pied ET la jambe — le japonais ne tranche pas à la cheville comme le français. Le contexte fait le partage.",
      en: "足 covers both foot and leg — Japanese doesn't cut at the ankle the way English does. Context decides which is meant." },
/* g60 高くないです */
534:{ fr: "道 se lit みち seul et どう en composé : 北海道 (ほっかいどう) est « la route de la mer du nord ». Le même kanji clôt le voyage.",
      en: "道 reads みち alone and どう in compounds: 北海道 (ほっかいどう) is 'the north sea road'. The same kanji closes the journey." },
/* g61 高かったです */
535:{ fr: "いたい se conjugue comme n'importe quel adjectif en い : いたかった. Le français passe par un verbe (« j'avais mal »), le japonais par le seul adjectif.",
      en: "いたい conjugates like any い-adjective: いたかった. English needs a verb ('my legs hurt'), Japanese just inflects the adjective." },
536:{ fr: "古かった décrit l'état à ce moment-là, pas un changement. Pour « est devenu vieux », il faudra 古くなりました — c'est l'étape 75.",
      en: "古かった describes how it was then, not a change. For 'became old' you'd need 古くなりました — that's stop 75." },
/* g62 元気です */
537:{ fr: "きれい dit aussi bien « beau » que « propre ». Pour un ciel, c'est la clarté : 空がきれい, c'est un ciel dégagé, pas un ciel décoré.",
      en: "きれい covers both 'beautiful' and 'clean'. For a sky it means clear: 空がきれい is an unclouded sky, not a decorated one." },
/* g63 大きい犬・元気な人 */
538:{ fr: "Le 白 de 白い se retrouve dans 面白い (おもしろい, intéressant) — littéralement « le visage qui blanchit », de surprise. Un mot que vous employez déjà.",
      en: "The 白 of 白い turns up in 面白い (おもしろい, interesting) — literally 'the face turning white' with surprise. A word you already use." },
539:{ fr: "小 se lit ちい dans 小さい et しょう en composé : 小学校 (しょうがっこう), l'école primaire. Vous connaissez déjà 学校 — il suffit d'ajouter « petit ».",
      en: "小 reads ちい in 小さい and しょう in compounds: 小学校 (しょうがっこう), primary school. You already know 学校 — just add 'small'." },
540:{ fr: "ほしい prend が et ne s'emploie que pour des objets, jamais pour des actions — celles-là veulent ～たいです. Et 白い se colle au nom sans な.",
      en: "ほしい takes が and only ever applies to things, never actions — those take ～たいです. And 白い attaches to the noun with no な." },
/* g64 とても・あまり */
541:{ fr: "多い ne se met presque jamais devant un nom : ✗多い人 ne se dit pas. Il reste en fin de phrase — c'est l'exception parmi les adjectifs en い.",
      en: "多い almost never sits in front of a noun: ✗多い人 doesn't work. It stays at the end of the sentence — the odd one out among い-adjectives." },
542:{ fr: "耳がいい ne veut pas dire « avoir de belles oreilles » mais « avoir l'oreille fine ». Beaucoup de parties du corps s'emploient ainsi : 目がいい, c'est bien voir.",
      en: "耳がいい doesn't mean 'nice ears' — it means sharp hearing. Many body parts work this way: 目がいい is good eyesight." },
543:{ fr: "L'opposé de 多い est 少ない (すくない), et tous deux suivent le même moule 「AはBが～」. Ils décrivent une quantité, jamais une taille.",
      en: "The opposite of 多い is 少ない (すくない), and both use the same 「AはBが～」 frame. They describe quantity, never size." },
/* g65 どうですか・どんな */
544:{ fr: "どんな国 demande le caractère du pays, pas son nom. Pour le nom, ce serait どこの国 — どんな appelle une description.",
      en: "どんな国 asks what the country is like, not which one it is. For the name you'd say どこの国 — どんな calls for a description." },
/* g70 AはBより */
545:{ fr: "Les points cardinaux se comparent comme n'importe quel nom : ils prennent は et より sans rien de particulier. En japonais, ce sont des noms ordinaires.",
      en: "Compass points compare like any other noun: they take は and より with nothing special. In Japanese they are ordinary nouns." },
546:{ fr: "Le japonais répète まち des deux côtés là où le français dit « celle de l'est ». Il n'a pas de pronom de reprise — on redit le nom.",
      en: "Japanese repeats まち on both sides where English says 'the eastern one'. It has no such pronoun — you say the noun again." },
/* g72 ～がいちばん */
547:{ fr: "北 seul suffit à désigner « le nord du pays ». Pas besoin de 北の方 ni de 北部 : le point cardinal fait office de région.",
      en: "北 on its own is enough for 'the north of the country'. No need for 北の方 or 北部: the compass point doubles as a region." },
/* g73 ～は～が、～は～ */
548:{ fr: "Deux saisons, deux は, une seule opposition. Le が central relie sans rien nier — il dit « et de l'autre côté », pas « mais » au sens fort.",
      en: "Two seasons, two は, one opposition. The が in the middle joins without denying — it means 'and on the other hand', not a strong 'but'." },
549:{ fr: "La seconde moitié ne répète pas 耳が : le contraste porte sur le chien et le chat, le reste est sous-entendu. Le japonais coupe tout ce qui est déjà su.",
      en: "The second half doesn't repeat 耳が: the contrast is between dog and cat, the rest is understood. Japanese drops whatever is already known." },
/* g78 ～てください */
550:{ fr: "口 se lit くち et se retrouve partout dans les gares : 入口 (いりぐち, entrée) et 出口 (でぐち, sortie). Deux mots à repérer avant tout voyage.",
      en: "口 reads くち and turns up all over stations: 入口 (いりぐち, entrance) and 出口 (でぐち, exit). Two words to spot before any trip." },
551:{ fr: "右を見る avec を : la direction regardée se traite comme un objet. On dit de même 空を見る, regarder le ciel.",
      en: "右を見る takes を: the direction you look at is treated as an object. Likewise 空を見る, to look at the sky." },
552:{ fr: "左に行く se comprend, mais on entend surtout 左に曲がる (まがる), « tourner à gauche » — la phrase exacte que donne un GPS japonais.",
      en: "左に行く is understood, but what you'll actually hear is 左に曲がる (まがる), 'turn left' — the exact phrase a Japanese satnav uses." },
553:{ fr: "立 se lit た dans 立つ et りつ en composé : 国立 (こくりつ) veut dire « national », littéralement « établi par l'État ». Vous avez les deux kanji.",
      en: "立 reads た in 立つ and りつ in compounds: 国立 (こくりつ) means 'national' — literally 'set up by the state'. You now know both kanji." },
/* g80 ～ています (état) */
554:{ fr: "立っています décrit une position tenue, pas le geste de se lever. Pour le geste, c'est 立ちます — même verbe, deux moments différents.",
      en: "立っています describes a position being held, not the act of standing up. For the act it's 立ちます — same verb, two different moments." },
/* g81 ～てもいいですか */
555:{ fr: "出る prend に pour la destination et を pour le lieu quitté : 外に出る (sortir dehors) mais 部屋を出る (quitter la pièce). La particule change tout.",
      en: "出る takes に for where you go and を for what you leave: 外に出る (go outside) but 部屋を出る (leave the room). The particle changes everything." },
/* g83 ～て、～て */
556:{ fr: "En japonais on BOIT le médicament, même en comprimé : くすりを飲む. Le verbe 飲む couvre tout ce qui descend sans être mâché.",
      en: "In Japanese you drink medicine, even a tablet: くすりを飲む. 飲む covers anything that goes down without chewing." }

};

/* Merge into the corpus. Kept here rather than in sentences.js so the corpus
 * file stays purely the corpus; notes.js loads after it. */
if (typeof SENTENCES !== "undefined") {
  for (const i in NOTES) if (SENTENCES[i]) SENTENCES[i].note = NOTES[i];
}
if (typeof module !== "undefined") module.exports = { NOTES };
