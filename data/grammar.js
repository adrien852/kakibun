/* Kakibun — the N5 grammar journey.
 * 10 arcs (stations on the map), 100 grammar points.
 * Point: { id, arc, pat, name:{fr,en}, expl:{fr,en}, tf?:{from,to} }
 *   tf = transform drill: conjugate 'from' form into 'to' form.
 * Order of the GRAMMAR array = unlock order on the journey.
 */
const ARCS = [
  { id:"a1",  jp:"東京",   city:{fr:"Tokyo",en:"Tokyo"},       name:{fr:"Se présenter",en:"Introducing yourself"} },
  { id:"a2",  jp:"横浜",   city:{fr:"Yokohama",en:"Yokohama"}, name:{fr:"Montrer et demander",en:"Pointing & asking"} },
  { id:"a3",  jp:"鎌倉",   city:{fr:"Kamakura",en:"Kamakura"}, name:{fr:"Exister quelque part",en:"Existing somewhere"} },
  { id:"a4",  jp:"富士山", city:{fr:"Mont Fuji",en:"Mt Fuji"}, name:{fr:"Se déplacer",en:"Getting around"} },
  { id:"a5",  jp:"名古屋", city:{fr:"Nagoya",en:"Nagoya"},     name:{fr:"La vie de tous les jours",en:"Everyday life"} },
  { id:"a6",  jp:"京都",   city:{fr:"Kyoto",en:"Kyoto"},       name:{fr:"Envies et invitations",en:"Wishes & invitations"} },
  { id:"a7",  jp:"大阪",   city:{fr:"Osaka",en:"Osaka"},       name:{fr:"Décrire le monde",en:"Describing the world"} },
  { id:"a8",  jp:"広島",   city:{fr:"Hiroshima",en:"Hiroshima"},name:{fr:"Comparer",en:"Comparing"} },
  { id:"a9",  jp:"福岡",   city:{fr:"Fukuoka",en:"Fukuoka"},   name:{fr:"La forme en て",en:"The て-form"} },
  { id:"a10", jp:"北海道", city:{fr:"Hokkaido",en:"Hokkaido"}, name:{fr:"La forme neutre et au-delà",en:"Plain form & beyond"} }
];

const GRAMMAR = [];
const G = (id, arc, pat, nameFr, nameEn, explFr, explEn, tf) =>
  GRAMMAR.push({ id, arc, pat, name:{fr:nameFr,en:nameEn}, expl:{fr:explFr,en:explEn}, tf });

/* ============ ARC 1 — 東京 : se présenter ============ */
G("g01","a1","AはBです","A est B","A is B",
  "La phrase japonaise la plus simple : thème + は + information + です. です joue le rôle de « être » (poli) et ne change jamais selon la personne : 私は学生です = je suis étudiant, comme il/elle est étudiant(e). Le verbe vient toujours en DERNIER.",
  "The simplest Japanese sentence: topic + は + information + です. です acts as polite “to be” and never changes with the person: 私は学生です = I am a student. The verb always comes LAST."),
G("g02","a1","じゃありません","Négation de です","Negative of です",
  "Pour nier です, on dit じゃありません (ou では ありません, plus formel) : 学生じゃありません = je ne suis pas étudiant. Notez que です disparaît — じゃありません le remplace entièrement.",
  "To negate です, say じゃありません (or the more formal ではありません): 学生じゃありません = I am not a student. です disappears — じゃありません replaces it entirely.",
  {from:"desu",to:"janai"}),
G("g03","a1","でした","です au passé","Past of です",
  "です au passé devient でした : 学生でした = j'étais étudiant. Le passé négatif est じゃありませんでした. Retenez la famille complète : です / じゃありません / でした / じゃありませんでした.",
  "Past です is でした: 学生でした = I was a student. The past negative is じゃありませんでした. Learn the full family: です / じゃありません / でした / じゃありませんでした.",
  {from:"desu",to:"deshita"}),
G("g04","a1","～か","Poser une question","Asking a question",
  "Ajoutez simplement か à la fin d'une phrase pour en faire une question — sans changer l'ordre des mots : 学生です → 学生ですか = êtes-vous étudiant ? À l'oral, l'intonation monte sur か.",
  "Just add か to the end of a sentence to make it a question — no word-order change: 学生です → 学生ですか = are you a student? In speech, intonation rises on か."),
G("g05","a1","はい・いいえ","Répondre oui / non","Answering yes / no",
  "はい、そうです = oui, c'est ça. いいえ、ちがいます = non, ce n'est pas ça. On répond souvent en répétant le mot : 学生ですか。— はい、学生です。",
  "はい、そうです = yes, that's right. いいえ、ちがいます = no, that's wrong. People often answer by repeating the word: 学生ですか。— はい、学生です。"),
G("g06","a1","AのB","の : possession et lien","の: possession & link",
  "AのB = « le B de A ». の relie deux noms : 私の本 = mon livre, 日本の車 = une voiture japonaise, 日本語の先生 = un professeur de japonais. L'ordre est l'inverse du français : le possesseur d'abord.",
  "AのB = “A's B”. の links two nouns: 私の本 = my book, 日本の車 = a Japanese car, 日本語の先生 = a teacher of Japanese. The owner comes first."),
G("g07","a1","～も","も : aussi","も: also",
  "も remplace は et signifie « aussi » : 私は学生です。田中さんも学生です = M. Tanaka aussi. Dans une phrase négative, も veut dire « non plus ».",
  "も replaces は and means “also”: 私は学生です。田中さんも学生です = Mr Tanaka too. In a negative sentence it means “neither”."),
G("g08","a1","～人・～語","Nationalités et langues","Nationalities & languages",
  "Pays + 人 (じん) = nationalité : 日本人 = Japonais. Pays + 語 (ご) = langue : 日本語 = le japonais. Deux kanji très rentables : ils transforment chaque nom de pays en deux mots nouveaux.",
  "Country + 人 (じん) = nationality: 日本人 = Japanese person. Country + 語 (ご) = language: 日本語 = the Japanese language. Two very profitable kanji: each country name becomes two new words."),
G("g09","a1","何ですか","Demander « qu'est-ce que c'est »","Asking “what is it”",
  "何 (なん) ですか = qu'est-ce que c'est ? 何 se prononce なん devant です, た, だ, な — et なに ailleurs (何を, 何が). お名前は何ですか = quel est votre nom ?",
  "何 (なん) ですか = what is it? 何 is read なん before です, た, だ, な — and なに elsewhere (何を, 何が). お名前は何ですか = what is your name?"),
G("g10","a1","だれですか・～さん","Qui ? et ～さん","Who? and ～さん",
  "だれですか = qui est-ce ? Pour parler des autres, ajoutez toujours さん après leur nom : 田中さん. Jamais さん pour soi-même — c'est un titre de respect qu'on ne s'accorde pas.",
  "だれですか = who is it? When talking about others, always add さん after their name: 田中さん. Never use さん for yourself — it's a respect title you don't give yourself."),

/* ============ ARC 2 — 横浜 : montrer et demander ============ */
G("g11","a2","これ・それ・あれ","Ceci, cela, cela là-bas","This, that, that over there",
  "Trois distances : これ = près de moi, それ = près de toi, あれ = loin de nous deux. Ce sont des pronoms complets : これは本です = ceci est un livre.",
  "Three distances: これ = near me, それ = near you, あれ = far from both of us. They stand alone as pronouns: これは本です = this is a book."),
G("g12","a2","この・その・あの＋名詞","Ce…-ci, ce…-là + nom","This/that + noun",
  "この, その, あの se placent DEVANT un nom : この本 = ce livre-ci. これ est seul, この est toujours suivi d'un nom — c'est la différence entre « ceci » et « ce livre ».",
  "この, その, あの go BEFORE a noun: この本 = this book. これ stands alone, この must be followed by a noun — the difference between “this” and “this book”."),
G("g13","a2","ここ・そこ・あそこ","Ici, là, là-bas","Here, there, over there",
  "Les mêmes trois distances, pour les lieux : ここ = ici, そこ = là (près de toi), あそこ = là-bas. ここは駅です = ici, c'est la gare.",
  "The same three distances, for places: ここ = here, そこ = there (near you), あそこ = over there. ここは駅です = this place is the station."),
G("g14","a2","どこですか","Où est… ?","Where is…?",
  "どこ = où. 駅はどこですか = où est la gare ? Le mot interrogatif prend simplement la place de la réponse : 駅は[あそこ]です → 駅は[どこ]ですか.",
  "どこ = where. 駅はどこですか = where is the station? The question word simply sits where the answer would: 駅は[あそこ]です → 駅は[どこ]ですか."),
G("g15","a2","どれ・どの","Lequel ?","Which one?",
  "どれ = lequel (seul) : どれですか. どの + nom = quel… : どの本ですか = quel livre ? Même logique que これ/この : la forme en -れ est seule, la forme en -の précède un nom.",
  "どれ = which one (alone): どれですか. どの + noun = which…: どの本ですか = which book? Same logic as これ/この: the -れ form stands alone, the -の form needs a noun."),
G("g16","a2","だれの・私の","À qui ?","Whose?",
  "だれの本ですか = à qui est ce livre ? Réponse : 私のです = c'est le mien. Ici の tout seul remplace le nom déjà connu (« celui de moi »).",
  "だれの本ですか = whose book is this? Answer: 私のです = it's mine. Here の alone replaces the already-known noun (“the one of mine”)."),
G("g17","a2","いくらですか","Combien ça coûte ?","How much is it?",
  "いくらですか = combien ? Les prix se donnent en 円 (えん) : 三百円です = 300 yens. Retenez : 百 = 100, 千 = 1000, 万 = 10 000.",
  "いくらですか = how much? Prices are in 円 (えん): 三百円です = 300 yen. Remember: 百 = 100, 千 = 1,000, 万 = 10,000."),
G("g18","a2","何時ですか","Quelle heure est-il ?","What time is it?",
  "今何時ですか = quelle heure est-il ? Heure = nombre + 時 (じ), minutes + 分 (ふん/ぷん), et 半 = et demie : 三時半 = 3 h 30. Attention : 四時 = よじ, 九時 = くじ, 七時 = しちじ.",
  "今何時ですか = what time is it? Hour = number + 時 (じ), minutes + 分 (ふん/ぷん), 半 = half past: 三時半 = 3:30. Careful: 四時 = よじ, 九時 = くじ, 七時 = しちじ."),
G("g19","a2","何曜日ですか","Les jours de la semaine","Days of the week",
  "Chaque jour = un kanji-élément + 曜日 : 月曜日 lune/lundi, 火曜日 feu/mardi, 水 eau, 木 bois, 金 or, 土 terre, 日 soleil/dimanche. 今日は何曜日ですか = quel jour sommes-nous ?",
  "Each day = an element kanji + 曜日: 月曜日 moon/Monday, 火曜日 fire/Tuesday, 水 water, 木 wood, 金 gold, 土 earth, 日 sun/Sunday. 今日は何曜日ですか = what day is it?"),

/* ============ ARC 3 — 鎌倉 : exister quelque part ============ */
G("g20","a3","～があります","Il y a (objets)","There is (things)",
  "あります = exister, pour les choses INANIMÉES (objets, plantes, bâtiments) : 本があります = il y a un livre. La chose qui existe prend が, pas は.",
  "あります = to exist, for INANIMATE things (objects, plants, buildings): 本があります = there is a book. The thing that exists takes が, not は."),
G("g21","a3","～がいます","Il y a (êtres vivants)","There is (living beings)",
  "います = exister, pour ce qui est VIVANT et se déplace (gens, animaux) : 犬がいます = il y a un chien. あります pour les choses, います pour les êtres — les confondre est l'erreur classique.",
  "います = to exist, for LIVING, moving beings (people, animals): 犬がいます = there is a dog. あります for things, います for beings — mixing them up is the classic mistake."),
G("g22","a3","場所に～があります","に : le lieu où l'on est","に: the place where something is",
  "Avec あります/います, le lieu prend に : 駅に人がいます = il y a des gens à la gare. Schéma : [lieu]に [chose/être]が あります/います.",
  "With あります/います the location takes に: 駅に人がいます = there are people at the station. Pattern: [place]に [thing/being]が あります/います."),
G("g23","a3","上・下・中・前・後ろ","Dessus, dessous, dedans…","On, under, inside…",
  "Position = nom + の + mot de position + に : つくえの上に = sur la table, かばんの中に = dans le sac. Le japonais dit « le dessus de la table » plutôt que « sur la table ».",
  "Position = noun + の + position word + に: つくえの上に = on the desk, かばんの中に = in the bag. Japanese says “the top of the desk” rather than “on the desk”."),
G("g24","a3","AとB","と : et (liste fermée)","と: and (closed list)",
  "と relie des noms en liste COMPLÈTE : 本とペンがあります = il y a un livre et un stylo (c'est tout). と ne relie que des noms, jamais des phrases.",
  "と joins nouns in a COMPLETE list: 本とペンがあります = there's a book and a pen (and that's all). と only joins nouns, never sentences."),
G("g25","a3","AやB","や : et… entre autres","や: and… among others",
  "や donne des EXEMPLES d'une liste incomplète : 本やペンがあります = il y a des livres, des stylos… (entre autres). Comparez : と ferme la liste, や la laisse ouverte.",
  "や gives EXAMPLES from an incomplete list: 本やペンがあります = there are books, pens… (among other things). Compare: と closes the list, や leaves it open."),
G("g26","a3","一つ・二人・三本…","Compter les choses et les gens","Counting things & people",
  "Le japonais compte avec des classificateurs : ～つ pour les objets (一つ、二つ、三つ), ～人 pour les gens (一人 ひとり, 二人 ふたり, 三人 さんにん). Le nombre se place APRÈS le nom : りんごが三つあります.",
  "Japanese counts with classifiers: ～つ for objects (一つ、二つ、三つ), ～人 for people (一人 ひとり, 二人 ふたり, 三人 さんにん). The number goes AFTER the noun: りんごが三つあります."),
G("g27","a3","いくつ・何人","Combien ?","How many?",
  "いくつ = combien (d'objets), 何人 (なんにん) = combien de personnes : りんごはいくつありますか。子どもは何人いますか。",
  "いくつ = how many (things), 何人 (なんにん) = how many people: りんごはいくつありますか。子どもは何人いますか。"),
G("g28","a3","何も～ません","Rien, personne","Nothing, nobody",
  "Mot interrogatif + も + négation = zéro absolu : 何もありません = il n'y a rien, だれもいません = il n'y a personne. Le verbe DOIT être négatif.",
  "Question word + も + negative = absolute zero: 何もありません = there is nothing, だれもいません = there is nobody. The verb MUST be negative."),

/* ============ ARC 4 — 富士山 : se déplacer ============ */
G("g29","a4","～へ行きます","Aller vers","Going toward",
  "Les trois verbes du voyage : 行きます (aller), 来ます (venir), 帰ります (rentrer). La direction prend へ, prononcé « e » : 東京へ行きます = je vais à Tokyo.",
  "The three travel verbs: 行きます (go), 来ます (come), 帰ります (return home). Direction takes へ, pronounced “e”: 東京へ行きます = I'm going to Tokyo."),
G("g30","a4","～に行きます","に : la destination","に: the destination",
  "La destination peut aussi prendre に : 駅に行きます. Nuance : へ insiste sur la direction du mouvement, に sur le point d'arrivée. Dans la vie courante, les deux s'échangent librement ici.",
  "The destination can also take に: 駅に行きます. Nuance: へ stresses the direction of movement, に the arrival point. In everyday use they swap freely here."),
G("g31","a4","～で行きます","で : le moyen de transport","で: means of transport",
  "Le moyen de transport prend で : バスで行きます = j'y vais en bus, 電車で = en train. Exception : à pied = 歩いて (sans で).",
  "The means of transport takes で: バスで行きます = I go by bus, 電車で = by train. Exception: on foot = 歩いて (no で)."),
G("g32","a4","～と行きます","と : avec quelqu'un","と: with someone",
  "Le compagnon prend と : 友だちと行きます = j'y vais avec un ami. Seul = 一人で (avec で !) : 一人で来ました = je suis venu seul.",
  "The companion takes と: 友だちと行きます = I go with a friend. Alone = 一人で (with で!): 一人で来ました = I came alone."),
G("g33","a4","から・まで","De… jusqu'à…","From… until…",
  "から = point de départ, まで = point d'arrivée — pour les lieux comme pour les heures : 東京から大阪まで, 九時から五時まで = de 9 h à 17 h.",
  "から = starting point, まで = end point — for places and times alike: 東京から大阪まで, 九時から五時まで = from 9 to 5."),
G("g34","a4","何で行きますか","Comment y va-t-on ?","How do you get there?",
  "何で (なんで) 行きますか = par quel moyen ? Réponse avec で : 電車で行きます. だれと行きますか = avec qui ? Réponse avec と.",
  "何で (なんで) 行きますか = by what means? Answer with で: 電車で行きます. だれと行きますか = with whom? Answer with と."),
G("g35","a4","いつ・今日・明日","Quand ? (mots sans に)","When? (words without に)",
  "いつ = quand : いつ行きますか。Les temps RELATIFS (今日 aujourd'hui, 明日 demain, 毎日 chaque jour, 今 maintenant) ne prennent JAMAIS に : 明日行きます, pas ✕明日に.",
  "いつ = when: いつ行きますか。RELATIVE time words (今日 today, 明日 tomorrow, 毎日 every day, 今 now) NEVER take に: 明日行きます, not ✕明日に."),
G("g36","a4","七時に","に : l'heure précise","に: precise time",
  "Une heure ou une date PRÉCISE prend に : 七時に起きます = je me lève à 7 h, 日曜日に行きます. Règle simple : si on peut le pointer sur un calendrier ou une horloge → に.",
  "A PRECISE time or date takes に: 七時に起きます = I get up at 7, 日曜日に行きます. Simple rule: if you can point at it on a clock or calendar → に."),
G("g37","a4","公園を散歩します","を : le lieu traversé","を: the place you move through",
  "Avec les verbes de déplacement, を marque le lieu que l'on parcourt : 公園を散歩します = se promener dans le parc, 道を歩きます = marcher le long de la route.",
  "With motion verbs, を marks the place you move along: 公園を散歩します = stroll through the park, 道を歩きます = walk along the road."),

/* ============ ARC 5 — 名古屋 : la vie de tous les jours ============ */
G("g38","a5","～を＋ます","を : l'objet direct","を: the direct object",
  "を marque ce que l'action touche : パンを食べます = je mange du pain, 本を読みます = je lis un livre. Schéma complet : [personne]は [chose]を [verbe]ます.",
  "を marks what the action touches: パンを食べます = I eat bread, 本を読みます = I read a book. Full pattern: [person]は [thing]を [verb]ます."),
G("g39","a5","～ません","Le présent négatif","Polite negative",
  "ます → ません : 食べます → 食べません = je ne mange pas. Le présent japonais couvre aussi le futur : 明日行きません = je n'irai pas demain.",
  "ます → ません: 食べます → 食べません = I don't eat. The Japanese present also covers the future: 明日行きません = I won't go tomorrow.",
  {from:"masu",to:"masen"}),
G("g40","a5","～ました","Le passé poli","Polite past",
  "ます → ました : 食べます → 食べました = j'ai mangé. Une seule terminaison pour tout le monde, aucune exception — le passé japonais est un cadeau.",
  "ます → ました: 食べます → 食べました = I ate. One ending for everyone, no exceptions — the Japanese past tense is a gift.",
  {from:"masu",to:"mashita"}),
G("g41","a5","～ませんでした","Le passé négatif","Past negative",
  "ません + でした = passé négatif : 食べませんでした = je n'ai pas mangé. La famille des politesses est complète : ます / ません / ました / ませんでした — exactement comme です.",
  "ません + でした = past negative: 食べませんでした = I didn't eat. The polite family is complete: ます / ません / ました / ませんでした — just like です.",
  {from:"masen",to:"masendeshita"}),
G("g42","a5","場所で～ます","で : le lieu de l'action","で: place of action",
  "Là où une ACTION se passe → で : レストランで食べます = je mange au restaurant. Comparez avec に : 駅に人がいます (présence) vs 駅で待ちます (action d'attendre).",
  "Where an ACTION happens → で: レストランで食べます = I eat at the restaurant. Compare with に: 駅に人がいます (presence) vs 駅で待ちます (the action of waiting)."),
G("g43","a5","友だちに会います","に : le destinataire","に: the receiver",
  "L'action est dirigée vers quelqu'un → に : 友だちに会います = je rencontre un ami, 母に電話します = j'appelle ma mère, 先生に聞きます = je demande au professeur.",
  "The action is directed at someone → に: 友だちに会います = I meet a friend, 母に電話します = I phone my mother, 先生に聞きます = I ask the teacher."),
G("g44","a5","～ね","ね : n'est-ce pas ?","ね: isn't it?",
  "ね en fin de phrase cherche l'accord : いい天気ですね = beau temps, n'est-ce pas ? On partage quelque chose que l'autre peut constater aussi.",
  "ね at the end seeks agreement: いい天気ですね = nice weather, isn't it? You share something the listener can see too."),
G("g45","a5","～よ","よ : je te l'apprends","よ: I'm telling you",
  "よ signale une information NOUVELLE pour l'interlocuteur : このパンはおいしいですよ = ce pain est bon, tu sais. ね partage, よ informe.",
  "よ flags information NEW to the listener: このパンはおいしいですよ = this bread is good, you know. ね shares, よ informs."),
G("g46","a5","毎日・よく・時々","La fréquence","Frequency",
  "毎日 = chaque jour, よく = souvent, 時々 (ときどき) = parfois. Et avec la négation : あまり～ません = pas beaucoup, 全然～ません = pas du tout. あまり et 全然 EXIGENT un verbe négatif.",
  "毎日 = every day, よく = often, 時々 (ときどき) = sometimes. With negatives: あまり～ません = not much, 全然～ません = not at all. あまり and 全然 REQUIRE a negative verb."),
G("g47","a5","もう・まだ","Déjà / pas encore","Already / not yet",
  "もう食べました = j'ai déjà mangé. まだです = pas encore. Attention à la réponse : もう食べましたか → いいえ、まだです (et non ✕食べませんでした, qui voudrait dire « je n'ai pas mangé du tout »).",
  "もう食べました = I already ate. まだです = not yet. Mind the answer: もう食べましたか → いいえ、まだです (not ✕食べませんでした, which would mean you simply didn't eat)."),
G("g48","a5","ごろ・ぐらい","Vers / environ","Around / about",
  "ごろ = vers (un MOMENT) : 七時ごろ = vers 7 h. ぐらい = environ (une QUANTITÉ ou durée) : 一時間ぐらい = environ une heure. Moment → ごろ, quantité → ぐらい.",
  "ごろ = around (a POINT in time): 七時ごろ = around 7. ぐらい = about (an AMOUNT or duration): 一時間ぐらい = about an hour. Time point → ごろ, amount → ぐらい."),
G("g49","a5","一週間に三回","に : la fréquence","に: frequency rate",
  "Période + に + nombre de fois = rythme : 一週間に三回 = trois fois par semaine, 一日に二回 = deux fois par jour. 回 (かい) est le compteur des « fois ».",
  "Period + に + number of times = rate: 一週間に三回 = three times a week, 一日に二回 = twice a day. 回 (かい) is the counter for “times”.");

/* ============ ARC 6 — 京都 : envies et invitations ============ */
G("g50","a6","～ませんか","Inviter : « et si… ? »","Inviting: “won't you…?”",
  "ませんか = invitation polie : 一緒に食べませんか = veux-tu manger avec moi ? Littéralement « ne mangerais-tu pas ? » — la forme négative rend l'invitation douce, facile à refuser.",
  "ませんか = polite invitation: 一緒に食べませんか = won't you eat with me? Literally “won't you eat?” — the negative form makes the invitation gentle and easy to decline.",
  {from:"masu",to:"masenka"});
G("g51","a6","～ましょう","Faisons !","Let's!",
  "ましょう = « faisons » : 行きましょう = allons-y ! On l'emploie quand l'accord est déjà acquis. Réponse type à ませんか : ええ、行きましょう。",
  "ましょう = “let's”: 行きましょう = let's go! Used once agreement is assumed. Typical reply to ませんか: ええ、行きましょう。",
  {from:"masu",to:"mashou"});
G("g52","a6","～ましょうか","Je vais… ? On… ?","Shall I…? Shall we…?",
  "ましょうか propose de l'aide ou une décision commune : 手伝いましょうか = je vous aide ? 何を食べましょうか = qu'est-ce qu'on mange ?",
  "ましょうか offers help or a joint decision: 手伝いましょうか = shall I help? 何を食べましょうか = what shall we eat?",
  {from:"masu",to:"mashouka"});
G("g53","a6","～たいです","Vouloir faire","Wanting to do",
  "Radical (forme ます sans ます) + たい = vouloir faire : 食べます → 食べたいです = je veux manger. たい se conjugue comme un adjectif en い : 食べたくないです = je ne veux pas manger.",
  "Stem (ます-form minus ます) + たい = want to do: 食べます → 食べたいです = I want to eat. たい conjugates like an い-adjective: 食べたくないです = I don't want to eat.",
  {from:"masu",to:"tai"});
G("g54","a6","見に行きます","Aller POUR faire","Going in order to do",
  "Radical + に + 行きます/来ます = se déplacer dans un but : 映画を見に行きます = aller voir un film, 昼ご飯を食べに来ました = je suis venu déjeuner.",
  "Stem + に + 行きます/来ます = move somewhere for a purpose: 映画を見に行きます = go to see a movie, 昼ご飯を食べに来ました = I came to have lunch.");
G("g55","a6","～がほしいです","Vouloir (une chose)","Wanting (a thing)",
  "Pour vouloir une CHOSE : [chose]が ほしいです : 新しい車がほしいです = je veux une nouvelle voiture. La chose désirée prend が. Pour une ACTION, c'est たい.",
  "To want a THING: [thing]が ほしいです: 新しい車がほしいです = I want a new car. The wanted thing takes が. For an ACTION, use たい.");
G("g56","a6","何か・どこか・だれか","Quelque chose, quelque part","Something, somewhere",
  "Mot interrogatif + か = indéfini : 何か食べましたか = as-tu mangé quelque chose ? どこか行きたいです = je veux aller quelque part. Souvent, を/が disparaît après 何か.",
  "Question word + か = indefinite: 何か食べましたか = did you eat something? どこか行きたいです = I want to go somewhere. を/が often drops after 何か.");
G("g57","a6","AかB","か : ou","か: or",
  "Entre deux noms, か = « ou » : コーヒーかお茶を飲みます = je bois du café ou du thé. Le choix reste ouvert, le verbe ne change pas.",
  "Between two nouns, か = “or”: コーヒーかお茶を飲みます = I'll drink coffee or tea. The choice stays open, the verb doesn't change.");
G("g58","a6","一緒に・みんなで","Ensemble","Together",
  "一緒に (いっしょに) = ensemble, avec quelqu'un. みんなで = tous ensemble — ce で marque le groupe qui agit comme un tout : みんなで歌いました = nous avons chanté tous ensemble.",
  "一緒に (いっしょに) = together, with someone. みんなで = all together — this で marks the group acting as one: みんなで歌いました = we all sang together.");

/* ============ ARC 7 — 大阪 : décrire le monde ============ */
G("g59","a7","高いです","Les adjectifs en い","い-adjectives",
  "Les adjectifs en い se suffisent à eux-mêmes : 高い = cher/haut, おいしい = bon. Devant です ils ne changent pas : このパンはおいしいです. Le です n'est là que pour la politesse.",
  "い-adjectives are self-sufficient: 高い = expensive/tall, おいしい = tasty. Before です they don't change: このパンはおいしいです. The です is only there for politeness.");
G("g60","a7","高くないです","い-adjectif négatif","Negative い-adjective",
  "Pour nier un adjectif en い : い → くないです : 高い → 高くないです = pas cher. Exception unique : いい (bon) devient よくないです.",
  "To negate an い-adjective: い → くないです: 高い → 高くないです = not expensive. The one exception: いい (good) becomes よくないです.",
  {from:"adji",to:"kunai"});
G("g61","a7","高かったです","い-adjectif au passé","Past い-adjective",
  "Passé : い → かったです : 高かったです = c'était cher. Négatif passé : くなかったです. C'est l'ADJECTIF qui se conjugue, jamais です : ✕高いでした n'existe pas.",
  "Past: い → かったです: 高かったです = it was expensive. Past negative: くなかったです. The ADJECTIVE conjugates, never です: ✕高いでした doesn't exist.",
  {from:"adji",to:"katta"});
G("g62","a7","元気です","Les adjectifs en な","な-adjectives",
  "Les adjectifs en な se comportent comme des noms : 元気です = en forme, 元気じゃありません, 元気でした. Ils empruntent toute la famille de です.",
  "な-adjectives behave like nouns: 元気です = well, 元気じゃありません, 元気でした. They borrow the whole です family.");
G("g63","a7","大きい犬・元気な人","Adjectif + nom","Adjective + noun",
  "Devant un nom, l'adjectif en い reste tel quel : 大きい犬 = un gros chien. L'adjectif en な prend な : 元気な人 = une personne en forme. C'est là que le な apparaît — d'où leur nom.",
  "Before a noun, an い-adjective stays as is: 大きい犬 = a big dog. A な-adjective takes な: 元気な人 = a lively person. That's where the な shows up — hence the name.");
G("g64","a7","とても・あまり","Très / pas tellement","Very / not really",
  "とても + adjectif = très : とても高いです. あまり + NÉGATIF = pas tellement : あまり高くないです. あまり appelle obligatoirement une fin négative.",
  "とても + adjective = very: とても高いです. あまり + NEGATIVE = not really: あまり高くないです. あまり must be completed by a negative.");
G("g65","a7","どうですか・どんな","Comment ? Quel genre ?","How is it? What kind?",
  "どうですか = comment est-ce ? / qu'en dites-vous ? どんな + nom = quel genre de : どんな映画が好きですか = quel genre de films aimes-tu ?",
  "どうですか = how is it? / what do you think? どんな + noun = what kind of: どんな映画が好きですか = what kind of movies do you like?");
G("g66","a7","～が好きです","Aimer : 好き + が","Liking: 好き + が",
  "好き (aimer) et きらい (détester) sont des adjectifs en な, et la chose aimée prend が : 犬が好きです = j'aime les chiens. Renforcé : 大好きです = j'adore.",
  "好き (like) and きらい (dislike) are な-adjectives, and the liked thing takes が: 犬が好きです = I like dogs. Stronger: 大好きです = I love.");
G("g67","a7","～が上手です","Doué / pas doué : が","Skilled / poor at: が",
  "上手 (じょうず) = doué, 下手 (へた) = pas doué, わかります = comprendre : la chose maîtrisée ou comprise prend が : 田中さんは料理が上手です。日本語がわかります。",
  "上手 (じょうず) = good at, 下手 (へた) = bad at, わかります = understand: the mastered or understood thing takes が: 田中さんは料理が上手です。日本語がわかります。");
G("g68","a7","～から、～","から : parce que","から: because",
  "Raison + から + conséquence : 高いですから、買いません = c'est cher, donc je n'achète pas. La raison vient TOUJOURS en premier, coiffée de から.",
  "Reason + から + consequence: 高いですから、買いません = it's expensive, so I won't buy it. The reason ALWAYS comes first, capped with から.");
G("g69","a7","どうしてですか","Pourquoi ?","Why?",
  "どうして = pourquoi : どうして食べませんか。Réponse : ～からです : おなかがいっぱいですからです → en pratique on dit simplement おなかがいっぱいですから.",
  "どうして = why: どうして食べませんか。Answer: ～からです — in practice you just say おなかがいっぱいですから.");

/* ============ ARC 8 — 広島 : comparer ============ */
G("g70","a8","AはBより","Plus… que…","More… than…",
  "AはBより高いです = A est plus cher que B. より colle au PERDANT de la comparaison. Pas de « plus » à ajouter : l'adjectif reste tel quel.",
  "AはBより高いです = A is more expensive than B. より sticks to the LOSER of the comparison. No word for “more” is needed: the adjective stays unchanged.");
G("g71","a8","どちらが～ですか","Lequel des deux ?","Which of the two?",
  "AとBと、どちらが高いですか = de A ou B, lequel est le plus cher ? Réponse : Aのほうが高いです — のほう désigne « le côté A ».",
  "AとBと、どちらが高いですか = of A and B, which is more expensive? Answer: Aのほうが高いです — のほう means “the A side”.");
G("g72","a8","～がいちばん","Le plus… de tous","The most… of all",
  "いちばん (一番) = numéro un : [groupe]の中で [X]が いちばん～です : 日本の中で富士山がいちばん高いです. Le mot interrogatif : 何がいちばん好きですか.",
  "いちばん (一番) = number one: [group]の中で [X]が いちばん～です: 日本の中で富士山がいちばん高いです. With a question word: 何がいちばん好きですか.");
G("g73","a8","～は～が、～は～","は : le contraste","は: contrast",
  "Deux は face à face opposent deux thèmes : 肉は食べますが、魚は食べません = la viande, oui ; le poisson, non. Ce は de contraste remplace même を et が.",
  "Two は face to face contrast two topics: 肉は食べますが、魚は食べません = meat, yes; fish, no. This contrastive は even replaces を and が.");
G("g74","a8","～だけ","Seulement","Only",
  "だけ = seulement : 一つだけあります = il n'y en a qu'un. だけ se place après le nom ou le nombre, et la phrase reste affirmative.",
  "だけ = only: 一つだけあります = there's just one. だけ goes after the noun or number, and the sentence stays affirmative.");
G("g75","a8","～くなります・になります","Devenir","Becoming",
  "なります = devenir. Adjectif en い : い → く + なります : 寒くなりました = il s'est mis à faire froid. Adjectif en な / nom : + に + なります : 元気になりました, 先生になりたいです.",
  "なります = to become. い-adjective: い → く + なります: 寒くなりました = it got cold. な-adjective / noun: + に + なります: 元気になりました, 先生になりたいです.",
  {from:"adji",to:"kunaru"});
G("g76","a8","そして・でも・それから","Relier les phrases","Linking sentences",
  "En début de phrase : そして = et, それから = et puis/ensuite, でも = mais : 高いです。でも、おいしいです。Trois mots qui rendent le discours fluide.",
  "At the start of a sentence: そして = and, それから = and then, でも = but: 高いです。でも、おいしいです。Three words that make speech flow.");

/* ============ ARC 9 — 福岡 : la forme en て ============ */
G("g77","a9","て形","La forme en て","The て-form",
  "La forme て est le couteau suisse du japonais. Groupe 2 (る) : 食べる → 食べて. Groupe 1 : く→いて (書いて), ぐ→いで, む/ぶ/ぬ→んで (飲んで), う/つ/る→って (買って), す→して. Exceptions : 行く→行って, する→して, 来る→来て.",
  "The て-form is Japanese's Swiss-army knife. Group 2 (る): 食べる → 食べて. Group 1: く→いて (書いて), ぐ→いで, む/ぶ/ぬ→んで (飲んで), う/つ/る→って (買って), す→して. Exceptions: 行く→行って, する→して, 来る→来て.",
  {from:"dict",to:"te"});
G("g78","a9","～てください","S'il vous plaît, faites…","Please do…",
  "て + ください = demande polie : 見てください = regardez, s'il vous plaît. ちょっと待ってください = attendez un instant. C'est LA façon standard de demander une action.",
  "て + ください = polite request: 見てください = please look. ちょっと待ってください = please wait a moment. This is THE standard way to ask for an action.",
  {from:"dict",to:"tekudasai"});
G("g79","a9","～ています (en train de)","Action en cours","Action in progress",
  "て + います = être en train de : 今、ご飯を食べています = je suis en train de manger. L'équivalent du « -ing » anglais ou de « en train de ».",
  "て + います = to be doing: 今、ご飯を食べています = I'm eating right now. The equivalent of English “-ing”.",
  {from:"dict",to:"teimasu"});
G("g80","a9","～ています (état)","État et habitude","State & habit",
  "ています décrit aussi un ÉTAT durable ou une habitude : 東京に住んでいます = j'habite à Tokyo, 会社で働いています = je travaille dans une entreprise, 田中さんを知っています = je connais M. Tanaka.",
  "ています also describes a lasting STATE or habit: 東京に住んでいます = I live in Tokyo, 会社で働いています = I work at a company, 田中さんを知っています = I know Mr Tanaka.");
G("g81","a9","～てもいいですか","Puis-je… ?","May I…?",
  "て + もいいですか = demander la permission : 写真をとってもいいですか = puis-je prendre une photo ? Accord : はい、いいですよ / どうぞ.",
  "て + もいいですか = asking permission: 写真をとってもいいですか = may I take a photo? Granting: はい、いいですよ / どうぞ.",
  {from:"dict",to:"temoii"});
G("g82","a9","～てはいけません","C'est interdit","You must not",
  "て + はいけません = interdiction : ここで写真をとってはいけません = interdit de photographier ici. Réponse négative à てもいいですか.",
  "て + はいけません = prohibition: ここで写真をとってはいけません = no photos here. The negative answer to てもいいですか.",
  {from:"dict",to:"tewaikemasen"});
G("g83","a9","～て、～て","Enchaîner les actions","Chaining actions",
  "La forme て enchaîne les actions dans l'ordre : 朝起きて、パンを食べて、学校へ行きます = je me lève, je mange du pain et je vais à l'école. Seul le DERNIER verbe porte le temps.",
  "The て-form chains actions in order: 朝起きて、パンを食べて、学校へ行きます = I get up, eat bread and go to school. Only the LAST verb carries the tense.");
G("g84","a9","～てから","Après avoir…","After doing…",
  "AてからB = B après avoir fait A : ご飯を食べてから、勉強します = j'étudie après avoir mangé. Plus précis qu'un simple enchaînement : l'ordre est explicite.",
  "AてからB = B after doing A: ご飯を食べてから、勉強します = I study after eating. More precise than plain chaining: the order is explicit.",
  {from:"dict",to:"tekara"});
G("g85","a9","～をください","J'en voudrais un","I'd like one",
  "Nom + をください = donnez-moi… : これをください = je prends ceci (au magasin), 水をください = de l'eau, s'il vous plaît. Avec un nombre : りんごを三つください.",
  "Noun + をください = please give me…: これをください = I'll take this (in a shop), 水をください = water, please. With a number: りんごを三つください.");
G("g86","a9","安くて、おいしいです","Relier les adjectifs","Linking adjectives",
  "Pour enchaîner des adjectifs : い → くて : 安くて、おいしいです = pas cher et bon. Adjectif en な / nom : + で : 元気で、親切です. Même idée que la forme て des verbes.",
  "To chain adjectives: い → くて: 安くて、おいしいです = cheap and tasty. な-adjective / noun: + で: 元気で、親切です. Same idea as the verb て-form.",
  {from:"adji",to:"kute"});

/* ============ ARC 10 — 北海道 : la forme neutre et au-delà ============ */
G("g87","a10","辞書形","La forme du dictionnaire","The dictionary form",
  "La forme neutre présente : 食べます → 食べる, 行きます → 行く. C'est la forme des dictionnaires, du parler familier, et la base de nombreuses structures. Groupe 2 : remplacer ます par る ; groupe 1 : la voyelle i devient u (きます→く).",
  "The plain present: 食べます → 食べる, 行きます → 行く. It's the form in dictionaries, casual speech, and the base of many structures. Group 2: replace ます with る; group 1: the i-vowel becomes u (きます→く).",
  {from:"masu",to:"dict"});
G("g88","a10","～ことができます","Savoir / pouvoir faire","Can do",
  "Forme du dictionnaire + ことができます = être capable de : 日本語を話すことができます = je sais parler japonais. こと transforme le verbe en nom (« le fait de parler »).",
  "Dictionary form + ことができます = to be able to: 日本語を話すことができます = I can speak Japanese. こと turns the verb into a noun (“the act of speaking”)."),
G("g89","a10","～前に","Avant de…","Before doing…",
  "Forme du dictionnaire + 前に (まえに) = avant de faire : 寝る前に、本を読みます = je lis avant de dormir. Le verbe devant 前に reste TOUJOURS au présent, même si la phrase est au passé.",
  "Dictionary form + 前に (まえに) = before doing: 寝る前に、本を読みます = I read before sleeping. The verb before 前に ALWAYS stays present, even in a past sentence."),
G("g90","a10","ない形","La forme en ない","The ない-form",
  "Négatif neutre : 食べる → 食べない, 行く → 行かない (groupe 1 : la voyelle a + ない), する → しない, 来る → こない. Exception : ある → ない tout court.",
  "Plain negative: 食べる → 食べない, 行く → 行かない (group 1: a-vowel + ない), する → しない, 来る → こない. Exception: ある → plain ない.",
  {from:"dict",to:"nai"}),
G("g91","a10","～ないでください","Ne faites pas…","Please don't…",
  "ない + でください = demande négative polie : ここで写真をとらないでください = ne prenez pas de photos ici. しんぱいしないでください = ne vous inquiétez pas.",
  "ない + でください = polite negative request: ここで写真をとらないでください = please don't take photos here. しんぱいしないでください = don't worry.",
  {from:"dict",to:"naidekudasai"}),
G("g92","a10","～なければなりません","Devoir faire","Must do",
  "ない → なければなりません = obligation : 行かなければなりません = je dois y aller. Long mais mécanique : retirez い de ない, ajoutez ければなりません.",
  "ない → なければなりません = obligation: 行かなければなりません = I must go. Long but mechanical: drop い from ない, add ければなりません.",
  {from:"dict",to:"nakerebanarimasen"}),
G("g93","a10","～なくてもいいです","Pas besoin de…","Don't have to…",
  "ない → なくてもいいです = absence d'obligation : 明日来なくてもいいです = tu n'es pas obligé de venir demain. Le miroir exact de なければなりません.",
  "ない → なくてもいいです = no obligation: 明日来なくてもいいです = you don't have to come tomorrow. The exact mirror of なければなりません.",
  {from:"dict",to:"nakutemoiidesu"}),
G("g94","a10","た形","La forme en た","The た-form",
  "Passé neutre : prenez la forme て et remplacez て/で par た/だ : 食べて→食べた, 飲んで→飲んだ, 行って→行った. Si vous savez faire la forme て, la forme た est gratuite.",
  "Plain past: take the て-form and swap て/で for た/だ: 食べて→食べた, 飲んで→飲んだ, 行って→行った. If you can make the て-form, the た-form is free.",
  {from:"dict",to:"ta"}),
G("g95","a10","～たことがあります","Avoir déjà fait","Have done before",
  "た + ことがあります = expérience vécue : 日本へ行ったことがあります = je suis déjà allé au Japon. Négatif : 一度もありません = pas une seule fois.",
  "た + ことがあります = life experience: 日本へ行ったことがあります = I have been to Japan. Negative: 一度もありません = not even once.",
  {from:"dict",to:"takotoga"}),
G("g96","a10","～たり～たりします","Faire ceci, cela…","Doing this and that…",
  "た + り, listé puis + します = exemples d'activités sans ordre : 週末は本を読んだり、映画を見たりします = le week-end, je lis, je regarde des films, etc. La liste est ouverte, comme や pour les noms.",
  "た + り, listed then + します = sample activities in no order: 週末は本を読んだり、映画を見たりします = on weekends I read, watch movies, and so on. The list is open, like や for nouns.",
  {from:"dict",to:"tari"}),
G("g97","a10","～と思います","Je pense que…","I think that…",
  "Forme neutre + と思います (とおもいます) = je pense que : 明日は雨だと思います = je pense qu'il pleuvra demain. La pensée citée passe en forme NEUTRE ; le nom prend だ devant と.",
  "Plain form + と思います (とおもいます) = I think that: 明日は雨だと思います = I think it will rain tomorrow. The quoted thought goes PLAIN; nouns take だ before と."),
G("g98","a10","～と言いました","Il a dit que…","(He) said that…",
  "と言いました (といいました) rapporte des paroles : 田中さんは来ると言いました = M. Tanaka a dit qu'il viendrait. Citation directe possible avec les mêmes mots : 「行きます」と言いました.",
  "と言いました (といいました) reports speech: 田中さんは来ると言いました = Mr Tanaka said he would come. Direct quotes use the same と: 「行きます」と言いました."),
G("g99","a10","～でしょう","Probablement","Probably",
  "でしょう = supposition : 明日は晴れでしょう = il fera sans doute beau demain (le ton de la météo). Avec l'intonation montante, ～でしょう? = « …n'est-ce pas ? ».",
  "でしょう = conjecture: 明日は晴れでしょう = it will probably be sunny tomorrow (weather-forecast tone). With rising intonation, ～でしょう? = “…right?”."),
G("g100","a10","だ・普通体","Parler familier","Casual speech",
  "Entre amis, です devient だ (ou disparaît), ます devient la forme neutre : 学生だ, 明日行く?, おいしいね. Vous connaissez déjà toutes les pièces — il suffit d'enlever la politesse.",
  "With friends, です becomes だ (or vanishes) and ます becomes the plain form: 学生だ, 明日行く?, おいしいね. You already know all the pieces — just strip the politeness.");

if (typeof module !== "undefined") module.exports = { ARCS, GRAMMAR };
