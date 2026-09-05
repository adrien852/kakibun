/* Kakibun — dialogues.
 *
 * Extra content alongside the 502 sentences; nothing here replaces anything.
 * A sentence teaches a pattern in isolation; a dialogue shows what the pattern
 * is FOR — who says it, what comes back, and how a real exchange holds together.
 *
 *   D(gp, where, lines, note)
 *     gp    = the LAST grammar point the dialogue needs. It unlocks there, so a
 *             dialogue never uses grammar the journey hasn't reached.
 *     where = the setting, which is also what makes the ten cities mean
 *             something: 東京 is introductions, 横浜 is finding your way…
 *     lines = [{ sp:"A"|"B", dsl, fr, en }] — the same DSL as sentences.js, so
 *             furigana, the word popup and TTS all work with no extra machinery.
 *     note  = one 💡 for the exchange as a whole: usually the pragmatics, the
 *             thing a grammar table can't tell you.
 *
 * The release checklist enforces the vocabulary rule mechanically: every word
 * used must already appear in a sentence at or before this dialogue's point.
 */
const DIALOGUES = [];
const D = (gp, where, lines, note) =>
  DIALOGUES.push({ i: DIALOGUES.length, gp, where, lines, note });

/* ============ ARC 1 — 東京 : se présenter ============ */

D("g05",
  { fr: "Premier jour à l'école de langue, Tokyo", en: "First day at the language school, Tokyo" },
  [
    { sp: "A", dsl: "hajimemashite 、 yamada0 です", fr: "Enchanté. Je suis Yamada.", en: "Nice to meet you. I'm Yamada." },
    { sp: "B", dsl: "hajimemashite 、 tanaka0 です", fr: "Enchanté. Je suis Tanaka.", en: "Nice to meet you. I'm Tanaka." },
    { sp: "A", dsl: "tanaka は=top gakusei です か=q", fr: "Vous êtes étudiant, M. Tanaka ?", en: "Are you a student, Mr Tanaka?" },
    { sp: "B", dsl: "hai 、 gakusei です", fr: "Oui, je suis étudiant.", en: "Yes, I'm a student." },
    { sp: "B", dsl: "yoroshiku", fr: "Ravi de vous rencontrer.", en: "Pleased to meet you." }
  ],
  { fr: "はじめまして ne se dit qu'UNE fois par personne, à la toute première rencontre ; ensuite c'est こんにちは. Remarquez qu'ils donnent leur nom SANS さん — on ne s'attribue jamais un titre de respect. Et よろしくおねがいします clôt toujours les présentations.",
    en: "はじめまして is said exactly ONCE per person, at the very first meeting; after that it's こんにちは. Note also that they give their names WITHOUT さん — you never award yourself an honorific. And よろしくおねがいします always closes an introduction." });

D("g08",
  { fr: "À la pause, entre deux cours", en: "During the break, between classes" },
  [
    { sp: "A", dsl: "yamada は=top nihonjin です か=q", fr: "Mme Yamada, vous êtes japonaise ?", en: "Ms Yamada, are you Japanese?" },
    { sp: "B", dsl: "hai 、 nihonjin です", fr: "Oui, je suis japonaise.", en: "Yes, I'm Japanese." },
    { sp: "B", dsl: "tanaka も=also nihonjin です か=q", fr: "M. Tanaka aussi est japonais ?", en: "Is Mr Tanaka Japanese as well?" },
    { sp: "A", dsl: "iie 、 furansujin です", fr: "Non, il est français.", en: "No, he's French." },
    { sp: "B", dsl: "soudesuka 、 furansujin の=poss sensei です か=q", fr: "Ah bon ? C'est un professeur français ?", en: "Really? Is he a French teacher?" }
  ],
  { fr: "そうですか avec la voix qui DESCEND veut dire « ah bon, je vois » — on prend acte. Avec la voix qui monte, c'est une vraie question, presque de la surprise. Le même mot, deux intentions, et rien à l'écrit pour les distinguer.",
    en: "そうですか with a FALLING voice means “ah, I see” — you're taking it in. With a rising voice it's a real question, close to surprise. Same word, two intentions, and nothing in writing to tell them apart." });

D("g09",
  { fr: "On remplit un formulaire à l'accueil", en: "Filling in a form at the reception desk" },
  [
    { sp: "A", dsl: "sumimasen 、 onamae は=top nan です か=q", fr: "Excusez-moi, quel est votre nom ?", en: "Excuse me, what's your name?" },
    { sp: "B", dsl: "tanaka0 です", fr: "Tanaka.", en: "Tanaka." },
    { sp: "A", dsl: "shigoto は=top nan です か=q", fr: "Quelle est votre profession ?", en: "What's your job?" },
    { sp: "B", dsl: "isha です", fr: "Je suis médecin.", en: "I'm a doctor." },
    { sp: "A", dsl: "arigatou", fr: "Merci beaucoup.", en: "Thank you very much." }
  ],
  { fr: "Remarquez la réponse : 田中です, pas 私は田中です. Dès que le contexte fournit le sujet, le japonais le laisse tomber — répondre par une phrase complète sonnerait scolaire, presque raide.",
    en: "Notice the answer: 田中です, not 私は田中です. As soon as context supplies the subject, Japanese drops it — a full sentence here would sound like a textbook, almost stiff." });

D("g10",
  { fr: "Un sac oublié dans la salle de classe", en: "A bag left behind in the classroom" },
  [
    { sp: "A", dsl: "sumimasen 、 tanaka の=poss kaban です か=q", fr: "Excusez-moi, c'est le sac de M. Tanaka ?", en: "Excuse me, is this Mr Tanaka's bag?" },
    { sp: "B", dsl: "iie 、 tanaka の=pron desu.janai", fr: "Non, ce n'est pas le sien.", en: "No, it isn't his." },
    { sp: "A", dsl: "dare の=poss kaban です か=q", fr: "À qui est ce sac ?", en: "Whose bag is it?" },
    { sp: "B", dsl: "yamada の=pron です", fr: "C'est celui de Mme Yamada.", en: "It's Ms Yamada's." },
    { sp: "A", dsl: "aa 、 soudesu か=q", fr: "Ah, d'accord.", en: "Ah, right." }
  ],
  { fr: "すみません ouvre à peu près tout au Japon : c'est « excusez-moi », « pardon » et « merci » à la fois. L'utiliser avant une question à un inconnu n'est pas une politesse optionnelle, c'est la porte d'entrée.",
    en: "すみません opens almost everything in Japan: it's “excuse me”, “sorry” and “thank you” at once. Using it before asking a stranger anything isn't optional politeness — it's the way in." });

D("g07",
  { fr: "Le matin, en arrivant", en: "In the morning, arriving" },
  [
    { sp: "A", dsl: "ohayou", fr: "Bonjour !", en: "Good morning!" },
    { sp: "B", dsl: "ohayou 、 kinou は=top ame desu.deshita", fr: "Bonjour. Hier, il pleuvait.", en: "Morning. It rained yesterday." },
    { sp: "A", dsl: "hai 、 kyou は=top hare です", fr: "Oui. Aujourd'hui, il fait beau.", en: "Yes. Today it's fine." },
    { sp: "B", dsl: "senshuu は=top yasumi desu.deshita か=q", fr: "La semaine dernière, c'était congé ?", en: "Was last week a holiday?" },
    { sp: "A", dsl: "iie 、 yasumi desu.janakatta", fr: "Non, ce n'était pas congé.", en: "No, it wasn't." }
  ],
  { fr: "La météo est le sujet neutre par excellence pour ouvrir une conversation japonaise — plus encore qu'en France. Ce n'est pas du remplissage : c'est la façon convenue de se saluer sans être intrusif.",
    en: "Weather is the neutral opener in Japanese conversation — even more so than in English. It isn't filler: it's the agreed way of greeting someone without prying." });

/* ============ ARC 2 — 横浜 : trouver son chemin ============ */

D("g14",
  { fr: "Sorti du métro, perdu", en: "Out of the metro, lost" },
  [
    { sp: "A", dsl: "sumimasen 、 eki は=top doko です か=q", fr: "Excusez-moi, où est la gare ?", en: "Excuse me, where's the station?" },
    { sp: "B", dsl: "asoko です", fr: "C'est là-bas.", en: "Over there." },
    { sp: "A", dsl: "aa 、 arigatou", fr: "Ah, merci.", en: "Ah, thank you." },
    { sp: "A", dsl: "konbini は=top doko です か=q", fr: "Et la supérette ?", en: "And the convenience store?" },
    { sp: "B", dsl: "konbini も=also asoko です", fr: "La supérette aussi est là-bas.", en: "The convenience store is over there too." },
    { sp: "A", dsl: "arigatou", fr: "Merci beaucoup.", en: "Thank you very much." }
  ],
  { fr: "Un Japonais à qui l'on demande son chemin vous accompagnera souvent jusqu'à destination plutôt que d'expliquer. Ne soyez pas surpris : refuser serait plus gênant que d'accepter.",
    en: "Ask a Japanese person for directions and they'll often walk you there rather than explain. Don't be surprised — refusing would be more awkward than accepting." });

D("g17",
  { fr: "Dans une petite boutique de Chinatown", en: "In a small shop in Chinatown" },
  [
    { sp: "A", dsl: "sumimasen 、 kore は=top ikura です か=q", fr: "Excusez-moi, combien coûte ceci ?", en: "Excuse me, how much is this?" },
    { sp: "B", dsl: "sore は=top sanbyakuen です", fr: "Cela fait 300 yens.", en: "That's 300 yen." },
    { sp: "A", dsl: "kono kasa は=top ikura です か=q", fr: "Et ce parapluie-ci ?", en: "And this umbrella?" },
    { sp: "B", dsl: "sono kasa は=top senen です", fr: "Ce parapluie fait 1000 yens.", en: "That umbrella is 1000 yen." },
    { sp: "A", dsl: "hai 、 soudesu か=q", fr: "Ah, d'accord.", en: "Right, I see." }
  ],
  { fr: "Suivez le ballet des démonstratifs : le client dit これ (dans sa main), le vendeur répond それ (du côté du client), puis le client passe à この+nom. Les trois distances font tout le travail, sans un mot de plus.",
    en: "Watch the demonstratives dance: the customer says これ (in his hand), the seller answers それ (on the customer's side), then the customer moves to この + noun. The three distances do all the work, with nothing added." });

D("g18",
  { fr: "Sur le quai, avant le train", en: "On the platform, before the train" },
  [
    { sp: "A", dsl: "sumimasen 、 ima nanji です か=q", fr: "Excusez-moi, quelle heure est-il ?", en: "Excuse me, what time is it?" },
    { sp: "B", dsl: "ima sanji です", fr: "Il est trois heures.", en: "It's three o'clock." },
    { sp: "A", dsl: "arigatou", fr: "Merci.", en: "Thank you." },
    { sp: "B", dsl: "kyou は=top yasumi です か=q", fr: "Aujourd'hui, c'est congé ?", en: "Is today a day off?" },
    { sp: "A", dsl: "iie 、 yasumi desu.janai", fr: "Non, ce n'est pas congé.", en: "No, it isn't." }
  ],
  { fr: "Les trains japonais partent à la minute annoncée. Demander l'heure sur un quai n'est donc pas une politesse en l'air : c'est une vraie question, et la réponse sera précise.",
    en: "Japanese trains leave at the minute stated. Asking the time on a platform isn't small talk, then — it's a real question, and the answer will be exact." });

D("g19",
  { fr: "Au bureau, un lundi", en: "At the office, on a Monday" },
  [
    { sp: "A", dsl: "kyou は=top nanyoubi です か=q", fr: "On est quel jour aujourd'hui ?", en: "What day is it today?" },
    { sp: "B", dsl: "kyou は=top getsuyoubi です", fr: "Aujourd'hui, c'est lundi.", en: "Today is Monday." },
    { sp: "A", dsl: "ashita は=top kayoubi です か=q", fr: "Demain, c'est mardi ?", en: "So tomorrow is Tuesday?" },
    { sp: "B", dsl: "hai 、 soudesu", fr: "Oui, c'est ça.", en: "Yes, that's right." },
    { sp: "B", dsl: "tanaka の=poss tanjoubi は=top nichiyoubi です", fr: "L'anniversaire de M. Tanaka est un dimanche.", en: "Mr Tanaka's birthday is on a Sunday." },
    { sp: "A", dsl: "soudesuka", fr: "Ah bon ?", en: "Is that so?" }
  ],
  { fr: "Le japonais commence la semaine au 月曜日, la lune, comme le français. Mais les calendriers japonais, eux, s'ouvrent souvent sur 日曜日 — le dimanche est en tête du tableau, pas en fin.",
    en: "Japanese starts the week at 月曜日, Monday, like English. But Japanese calendars often open on 日曜日 — Sunday sits at the head of the grid, not the end." });

D("g16",
  { fr: "Un parapluie oublié dans l'entrée", en: "An umbrella left in the entrance" },
  [
    { sp: "A", dsl: "sumimasen 、 kono kasa は=top dare の=pron です か=q", fr: "Excusez-moi, à qui est ce parapluie ?", en: "Excuse me, whose umbrella is this?" },
    { sp: "B", dsl: "watashi の=pron desu.janai", fr: "Ce n'est pas le mien.", en: "It isn't mine." },
    { sp: "A", dsl: "yamada の=pron です か=q", fr: "C'est celui de Mme Yamada ?", en: "Is it Ms Yamada's?" },
    { sp: "B", dsl: "iie 、 yamada の=poss kasa は=top are です", fr: "Non. Le parapluie de Mme Yamada, c'est celui-là.", en: "No. Ms Yamada's umbrella is that one over there." },
    { sp: "A", dsl: "aa 、 arigatou", fr: "Ah, merci.", en: "Ah, thank you." }
  ],
  { fr: "Les parapluies transparents à 500 yens des supérettes se ressemblent tous, et les entrées japonaises en sont pleines les jours de pluie. La question se pose donc pour de vrai.",
    en: "The clear 500-yen convenience-store umbrellas all look alike, and Japanese entrance halls are full of them on a wet day. So this question genuinely gets asked." });

/* ============ ARC 3 — 鎌倉 : ce qu'il y a, et combien ============ */

D("g22",
  { fr: "Le chat du temple a disparu", en: "The temple cat has gone missing" },
  [
    { sp: "A", dsl: "sumimasen 、 neko が=subj iru.masu か=q", fr: "Excusez-moi, y a-t-il un chat ?", en: "Excuse me, is there a cat?" },
    { sp: "B", dsl: "hai 、 niwa に=exist iru.masu", fr: "Oui, il est dans le jardin.", en: "Yes, it's in the garden." },
    { sp: "A", dsl: "heya に=exist iru.masu か=q", fr: "Il est dans la pièce ?", en: "Is it in the room?" },
    { sp: "B", dsl: "iie 、 heya に=exist iru.masen", fr: "Non, il n'est pas dans la pièce.", en: "No, it isn't in the room." }
  ],
  { fr: "います et non あります : un chat se déplace. C'est l'erreur que tout débutant commet une fois, et une seule — la correction d'un Japonais est en général immédiate et amusée.",
    en: "います, not あります: a cat moves. It's the mistake every beginner makes exactly once — a Japanese listener will correct it instantly, and with amusement." });

D("g23",
  { fr: "On cherche ses affaires avant de partir", en: "Looking for your things before leaving" },
  [
    { sp: "A", dsl: "watashi の=poss kaban は=top doko です か=q", fr: "Où est mon sac ?", en: "Where's my bag?" },
    { sp: "B", dsl: "tsukue の=poss ue に=exist aru.masu", fr: "Il est sur le bureau.", en: "It's on the desk." },
    { sp: "A", dsl: "pen も=also aru.masu か=q", fr: "Le stylo aussi ?", en: "Is the pen there too?" },
    { sp: "B", dsl: "hai 、 kaban の=poss naka に=exist aru.masu", fr: "Oui, il est dans le sac.", en: "Yes, it's in the bag." }
  ],
  { fr: "つくえの上に, かばんの中に : le japonais nomme la position (« le dessus », « l'intérieur ») là où le français emploie une préposition. Une fois ce réflexe pris, toute la série 上下中前後 s'utilise pareil.",
    en: "つくえの上に, かばんの中に: Japanese names the position (“the top”, “the inside”) where English uses a preposition. Once that clicks, the whole 上下中前後 set works the same way." });

D("g25",
  { fr: "Au supermarché, en listant ce qu'il y a", en: "At the supermarket, listing what's there" },
  [
    { sp: "A", dsl: "suupaa に=exist yasai や=list kudamono が=subj aru.masu", fr: "Au supermarché, il y a des légumes, des fruits…", en: "At the supermarket there are vegetables, fruit and so on." },
    { sp: "B", dsl: "pan と=and tamago も=also aru.masu か=q", fr: "Il y a aussi du pain et des œufs ?", en: "Is there bread and eggs too?" },
    { sp: "A", dsl: "hai 、 aru.masu", fr: "Oui, il y en a.", en: "Yes, there are." },
    { sp: "B", dsl: "ocha は=contrast aru.masu か=q", fr: "Et du thé ?", en: "What about tea?" },
    { sp: "A", dsl: "iie 、 ocha は=contrast aru.masen", fr: "Non, il n'y a pas de thé.", en: "No, there's no tea." }
  ],
  { fr: "や ouvre la liste, と la ferme : « des légumes, des fruits… » contre « du pain et des œufs », point final. Le choix de la particule dit à lui seul si vous avez tout énuméré.",
    en: "や opens the list, と closes it: “vegetables, fruit and so on” against “bread and eggs”, full stop. The particle alone tells your listener whether you've named everything." });

D("g27",
  { fr: "Chez le primeur", en: "At the greengrocer's" },
  [
    { sp: "A", dsl: "sumimasen 、 ringo は=top ikutsu aru.masu か=q", fr: "Excusez-moi, combien y a-t-il de pommes ?", en: "Excuse me, how many apples are there?" },
    { sp: "B", dsl: "mittsu aru.masu", fr: "Il y en a trois.", en: "There are three." },
    { sp: "A", dsl: "tamago も=also aru.masu か=q", fr: "Il y a des œufs aussi ?", en: "Are there eggs as well?" },
    { sp: "B", dsl: "hai 、 itsutsu aru.masu", fr: "Oui, il y en a cinq.", en: "Yes, there are five." }
  ],
  { fr: "みっつ, いつつ : ces compteurs-là viennent du japonais d'origine, pas du chinois. C'est pourquoi ils ne ressemblent en rien à さん et ご — deux systèmes de nombres cohabitent dans la langue.",
    en: "みっつ, いつつ: these counters come from native Japanese, not from Chinese. That's why they look nothing like さん and ご — two number systems live side by side in the language." });

D("g28",
  { fr: "Une salle vide en fin de journée", en: "An empty room at the end of the day" },
  [
    { sp: "A", dsl: "sumimasen 、 tanaka は=top iru.masu か=q", fr: "Excusez-moi, M. Tanaka est là ?", en: "Excuse me, is Mr Tanaka here?" },
    { sp: "B", dsl: "iie 、 dare も=none iru.masen", fr: "Non, il n'y a personne.", en: "No, there's nobody here." },
    { sp: "A", dsl: "heya に=exist hon が=subj aru.masu か=q", fr: "Il y a des livres dans la pièce ?", en: "Are there books in the room?" },
    { sp: "B", dsl: "iie 、 nani も=none aru.masen", fr: "Non, il n'y a rien.", en: "No, there's nothing." }
  ],
  { fr: "だれも et 何も exigent tous deux un verbe négatif. Là où le français double la négation (« personne… ne »), le japonais n'en met qu'une, portée par le ません final.",
    en: "だれも and 何も both demand a negative verb. Where French doubles the negative, Japanese uses just one, carried by the final ません." });

/* ============ ARC 4 — 富士山 : se déplacer ============ */

D("g30",
  { fr: "On parle du week-end à venir", en: "Talking about the coming weekend" },
  [
    { sp: "A", dsl: "ashita doko へ=dir iku.masu か=q", fr: "Où allez-vous demain ?", en: "Where are you going tomorrow?" },
    { sp: "B", dsl: "daigaku に=dest iku.masu", fr: "Je vais à l'université.", en: "I'm going to the university." },
    { sp: "A", dsl: "watashi も=also daigaku に=dest iku.masu", fr: "Moi aussi, j'y vais.", en: "I'm going there too." },
    { sp: "B", dsl: "soudesuka", fr: "Ah bon ?", en: "Oh really?" }
  ],
  { fr: "へ et に sont interchangeables ici, et les deux apparaissent dans le même échange — c'est exactement ce qui se passe dans la vraie langue. Personne ne choisit consciemment.",
    en: "へ and に are interchangeable here, and both turn up in the same exchange — which is exactly what happens in real speech. Nobody picks consciously." });

D("g34",
  { fr: "Comment tu viens ?", en: "How do you get here?" },
  [
    { sp: "A", dsl: "nande gakkou に=dest iku.masu か=q", fr: "Comment vas-tu à l'école ?", en: "How do you get to school?" },
    { sp: "B", dsl: "densha で=means iku.masu", fr: "J'y vais en train.", en: "I go by train." },
    { sp: "B", dsl: "tanaka は=top nande iku.masu か=q", fr: "Et toi, M. Tanaka ?", en: "And how about you, Mr Tanaka?" },
    { sp: "A", dsl: "watashi は=top jitensha で=means iku.masu", fr: "Moi, j'y vais à vélo.", en: "I go by bike." }
  ],
  { fr: "何で se lit ici なんで, « par quel moyen ». Le même なんで peut vouloir dire « pourquoi » — dans le doute, un Japonais précisera 何で行きますか contre どうして行きますか.",
    en: "何で is read なんで here, “by what means”. The same なんで can mean “why” — when it's ambiguous, a speaker will fall back on 何で行きますか versus どうして行きますか." });

D("g33",
  { fr: "Devant la banque, portes closes", en: "Outside the bank, doors shut" },
  [
    { sp: "A", dsl: "sumimasen 、 ginkou は=top nanji から=from です か=q", fr: "Excusez-moi, la banque ouvre à quelle heure ?", en: "Excuse me, from what time is the bank open?" },
    { sp: "B", dsl: "kuji から=from です", fr: "À partir de 9 h.", en: "From nine." },
    { sp: "A", dsl: "nanji まで=until です か=q", fr: "Et jusqu'à quelle heure ?", en: "And until when?" },
    { sp: "B", dsl: "gogo sanji まで=until です", fr: "Jusqu'à 15 h.", en: "Until three in the afternoon." },
    { sp: "A", dsl: "arigatou", fr: "Merci beaucoup.", en: "Thank you very much." }
  ],
  { fr: "Les banques japonaises ferment tôt, souvent à 15 h. C'est un fait pratique autant qu'une leçon de grammaire : から et まで vous serviront d'abord à ne pas trouver porte close.",
    en: "Japanese banks close early, often at three. That's as much a practical fact as a grammar lesson: から and まで will first earn their keep by keeping you from a locked door." });

D("g36",
  { fr: "On compare ses horaires", en: "Comparing schedules" },
  [
    { sp: "A", dsl: "mainichi nanji に=time okiru.masu か=q", fr: "Tu te lèves à quelle heure tous les jours ?", en: "What time do you get up every day?" },
    { sp: "B", dsl: "shichiji に=time okiru.masu", fr: "Je me lève à 7 h.", en: "I get up at seven." },
    { sp: "A", dsl: "nanji に=time neru.masu か=q", fr: "Et tu te couches à quelle heure ?", en: "And what time do you go to bed?" },
    { sp: "B", dsl: "juuji に=time neru.masu", fr: "Je me couche à 22 h.", en: "I go to bed at ten." }
  ],
  { fr: "毎日 n'a pas de に, 七時 en a un : le temps relatif reste nu, le temps pointable sur une horloge prend に. Les deux règles cohabitent dans la même phrase, sans conflit.",
    en: "毎日 takes no に, 七時 does: relative time stays bare, clock time takes に. The two rules sit in one sentence without conflict." });

D("g32",
  { fr: "Un voyage, mais avec qui ?", en: "A trip — but with whom?" },
  [
    { sp: "A", dsl: "konshuu toukyou へ=dir iku.masu", fr: "Cette semaine, je vais à Tokyo.", en: "I'm going to Tokyo this week." },
    { sp: "B", dsl: "dare と=with iku.masu か=q", fr: "Avec qui y vas-tu ?", en: "Who are you going with?" },
    { sp: "A", dsl: "tomodachi と=with iku.masu", fr: "J'y vais avec un ami.", en: "I'm going with a friend." },
    { sp: "B", dsl: "watashi は=top hitoride iku.masu", fr: "Moi, j'y vais seul.", en: "I'm going on my own." }
  ],
  { fr: "一人で et non ✗一人と : « seul » prend で, la particule du moyen, alors que « avec » prend と. Le piège est d'autant plus tenace que le français dit « seul » sans préposition.",
    en: "一人で, not ✗一人と: “alone” takes で, the means particle, while “with” takes と. The trap sticks because English says “alone” with no preposition at all." });

/* ============ ARC 5 — 名古屋 : la journée ordinaire ============ */

D("g42",
  { fr: "Midi approche", en: "Lunchtime is coming" },
  [
    { sp: "A", dsl: "hirugohan を=obj doko で=place taberu.masu か=q", fr: "Où déjeunes-tu ?", en: "Where do you have lunch?" },
    { sp: "B", dsl: "resutoran で=place taberu.masu", fr: "Je mange au restaurant.", en: "I eat at a restaurant." },
    { sp: "A", dsl: "watashi は=top uchi で=place taberu.masu", fr: "Moi, je mange chez moi.", en: "I eat at home." },
    { sp: "B", dsl: "soudesuka", fr: "Ah bon.", en: "I see." }
  ],
  { fr: "で pour le lieu d'une action, に pour le lieu d'une présence : うちで食べます mais うちにいます. La même maison, deux particules selon ce que vous y faites.",
    en: "で for where an action happens, に for where something is: うちで食べます but うちにいます. The same house, two particles depending on what you're doing in it." });

D("g47",
  { fr: "Devant la machine à café", en: "By the coffee machine" },
  [
    { sp: "A", dsl: "mou hirugohan を=obj taberu.mashita か=q", fr: "Tu as déjà déjeuné ?", en: "Have you had lunch yet?" },
    { sp: "B", dsl: "iie 、 mada です", fr: "Non, pas encore.", en: "No, not yet." },
    { sp: "A", dsl: "watashi は=top mou taberu.mashita", fr: "Moi, j'ai déjà mangé.", en: "I've already eaten." },
    { sp: "B", dsl: "soudesuka 、 mou sanji です か=q", fr: "Ah bon, il est déjà 15 h ?", en: "Really, is it three already?" }
  ],
  { fr: "La réponse est まだです, jamais 食べませんでした — qui voudrait dire « je n'ai pas mangé du tout ». まだ laisse la porte ouverte : ce n'est pas encore fait, mais ça va l'être.",
    en: "The answer is まだです, never 食べませんでした, which would mean “I didn't eat at all”. まだ leaves the door open: not done yet, but it will be." });

D("g43",
  { fr: "Un coup de téléphone", en: "A phone call" },
  [
    { sp: "A", dsl: "moshimoshi 、 tanaka0 です", fr: "Allô, c'est Tanaka.", en: "Hello, this is Tanaka." },
    { sp: "B", dsl: "aa 、 tanaka", fr: "Ah, monsieur Tanaka.", en: "Ah, Mr Tanaka." },
    { sp: "A", dsl: "ashita yamada に=iobj au.masu か=q", fr: "Vous voyez Mme Yamada demain ?", en: "Are you meeting Ms Yamada tomorrow?" },
    { sp: "B", dsl: "hai 、 kissaten で=place au.masu", fr: "Oui, on se retrouve au café.", en: "Yes, we're meeting at the coffee shop." }
  ],
  { fr: "もしもし ne s'emploie qu'au téléphone — jamais pour aborder quelqu'un dans la rue. Et 会います prend に : en japonais, on rencontre « à » quelqu'un.",
    en: "もしもし is only for the telephone — never for approaching someone in the street. And 会います takes に: in Japanese you meet “to” someone." });

D("g46",
  { fr: "On parle de ses habitudes", en: "Talking about what you usually do" },
  [
    { sp: "A", dsl: "yoku eiga を=obj miru.masu か=q", fr: "Tu regardes souvent des films ?", en: "Do you watch films often?" },
    { sp: "B", dsl: "tokidoki miru.masu", fr: "Parfois.", en: "Sometimes." },
    { sp: "B", dsl: "tanaka は=top yoku miru.masu か=q", fr: "Et toi, tu en regardes souvent ?", en: "Do you watch them often?" },
    { sp: "A", dsl: "watashi は=top amari miru.masen", fr: "Pas beaucoup.", en: "Not much." },
    { sp: "A", dsl: "terebi を=obj yoku miru.masu", fr: "Je regarde souvent la télé.", en: "I watch a lot of television." }
  ],
  { fr: "あまり appelle obligatoirement un verbe négatif — あまり見ません. On ne peut pas dire ✗あまり見ます : le mot n'existe qu'en compagnie d'une négation.",
    en: "あまり compulsorily takes a negative verb — あまり見ません. You can't say ✗あまり見ます: the word only exists alongside a negative." });

D("g49",
  { fr: "Sur le rythme d'étude", en: "About study routines" },
  [
    { sp: "A", dsl: "mainichi benkyou.masu か=q", fr: "Tu étudies tous les jours ?", en: "Do you study every day?" },
    { sp: "B", dsl: "iie 、 isshuukan に=freq sankai benkyou.masu", fr: "Non, trois fois par semaine.", en: "No, three times a week." },
    { sp: "A", dsl: "watashi は=top mainichi ichijikan benkyou.masu", fr: "Moi, j'étudie une heure par jour.", en: "I study for an hour every day." },
    { sp: "B", dsl: "soudesuka", fr: "Ah bon.", en: "Is that so." }
  ],
  { fr: "一時間 est une DURÉE, 一時 un moment. 三時 = 15 h, 三時間 = trois heures de long. Le 間 fait toute la différence, et il s'oublie facilement.",
    en: "一時間 is a DURATION, 一時 a moment. 三時 = three o'clock, 三時間 = three hours long. The 間 makes all the difference, and it's easily forgotten." });

/* ============ ARC 6 — 京都 : proposer, vouloir ============ */

D("g52",
  { fr: "On organise une sortie", en: "Making a plan" },
  [
    { sp: "A", dsl: "ashita isshoni eiga を=obj miru.masenka", fr: "On va voir un film demain ?", en: "Shall we see a film tomorrow?" },
    { sp: "B", dsl: "ee 、 miru.mashou", fr: "Oui, allons-y.", en: "Yes, let's." },
    { sp: "A", dsl: "nanji に=time au.mashouka", fr: "On se retrouve à quelle heure ?", en: "What time shall we meet?" },
    { sp: "B", dsl: "sanji に=time eki で=place au.mashou", fr: "Retrouvons-nous à 15 h à la gare.", en: "Let's meet at three at the station." }
  ],
  { fr: "Voyez l'escalier : ませんか propose, ましょう accepte, ましょうか redemande l'avis de l'autre. Trois degrés d'engagement pour une seule sortie au cinéma.",
    en: "Notice the staircase: ませんか proposes, ましょう accepts, ましょうか asks the other person again. Three degrees of commitment for one trip to the cinema." });

D("g52",
  { fr: "Quelqu'un porte trop de choses", en: "Someone is carrying too much" },
  [
    { sp: "A", dsl: "tetsudau.mashouka", fr: "Je vous aide ?", en: "Shall I help you?" },
    { sp: "B", dsl: "arigatou 、 onegaishimasu", fr: "Merci, volontiers.", en: "Thank you, yes please." },
    { sp: "A", dsl: "doa を=obj akeru.mashouka", fr: "J'ouvre la porte ?", en: "Shall I get the door?" },
    { sp: "B", dsl: "hai 、 onegaishimasu", fr: "Oui, s'il vous plaît.", en: "Yes, please." }
  ],
  { fr: "おねがいします accepte une offre ; ください la réclame. À quelqu'un qui vous propose son aide, おねがいします est la seule bonne réponse — ください sonnerait comme un ordre.",
    en: "おねがいします accepts an offer; ください demands one. To someone offering help, おねがいします is the only right answer — ください would land like an order." });

D("g53",
  { fr: "Premier jour au Japon", en: "First day in Japan" },
  [
    { sp: "A", dsl: "nihon で=place nani を=obj suru.tai か=q", fr: "Qu'est-ce que tu veux faire au Japon ?", en: "What do you want to do in Japan?" },
    { sp: "B", dsl: "sushi を=obj taberu.tai", fr: "Je veux manger des sushis.", en: "I want to eat sushi." },
    { sp: "B", dsl: "tanaka は=top nani を=obj suru.tai か=q", fr: "Et toi, qu'est-ce que tu veux faire ?", en: "What do you want to do?" },
    { sp: "A", dsl: "watashi は=top kyouto へ=dir iku.tai", fr: "Moi, je veux aller à Kyoto.", en: "I want to go to Kyoto." }
  ],
  { fr: "たい ne dit que SON propre désir. On ne demande たいですか qu'à son interlocuteur, jamais à propos d'un tiers — présumer de ce que veut un absent ne se fait pas.",
    en: "たい states only your OWN wish. You ask たいですか of the person in front of you, never about a third party — presuming to know an absent person's wishes isn't done." });

D("g55",
  { fr: "Un cadeau d'anniversaire à choisir", en: "Choosing a birthday present" },
  [
    { sp: "A", dsl: "tanjoubi に=time nani が=obj hoshii です か=q", fr: "Qu'est-ce que tu veux pour ton anniversaire ?", en: "What would you like for your birthday?" },
    { sp: "B", dsl: "sumaho が=obj hoshii です", fr: "Je voudrais un smartphone.", en: "I'd like a smartphone." },
    { sp: "A", dsl: "soudesuka", fr: "Ah bon.", en: "I see." },
    { sp: "B", dsl: "tanaka は=top nani が=obj hoshii です か=q", fr: "Et toi, qu'est-ce que tu veux ?", en: "And what do you want?" },
    { sp: "A", dsl: "watashi は=top hon が=obj hoshii です", fr: "Moi, je voudrais un livre.", en: "I'd like a book." }
  ],
  { fr: "ほしい prend が et non を : la chose désirée est traitée en sujet, « le smartphone est désirable pour moi ». C'est un adjectif, pas un verbe — d'où la particule.",
    en: "ほしい takes が, not を: the wanted thing is treated as the subject, “the smartphone is desirable to me”. It's an adjective, not a verb — hence the particle." });

D("g58",
  { fr: "Dimanche approche", en: "Sunday is coming up" },
  [
    { sp: "A", dsl: "nichiyoubi dokoka iku.masu か=q", fr: "Tu vas quelque part dimanche ?", en: "Are you going anywhere on Sunday?" },
    { sp: "B", dsl: "ee 、 umi に=dest iku.tai", fr: "Oui, je voudrais aller à la mer.", en: "Yes, I'd like to go to the sea." },
    { sp: "A", dsl: "dare と=with iku.masu か=q", fr: "Avec qui ?", en: "Who with?" },
    { sp: "B", dsl: "kazoku と=with isshoni iku.masu", fr: "J'y vais avec ma famille.", en: "I'm going with my family." }
  ],
  { fr: "どこか avale la particule : どこか行きます, sans に ni へ. Les indéfinis en か se passent des particules que leur mot interrogatif d'origine réclamait.",
    en: "どこか swallows the particle: どこか行きます, with no に or へ. The か-indefinites drop the particles their question-word originals required." });

/* ============ ARC 7 — 大阪 : donner son avis ============ */

D("g65",
  { fr: "Premier soir à Osaka", en: "First evening in Osaka" },
  [
    { sp: "A", dsl: "kono machi は=top dou です か=q", fr: "Comment tu trouves cette ville ?", en: "How do you find this town?" },
    { sp: "B", dsl: "totemo nigiyaka です", fr: "C'est très animé.", en: "It's very lively." },
    { sp: "A", dsl: "resutoran は=top dou です か=q", fr: "Et les restaurants ?", en: "And the restaurants?" },
    { sp: "B", dsl: "totemo yasui です", fr: "Ils sont très bon marché.", en: "They're very cheap." }
  ],
  { fr: "どうですか demande une impression, pas une description. Répondre par des faits (« il y a deux millions d'habitants ») raterait la question : on attend ce que vous en pensez.",
    en: "どうですか asks for an impression, not a description. Answering with facts (“it has two million people”) misses the question: what's wanted is what you make of it." });

D("g66",
  { fr: "Devant un menu", en: "Looking at a menu" },
  [
    { sp: "A", dsl: "donna ryouri.noun が=obj suki です か=q", fr: "Quel genre de cuisine aimes-tu ?", en: "What kind of food do you like?" },
    { sp: "B", dsl: "sushi が=obj daisuki です", fr: "J'adore les sushis.", en: "I love sushi." },
    { sp: "B", dsl: "tanaka は=top nani が=obj suki です か=q", fr: "Et toi, qu'est-ce que tu aimes ?", en: "What do you like?" },
    { sp: "A", dsl: "watashi は=top keeki が=obj suki です", fr: "Moi, j'aime les gâteaux.", en: "I like cake." }
  ],
  { fr: "好き est un adjectif, pas un verbe : la chose aimée prend が. Littéralement « les sushis sont plaisants ». C'est pour cela qu'on ne dit jamais ✗すしを好きです.",
    en: "好き is an adjective, not a verb: the liked thing takes が. Literally “sushi is pleasing”. Which is why you never say ✗すしを好きです." });

D("g67",
  { fr: "On complimente votre japonais", en: "Someone compliments your Japanese" },
  [
    { sp: "A", dsl: "nihongo が=obj wakaru.masu か=q", fr: "Vous comprenez le japonais ?", en: "Do you understand Japanese?" },
    { sp: "B", dsl: "sukoshi wakaru.masu", fr: "Un peu.", en: "A little." },
    { sp: "A", dsl: "jouzu です ね=agree", fr: "Vous êtes doué !", en: "You're good at it!" },
    { sp: "B", dsl: "iie 、 heta です", fr: "Non, je suis mauvais.", en: "No, I'm not good at all." }
  ],
  { fr: "日本語が上手ですね vous sera dit dès votre troisième phrase. La réponse attendue n'est pas « merci » mais une négation modeste — accepter le compliment sonnerait vaniteux.",
    en: "日本語が上手ですね will be said to you by your third sentence. The expected reply isn't “thank you” but a modest denial — accepting the compliment would sound vain." });

D("g69",
  { fr: "Une invitation déclinée", en: "Turning down an invitation" },
  [
    { sp: "A", dsl: "doushite eiga を=obj miru.masen か=q", fr: "Pourquoi tu ne viens pas voir le film ?", en: "Why aren't you coming to the film?" },
    { sp: "B", dsl: "isogashii です から=because 、 miru.masen", fr: "Je suis occupé, donc je n'y vais pas.", en: "I'm busy, so I'm not going." },
    { sp: "A", dsl: "soudesuka", fr: "Ah bon.", en: "I see." },
    { sp: "B", dsl: "ashita は=contrast hima です から=because 、 miru.masu", fr: "Mais demain je suis libre, donc j'irai.", en: "Tomorrow I'm free, though, so I'll go." }
  ],
  { fr: "La raison passe TOUJOURS devant : « occupé, donc je n'y vais pas ». Un francophone commence par la conclusion, un Japonais par la cause — inverser l'ordre est la faute la plus fréquente.",
    en: "The reason ALWAYS comes first: “busy, so I'm not going”. English starts with the conclusion, Japanese with the cause — flipping the order is the commonest mistake." });

D("g65",
  { fr: "Devant une pâtisserie connue", en: "Outside a well-known cake shop" },
  [
    { sp: "A", dsl: "ano mise は=top yuumei です か=q", fr: "Ce magasin est célèbre ?", en: "Is that shop famous?" },
    { sp: "B", dsl: "hai 、 yuumei.na mise です", fr: "Oui, c'est un magasin célèbre.", en: "Yes, it's a famous shop." },
    { sp: "B", dsl: "keeki が=subj totemo oishii です", fr: "Les gâteaux y sont très bons.", en: "The cakes are very good." },
    { sp: "A", dsl: "takai です か=q", fr: "C'est cher ?", en: "Is it expensive?" },
    { sp: "B", dsl: "iie 、 amari takai.kunai です", fr: "Non, pas très cher.", en: "No, not very." }
  ],
  { fr: "ゆうめいです en fin de phrase, ゆうめいな店 devant un nom : le な n'apparaît que collé au nom qu'il qualifie. C'est de là que ces adjectifs tirent leur nom.",
    en: "ゆうめいです at the end of a sentence, ゆうめいな店 before a noun: the な appears only when glued to the noun it describes. That's where these adjectives get their name." });

/* ============ ARC 8 — 広島 : comparer ============ */

D("g71",
  { fr: "Train ou bus pour Hiroshima ?", en: "Train or bus to Hiroshima?" },
  [
    { sp: "A", dsl: "densha と=and basu と=and 、 dochira が=subj hayai です か=q", fr: "Le train ou le bus, lequel est le plus rapide ?", en: "Train or bus — which is faster?" },
    { sp: "B", dsl: "densha の=poss hou が=subj hayai です", fr: "Le train est plus rapide.", en: "The train is faster." },
    { sp: "A", dsl: "takai です か=q", fr: "Et c'est cher ?", en: "And is it expensive?" },
    { sp: "B", dsl: "hai 、 densha の=poss hou が=subj takai です", fr: "Oui, le train est plus cher.", en: "Yes, the train is more expensive." }
  ],
  { fr: "のほう veut dire « le côté » : on ne compare pas deux objets mais deux côtés d'une balance. D'où 電車のほうが — « du côté du train, c'est plus rapide ».",
    en: "のほう means “the side”: you're not comparing two objects but two sides of a scale. Hence 電車のほうが — “on the train side, it's faster”." });

D("g72",
  { fr: "Le plat préféré", en: "The favourite dish" },
  [
    { sp: "A", dsl: "nihon の=poss ryouri.noun で=place nani が=subj ichiban suki です か=q", fr: "Dans la cuisine japonaise, qu'est-ce que tu préfères ?", en: "Of all Japanese food, what do you like best?" },
    { sp: "B", dsl: "sushi が=subj ichiban suki です", fr: "Ce sont les sushis que je préfère.", en: "I like sushi best." },
    { sp: "A", dsl: "watashi は=top niku が=obj amari suki desu.janai", fr: "Moi, je n'aime pas beaucoup la viande.", en: "I don't much like meat." },
    { sp: "B", dsl: "soudesuka", fr: "Ah bon.", en: "Is that so." }
  ],
  { fr: "いちばん signifie « numéro un » : le japonais n'a pas de superlatif, il ajoute simplement « le plus » devant l'adjectif. Aucune terminaison ne change.",
    en: "いちばん means “number one”: Japanese has no superlative form, it just puts “most” in front of the adjective. No ending changes at all." });

D("g73",
  { fr: "Un régime particulier", en: "A particular diet" },
  [
    { sp: "A", dsl: "niku は=contrast taberu.masu か=q", fr: "Tu manges de la viande ?", en: "Do you eat meat?" },
    { sp: "B", dsl: "niku は=contrast taberu.masu が=but 、 sakana は=contrast taberu.masen", fr: "Je mange de la viande, mais pas de poisson.", en: "I eat meat, but not fish." },
    { sp: "A", dsl: "doushite です か=q", fr: "Pourquoi ?", en: "Why's that?" },
    { sp: "B", dsl: "suki desu.janai から=because", fr: "Parce que je n'aime pas ça.", en: "Because I don't like it." }
  ],
  { fr: "Deux は face à face signalent une opposition, et ils chassent le を attendu : にくは食べます, pas にくを. Le contraste prend le pas sur la fonction grammaticale.",
    en: "Two は facing off signal a contrast, and they displace the expected を: にくは食べます, not にくを. Contrast outranks grammatical function." });

D("g75",
  { fr: "Le froid arrive", en: "The cold sets in" },
  [
    { sp: "A", dsl: "samui.ku naru.mashita ね=agree", fr: "Il s'est mis à faire froid, non ?", en: "It's turned cold, hasn't it?" },
    { sp: "B", dsl: "hai 、 senshuu は=top atsui.katta です", fr: "Oui, la semaine dernière il faisait chaud.", en: "Yes, last week it was hot." },
    { sp: "A", dsl: "raishuu も=also samui です か=q", fr: "La semaine prochaine aussi, il fera froid ?", en: "Will it be cold next week too?" },
    { sp: "B", dsl: "wakaru.masen", fr: "Je ne sais pas.", en: "I don't know." }
  ],
  { fr: "い devient く devant なります : さむい → さむくなりました. Et le ね cherche votre accord sur un fait que vous ressentez tous les deux — c'est ce qui le rend naturel ici.",
    en: "い becomes く before なります: さむい → さむくなりました. And the ね seeks agreement about something you can both feel — which is what makes it natural here." });

D("g76",
  { fr: "Le récit de la veille", en: "Telling someone about yesterday" },
  [
    { sp: "A", dsl: "kinou nani を=obj suru.mashita か=q", fr: "Qu'as-tu fait hier ?", en: "What did you do yesterday?" },
    { sp: "B", dsl: "kouen を=path sanpo.mashita", fr: "Je me suis promené dans le parc.", en: "I went for a walk in the park." },
    { sp: "B", dsl: "sorekara 、 resutoran で=place bangohan を=obj taberu.mashita", fr: "Et puis j'ai dîné au restaurant.", en: "Then I had dinner at a restaurant." },
    { sp: "A", dsl: "oishii.katta です か=q", fr: "C'était bon ?", en: "Was it good?" },
    { sp: "B", dsl: "hai 、 totemo oishii.katta です", fr: "Oui, c'était très bon.", en: "Yes, it was very good." }
  ],
  { fr: "それから marque la suite dans le temps, そして relie simplement deux faits. Pour raconter une journée, それから est le mot qui fait avancer le récit.",
    en: "それから marks what came next in time; そして just links two facts. To narrate a day, それから is the word that moves the story along." });

/* ============ ARC 9 — 福岡 : demander, permettre ============ */

D("g78",
  { fr: "On n'a rien compris", en: "You didn't catch a word" },
  [
    { sp: "A", dsl: "sumimasen 、 mou ichido iu.te kudasai", fr: "Excusez-moi, pouvez-vous répéter ?", en: "Sorry, could you say that again?" },
    { sp: "B", dsl: "eki は=top asoko です", fr: "La gare est là-bas.", en: "The station is over there." },
    { sp: "A", dsl: "yukkuri hanasu.te kudasai", fr: "Parlez lentement, s'il vous plaît.", en: "Please speak slowly." },
    { sp: "B", dsl: "hai 、 eki は=top asoko です", fr: "D'accord, la gare est là-bas.", en: "All right — the station is over there." },
    { sp: "A", dsl: "arigatou", fr: "Merci beaucoup.", en: "Thank you very much." }
  ],
  { fr: "もういちど言ってください et ゆっくり話してください sont les deux phrases à savoir par cœur avant de partir. Elles vous serviront plus que n'importe quelle liste de vocabulaire.",
    en: "もういちど言ってください and ゆっくり話してください are the two sentences to know by heart before you go. They'll serve you better than any vocabulary list." });

D("g82",
  { fr: "Dans un temple", en: "Inside a temple" },
  [
    { sp: "A", dsl: "sumimasen 、 shashin を=obj toru.te ~もいいですか", fr: "Excusez-moi, puis-je prendre une photo ?", en: "Excuse me, may I take a photo?" },
    { sp: "B", dsl: "hai 、 ii です よ=emph", fr: "Oui, bien sûr.", en: "Yes, that's fine." },
    { sp: "A", dsl: "arigatou", fr: "Merci.", en: "Thank you." },
    { sp: "B", dsl: "demo 、 naka で=place toru.te ~はいけません", fr: "Mais à l'intérieur, c'est interdit.", en: "But you mustn't take any inside." }
  ],
  { fr: "Demander avant de photographier n'est pas une formalité au Japon : dans les temples, les magasins et les restaurants, la question est attendue — et la réponse est souvent oui.",
    en: "Asking before photographing isn't a formality in Japan: in temples, shops and restaurants the question is expected — and the answer is usually yes." });

D("g80",
  { fr: "On fait connaissance", en: "Getting to know someone" },
  [
    { sp: "A", dsl: "doko に=exist sumu.teimasu か=q", fr: "Où habitez-vous ?", en: "Where do you live?" },
    { sp: "B", dsl: "toukyou に=exist sumu.teimasu", fr: "J'habite à Tokyo.", en: "I live in Tokyo." },
    { sp: "A", dsl: "kaisha で=place hataraku.teimasu か=q", fr: "Vous travaillez dans une entreprise ?", en: "Do you work at a company?" },
    { sp: "B", dsl: "hai 、 ginkou で=place hataraku.teimasu", fr: "Oui, je travaille dans une banque.", en: "Yes, I work at a bank." }
  ],
  { fr: "住んでいます, pas 住みます : certains verbes n'existent qu'à l'état. すむ, しる et はたらく décrivent une situation durable, et la forme ている est la seule naturelle.",
    en: "住んでいます, not 住みます: some verbs exist only as states. すむ, しる and はたらく describe a lasting situation, and the ている form is the only natural one." });

D("g84",
  { fr: "Le matin d'un collègue", en: "A colleague's morning" },
  [
    { sp: "A", dsl: "asa nani を=obj suru.masu か=q", fr: "Que fais-tu le matin ?", en: "What do you do in the morning?" },
    { sp: "B", dsl: "okiru.te 、 koohii を=obj nomu.te 、 shigoto に=dest iku.masu", fr: "Je me lève, je bois un café et je vais au travail.", en: "I get up, drink a coffee and go to work." },
    { sp: "A", dsl: "asagohan を=obj taberu.masen か=q", fr: "Tu ne prends pas de petit-déjeuner ?", en: "You don't have breakfast?" },
    { sp: "B", dsl: "dekakeru.te ~から 、 kissaten で=place taberu.masu", fr: "Après être sorti, je mange au café.", en: "After I leave, I eat at a coffee shop." }
  ],
  { fr: "Trois actions enchaînées, un seul temps : seul le dernier verbe porte le 行きます. Les formes て qui précèdent restent neutres et héritent du temps final.",
    en: "Three actions chained, one tense: only the last verb carries 行きます. The て forms before it stay neutral and inherit the final tense." });

D("g85",
  { fr: "Au guichet de la gare", en: "At the station ticket window" },
  [
    { sp: "A", dsl: "sumimasen 、 kippu を=obj futatsu kudasai", fr: "Excusez-moi, deux billets s'il vous plaît.", en: "Excuse me, two tickets please." },
    { sp: "B", dsl: "senen です", fr: "Ça fait 1000 yens.", en: "That's 1000 yen." },
    { sp: "A", dsl: "onegaishimasu", fr: "Voilà, merci.", en: "Here you are." },
    { sp: "B", dsl: "arigatou", fr: "Merci beaucoup.", en: "Thank you very much." }
  ],
  { fr: "Le compteur se glisse entre を et ください : きっぷを二つください. Il ne se colle jamais au nom — ✗二つのきっぷ serait compris, mais sonne étranger.",
    en: "The counter slots between を and ください: きっぷを二つください. It never attaches to the noun — ✗二つのきっぷ would be understood, but sounds foreign." });

/* ============ ARC 10 — 北海道 : penser, raconter ============ */

D("g95",
  { fr: "On parle de ses voyages", en: "Talking about travels" },
  [
    { sp: "A", dsl: "nihon に=dest iku.ta ~ことがあります か=q", fr: "Tu es déjà allé au Japon ?", en: "Have you ever been to Japan?" },
    { sp: "B", dsl: "hai 、 nikai iku.ta ~ことがあります", fr: "Oui, j'y suis allé deux fois.", en: "Yes, I've been twice." },
    { sp: "A", dsl: "sushi を=obj taberu.ta ~ことがあります か=q", fr: "Tu as déjà mangé des sushis ?", en: "Have you ever eaten sushi?" },
    { sp: "B", dsl: "hai 、 aru.masu", fr: "Oui, ça m'est arrivé.", en: "Yes, I have." }
  ],
  { fr: "たことがあります dit « au moins une fois dans ma vie », pas « je l'ai fait hier ». Pour un fait daté, le simple passé suffit : きのう食べました.",
    en: "たことがあります says “at least once in my life”, not “I did it yesterday”. For a dated event the plain past is enough: きのう食べました." });

D("g97",
  { fr: "La météo du week-end", en: "The weekend forecast" },
  [
    { sp: "A", dsl: "ashita の=poss tenki は=top dou です か=q", fr: "Quel temps fera-t-il demain ?", en: "What will the weather be like tomorrow?" },
    { sp: "B", dsl: "ame desu.da と=quote omou.masu", fr: "Je pense qu'il pleuvra.", en: "I think it'll rain." },
    { sp: "A", dsl: "shuumatsu は=top hare desu.da と=quote omou.masu か=q", fr: "Tu penses qu'il fera beau ce week-end ?", en: "Do you think it'll be fine at the weekend?" },
    { sp: "B", dsl: "hai 、 hare desu.da と=quote omou.masu", fr: "Oui, je pense qu'il fera beau.", en: "Yes, I think it'll be fine." }
  ],
  { fr: "だ devant と, même dans une phrase polie : un nom ne se cite jamais nu. On dit 雨だと思います et non ✗雨と思います — la citation passe toujours en forme neutre.",
    en: "だ before と, even inside a polite sentence: a noun is never quoted bare. It's 雨だと思います, not ✗雨と思います — quotations always go into the plain form." });

D("g96",
  { fr: "Ce qu'on fait le week-end", en: "What you do at weekends" },
  [
    { sp: "A", dsl: "shuumatsu は=top nani を=obj suru.masu か=q", fr: "Que fais-tu le week-end ?", en: "What do you do at weekends?" },
    { sp: "B", dsl: "hon を=obj yomu.tari 、 eiga を=obj miru.tari suru.masu", fr: "Je lis, je regarde des films…", en: "I read, watch films, that sort of thing." },
    { sp: "A", dsl: "watashi は=top ryouri.tari 、 sanpo.tari suru.masu", fr: "Moi, je cuisine, je me promène…", en: "I cook, go for walks, and so on." },
    { sp: "B", dsl: "soudesuka", fr: "Ah bon.", en: "Is that so." }
  ],
  { fr: "たり est aux verbes ce que や est aux noms : une liste d'exemples volontairement incomplète. Dire « je lis et je regarde des films » avec て impliquerait que c'est tout.",
    en: "たり is to verbs what や is to nouns: a deliberately incomplete list of examples. Saying “I read and watch films” with て would imply that's the whole of it." });

D("g93",
  { fr: "On s'en va un peu tôt", en: "Leaving a little early" },
  [
    { sp: "A", dsl: "mou kaeru.nakereba ~なりません", fr: "Je dois déjà rentrer.", en: "I have to head home already." },
    { sp: "B", dsl: "soudesuka 、 isogu.nakutemo ~いいです よ=emph", fr: "Ah bon ? Rien ne presse, tu sais.", en: "Oh — there's no need to rush, you know." },
    { sp: "A", dsl: "demo 、 kusuri を=obj nomu.nakereba ~なりません", fr: "Mais je dois prendre mon médicament.", en: "But I have to take my medicine." },
    { sp: "B", dsl: "wakaru.mashita", fr: "D'accord.", en: "I see." }
  ],
  { fr: "なければなりません dit littéralement « si je ne le fais pas, ça n'ira pas » : le japonais construit l'obligation avec une double négation. À l'oral, on entend surtout la contraction なきゃ.",
    en: "なければなりません literally says “if I don't, it won't do”: Japanese builds obligation out of a double negative. In speech you'll mostly hear the contraction なきゃ." });

D("g100",
  { fr: "Entre amis, on ne fait plus de manières", en: "Among friends, no more formality" },
  [
    { sp: "A", dsl: "shuumatsu 、 nani を=obj suru", fr: "Tu fais quoi ce week-end ?", en: "What are you doing this weekend?" },
    { sp: "B", dsl: "eiga を=obj miru", fr: "Je vais voir un film.", en: "I'm seeing a film." },
    { sp: "A", dsl: "watashi も=also iku", fr: "Moi aussi, j'y vais.", en: "I'll come too." },
    { sp: "B", dsl: "jaa 、 sanji に=time eki で=place au", fr: "Alors, rendez-vous à 15 h à la gare.", en: "Right, let's meet at the station at three." }
  ],
  { fr: "Tout le poli a disparu : ni です, ni ます, ni か. La question se fait par la seule intonation montante. Vous n'avez rien de neuf à apprendre ici — seulement à retirer.",
    en: "All the politeness is gone: no です, no ます, no か. The question is carried by rising intonation alone. There's nothing new to learn here — only things to take away." });

if (typeof module !== "undefined") module.exports = { DIALOGUES };
