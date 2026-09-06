/* Kakibun — lexicon.
 * W(id, kanji|null, reading, pos, fr, en, extra)
 *   pos: n noun · v1 ichidan · v5 godan · vk 来る · vs する-noun · cop copula
 *        adji / adjna · adv · q question word · dem demonstrative · num · exp expression
 *   extra: { kb:[per-kanji readings of the kanji run], sp:1 fused/special reading,
 *            note:{fr,en} }
 * Words whose kanji lie outside Kakikana's set are stored kana-only on purpose.
 * Display gating (learned kanji → kanji, else kana) happens in js/bridge.js.
 */
const LEXICON = {};
const W = (id,k,r,pos,fr,en,x) => { LEXICON[id] = Object.assign({id,k,r,pos,fr,en},x||{}); };

/* ---- copula & core ---- */
W("desu",null,"です","cop","être (poli)","to be (polite)");
W("suru",null,"する","vs0","faire","to do");

/* ---- pronouns & people ---- */
W("watashi","私","わたし","n","je, moi","I, me");
W("anata",null,"あなた","n","tu, vous","you");
W("tanaka","田中さん","たなかさん","n","M./Mme Tanaka","Mr/Ms Tanaka",{kb:["た","なか"]});
W("yamada","山田さん","やまださん","n","M./Mme Yamada","Mr/Ms Yamada",{kb:["やま","だ"]});
W("hito","人","ひと","n","personne","person");
W("otokonohito","男の人","おとこのひと","n","homme","man",{seg:[["男","おとこ"],["の"],["人","ひと"]]});
W("onnanohito","女の人","おんなのひと","n","femme","woman",{seg:[["女","おんな"],["の"],["人","ひと"]]});
W("kodomo","子ども","こども","n","enfant","child");
W("gakusei","学生","がくせい","n","étudiant(e)","student",{kb:["がく","せい"]});
W("sensei","先生","せんせい","n","professeur","teacher",{kb:["せん","せい"]});
W("tomodachi","友だち","ともだち","n","ami(e)","friend");
W("chichi","父","ちち","n","(mon) père","(my) father");
W("haha","母","はは","n","(ma) mère","(my) mother");
W("otousan","お父さん","おとうさん","n","père (respectueux)","father (respectful)");
W("okaasan","お母さん","おかあさん","n","mère (respectueuse)","mother (respectful)");
W("kazoku",null,"かぞく","n","famille","family");
W("nihonjin","日本人","にほんじん","n","Japonais(e)","Japanese person",{kb:["に","ほん","じん"]});
W("furansujin","フランス人","フランスじん","n","Français(e)","French person",{kb:["じん"],note:{fr:"フランス en katakana + 人",en:"フランス in katakana + 人"}});
W("minna",null,"みんな","n","tout le monde","everyone");

/* ---- places ---- */
W("nihon","日本","にほん","n","Japon","Japan",{kb:["に","ほん"]});
W("furansu",null,"フランス","n","France","France");
W("toukyou","東京","とうきょう","n","Tokyo","Tokyo",{kb:["とう","きょう"]});
W("kyouto",null,"きょうと","n","Kyoto","Kyoto");
W("oosaka",null,"おおさか","n","Osaka","Osaka");
W("eki","駅","えき","n","gare","station");
W("gakkou","学校","がっこう","n","école","school",{kb:["がっ","こう"]});
W("daigaku","大学","だいがく","n","université","university",{kb:["だい","がく"]});
W("kaisha","会社","かいしゃ","n","entreprise","company",{kb:["かい","しゃ"]});
W("mise","店","みせ","n","magasin","shop");
W("resutoran",null,"レストラン","n","restaurant","restaurant");
W("suupaa",null,"スーパー","n","supermarché","supermarket");
W("konbini",null,"コンビニ","n","supérette","convenience store");
W("kissaten",null,"きっさてん","n","café (salon de thé)","coffee shop");
W("ginkou",null,"ぎんこう","n","banque","bank");
W("byouin",null,"びょういん","n","hôpital","hospital");
W("toshokan",null,"としょかん","n","bibliothèque","library");
W("kouen",null,"こうえん","n","parc","park");
W("uchi",null,"うち","n","maison, chez soi","home");
W("heya",null,"へや","n","chambre, pièce","room");
W("toire",null,"トイレ","n","toilettes","toilet");
W("hoteru",null,"ホテル","n","hôtel","hotel");
W("depaato",null,"デパート","n","grand magasin","department store");
W("kuni","国","くに","n","pays","country");
W("machi",null,"まち","n","ville","town");
W("yama","山","やま","n","montagne","mountain");
W("fujisan",null,"ふじさん","n","le mont Fuji","Mt Fuji");
W("kawa","川","かわ","n","rivière","river");
W("umi",null,"うみ","n","mer","sea");
W("niwa",null,"にわ","n","jardin","garden");
W("tokoro",null,"ところ","n","endroit","place");
W("michi","道","みち","n","route, rue","road; street");

/* ---- position ---- */
W("ue","上","うえ","n","dessus","top; above");
W("shita","下","した","n","dessous","under");
W("naka","中","なか","n","intérieur","inside");
W("soto","外","そと","n","dehors","outside");
W("mae","前","まえ","n","devant ; avant","front; before");
W("ushiro","後ろ","うしろ","n","derrière","behind",{kb:["うし"]});
W("migi","右","みぎ","n","droite","right");
W("hidari","左","ひだり","n","gauche","left");
W("chikaku",null,"ちかく","n","à côté, près","nearby");

/* ---- things ---- */
W("hon","本","ほん","n","livre","book");
W("pen",null,"ペン","n","stylo","pen");
W("kaban",null,"かばん","n","sac","bag");
W("tsukue",null,"つくえ","n","bureau (meuble)","desk");
W("isu",null,"いす","n","chaise","chair");
W("tokei",null,"とけい","n","montre, horloge","clock; watch");
W("kasa",null,"かさ","n","parapluie","umbrella");
W("sumaho",null,"スマホ","n","smartphone","smartphone");
W("pasokon",null,"パソコン","n","ordinateur","computer");
W("terebi",null,"テレビ","n","télévision","TV");
W("shashin",null,"しゃしん","n","photo","photo");
W("kuruma","車","くるま","n","voiture","car");
W("jitensha",null,"じてんしゃ","n","vélo","bicycle");
W("densha","電車","でんしゃ","n","train","train",{kb:["でん","しゃ"]});
W("basu",null,"バス","n","bus","bus");
W("hikouki",null,"ひこうき","n","avion","airplane");
W("chikatetsu",null,"ちかてつ","n","métro","subway");
W("kippu",null,"きっぷ","n","billet, ticket","ticket");
W("okane","お金","おかね","n","argent","money");
W("eiga",null,"えいが","n","film","movie");
W("ongaku",null,"おんがく","n","musique","music");
W("uta",null,"うた","n","chanson","song");
W("hou",null,"ほう","n","côté (comparaison)","side (comparison)");
W("nihongo","日本語","にほんご","n","japonais (langue)","Japanese language",{kb:["に","ほん","ご"]});
W("furansugo",null,"フランスご","n","français (langue)","French language",{note:{fr:"フランス + 語",en:"フランス + 語"}});
W("eigo",null,"えいご","n","anglais (langue)","English language");
W("namae","名前","なまえ","n","nom","name",{kb:["な","まえ"]});
W("onamae","お名前","おなまえ","n","(votre) nom","(your) name",{kb:["な","まえ"]});
W("shigoto",null,"しごと","n","travail","work; job");
W("shukudai",null,"しゅくだい","n","devoirs","homework");
W("tegami",null,"てがみ","n","lettre","letter");
W("purezento",null,"プレゼント","n","cadeau","present");
W("hana","花","はな","n","fleur","flower");
W("inu","犬","いぬ","n","chien","dog");
W("neko",null,"ねこ","n","chat","cat");
W("tenki","天気","てんき","n","temps (météo)","weather",{kb:["てん","き"]});
W("ame","雨","あめ","n","pluie","rain");
W("yuki",null,"ゆき","n","neige","snow");
W("hare",null,"はれ","n","beau temps","sunny weather");
W("mado",null,"まど","n","fenêtre","window");
W("doa",null,"ドア","n","porte","door");
W("denki","電気","でんき","n","lumière, électricité","light; electricity",{kb:["でん","き"]});
W("isha",null,"いしゃ","n","médecin","doctor");
W("kaishain",null,"かいしゃいん","n","employé(e) de bureau","office worker");
W("me","目","め","n","œil","eye");
W("te","手","て","n","main","hand");
W("mimi","耳","みみ","n","oreille","ear");
W("ashi","足","あし","n","pied, jambe","foot; leg");
W("atama",null,"あたま","n","tête","head");
W("onaka",null,"おなか","n","ventre","belly");
W("kusuri",null,"くすり","n","médicament","medicine");

/* ---- food & drink ---- */
W("pan",null,"パン","n","pain","bread");
W("gohan",null,"ごはん","n","riz ; repas","rice; meal");
W("asagohan",null,"あさごはん","n","petit-déjeuner","breakfast");
W("hirugohan",null,"ひるごはん","n","déjeuner","lunch");
W("bangohan",null,"ばんごはん","n","dîner","dinner");
W("mizu","水","みず","n","eau","water");
W("ocha",null,"おちゃ","n","thé","tea");
W("koohii",null,"コーヒー","n","café","coffee");
W("gyuunyuu",null,"ぎゅうにゅう","n","lait","milk");
W("biiru",null,"ビール","n","bière","beer");
W("sakana","魚","さかな","n","poisson","fish");
W("niku",null,"にく","n","viande","meat");
W("yasai",null,"やさい","n","légumes","vegetables");
W("kudamono",null,"くだもの","n","fruits","fruit");
W("tamago",null,"たまご","n","œuf","egg");
W("ringo",null,"りんご","n","pomme","apple");
W("sushi",null,"すし","n","sushi","sushi");
W("raamen",null,"ラーメン","n","ramen","ramen");
W("karee",null,"カレー","n","curry","curry");
W("keeki",null,"ケーキ","n","gâteau","cake");
W("okashi",null,"おかし","n","sucreries","sweets");
W("obentou",null,"おべんとう","n","bento","boxed lunch");

/* ---- time ---- */
W("ima","今","いま","n","maintenant","now");
W("kyou","今日","きょう","n","aujourd'hui","today",{sp:1});
W("ashita",null,"あした","n","demain","tomorrow");
W("kinou",null,"きのう","n","hier","yesterday");
W("mainichi","毎日","まいにち","n","chaque jour","every day",{kb:["まい","にち"]});
W("maishuu","毎週","まいしゅう","n","chaque semaine","every week",{kb:["まい","しゅう"]});
W("maiasa",null,"まいあさ","n","chaque matin","every morning");
W("maiban",null,"まいばん","n","chaque soir","every evening");
W("konshuu","今週","こんしゅう","n","cette semaine","this week",{kb:["こん","しゅう"]});
W("raishuu","来週","らいしゅう","n","la semaine prochaine","next week",{kb:["らい","しゅう"]});
W("senshuu","先週","せんしゅう","n","la semaine dernière","last week",{kb:["せん","しゅう"]});
W("kotoshi","今年","ことし","n","cette année","this year",{sp:1});
W("rainen","来年","らいねん","n","l'année prochaine","next year",{kb:["らい","ねん"]});
W("kyonen","去年","きょねん","n","l'année dernière","last year",{kb:["きょ","ねん"]});
W("asa",null,"あさ","n","matin","morning");
W("hiru",null,"ひる","n","midi ; journée","noon; daytime");
W("ban",null,"ばん","n","soir","evening");
W("yoru",null,"よる","n","nuit","night");
W("gozen","午前","ごぜん","n","matinée (a.m.)","a.m.",{kb:["ご","ぜん"]});
W("gogo","午後","ごご","n","après-midi (p.m.)","p.m.",{kb:["ご","ご"]});
W("toki","時","とき","n","moment","time; moment");
W("jikan","時間","じかん","n","temps ; heure (durée)","time; hours",{kb:["じ","かん"]});
W("shuumatsu",null,"しゅうまつ","n","week-end","weekend");
W("tanjoubi",null,"たんじょうび","n","anniversaire","birthday");
W("yasumi","休み","やすみ","n","congé, repos","day off; rest",{kb:["やす"]});
W("natsuyasumi",null,"なつやすみ","n","vacances d'été","summer vacation");
W("haru",null,"はる","n","printemps","spring");
W("natsu",null,"なつ","n","été","summer");
W("fuyu",null,"ふゆ","n","hiver","winter");

/* ---- days of week ---- */
W("nichiyoubi","日曜日","にちようび","n","dimanche","Sunday",{kb:["にち","よう","び"]});
W("getsuyoubi","月曜日","げつようび","n","lundi","Monday",{kb:["げつ","よう","び"]});
W("kayoubi","火曜日","かようび","n","mardi","Tuesday",{kb:["か","よう","び"]});
W("suiyoubi","水曜日","すいようび","n","mercredi","Wednesday",{kb:["すい","よう","び"]});
W("mokuyoubi","木曜日","もくようび","n","jeudi","Thursday",{kb:["もく","よう","び"]});
W("kinyoubi","金曜日","きんようび","n","vendredi","Friday",{kb:["きん","よう","び"]});
W("doyoubi","土曜日","どようび","n","samedi","Saturday",{kb:["ど","よう","び"]});

/* ---- numbers, money, clock ---- */
W("hitotsu","一つ","ひとつ","num","un (objet)","one (thing)",{kb:["ひと"]});
W("futatsu","二つ","ふたつ","num","deux (objets)","two (things)",{kb:["ふた"]});
W("mittsu","三つ","みっつ","num","trois (objets)","three (things)",{kb:["みっ"]});
W("yottsu","四つ","よっつ","num","quatre (objets)","four (things)",{kb:["よっ"]});
W("itsutsu","五つ","いつつ","num","cinq (objets)","five (things)",{kb:["いつ"]});
W("hitori","一人","ひとり","num","une personne ; seul","one person; alone",{sp:1});
W("futari","二人","ふたり","num","deux personnes","two people",{sp:1});
W("sannin","三人","さんにん","num","trois personnes","three people",{kb:["さん","にん"]});
W("hyakuen","百円","ひゃくえん","num","100 yens","100 yen",{kb:["ひゃく","えん"]});
W("sanbyakuen","三百円","さんびゃくえん","num","300 yens","300 yen",{kb:["さん","びゃく","えん"]});
W("gohyakuen","五百円","ごひゃくえん","num","500 yens","500 yen",{kb:["ご","ひゃく","えん"]});
W("senen","千円","せんえん","num","1000 yens","1,000 yen",{kb:["せん","えん"]});
W("ichiman-en","一万円","いちまんえん","num","10 000 yens","10,000 yen",{kb:["いち","まん","えん"]});
W("ichiji","一時","いちじ","num","une heure (1 h)","one o'clock",{kb:["いち","じ"]});
W("sanji","三時","さんじ","num","trois heures","three o'clock",{kb:["さん","じ"]});
W("yoji","四時","よじ","num","quatre heures","four o'clock",{kb:["よ","じ"]});
W("rokuji","六時","ろくじ","num","six heures","six o'clock",{kb:["ろく","じ"]});
W("shichiji","七時","しちじ","num","sept heures","seven o'clock",{kb:["しち","じ"]});
W("hachiji","八時","はちじ","num","huit heures","eight o'clock",{kb:["はち","じ"]});
W("kuji","九時","くじ","num","neuf heures","nine o'clock",{kb:["く","じ"]});
W("juuji","十時","じゅうじ","num","dix heures","ten o'clock",{kb:["じゅう","じ"]});
W("goji","五時","ごじ","num","cinq heures","five o'clock",{kb:["ご","じ"]});
W("niji","二時","にじ","num","deux heures","two o'clock",{kb:["に","じ"]});
W("sanjihan","三時半","さんじはん","num","trois heures et demie","half past three",{kb:["さん","じ","はん"]});
W("shichijihan","七時半","しちじはん","num","sept heures et demie","half past seven",{kb:["しち","じ","はん"]});
W("gofun","五分","ごふん","num","cinq minutes","five minutes",{kb:["ご","ふん"]});
W("juppun","十分","じゅっぷん","num","dix minutes","ten minutes",{kb:["じゅっ","ぷん"]});
W("ichijikan","一時間","いちじかん","num","une heure (durée)","one hour",{kb:["いち","じ","かん"]});
W("nijikan","二時間","にじかん","num","deux heures (durée)","two hours",{kb:["に","じ","かん"]});
W("isshuukan","一週間","いっしゅうかん","num","une semaine","one week",{kb:["いっ","しゅう","かん"]});
W("ichinichi","一日","いちにち","num","une journée","one day",{kb:["いち","にち"]});
W("ikkai",null,"いっかい","num","une fois","once");
W("nikai",null,"にかい","num","deux fois","twice");
W("sankai",null,"さんかい","num","trois fois","three times");
W("ichido",null,"いちど","num","une fois","once");

/* ---- verbs ---- */
W("taberu","食べる","たべる","v1","manger","to eat",{kb:["た"]});
W("nomu","飲む","のむ","v5","boire","to drink",{kb:["の"]});
W("miru","見る","みる","v1","voir, regarder","to see; watch",{kb:["み"]});
W("kiku","聞く","きく","v5","écouter ; demander","to listen; ask",{kb:["き"]});
W("yomu","読む","よむ","v5","lire","to read",{kb:["よ"]});
W("kaku","書く","かく","v5","écrire","to write",{kb:["か"]});
W("hanasu","話す","はなす","v5","parler","to speak",{kb:["はな"]});
W("iu","言う","いう","v5","dire","to say",{kb:["い"]});
W("iku","行く","いく","v5","aller","to go",{kb:["い"],irr:"iku"});
W("kuru","来る","くる","vk","venir","to come");
W("kaeru",null,"かえる","v5","rentrer","to return home");
W("au","会う","あう","v5","rencontrer","to meet",{kb:["あ"]});
W("kau","買う","かう","v5","acheter","to buy",{kb:["か"]});
W("matsu",null,"まつ","v5","attendre","to wait");
W("motsu",null,"もつ","v5","tenir, porter","to hold; carry");
W("hataraku",null,"はたらく","v5","travailler","to work");
W("yasumu","休む","やすむ","v5","se reposer","to rest",{kb:["やす"]});
W("okiru",null,"おきる","v1","se lever","to get up");
W("neru",null,"ねる","v1","dormir, se coucher","to sleep");
W("wakaru","分かる","わかる","v5","comprendre","to understand",{kb:["わ"]});
W("shiru",null,"しる","v5","connaître","to know");
W("sumu",null,"すむ","v5","habiter","to live (in)");
W("tatsu","立つ","たつ","v5","se lever, se tenir debout","to stand",{kb:["た"]});
W("suwaru",null,"すわる","v5","s'asseoir","to sit");
W("hairu","入る","はいる","v5","entrer","to enter",{kb:["はい"]});
W("deru","出る","でる","v1","sortir","to go out",{kb:["で"]});
W("dekakeru","出かける","でかける","v1","sortir (de chez soi)","to go out (somewhere)",{kb:["で"]});
W("noru",null,"のる","v5","monter (dans)","to ride; get on");
W("aruku",null,"あるく","v5","marcher","to walk");
W("hashiru",null,"はしる","v5","courir","to run");
W("asobu",null,"あそぶ","v5","jouer, s'amuser","to play; have fun");
W("toru",null,"とる","v5","prendre (photo)","to take (photo)");
W("akeru",null,"あける","v1","ouvrir","to open");
W("shimeru",null,"しめる","v1","fermer","to close");
W("tsukau",null,"つかう","v5","utiliser","to use");
W("tsukuru",null,"つくる","v5","faire, fabriquer","to make");
W("ageru",null,"あげる","v1","donner","to give");
W("morau",null,"もらう","v5","recevoir","to receive");
W("kasu",null,"かす","v5","prêter","to lend");
W("kariru",null,"かりる","v1","emprunter","to borrow");
W("oshieru",null,"おしえる","v1","enseigner, apprendre (à qqn)","to teach; tell");
W("narau",null,"ならう","v5","apprendre (de qqn)","to learn");
W("utau",null,"うたう","v5","chanter","to sing");
W("oyogu",null,"およぐ","v5","nager","to swim");
W("owaru",null,"おわる","v5","finir","to end");
W("hajimaru",null,"はじまる","v5","commencer","to begin");
W("naru",null,"なる","v5","devenir","to become");
W("arau",null,"あらう","v5","laver","to wash");
W("wasureru",null,"わすれる","v1","oublier","to forget");
W("isogu",null,"いそぐ","v5","se dépêcher","to hurry");
W("omou",null,"おもう","v5","penser","to think");
W("tetsudau",null,"てつだう","v5","aider","to help");
W("umareru","生まれる","うまれる","v1","naître","to be born",{kb:["う"]});
W("iru",null,"いる","v1","être (êtres vivants)","to exist (living)");
W("aru",null,"ある","v5","être, y avoir (choses)","to exist (things)",{irr:"aru"});
W("benkyou",null,"べんきょう","vs","étudier","to study");
W("denwa","電話","でんわ","vs","téléphoner","to phone",{kb:["でん","わ"]});
W("ryouri",null,"りょうり","vs","cuisiner","to cook");
W("kaimono",null,"かいもの","vs","faire des courses","to shop");
W("sanpo",null,"さんぽ","vs","se promener","to take a walk");
W("shinpai",null,"しんぱい","vs","s'inquiéter","to worry");

/* ---- i-adjectives ---- */
W("ookii","大きい","おおきい","adji","grand","big",{kb:["おお"]});
W("chiisai","小さい","ちいさい","adji","petit","small",{kb:["ちい"]});
W("takai","高い","たかい","adji","cher ; haut","expensive; tall",{kb:["たか"]});
W("yasui","安い","やすい","adji","bon marché","cheap",{kb:["やす"]});
W("atarashii","新しい","あたらしい","adji","nouveau","new",{kb:["あたら"]});
W("furui","古い","ふるい","adji","vieux (choses)","old (things)",{kb:["ふる"]});
W("ii",null,"いい","adji","bon, bien","good",{irr:"ii"});
W("warui",null,"わるい","adji","mauvais","bad");
W("oishii",null,"おいしい","adji","bon (goût)","tasty");
W("atsui",null,"あつい","adji","chaud","hot");
W("samui",null,"さむい","adji","froid (temps)","cold (weather)");
W("tsumetai",null,"つめたい","adji","froid (au toucher)","cold (to touch)");
W("omoshiroi",null,"おもしろい","adji","intéressant, amusant","interesting; fun");
W("tsumaranai",null,"つまらない","adji","ennuyeux","boring");
W("muzukashii",null,"むずかしい","adji","difficile","difficult");
W("yasashii",null,"やさしい","adji","facile ; gentil","easy; kind");
W("nagai","長い","ながい","adji","long","long",{kb:["なが"]});
W("mijikai",null,"みじかい","adji","court","short");
W("hayai",null,"はやい","adji","rapide ; tôt","fast; early");
W("osoi",null,"おそい","adji","lent ; tard","slow; late");
W("chikai",null,"ちかい","adji","proche","near");
W("tooi",null,"とおい","adji","loin","far");
W("isogashii",null,"いそがしい","adji","occupé","busy");
W("tanoshii",null,"たのしい","adji","amusant, agréable","enjoyable");
W("ooi","多い","おおい","adji","nombreux","many",{kb:["おお"]});
W("sukunai","少ない","すくない","adji","peu nombreux","few",{kb:["すく"]});
W("shiroi","白い","しろい","adji","blanc","white",{kb:["しろ"]});
W("akai",null,"あかい","adji","rouge","red");
W("aoi",null,"あおい","adji","bleu","blue");
W("hiroi",null,"ひろい","adji","spacieux","spacious");
W("semai",null,"せまい","adji","étroit","cramped");
W("amai",null,"あまい","adji","sucré","sweet");
W("itai",null,"いたい","adji","douloureux","painful");
W("hoshii",null,"ほしい","adji","désiré (vouloir)","wanted");
W("kawaii",null,"かわいい","adji","mignon","cute");

/* ---- na-adjectives ---- */
W("genki","元気","げんき","adjna","en forme","well; lively",{kb:["げん","き"]});
W("shizuka",null,"しずか","adjna","calme","quiet");
W("nigiyaka",null,"にぎやか","adjna","animé","lively");
W("kirei",null,"きれい","adjna","joli ; propre","pretty; clean");
W("yuumei",null,"ゆうめい","adjna","célèbre","famous");
W("shinsetsu",null,"しんせつ","adjna","gentil","kind");
W("hima",null,"ひま","adjna","libre (temps)","free (time)");
W("benri",null,"べんり","adjna","pratique","convenient");
W("suki","好き","すき","adjna","aimé (aimer)","liked",{kb:["す"]});
W("kirai",null,"きらい","adjna","détesté (détester)","disliked");
W("daisuki","大好き","だいすき","adjna","adoré (adorer)","loved",{kb:["だい","す"]});
W("jouzu","上手","じょうず","adjna","doué","good at",{sp:1});
W("heta","下手","へた","adjna","pas doué","bad at",{sp:1});
W("taihen",null,"たいへん","adjna","dur, pénible","tough");
W("daijoubu",null,"だいじょうぶ","adjna","ça va ; pas de problème","all right");

/* ---- adverbs & connectors ---- */
W("totemo",null,"とても","adv","très","very");
W("amari",null,"あまり","adv","pas tellement (+ nég.)","not really (+ neg.)");
W("zenzen",null,"ぜんぜん","adv","pas du tout (+ nég.)","not at all (+ neg.)");
W("yoku",null,"よく","adv","souvent ; bien","often; well");
W("tokidoki","時々","ときどき","adv","parfois","sometimes",{sp:1});
W("takusan",null,"たくさん","adv","beaucoup","a lot");
W("sukoshi","少し","すこし","adv","un peu","a little",{kb:["すこ"]});
W("chotto",null,"ちょっと","adv","un peu ; un instant","a bit; a moment");
W("mou",null,"もう","adv","déjà","already");
W("mada",null,"まだ","adv","encore ; pas encore","still; not yet");
W("itsumo",null,"いつも","adv","toujours","always");
W("isshoni",null,"いっしょに","adv","ensemble","together");
W("hitoride","一人で","ひとりで","adv","seul","alone",{sp:1});
W("minnade",null,"みんなで","adv","tous ensemble","all together");
W("zenbu",null,"ぜんぶ","adv","tout","everything");
W("soshite",null,"そして","adv","et","and (then)");
W("demo",null,"でも","adv","mais","but");
W("sorekara",null,"それから","adv","et puis","and then");
W("ichiban",null,"いちばん","adv","le plus","the most");
W("yukkuri",null,"ゆっくり","adv","lentement","slowly");
W("mata",null,"また","adv","encore, de nouveau","again");

/* ---- question words ---- */
W("nani","何","なに","q","quoi","what",{kb:["なに"]});
W("nan","何","なん","q","quoi","what",{kb:["なん"]});
W("dare",null,"だれ","q","qui","who");
W("doko",null,"どこ","q","où","where");
W("itsu",null,"いつ","q","quand","when");
W("dou",null,"どう","q","comment","how");
W("donna",null,"どんな","q","quel genre de","what kind of");
W("doushite",null,"どうして","q","pourquoi","why");
W("ikura",null,"いくら","q","combien (prix)","how much");
W("ikutsu",null,"いくつ","q","combien (nombre)","how many");
W("nanji","何時","なんじ","q","quelle heure","what time",{kb:["なん","じ"]});
W("nannin","何人","なんにん","q","combien de personnes","how many people",{kb:["なん","にん"]});
W("nanyoubi","何曜日","なんようび","q","quel jour","what day",{kb:["なん","よう","び"]});
W("nande","何で","なんで","q","par quel moyen","by what means",{kb:["なん"]});
W("dochira",null,"どちら","q","lequel (des deux)","which (of two)");
W("dore",null,"どれ","q","lequel","which one");
W("dono",null,"どの","q","quel","which (+ noun)");
W("nanika","何か","なにか","q","quelque chose","something",{kb:["なに"]});
W("dokoka",null,"どこか","q","quelque part","somewhere");
W("dareka",null,"だれか","q","quelqu'un","someone");

/* ---- demonstratives ---- */
W("kore",null,"これ","dem","ceci","this");
W("sore",null,"それ","dem","cela","that");
W("are",null,"あれ","dem","cela (là-bas)","that (over there)");
W("kono",null,"この","dem","ce …-ci","this (+ noun)");
W("sono",null,"その","dem","ce …-là","that (+ noun)");
W("ano",null,"あの","dem","ce …-là-bas","that (+ noun, far)");
W("koko",null,"ここ","dem","ici","here");
W("soko",null,"そこ","dem","là","there");
W("asoko",null,"あそこ","dem","là-bas","over there");

/* ---- expressions ---- */
W("hai",null,"はい","exp","oui","yes");
W("iie",null,"いいえ","exp","non","no");
W("ee",null,"ええ","exp","oui (familier)","yeah");
W("soudesu",null,"そうです","exp","c'est ça","that's right");
W("chigaimasu",null,"ちがいます","exp","ce n'est pas ça","that's wrong");
W("sumimasen",null,"すみません","exp","excusez-moi","excuse me");
W("arigatou",null,"ありがとうございます","exp","merci","thank you");
W("douzo",null,"どうぞ","exp","je vous en prie","here you go");
W("onegaishimasu",null,"おねがいします","exp","s'il vous plaît","please");
W("kudasai",null,"ください","exp","donnez-moi","please give me");
W("ippai",null,"いっぱい","exp","plein, rassasié","full");

/* --- greetings and conversation glue, added with the dialogues (v2.0) --- */
/* Bare surnames. The tanaka/yamada entries carry さん baked in, which is right
   when you talk ABOUT someone and WRONG when you introduce yourself — you never
   award yourself an honorific. The dialogues need both forms. */
W("tanaka0","田中","たなか","n","Tanaka (sans さん)","Tanaka (no さん)",{kb:["た","なか"]});
W("yamada0","山田","やまだ","n","Yamada (sans さん)","Yamada (no さん)",{kb:["やま","だ"]});
W("konnichiwa",null,"こんにちは","exp","bonjour","hello");
W("ohayou",null,"おはようございます","exp","bonjour (le matin)","good morning");
W("konbanwa",null,"こんばんは","exp","bonsoir","good evening");
W("sayounara",null,"さようなら","exp","au revoir","goodbye");
W("hajimemashite",null,"はじめまして","exp","enchanté","nice to meet you");
W("yoroshiku",null,"よろしくおねがいします","exp","enchanté, comptez sur moi","pleased to meet you");
W("soudesuka",null,"そうですか","exp","ah bon ?","is that so?");
W("aa",null,"ああ","exp","ah","ah");
W("etto",null,"えっと","exp","euh…","umm…");
W("jaa",null,"じゃあ","exp","alors, bon","well then");
W("dewa",null,"では","exp","alors (soutenu)","well then (formal)");
W("shitsurei",null,"しつれいします","exp","excusez-moi (en entrant/partant)","excuse me (entering/leaving)");
W("otsukaresama",null,"おつかれさまです","exp","bon courage, merci (au travail)","thanks for your work");
W("itadakimasu",null,"いただきます","exp","bon appétit (avant de manger)","said before eating");
W("gochisousama",null,"ごちそうさまでした","exp","merci pour le repas","thanks for the meal");
W("moshimoshi",null,"もしもし","exp","allô","hello (on the phone)");
W("chotto",null,"ちょっと","adv","un peu, un instant","a little, a moment");

/* ---------- words a prompt cannot choose between ----------
 * In a production exercise the French (or English) is all you get, and for a
 * few words it simply does not decide: "Oui" is はい and it is also ええ. Both
 * are correct Japanese in the same slot, so grading accepts either and the
 * feedback then says which one the sentence itself used — the 💡 note explains
 * the difference from there.
 *
 * Deliberately short. This is for FREE VARIATION only:
 *   なに/なん is NOT here — the choice is phonologically determined (なん before
 *     です・だ・の and counters), so accepting the other would teach a mistake.
 *   それ/あれ is NOT here — near vs far is a real distinction, and the glosses
 *     already mark it ("Cela" vs "Là-bas, c'est").
 */
const ALT_WORDS = [
  ["hai", "ee"],         // oui — a register difference, both correct
  ["namae", "onamae"],   // nom — お is a politeness prefix, not a different word
  ["ikkai", "ichido"]    // une fois — もう一回 and もう一度 are both natural
];

if (typeof module !== "undefined") module.exports = { LEXICON, ALT_WORDS };
