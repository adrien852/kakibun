/* Kakibun — the sentence corpus.
 * S(gp, lvl, dsl, fr, en [, note])
 *   gp  = grammar point exercised (primary)
 *   lvl = 1 easy · 2 medium · 3 long/combined  (drives ordering inside a point)
 *   dsl = see js/parse.js
 * Vocabulary and grammar are cumulative: a sentence only uses points
 * introduced at or before its own gp.
 */
const SENTENCES = [];
const S = (gp,lvl,dsl,fr,en,note) => SENTENCES.push({ i:SENTENCES.length, gp, lvl, dsl, fr, en, note });

/* ============ ARC 1 — 東京 ============ */
// g01 AはBです
S("g01",1,"watashi は=top gakusei です","Je suis étudiant(e).","I am a student.");
S("g01",1,"tanaka は=top sensei です","M. Tanaka est professeur.","Mr Tanaka is a teacher.");
S("g01",2,"watashi は=top furansujin です","Je suis français(e).","I am French.");
S("g01",2,"haha は=top isha です","Ma mère est médecin.","My mother is a doctor.");
S("g01",3,"yamada は=top kaishain です","Mme Yamada est employée de bureau.","Ms Yamada is an office worker.");
// g02 じゃありません
S("g02",1,"watashi は=top sensei desu.janai","Je ne suis pas professeur.","I am not a teacher.");
S("g02",1,"chichi は=top isha desu.janai","Mon père n'est pas médecin.","My father is not a doctor.");
S("g02",2,"yamada は=top furansujin desu.janai","Mme Yamada n'est pas française.","Ms Yamada is not French.");
S("g02",2,"watashi は=top kodomo desu.janai","Je ne suis pas un enfant.","I am not a child.");
S("g02",3,"tanaka は=top gakusei desu.janai","M. Tanaka n'est pas étudiant.","Mr Tanaka is not a student.");
// g03 でした
S("g03",1,"chichi は=top sensei desu.deshita","Mon père était professeur.","My father was a teacher.");
S("g03",1,"kinou は=top ame desu.deshita","Hier, il pleuvait.","Yesterday it was rainy.");
S("g03",2,"senshuu は=top yasumi desu.deshita","La semaine dernière, c'était congé.","Last week was a holiday.");
S("g03",2,"watashi は=top gakusei desu.deshita","J'étais étudiant(e).","I was a student.");
S("g03",3,"kinou は=top hare desu.deshita","Hier, il faisait beau.","Yesterday was sunny.");
// g04 か
S("g04",1,"anata は=top gakusei です か=q","Es-tu étudiant(e) ?","Are you a student?");
S("g04",1,"tanaka は=top sensei です か=q","M. Tanaka est-il professeur ?","Is Mr Tanaka a teacher?");
S("g04",2,"yamada は=top nihonjin です か=q","Mme Yamada est-elle japonaise ?","Is Ms Yamada Japanese?");
S("g04",2,"okaasan は=top isha です か=q","Votre mère est-elle médecin ?","Is your mother a doctor?");
S("g04",3,"anata は=top furansujin です か=q","Êtes-vous français(e) ?","Are you French?");
// g05 はい・いいえ
S("g05",1,"hai 、 soudesu","Oui, c'est ça.","Yes, that's right.");
S("g05",1,"iie 、 chigaimasu","Non, ce n'est pas ça.","No, that's wrong.");
S("g05",2,"hai 、 watashi は=top gakusei です","Oui, je suis étudiant(e).","Yes, I am a student.");
S("g05",2,"iie 、 watashi は=top sensei desu.janai","Non, je ne suis pas professeur.","No, I am not a teacher.");
S("g05",3,"ee 、 soudesu","Oui (familier), c'est ça.","Yeah, that's right.");
// g06 の
S("g06",1,"watashi の=poss hon です","C'est mon livre.","It's my book.");
S("g06",1,"tanaka の=poss kuruma です","C'est la voiture de M. Tanaka.","It's Mr Tanaka's car.");
S("g06",2,"haha の=poss kaban です","C'est le sac de ma mère.","It's my mother's bag.");
S("g06",2,"yamada は=top nihongo の=poss sensei です","Mme Yamada est professeure de japonais.","Ms Yamada is a Japanese teacher.");
S("g06",3,"watashi の=poss tomodachi は=top nihonjin です","Mon ami est japonais.","My friend is Japanese.");
// g07 も
S("g07",1,"watashi も=also gakusei です","Moi aussi, je suis étudiant(e).","I am a student too.");
S("g07",1,"yamada も=also sensei です","Mme Yamada aussi est professeure.","Ms Yamada is also a teacher.");
S("g07",2,"haha も=also isha です","Ma mère aussi est médecin.","My mother is a doctor too.");
S("g07",2,"kyou も=also ame です","Aujourd'hui aussi, il pleut.","Today is rainy too.");
S("g07",3,"watashi の=poss tomodachi も=also furansujin です","Mon ami aussi est français.","My friend is French too.");
// g08 ～人・～語
S("g08",1,"tanaka は=top nihonjin です","M. Tanaka est japonais.","Mr Tanaka is Japanese.");
S("g08",1,"watashi は=top furansujin です","Je suis français(e).","I am French.");
S("g08",2,"yamada は=top nihongo の=poss sensei です","Mme Yamada est professeure de japonais.","Ms Yamada teaches Japanese.");
S("g08",2,"anata は=top nihonjin です か=q","Êtes-vous japonais(e) ?","Are you Japanese?");
S("g08",3,"watashi の=poss sensei は=top furansujin desu.janai","Mon professeur n'est pas français.","My teacher is not French.");
// g09 何ですか
S("g09",1,"onamae は=top nan です か=q","Quel est votre nom ?","What is your name?");
S("g09",2,"shigoto は=top nan です か=q","Quel est votre travail ?","What is your job?");
S("g09",2,"namae は=top nan です か=q","Quel est son nom ?","What is the name?");
S("g09",3,"anata の=poss shigoto は=top nan です か=q","Quel est votre métier ?","What is your occupation?");
// g10 だれですか・さん
S("g10",1,"dare です か=q","Qui est-ce ?","Who is it?");
S("g10",2,"tanaka は=top dare です か=q","Qui est M. Tanaka ?","Who is Mr Tanaka?");
S("g10",2,"tanaka は=top watashi の=poss tomodachi です","M. Tanaka est mon ami.","Mr Tanaka is my friend.");
S("g10",3,"yamada は=top watashi の=poss sensei です","Mme Yamada est ma professeure.","Ms Yamada is my teacher.");
S("g10",3,"anata の=poss sensei は=top dare です か=q","Qui est votre professeur ?","Who is your teacher?");

/* ============ ARC 2 — 横浜 ============ */
// g11 これ・それ・あれ
S("g11",1,"kore は=top hon です","Ceci est un livre.","This is a book.");
S("g11",1,"sore は=top watashi の=poss kaban です","Cela est mon sac.","That is my bag.");
S("g11",2,"are は=top fujisan です","Là-bas, c'est le mont Fuji.","That over there is Mt Fuji.");
S("g11",2,"kore は=top nan です か=q","Qu'est-ce que c'est ?","What is this?");
S("g11",3,"sore は=top mizu です か=q","Est-ce de l'eau ?","Is that water?");
S("g11",3,"are は=top gakkou です","Là-bas, c'est l'école.","That over there is the school.");
// g12 この・その・あの
S("g12",1,"kono hito は=top tanaka です","Cette personne est M. Tanaka.","This person is Mr Tanaka.");
S("g12",1,"ano hito は=top dare です か=q","Qui est cette personne là-bas ?","Who is that person over there?");
S("g12",2,"kono kuruma は=top nihon の=poss kuruma です","Cette voiture est une voiture japonaise.","This car is a Japanese car.");
S("g12",2,"sono hon は=top nihongo の=poss hon です","Ce livre est un livre de japonais.","That book is a Japanese book.");
S("g12",3,"ano yama は=top fujisan です","Cette montagne là-bas est le mont Fuji.","That mountain over there is Mt Fuji.");
// g13 ここ・そこ・あそこ
S("g13",1,"koko は=top eki です","Ici, c'est la gare.","This is the station.");
S("g13",1,"soko は=top watashi の=poss gakkou です","Là, c'est mon école.","That is my school.");
S("g13",2,"asoko は=top toshokan です","Là-bas, c'est la bibliothèque.","Over there is the library.");
S("g13",2,"koko は=top nihon です","Ici, c'est le Japon.","This is Japan.");
S("g13",3,"soko は=top toire です か=q","Est-ce que là, ce sont les toilettes ?","Is that the toilet?");
// g14 どこですか
S("g14",1,"eki は=top doko です か=q","Où est la gare ?","Where is the station?");
S("g14",1,"toire は=top doko です か=q","Où sont les toilettes ?","Where is the toilet?");
S("g14",2,"tanaka は=top doko です か=q","Où est M. Tanaka ?","Where is Mr Tanaka?");
S("g14",2,"konbini は=top doko です か=q","Où est la supérette ?","Where is the convenience store?");
S("g14",3,"eki は=top asoko です","La gare est là-bas.","The station is over there.");
// g15 どれ・どの
S("g15",1,"anata の=poss kasa は=top dore です か=q","Lequel est votre parapluie ?","Which one is your umbrella?");
S("g15",2,"watashi の=poss hon は=top dore です か=q","Lequel est mon livre ?","Which one is my book?");
S("g15",2,"dono hon です か=q","Quel livre ?","Which book?");
S("g15",3,"tanaka の=poss kuruma は=top dore です か=q","Laquelle est la voiture de M. Tanaka ?","Which is Mr Tanaka's car?");
// g16 だれの
S("g16",1,"kore は=top dare の=poss kasa です か=q","À qui est ce parapluie ?","Whose umbrella is this?");
S("g16",1,"sore は=top watashi の=pron です","C'est le mien.","That one is mine.");
S("g16",2,"kono kaban は=top dare の=pron です か=q","À qui est ce sac ?","Whose is this bag?");
S("g16",2,"ano kuruma は=top tanaka の=pron です","Cette voiture là-bas est celle de M. Tanaka.","That car is Mr Tanaka's.");
S("g16",3,"kono pen は=top anata の=pron です か=q","Ce stylo est-il à vous ?","Is this pen yours?");
// g17 いくら
S("g17",1,"kore は=top ikura です か=q","Combien coûte ceci ?","How much is this?");
S("g17",1,"sono kasa は=top ikura です か=q","Combien coûte ce parapluie ?","How much is that umbrella?");
S("g17",2,"kono hon は=top sanbyakuen です","Ce livre coûte 300 yens.","This book is 300 yen.");
S("g17",2,"ringo は=top hyakuen です","La pomme coûte 100 yens.","The apple is 100 yen.");
S("g17",3,"sore は=top senen です か=q","Cela coûte-t-il 1000 yens ?","Is that 1,000 yen?");
// g18 何時
S("g18",1,"ima nanji です か=q","Quelle heure est-il ?","What time is it now?");
S("g18",1,"ima sanji です","Il est trois heures.","It's three o'clock.");
S("g18",2,"ima shichijihan です","Il est sept heures et demie.","It's half past seven.");
S("g18",2,"gogo yoji です","Il est 16 heures.","It's 4 p.m.");
S("g18",3,"gozen kuji です","Il est 9 heures du matin.","It's 9 a.m.");
// g19 曜日
S("g19",1,"kyou は=top nanyoubi です か=q","Quel jour sommes-nous ?","What day is it today?");
S("g19",1,"kyou は=top getsuyoubi です","Aujourd'hui, c'est lundi.","Today is Monday.");
S("g19",2,"ashita は=top kayoubi です","Demain, c'est mardi.","Tomorrow is Tuesday.");
S("g19",2,"kinou は=top nichiyoubi desu.deshita","Hier, c'était dimanche.","Yesterday was Sunday.");
S("g19",3,"tanjoubi は=top doyoubi です","Mon anniversaire est un samedi.","My birthday is on Saturday.");

/* ============ ARC 3 — 鎌倉 ============ */
// g20 があります
S("g20",1,"hon が=subj aru.masu","Il y a un livre.","There is a book.");
S("g20",1,"mizu が=subj aru.masu","Il y a de l'eau.","There is water.");
S("g20",2,"kasa が=subj aru.masu か=q","Y a-t-il un parapluie ?","Is there an umbrella?");
S("g20",2,"okane が=subj aru.masen","Je n'ai pas d'argent.","There is no money.");
S("g20",3,"jikan が=subj aru.masen","Je n'ai pas le temps.","There is no time.");
// g21 がいます
S("g21",1,"inu が=subj iru.masu","Il y a un chien.","There is a dog.");
S("g21",1,"neko が=subj iru.masu か=q","Y a-t-il un chat ?","Is there a cat?");
S("g21",2,"kodomo が=subj iru.masu","Il y a des enfants.","There are children.");
S("g21",2,"dare が=subj iru.masu か=q","Qui est là ?","Who is there?");
S("g21",3,"sensei が=subj iru.masen","Le professeur n'est pas là.","The teacher is not there.");
// g22 に (lieu d'existence)
S("g22",1,"eki に=exist hito が=subj iru.masu","Il y a des gens à la gare.","There are people at the station.");
S("g22",1,"koko に=exist mizu が=subj aru.masu","Ici, il y a de l'eau.","There is water here.");
S("g22",2,"gakkou に=exist sensei が=subj iru.masu","Il y a un professeur à l'école.","There is a teacher at school.");
S("g22",2,"heya に=exist terebi が=subj aru.masu","Il y a une télé dans la chambre.","There is a TV in the room.");
S("g22",3,"niwa に=exist inu が=subj iru.masu","Il y a un chien dans le jardin.","There is a dog in the garden.");
S("g22",3,"toshokan に=exist hon が=subj takusan aru.masu","Il y a beaucoup de livres à la bibliothèque.","There are many books in the library.");
// g23 position
S("g23",1,"tsukue の=poss ue に=exist hon が=subj aru.masu","Il y a un livre sur le bureau.","There is a book on the desk.");
S("g23",1,"kaban の=poss naka に=exist pen が=subj aru.masu","Il y a un stylo dans le sac.","There is a pen in the bag.");
S("g23",2,"eki の=poss mae に=exist konbini が=subj aru.masu","Il y a une supérette devant la gare.","There is a convenience store in front of the station.");
S("g23",2,"isu の=poss shita に=exist neko が=subj iru.masu","Il y a un chat sous la chaise.","There is a cat under the chair.");
S("g23",3,"gakkou の=poss chikaku に=exist kouen が=subj aru.masu","Il y a un parc près de l'école.","There is a park near the school.");
// g24 と
S("g24",1,"pan と=and tamago が=subj aru.masu","Il y a du pain et des œufs.","There is bread and eggs.");
S("g24",1,"inu と=and neko が=subj iru.masu","Il y a un chien et un chat.","There is a dog and a cat.");
S("g24",2,"tsukue の=poss ue に=exist hon と=and pen が=subj aru.masu","Sur le bureau, il y a un livre et un stylo.","On the desk there are a book and a pen.");
S("g24",2,"mizu と=and ocha が=subj aru.masu","Il y a de l'eau et du thé.","There is water and tea.");
S("g24",3,"tanaka と=and yamada が=subj iru.masu","M. Tanaka et Mme Yamada sont là.","Mr Tanaka and Ms Yamada are there.");
// g25 や
S("g25",1,"kaban の=poss naka に=exist hon や=list pen が=subj aru.masu","Dans le sac, il y a des livres, des stylos…","In the bag there are books, pens and so on.");
S("g25",2,"suupaa に=exist yasai や=list kudamono が=subj aru.masu","Au supermarché, il y a des légumes, des fruits…","At the supermarket there are vegetables, fruit and so on.");
S("g25",2,"heya に=exist tsukue や=list isu が=subj aru.masu","Dans la pièce, il y a un bureau, des chaises…","In the room there are a desk, chairs and so on.");
S("g25",3,"eki の=poss mae に=exist resutoran や=list konbini が=subj aru.masu","Devant la gare, il y a des restaurants, des supérettes…","In front of the station there are restaurants, convenience stores and so on.");
// g26 compteurs
S("g26",1,"ringo が=subj mittsu aru.masu","Il y a trois pommes.","There are three apples.");
S("g26",1,"tamago が=subj itsutsu aru.masu","Il y a cinq œufs.","There are five eggs.");
S("g26",2,"kodomo が=subj futari iru.masu","Il y a deux enfants.","There are two children.");
S("g26",2,"gakusei が=subj sannin iru.masu","Il y a trois étudiants.","There are three students.");
S("g26",3,"tsukue の=poss ue に=exist ringo が=subj futatsu aru.masu","Sur le bureau, il y a deux pommes.","There are two apples on the desk.");
// g27 いくつ・何人
S("g27",1,"ringo は=top ikutsu aru.masu か=q","Combien y a-t-il de pommes ?","How many apples are there?");
S("g27",2,"tamago は=top ikutsu aru.masu か=q","Combien y a-t-il d'œufs ?","How many eggs are there?");
S("g27",2,"kodomo は=top nannin iru.masu か=q","Combien y a-t-il d'enfants ?","How many children are there?");
S("g27",3,"gakusei は=top nannin iru.masu か=q","Combien y a-t-il d'étudiants ?","How many students are there?");
// g28 何も～ません
S("g28",1,"nani も=none aru.masen","Il n'y a rien.","There is nothing.");
S("g28",2,"heya に=exist dare も=none iru.masen","Il n'y a personne dans la pièce.","There is nobody in the room.");
S("g28",2,"kaban の=poss naka に=exist nani も=none aru.masen","Il n'y a rien dans le sac.","There is nothing in the bag.");
S("g28",3,"eki に=exist dare も=none iru.masen","Il n'y a personne à la gare.","There is nobody at the station.");

/* ============ ARC 4 — 富士山 ============ */
// g29 へ行きます
S("g29",1,"watashi は=top toukyou へ=dir iku.masu","Je vais à Tokyo.","I am going to Tokyo.");
S("g29",1,"ashita gakkou へ=dir iku.masu","Demain, je vais à l'école.","Tomorrow I go to school.");
S("g29",2,"tanaka は=top nihon へ=dir kuru.masu","M. Tanaka vient au Japon.","Mr Tanaka is coming to Japan.");
S("g29",2,"watashi は=top uchi へ=dir kaeru.masu","Je rentre à la maison.","I am going home.");
S("g29",3,"anata は=top doko へ=dir iku.masu か=q","Où allez-vous ?","Where are you going?");
// g30 に destination
S("g30",1,"eki に=dest iku.masu","Je vais à la gare.","I am going to the station.");
S("g30",1,"ashita toshokan に=dest iku.masu","Demain, je vais à la bibliothèque.","Tomorrow I go to the library.");
S("g30",2,"konshuu byouin に=dest iku.masu","Cette semaine, je vais à l'hôpital.","This week I go to the hospital.");
S("g30",2,"tanaka は=top kyou daigaku に=dest kuru.masu","M. Tanaka vient à l'université aujourd'hui.","Mr Tanaka comes to the university today.");
S("g30",3,"watashi は=top rainen nihon に=dest iku.masu","J'irai au Japon l'année prochaine.","I will go to Japan next year.");
// g31 で transport
S("g31",1,"basu で=means iku.masu","J'y vais en bus.","I go by bus.");
S("g31",1,"densha で=means gakkou に=dest iku.masu","Je vais à l'école en train.","I go to school by train.");
S("g31",2,"watashi は=top jitensha で=means eki に=dest iku.masu","Je vais à la gare à vélo.","I go to the station by bicycle.");
S("g31",2,"hikouki で=means nihon へ=dir iku.masu","Je vais au Japon en avion.","I go to Japan by plane.");
S("g31",3,"chichi は=top kuruma で=means kaisha に=dest iku.masu","Mon père va au travail en voiture.","My father drives to work.");
// g32 と with
S("g32",1,"tomodachi と=with iku.masu","J'y vais avec un ami.","I go with a friend.");
S("g32",1,"haha と=with suupaa に=dest iku.masu","Je vais au supermarché avec ma mère.","I go to the supermarket with my mother.");
S("g32",2,"tanaka と=with kissaten に=dest iku.masu","Je vais au café avec M. Tanaka.","I go to the coffee shop with Mr Tanaka.");
S("g32",2,"watashi は=top tomodachi と=with toukyou へ=dir iku.masu","Je vais à Tokyo avec un ami.","I go to Tokyo with a friend.");
S("g32",3,"watashi は=top hitoride nihon へ=dir iku.masu","Je vais au Japon seul(e).","I go to Japan alone.",{fr:"« Seul » = 一人で, avec で — pas avec と !",en:"“Alone” = 一人で, with で — not と!"});
// g33 から・まで
S("g33",1,"uchi から=from eki まで=until aruku.masu","Je marche de chez moi à la gare.","I walk from home to the station.");
S("g33",1,"gakkou は=top kuji から=from です","L'école commence à 9 h.","School starts at 9.");
S("g33",2,"shigoto は=top gogo goji まで=until です","Le travail dure jusqu'à 17 h.","Work is until 5 p.m.");
S("g33",2,"toukyou から=from kyouto まで=until densha で=means iku.masu","De Tokyo à Kyoto, j'y vais en train.","From Tokyo to Kyoto I go by train.");
S("g33",3,"ginkou は=top kuji から=from sanji まで=until です","La banque est ouverte de 9 h à 15 h.","The bank is open from 9 to 3.");
// g34 何で・だれと
S("g34",1,"nande iku.masu か=q","Comment y allez-vous ?","How do you get there?");
S("g34",2,"nande gakkou に=dest iku.masu か=q","Comment vas-tu à l'école ?","How do you get to school?");
S("g34",2,"densha で=means iku.masu","J'y vais en train.","I go by train.");
S("g34",3,"dare と=with iku.masu か=q","Avec qui y allez-vous ?","Who are you going with?");
S("g34",3,"dare と=with nihon へ=dir iku.masu か=q","Avec qui vas-tu au Japon ?","Who are you going to Japan with?");
// g35 いつ (sans に)
S("g35",1,"itsu nihon へ=dir iku.masu か=q","Quand vas-tu au Japon ?","When are you going to Japan?");
S("g35",1,"ashita toukyou に=dest iku.masu","Demain, je vais à Tokyo.","Tomorrow I go to Tokyo.");
S("g35",2,"ima uchi に=dest kaeru.masu","Je rentre à la maison maintenant.","I am going home now.");
S("g35",2,"watashi は=top mainichi gakkou に=dest iku.masu","Je vais à l'école tous les jours.","I go to school every day.");
S("g35",3,"tanaka は=top raishuu furansu へ=dir iku.masu","M. Tanaka va en France la semaine prochaine.","Mr Tanaka goes to France next week.");
// g36 に heure précise
S("g36",1,"shichiji に=time okiru.masu","Je me lève à 7 h.","I get up at 7.");
S("g36",1,"juuji に=time neru.masu","Je me couche à 22 h.","I go to bed at 10.");
S("g36",2,"nichiyoubi に=time toshokan に=dest iku.masu","Dimanche, je vais à la bibliothèque.","On Sunday I go to the library.");
S("g36",2,"gozen kuji に=time gakkou に=dest iku.masu","Je vais à l'école à 9 h du matin.","I go to school at 9 a.m.");
S("g36",3,"doyoubi に=time tomodachi と=with dekakeru.masu","Samedi, je sors avec des amis.","On Saturday I go out with friends.");
// g37 を lieu traversé
S("g37",1,"kouen を=path sanpo.masu","Je me promène dans le parc.","I take a walk in the park.");
S("g37",1,"michi を=path aruku.masu","Je marche le long de la rue.","I walk along the street.");
S("g37",2,"mainichi kouen を=path aruku.masu","Tous les jours, je marche dans le parc.","Every day I walk through the park.");
S("g37",2,"haha と=with kouen を=path sanpo.masu","Je me promène dans le parc avec ma mère.","I stroll in the park with my mother.");

/* ============ ARC 5 — 名古屋 ============ */
// g38 を + ます
S("g38",1,"pan を=obj taberu.masu","Je mange du pain.","I eat bread.");
S("g38",1,"mizu を=obj nomu.masu","Je bois de l'eau.","I drink water.");
S("g38",2,"hon を=obj yomu.masu","Je lis un livre.","I read a book.");
S("g38",2,"terebi を=obj miru.masu","Je regarde la télé.","I watch TV.");
S("g38",3,"mainichi nihongo を=obj benkyou.masu","J'étudie le japonais tous les jours.","I study Japanese every day.");
S("g38",3,"ongaku を=obj kiku.masu","J'écoute de la musique.","I listen to music.");
// g39 ません
S("g39",1,"niku を=obj taberu.masen","Je ne mange pas de viande.","I don't eat meat.");
S("g39",1,"biiru を=obj nomu.masen","Je ne bois pas de bière.","I don't drink beer.");
S("g39",2,"kyou は=top terebi を=obj miru.masen","Aujourd'hui, je ne regarde pas la télé.","Today I won't watch TV.");
S("g39",2,"ashita gakkou に=dest iku.masen","Demain, je ne vais pas à l'école.","Tomorrow I won't go to school.");
S("g39",3,"chichi は=top ryouri.masen","Mon père ne cuisine pas.","My father doesn't cook.");
// g40 ました
S("g40",1,"kinou eiga を=obj miru.mashita","Hier, j'ai vu un film.","Yesterday I watched a movie.");
S("g40",1,"asagohan を=obj taberu.mashita","J'ai pris mon petit-déjeuner.","I ate breakfast.");
S("g40",2,"senshuu toukyou に=dest iku.mashita","La semaine dernière, je suis allé à Tokyo.","Last week I went to Tokyo.");
S("g40",2,"kinou hon を=obj yomu.mashita","Hier, j'ai lu un livre.","Yesterday I read a book.");
S("g40",3,"tomodachi と=with sushi を=obj taberu.mashita","J'ai mangé des sushis avec un ami.","I ate sushi with a friend.");
// g41 ませんでした
S("g41",1,"kinou benkyou.masendeshita","Hier, je n'ai pas étudié.","Yesterday I didn't study.");
S("g41",1,"asagohan を=obj taberu.masendeshita","Je n'ai pas pris de petit-déjeuner.","I didn't eat breakfast.");
S("g41",2,"senshuu terebi を=obj miru.masendeshita","La semaine dernière, je n'ai pas regardé la télé.","Last week I didn't watch TV.");
S("g41",2,"yamada は=top kinou kuru.masendeshita","Mme Yamada n'est pas venue hier.","Ms Yamada didn't come yesterday.");
S("g41",3,"kinou は=top nani も=none taberu.masendeshita","Hier, je n'ai rien mangé.","Yesterday I ate nothing.");
// g42 で lieu d'action
S("g42",1,"resutoran で=place hirugohan を=obj taberu.masu","Je déjeune au restaurant.","I have lunch at a restaurant.");
S("g42",1,"toshokan で=place benkyou.masu","J'étudie à la bibliothèque.","I study at the library.");
S("g42",2,"uchi で=place terebi を=obj miru.masu","Je regarde la télé à la maison.","I watch TV at home.");
S("g42",2,"kissaten で=place koohii を=obj nomu.masu","Je bois un café au salon de thé.","I drink coffee at the coffee shop.");
S("g42",3,"kouen で=place tomodachi と=with asobu.masu","Je joue au parc avec des amis.","I play in the park with friends.");
S("g42",3,"depaato で=place kaimono.masu","Je fais des courses au grand magasin.","I shop at the department store.");
// g43 に destinataire
S("g43",1,"tomodachi に=iobj denwa.masu","Je téléphone à un ami.","I phone a friend.");
S("g43",1,"haha に=iobj tegami を=obj kaku.masu","J'écris une lettre à ma mère.","I write a letter to my mother.");
S("g43",2,"sensei に=iobj kiku.masu","Je demande au professeur.","I ask the teacher.");
S("g43",2,"ashita tanaka に=iobj au.masu","Demain, je rencontre M. Tanaka.","Tomorrow I meet Mr Tanaka.",{fr:"会います prend に : on « rencontre À quelqu'un ».",en:"会います takes に: you meet “to” someone."});
S("g43",3,"kodomo に=iobj purezento を=obj ageru.masu","Je donne un cadeau à l'enfant.","I give the child a present.");
// g44 ね
S("g44",1,"kyou は=top ame です ね=agree","Il pleut aujourd'hui, n'est-ce pas ?","It's rainy today, isn't it?");
S("g44",1,"ano hito は=top tanaka です ね=agree","Cette personne, c'est M. Tanaka, non ?","That's Mr Tanaka, right?");
S("g44",2,"kore は=top anata の=poss kasa です ね=agree","C'est ton parapluie, n'est-ce pas ?","This is your umbrella, right?");
S("g44",2,"ashita は=top yasumi です ね=agree","Demain, c'est congé, hein ?","Tomorrow is a day off, right?");
S("g44",3,"yamada は=top nihongo の=poss sensei です ね=agree","Mme Yamada est bien professeure de japonais ?","Ms Yamada teaches Japanese, doesn't she?");
// g45 よ
S("g45",1,"kono mise の=poss pan は=top hyakuen です よ=emph","Le pain de ce magasin coûte 100 yens, tu sais.","This shop's bread is 100 yen, you know.");
S("g45",2,"densha は=top kuji に=time kuru.masu よ=emph","Le train arrive à 9 h, je te préviens.","The train comes at 9, you know.");
S("g45",2,"asoko に=exist konbini が=subj aru.masu よ=emph","Il y a une supérette là-bas, tu sais.","There's a convenience store over there, you know.");
S("g45",3,"tanaka は=top kyou kuru.masen よ=emph","M. Tanaka ne vient pas aujourd'hui, tu sais.","Mr Tanaka isn't coming today, you know.");
// g46 fréquence
S("g46",1,"watashi は=top yoku eiga を=obj miru.masu","Je vois souvent des films.","I often watch movies.");
S("g46",1,"tokidoki resutoran で=place taberu.masu","Parfois, je mange au restaurant.","Sometimes I eat at a restaurant.");
S("g46",2,"haha は=top mainichi kouen を=path aruku.masu","Ma mère marche dans le parc tous les jours.","My mother walks in the park every day.");
S("g46",2,"watashi は=top amari terebi を=obj miru.masen","Je ne regarde pas beaucoup la télé.","I don't watch TV much.");
S("g46",3,"chichi は=top zenzen ryouri.masen","Mon père ne cuisine jamais.","My father never cooks.");
S("g46",3,"maiasa koohii を=obj nomu.masu","Chaque matin, je bois un café.","Every morning I drink coffee.");
// g47 もう・まだ
S("g47",1,"mou hirugohan を=obj taberu.mashita か=q","As-tu déjà déjeuné ?","Have you had lunch yet?");
S("g47",1,"hai 、 mou taberu.mashita","Oui, j'ai déjà mangé.","Yes, I already ate.");
S("g47",2,"iie 、 mada です","Non, pas encore.","No, not yet.",{fr:"La bonne réponse est まだです — pas 食べませんでした, qui signifierait « je n'ai pas mangé du tout ».",en:"The right answer is まだです — not 食べませんでした, which would mean you simply didn't eat."});
S("g47",2,"mou kuji です よ=emph","Il est déjà 9 h, tu sais !","It's already 9, you know!");
S("g47",3,"yamada は=top mada kuru.masen","Mme Yamada n'est pas encore là.","Ms Yamada hasn't come yet.");
// g48 ごろ・ぐらい
S("g48",1,"shichiji ごろ=about okiru.masu","Je me lève vers 7 h.","I get up around 7.");
S("g48",1,"juuji ごろ=about neru.masu","Je me couche vers 22 h.","I go to bed around 10.");
S("g48",2,"mainichi ichijikan ぐらい=about benkyou.masu","J'étudie environ une heure par jour.","I study about an hour every day.");
S("g48",2,"eki まで=until juppun ぐらい=about です","Jusqu'à la gare, il y a environ dix minutes.","It's about ten minutes to the station.");
S("g48",3,"sanji ごろ=about uchi に=dest kaeru.masu","Je rentre vers 15 h.","I go home around 3.");
// g49 に fréquence
S("g49",1,"isshuukan に=freq ikkai eiga を=obj miru.masu","Je vois un film une fois par semaine.","I watch a movie once a week.");
S("g49",2,"isshuukan に=freq sankai nihongo を=obj benkyou.masu","J'étudie le japonais trois fois par semaine.","I study Japanese three times a week.");
S("g49",2,"ichinichi に=freq nikai koohii を=obj nomu.masu","Je bois du café deux fois par jour.","I drink coffee twice a day.");
S("g49",3,"isshuukan に=freq nikai kouen を=path hashiru.masu","Je cours dans le parc deux fois par semaine.","I run in the park twice a week.");

/* ============ ARC 6 — 京都 ============ */
// g50 ませんか
S("g50",1,"isshoni hirugohan を=obj taberu.masenka","Voulez-vous déjeuner avec moi ?","Won't you have lunch with me?");
S("g50",1,"ashita eiga を=obj miru.masenka","Tu ne veux pas voir un film demain ?","Won't you watch a movie tomorrow?");
S("g50",2,"kissaten で=place koohii を=obj nomu.masenka","On prend un café au salon de thé ?","Won't you have a coffee at the coffee shop?");
S("g50",2,"nichiyoubi に=time kouen を=path sanpo.masenka","On se promène au parc dimanche ?","Won't you take a walk in the park on Sunday?");
S("g50",3,"isshoni toshokan で=place benkyou.masenka","On étudie ensemble à la bibliothèque ?","Shall we study together at the library?");
// g51 ましょう
S("g51",1,"iku.mashou","Allons-y !","Let's go!");
S("g51",1,"ee 、 taberu.mashou","Oui (familier), mangeons !","Yeah, let's eat!");
S("g51",2,"eki の=poss mae で=place au.mashou","Retrouvons-nous devant la gare.","Let's meet in front of the station.");
S("g51",2,"isshoni kaeru.mashou","Rentrons ensemble.","Let's go home together.");
S("g51",3,"sanji に=time au.mashou","Retrouvons-nous à 15 h.","Let's meet at 3.");
// g52 ましょうか
S("g52",1,"tetsudau.mashouka","Je vous aide ?","Shall I help you?");
S("g52",1,"nani を=obj taberu.mashouka","Qu'est-ce qu'on mange ?","What shall we eat?");
S("g52",2,"mado を=obj akeru.mashouka","J'ouvre la fenêtre ?","Shall I open the window?");
S("g52",2,"doko で=place au.mashouka","Où se retrouve-t-on ?","Where shall we meet?");
S("g52",3,"doa を=obj shimeru.mashouka","Je ferme la porte ?","Shall I close the door?");
// g53 たい
S("g53",1,"sushi を=obj taberu.tai","Je veux manger des sushis.","I want to eat sushi.");
S("g53",1,"nihon へ=dir iku.tai","Je veux aller au Japon.","I want to go to Japan.");
S("g53",2,"eiga を=obj miru.tai","Je veux voir un film.","I want to watch a movie.");
S("g53",2,"mizu を=obj nomu.tai","Je veux boire de l'eau.","I want to drink water.");
S("g53",3,"kyou は=top nani も=none suru.takunai","Aujourd'hui, je ne veux rien faire.","Today I don't want to do anything.");
S("g53",3,"nihongo で=means hanasu.tai","Je veux parler en japonais.","I want to speak in Japanese.");
// g54 に but du déplacement
S("g54",1,"eiga を=obj miru.stem に=purpose iku.masu","Je vais voir un film.","I'm going to see a movie.");
S("g54",2,"hirugohan を=obj taberu.stem に=purpose iku.masu","Je vais déjeuner.","I'm going out to have lunch.");
S("g54",2,"kaimono.noun に=purpose iku.masu","Je vais faire des courses.","I'm going shopping.");
S("g54",3,"tomodachi に=iobj au.stem に=purpose toukyou へ=dir iku.masu","Je vais à Tokyo voir un ami.","I'm going to Tokyo to meet a friend.");
S("g54",3,"oyogu.stem に=purpose umi へ=dir iku.masu","Je vais à la mer pour nager.","I'm going to the sea to swim.");
// g55 ほしい
S("g55",1,"mizu が=obj hoshii です","Je veux de l'eau.","I want some water.");
S("g55",1,"sumaho が=obj hoshii です","Je veux un smartphone.","I want a smartphone.");
S("g55",2,"okane が=obj hoshii です","Je veux de l'argent.","I want money.");
S("g55",2,"nani が=obj hoshii です か=q","Que veux-tu ?","What do you want?");
S("g55",3,"inu が=obj hoshii です","Je veux un chien.","I want a dog.");
// g56 何か・どこか
S("g56",1,"nanika taberu.masenka","On mange quelque chose ?","Shall we eat something?");
S("g56",1,"nanika nomu.tai","Je veux boire quelque chose.","I want to drink something.");
S("g56",2,"dokoka iku.tai","Je veux aller quelque part.","I want to go somewhere.");
S("g56",2,"dareka iru.masu か=q","Il y a quelqu'un ?","Is anyone there?");
S("g56",3,"nanika kau.mashouka","On achète quelque chose ?","Shall we buy something?");
// g57 か ou
S("g57",1,"koohii か=or ocha を=obj nomu.masu","Je bois du café ou du thé.","I drink coffee or tea.");
S("g57",2,"densha か=or basu で=means iku.masu","J'y vais en train ou en bus.","I go by train or bus.");
S("g57",2,"doyoubi か=or nichiyoubi に=time iku.mashou","Allons-y samedi ou dimanche.","Let's go on Saturday or Sunday.");
S("g57",3,"pan か=or gohan を=obj taberu.masu","Je mange du pain ou du riz.","I eat bread or rice.");
// g58 一緒に・みんなで
S("g58",1,"isshoni iku.mashou","Allons-y ensemble.","Let's go together.");
S("g58",1,"minna で=total utau.mashou","Chantons tous ensemble !","Let's all sing together!");
S("g58",2,"tomodachi と=with isshoni eiga を=obj miru.masu","Je vois un film avec un ami.","I watch a movie together with a friend.");
S("g58",2,"minna で=total hirugohan を=obj taberu.mashita","Nous avons tous déjeuné ensemble.","We all had lunch together.");
S("g58",3,"kazoku と=with isshoni nihon へ=dir iku.tai","Je veux aller au Japon avec ma famille.","I want to go to Japan with my family.");

/* ============ ARC 7 — 大阪 ============ */
// g59 i-adj です
S("g59",1,"kono hon は=top omoshiroi です","Ce livre est intéressant.","This book is interesting.");
S("g59",1,"fujisan は=top takai です","Le mont Fuji est haut.","Mt Fuji is tall.");
S("g59",2,"kyou は=top atsui です","Il fait chaud aujourd'hui.","It's hot today.");
S("g59",2,"kono pan は=top oishii です","Ce pain est bon.","This bread is tasty.");
S("g59",3,"nihongo は=top muzukashii です","Le japonais est difficile.","Japanese is difficult.");
S("g59",3,"sono kaban は=top yasui です","Ce sac est bon marché.","That bag is cheap.");
// g60 くない
S("g60",1,"kono hon は=top takai.kunai です","Ce livre n'est pas cher.","This book is not expensive.");
S("g60",1,"kyou は=top samui.kunai です","Il ne fait pas froid aujourd'hui.","It's not cold today.");
S("g60",2,"kono eiga は=top omoshiroi.kunai です","Ce film n'est pas intéressant.","This movie is not interesting.");
S("g60",2,"watashi の=poss heya は=top ookii.kunai です","Ma chambre n'est pas grande.","My room is not big.");
S("g60",3,"nihongo は=top muzukashii.kunai です よ=emph","Le japonais n'est pas difficile, tu sais !","Japanese isn't difficult, you know!");
// g61 かった
S("g61",1,"kinou は=top atsui.katta です","Hier, il faisait chaud.","Yesterday was hot.");
S("g61",1,"eiga は=top omoshiroi.katta です","Le film était intéressant.","The movie was interesting.");
S("g61",2,"sushi は=top oishii.katta です","Les sushis étaient bons.","The sushi was tasty.");
S("g61",2,"senshuu は=top isogashii.katta です","La semaine dernière, j'étais occupé.","Last week I was busy.");
S("g61",3,"tenki は=top ii.katta です","Il faisait beau.","The weather was good.",{fr:"いい est irrégulier : son passé est よかった, jamais ✕いかった.",en:"いい is irregular: its past is よかった, never ✕いかった."});
S("g61",3,"sono hon は=top takai.kunakatta です","Ce livre n'était pas cher.","That book wasn't expensive.");
// g62 na-adj
S("g62",1,"watashi は=top genki です","Je vais bien.","I am well.");
S("g62",1,"kono machi は=top shizuka です","Cette ville est calme.","This town is quiet.");
S("g62",2,"yamada は=top shinsetsu です","Mme Yamada est gentille.","Ms Yamada is kind.");
S("g62",2,"kyou は=top hima です","Aujourd'hui, je suis libre.","Today I'm free.");
S("g62",3,"toukyou は=top nigiyaka です","Tokyo est animée.","Tokyo is lively.");
S("g62",3,"kono heya は=top kirei desu.janai","Cette chambre n'est pas propre.","This room is not clean.");
// g63 adj + nom
S("g63",1,"ookii inu が=subj iru.masu","Il y a un gros chien.","There is a big dog.");
S("g63",1,"kirei.na hana です","C'est une jolie fleur.","It's a pretty flower.");
S("g63",2,"atarashii sumaho を=obj kau.mashita","J'ai acheté un nouveau smartphone.","I bought a new smartphone.");
S("g63",2,"yuumei.na resutoran で=place taberu.mashita","J'ai mangé dans un restaurant célèbre.","I ate at a famous restaurant.");
S("g63",3,"omoshiroi hon を=obj yomu.tai","Je veux lire un livre intéressant.","I want to read an interesting book.");
S("g63",3,"shinsetsu.na hito です ね=agree","C'est quelqu'un de gentil, n'est-ce pas ?","What a kind person, eh?");
// g64 とても・あまり
S("g64",1,"kono eiga は=top totemo omoshiroi です","Ce film est très intéressant.","This movie is very interesting.");
S("g64",1,"fujisan は=top totemo takai です","Le mont Fuji est très haut.","Mt Fuji is very tall.");
S("g64",2,"kono hon は=top amari omoshiroi.kunai です","Ce livre n'est pas très intéressant.","This book is not very interesting.");
S("g64",2,"kyou は=top amari samui.kunai です","Il ne fait pas très froid aujourd'hui.","It's not very cold today.");
S("g64",3,"toukyou は=top totemo nigiyaka です","Tokyo est très animée.","Tokyo is very lively.");
// g65 どうですか・どんな
S("g65",1,"nihon は=top dou です か=q","Comment est le Japon ?","How is Japan?");
S("g65",1,"shigoto は=top dou です か=q","Comment va le travail ?","How is work?");
S("g65",2,"donna hon を=obj yomu.masu か=q","Quel genre de livres lis-tu ?","What kind of books do you read?");
S("g65",2,"donna machi です か=q","C'est quel genre de ville ?","What kind of town is it?");
S("g65",3,"kono keeki は=top dou です か=q","Comment est ce gâteau ?","How is this cake?");
// g66 好き
S("g66",1,"inu が=obj suki です","J'aime les chiens.","I like dogs.");
S("g66",1,"watashi は=top ongaku が=obj suki です","J'aime la musique.","I like music.");
S("g66",2,"donna eiga が=obj suki です か=q","Quel genre de films aimes-tu ?","What kind of movies do you like?");
S("g66",2,"neko が=obj suki desu.janai","Je n'aime pas les chats.","I don't like cats.");
S("g66",3,"watashi は=top sushi が=obj daisuki です","J'adore les sushis.","I love sushi.");
S("g66",3,"chichi は=top biiru が=obj suki です","Mon père aime la bière.","My father likes beer.");
// g67 上手・下手・わかります
S("g67",1,"tanaka は=top ryouri.noun が=obj jouzu です","M. Tanaka cuisine bien.","Mr Tanaka is good at cooking.");
S("g67",1,"nihongo が=obj wakaru.masu","Je comprends le japonais.","I understand Japanese.");
S("g67",2,"watashi は=top uta が=obj heta です","Je chante mal.","I'm bad at singing.");
S("g67",2,"yamada は=top eigo が=obj jouzu です","Mme Yamada parle bien anglais.","Ms Yamada is good at English.");
S("g67",3,"watashi は=top nihongo が=obj sukoshi wakaru.masu","Je comprends un peu le japonais.","I understand a little Japanese.");
// g68 から parce que
S("g68",1,"takai です から=because 、 kau.masen","C'est cher, donc je n'achète pas.","It's expensive, so I won't buy it.");
S("g68",1,"isogashii です から=because 、 iku.masen","Je suis occupé, donc je n'y vais pas.","I'm busy, so I won't go.");
S("g68",2,"ame です から=because 、 uchi で=place terebi を=obj miru.masu","Il pleut, donc je regarde la télé à la maison.","It's raining, so I'll watch TV at home.");
S("g68",2,"kyou は=top hima です から=because 、 eiga を=obj miru.tai","Je suis libre aujourd'hui, donc je veux voir un film.","I'm free today, so I want to see a movie.");
S("g68",3,"oishii です から=because 、 yoku kono resutoran で=place taberu.masu","C'est bon, donc je mange souvent dans ce restaurant.","It's tasty, so I often eat at this restaurant.");
// g69 どうして
S("g69",1,"doushite です か=q","Pourquoi ?","Why?");
S("g69",1,"doushite iku.masen か=q","Pourquoi n'y vas-tu pas ?","Why aren't you going?");
S("g69",2,"doushite nihongo を=obj benkyou.masu か=q","Pourquoi étudies-tu le japonais ?","Why do you study Japanese?");
S("g69",2,"takai です から=because","Parce que c'est cher.","Because it's expensive.");
S("g69",3,"doushite kinou kuru.masendeshita か=q","Pourquoi n'es-tu pas venu hier ?","Why didn't you come yesterday?");

/* ============ ARC 8 — 広島 ============ */
// g70 より
S("g70",1,"hikouki は=top densha より=than hayai です","L'avion est plus rapide que le train.","The plane is faster than the train.");
S("g70",1,"toukyou は=top kyouto より=than ookii です","Tokyo est plus grande que Kyoto.","Tokyo is bigger than Kyoto.");
S("g70",2,"kono hon は=top sono hon より=than omoshiroi です","Ce livre est plus intéressant que celui-là.","This book is more interesting than that one.");
S("g70",2,"koohii は=top ocha より=than takai です","Le café est plus cher que le thé.","Coffee is more expensive than tea.");
S("g70",3,"nihongo は=top eigo より=than muzukashii です か=q","Le japonais est-il plus difficile que l'anglais ?","Is Japanese harder than English?");
// g71 どちら・のほうが
S("g71",1,"koohii と=and ocha と=and 、 dochira が=subj suki です か=q","Du café ou du thé, lequel préfères-tu ?","Coffee or tea — which do you like better?");
S("g71",1,"koohii の=poss hou が=subj suki です","Je préfère le café.","I like coffee better.");
S("g71",2,"densha と=and basu と=and 、 dochira が=subj hayai です か=q","Le train ou le bus, lequel est le plus rapide ?","Train or bus — which is faster?");
S("g71",2,"densha の=poss hou が=subj hayai です","Le train est plus rapide.","The train is faster.");
S("g71",3,"inu と=and neko と=and 、 dochira が=subj suki です か=q","Chiens ou chats, lesquels préfères-tu ?","Dogs or cats — which do you like better?");
// g72 いちばん
S("g72",1,"nani が=subj ichiban suki です か=q","Qu'est-ce que tu préfères ?","What do you like best?");
S("g72",1,"sushi が=subj ichiban suki です","Ce sont les sushis que je préfère.","I like sushi best.");
S("g72",2,"nihon で=place fujisan が=subj ichiban takai です","Au Japon, c'est le mont Fuji le plus haut.","In Japan, Mt Fuji is the tallest.");
S("g72",2,"kono mise の=poss keeki が=subj ichiban oishii です","Les gâteaux de ce magasin sont les meilleurs.","This shop's cakes are the best.");
S("g72",3,"dare が=subj ichiban jouzu です か=q","Qui est le plus doué ?","Who is the best?");
// g73 は contraste
S("g73",1,"niku は=contrast taberu.masu が=but 、 sakana は=contrast taberu.masen","Je mange de la viande, mais pas de poisson.","I eat meat, but not fish.");
S("g73",2,"koohii は=contrast nomu.masu が=but 、 biiru は=contrast nomu.masen","Je bois du café, mais pas de bière.","I drink coffee, but not beer.");
S("g73",2,"kyou は=contrast hima です が=but 、 ashita は=contrast isogashii です","Aujourd'hui je suis libre, mais demain je suis occupé.","Today I'm free, but tomorrow I'm busy.");
S("g73",3,"nihongo は=top omoshiroi です が=but 、 muzukashii です","Le japonais est intéressant, mais difficile.","Japanese is interesting, but difficult.");
S("g73",3,"terebi は=contrast amari miru.masen","La télé, je ne la regarde pas beaucoup.","TV, I don't watch much.");
// g74 だけ
S("g74",1,"hitotsu だけ=only aru.masu","Il n'y en a qu'un.","There is only one.");
S("g74",1,"mizu だけ=only nomu.masu","Je ne bois que de l'eau.","I drink only water.");
S("g74",2,"sukoshi だけ=only wakaru.masu","Je ne comprends qu'un peu.","I understand only a little.");
S("g74",2,"kyou だけ=only yasui です よ=emph","C'est en promo aujourd'hui seulement !","It's cheap today only!");
S("g74",3,"hitori だけ=only kuru.mashita","Une seule personne est venue.","Only one person came.");
// g75 なります
S("g75",1,"samui.ku naru.mashita","Il s'est mis à faire froid.","It got cold.");
S("g75",1,"atsui.ku naru.mashita","Il s'est mis à faire chaud.","It got hot.");
S("g75",2,"genki.ni naru.mashita","Je vais mieux.","I got better.");
S("g75",2,"ookii.ku naru.mashita","Il a grandi.","It got big.");
S("g75",3,"sensei に=become naru.tai","Je veux devenir professeur.","I want to become a teacher.");
// g76 そして・でも・それから
S("g76",1,"demo 、 oishii です","Mais c'est bon.","But it's tasty.");
S("g76",2,"soshite 、 kissaten で=place koohii を=obj nomu.mashita","Et puis, j'ai bu un café au salon de thé.","And then I had coffee at the coffee shop.");
S("g76",2,"sorekara 、 uchi に=dest kaeru.mashita","Ensuite, je suis rentré à la maison.","After that, I went home.");
S("g76",3,"demo 、 ashita は=top isogashii です","Mais demain, je suis occupé.","But tomorrow I'm busy.");
S("g76",3,"soshite 、 minna で=total bangohan を=obj taberu.mashita","Et nous avons tous dîné ensemble.","And we all had dinner together.");

/* ============ ARC 9 — 福岡 ============ */
// g77 て形
S("g77",1,"okiru.te 、 koohii を=obj nomu.masu","Je me lève et je bois un café.","I get up and drink coffee.");
S("g77",1,"uchi に=dest kaeru.te 、 terebi を=obj miru.masu","Je rentre et je regarde la télé.","I go home and watch TV.");
S("g77",2,"eki まで=until aruku.te 、 densha に=dest noru.masu","Je marche jusqu'à la gare et je prends le train.","I walk to the station and take the train.");
S("g77",2,"hon を=obj kau.te 、 uchi で=place yomu.mashita","J'ai acheté un livre et je l'ai lu à la maison.","I bought a book and read it at home.");
S("g77",3,"tomodachi に=iobj au.te 、 hirugohan を=obj taberu.mashita","J'ai retrouvé un ami et nous avons déjeuné.","I met a friend and we had lunch.");
// g78 てください
S("g78",1,"chotto matsu.te kudasai","Attendez un instant, s'il vous plaît.","Please wait a moment.");
S("g78",1,"kore を=obj miru.te kudasai","Regardez ceci, s'il vous plaît.","Please look at this.");
S("g78",2,"mou ichido iu.te kudasai","Répétez, s'il vous plaît.","Please say it again.");
S("g78",2,"namae を=obj kaku.te kudasai","Écrivez votre nom, s'il vous plaît.","Please write your name.");
S("g78",3,"yukkuri hanasu.te kudasai","Parlez lentement, s'il vous plaît.","Please speak slowly.");
S("g78",3,"mado を=obj akeru.te kudasai","Ouvrez la fenêtre, s'il vous plaît.","Please open the window.");
// g79 ています (en cours)
S("g79",1,"ima gohan を=obj taberu.teimasu","Je suis en train de manger.","I am eating right now.");
S("g79",1,"ima nani を=obj suru.teimasu か=q","Qu'est-ce que tu fais, là ?","What are you doing now?");
S("g79",2,"haha は=top denwa.teimasu","Ma mère est au téléphone.","My mother is on the phone.");
S("g79",2,"kodomo は=top niwa で=place asobu.teimasu","Les enfants jouent dans le jardin.","The children are playing in the garden.");
S("g79",3,"ima hon を=obj yomu.teimasu","Je suis en train de lire.","I am reading now.");
// g80 ています (état)
S("g80",1,"toukyou に=exist sumu.teimasu","J'habite à Tokyo.","I live in Tokyo.");
S("g80",1,"kaisha で=place hataraku.teimasu","Je travaille dans une entreprise.","I work at a company.");
S("g80",2,"tanaka を=obj shiru.teimasu","Je connais M. Tanaka.","I know Mr Tanaka.",{fr:"知っています = je connais. Le savoir est un ÉTAT qui dure, d'où ています.",en:"知っています = I know. Knowing is a lasting STATE, hence ています."});
S("g80",2,"chichi は=top ginkou で=place hataraku.teimasu","Mon père travaille dans une banque.","My father works at a bank.");
S("g80",3,"watashi は=top furansu に=exist sumu.teimasu","J'habite en France.","I live in France.");
// g81 てもいいですか
S("g81",1,"hairu.te ~もいいですか","Puis-je entrer ?","May I come in?");
S("g81",1,"shashin を=obj toru.te ~もいいですか","Puis-je prendre une photo ?","May I take a photo?");
S("g81",2,"koko で=place taberu.te ~もいいですか","Puis-je manger ici ?","May I eat here?");
S("g81",2,"kono pen を=obj tsukau.te ~もいいですか","Puis-je utiliser ce stylo ?","May I use this pen?");
S("g81",3,"hai 、 ii です よ=emph","Oui, bien sûr !","Yes, sure!");
// g82 てはいけません
S("g82",1,"koko で=place shashin を=obj toru.te ~はいけません","Interdit de photographier ici.","You must not take photos here.");
S("g82",1,"koko に=dest hairu.te ~はいけません","Interdit d'entrer ici.","You must not enter here.");
S("g82",2,"toshokan で=place hanasu.te ~はいけません","Interdit de parler à la bibliothèque.","You must not talk in the library.");
S("g82",2,"koko で=place taberu.te ~はいけません","Interdit de manger ici.","You must not eat here.");
S("g82",3,"kono mizu を=obj nomu.te ~はいけません","Il ne faut pas boire cette eau.","You must not drink this water.");
// g83 て、て
S("g83",1,"asa okiru.te 、 pan を=obj taberu.te 、 gakkou へ=dir iku.masu","Le matin, je me lève, je mange du pain et je vais à l'école.","In the morning I get up, eat bread and go to school.");
S("g83",2,"uchi に=dest kaeru.te 、 bangohan を=obj taberu.te 、 neru.masu","Je rentre, je dîne et je me couche.","I go home, have dinner and sleep.");
S("g83",2,"kinou tomodachi に=iobj au.te 、 eiga を=obj miru.mashita","Hier, j'ai retrouvé un ami et nous avons vu un film.","Yesterday I met a friend and we watched a movie.");
S("g83",3,"eki に=dest iku.te 、 kippu を=obj kau.te 、 densha に=dest noru.mashita","Je suis allé à la gare, j'ai acheté un billet et j'ai pris le train.","I went to the station, bought a ticket and got on the train.");
S("g83",3,"asagohan を=obj taberu.te 、 shigoto に=dest iku.masu","Je prends mon petit-déjeuner et je vais au travail.","I have breakfast and go to work.");
// g84 てから
S("g84",1,"gohan を=obj taberu.te ~から 、 benkyou.masu","J'étudie après avoir mangé.","I study after eating.");
S("g84",1,"te を=obj arau.te ~から 、 gohan を=obj taberu.masu","Je me lave les mains avant de manger.","I wash my hands and then eat.");
S("g84",2,"shigoto が=subj owaru.te ~から 、 kaimono.noun に=purpose iku.masu","Après le travail, je vais faire des courses.","After work I go shopping.");
S("g84",2,"uchi に=dest kaeru.te ~から 、 terebi を=obj miru.masu","Une fois rentré, je regarde la télé.","After getting home I watch TV.");
S("g84",3,"bangohan を=obj taberu.te ~から 、 sanpo.masu","Après le dîner, je me promène.","After dinner I take a walk.");
// g85 をください
S("g85",1,"kore を=obj kudasai","Je prends ceci, s'il vous plaît.","This one, please.");
S("g85",1,"mizu を=obj kudasai","De l'eau, s'il vous plaît.","Water, please.");
S("g85",2,"koohii を=obj kudasai","Un café, s'il vous plaît.","Coffee, please.");
S("g85",2,"ringo を=obj mittsu kudasai","Trois pommes, s'il vous plaît.","Three apples, please.");
S("g85",3,"sore を=obj futatsu kudasai","Deux comme cela, s'il vous plaît.","Two of those, please.");
// g86 くて・で
S("g86",1,"kono mise は=top yasui.kute 、 oishii です","Ce restaurant est bon marché et bon.","This place is cheap and tasty.");
S("g86",1,"kono heya は=top hiroi.kute 、 kirei です","Cette chambre est spacieuse et propre.","This room is spacious and clean.");
S("g86",2,"yamada は=top shinsetsu.de 、 omoshiroi hito です","Mme Yamada est gentille et intéressante.","Ms Yamada is kind and interesting.");
S("g86",2,"toukyou は=top ookii.kute 、 nigiyaka.na machi です","Tokyo est une ville grande et animée.","Tokyo is a big, lively city.");
S("g86",3,"kono hon は=top yasui.kute 、 omoshiroi です","Ce livre est bon marché et intéressant.","This book is cheap and interesting.");

/* ============ ARC 10 — 北海道 ============ */
// g87 辞書形
S("g87",1,"ashita toukyou へ=dir iku","Demain, je vais à Tokyo. (familier)","Tomorrow I'm going to Tokyo. (casual)");
S("g87",1,"maiban juuji に=time neru","Je me couche à 22 h tous les soirs. (familier)","I go to bed at 10 every night. (casual)");
S("g87",2,"kyou は=top uchi で=place benkyou","Aujourd'hui, j'étudie à la maison. (familier)","Today I study at home. (casual)");
S("g87",2,"mainichi koohii を=obj nomu","Je bois du café tous les jours. (familier)","I drink coffee every day. (casual)");
S("g87",3,"tomodachi が=subj raishuu kuru","Un ami vient la semaine prochaine. (familier)","A friend is coming next week. (casual)");
// g88 ことができます
S("g88",1,"nihongo を=obj hanasu ~ことができます","Je sais parler japonais.","I can speak Japanese.");
S("g88",2,"watashi は=top oyogu ~ことができます","Je sais nager.","I can swim.");
S("g88",2,"sushi を=obj tsukuru ~ことができます","Je sais faire des sushis.","I can make sushi.");
S("g88",3,"koko で=place kippu を=obj kau ~ことができます","On peut acheter des billets ici.","You can buy tickets here.");
S("g88",3,"chichi は=top furansugo を=obj hanasu ~ことができます","Mon père sait parler français.","My father can speak French.");
// g89 前に
S("g89",1,"neru mae に=time 、 hon を=obj yomu.masu","Avant de dormir, je lis.","Before sleeping, I read.");
S("g89",1,"taberu mae に=time 、 te を=obj arau.masu","Avant de manger, je me lave les mains.","Before eating, I wash my hands.");
S("g89",2,"dekakeru mae に=time 、 tenki を=obj miru.masu","Avant de sortir, je regarde la météo.","Before going out, I check the weather.");
S("g89",2,"shigoto の=poss mae に=time 、 koohii を=obj nomu.masu","Avant le travail, je bois un café.","Before work, I drink coffee.");
S("g89",3,"neru mae に=time 、 sumaho を=obj miru.masen","Avant de dormir, je ne regarde pas mon téléphone.","Before sleeping, I don't look at my phone.");
// g90 ない形
S("g90",1,"ashita は=top iku.nai","Demain, je n'y vais pas. (familier)","Tomorrow I'm not going. (casual)");
S("g90",1,"niku を=obj taberu.nai","Je ne mange pas de viande. (familier)","I don't eat meat. (casual)");
S("g90",2,"terebi を=obj miru.nai","Je ne regarde pas la télé. (familier)","I don't watch TV. (casual)");
S("g90",2,"asa koohii を=obj nomu.nai","Le matin, je ne bois pas de café. (familier)","I don't drink coffee in the morning. (casual)");
S("g90",3,"zenzen wakaru.nai","Je ne comprends rien du tout. (familier)","I don't understand at all. (casual)");
// g91 ないでください
S("g91",1,"shinpai.naide kudasai","Ne vous inquiétez pas.","Please don't worry.");
S("g91",1,"koko で=place shashin を=obj toru.naide kudasai","Ne prenez pas de photos ici, s'il vous plaît.","Please don't take photos here.");
S("g91",2,"koko に=dest hairu.naide kudasai","N'entrez pas ici, s'il vous plaît.","Please don't come in here.");
S("g91",2,"mado を=obj akeru.naide kudasai","N'ouvrez pas la fenêtre, s'il vous plaît.","Please don't open the window.");
S("g91",3,"wasureru.naide kudasai","N'oubliez pas, s'il vous plaît.","Please don't forget.");
// g92 なければなりません
S("g92",1,"mou kaeru.nakereba ~なりません","Je dois déjà rentrer.","I have to go home now.");
S("g92",1,"kyou benkyou.nakereba ~なりません","Je dois étudier aujourd'hui.","I must study today.");
S("g92",2,"kusuri を=obj nomu.nakereba ~なりません","Je dois prendre mon médicament.","I must take my medicine.");
S("g92",2,"ashita hayai.ku okiru.nakereba ~なりません","Demain, je dois me lever tôt.","Tomorrow I must get up early.");
S("g92",3,"ashita gakkou に=dest iku.nakereba ~なりません","Demain, je dois aller à l'école.","Tomorrow I must go to school.");
// g93 なくてもいいです
S("g93",1,"ashita kuru.nakutemo ~いいです","Tu n'es pas obligé de venir demain.","You don't have to come tomorrow.");
S("g93",1,"isogu.nakutemo ~いいです","Pas besoin de se dépêcher.","No need to hurry.");
S("g93",2,"zenbu taberu.nakutemo ~いいです","Tu n'es pas obligé de tout manger.","You don't have to eat everything.");
S("g93",2,"kyou は=top hataraku.nakutemo ~いいです","Aujourd'hui, tu n'es pas obligé de travailler.","Today you don't have to work.");
S("g93",3,"kau.nakutemo ~いいです","Tu n'es pas obligé de l'acheter.","You don't have to buy it.");
// g94 た形
S("g94",1,"kinou eiga を=obj miru.ta","Hier, j'ai vu un film. (familier)","Yesterday I watched a movie. (casual)");
S("g94",1,"asagohan を=obj taberu.ta","J'ai pris mon petit-déjeuner. (familier)","I had breakfast. (casual)");
S("g94",2,"senshuu toukyou へ=dir iku.ta","La semaine dernière, je suis allé à Tokyo. (familier)","Last week I went to Tokyo. (casual)");
S("g94",2,"tomodachi と=with hanasu.ta","J'ai parlé avec un ami. (familier)","I talked with a friend. (casual)");
S("g94",3,"kinou は=top totemo atsui.katta","Hier, il faisait très chaud. (familier)","Yesterday was really hot. (casual)");
// g95 たことがあります
S("g95",1,"nihon へ=dir iku.ta ~ことがあります","Je suis déjà allé au Japon.","I have been to Japan.");
S("g95",1,"sushi を=obj taberu.ta ~ことがあります","J'ai déjà mangé des sushis.","I have eaten sushi before.");
S("g95",2,"fujisan を=obj miru.ta ~ことがあります","J'ai déjà vu le mont Fuji.","I have seen Mt Fuji.");
S("g95",2,"kyouto に=dest iku.ta ~ことがあります か=q","Es-tu déjà allé à Kyoto ?","Have you ever been to Kyoto?");
S("g95",3,"yamada に=iobj au.ta ~ことがあります","J'ai déjà rencontré Mme Yamada.","I have met Ms Yamada before.");
// g96 たり～たり
S("g96",1,"shuumatsu は=top hon を=obj yomu.tari 、 eiga を=obj miru.tari suru.masu","Le week-end, je lis, je regarde des films…","On weekends I read, watch movies and so on.");
S("g96",2,"nichiyoubi は=top sanpo.tari 、 kaimono.tari suru.masu","Le dimanche, je me promène, je fais des courses…","On Sundays I take walks, go shopping and so on.");
S("g96",2,"uchi で=place ongaku を=obj kiku.tari 、 ryouri.tari suru.masu","À la maison, j'écoute de la musique, je cuisine…","At home I listen to music, cook and so on.");
S("g96",3,"tomodachi と=with hanasu.tari 、 asobu.tari suru.mashita","Avec mes amis, on a discuté, on s'est amusés…","With my friends we talked, hung out and so on.");
// g97 と思います
S("g97",1,"ashita は=top ame desu.da と=quote omou.masu","Je pense qu'il pleuvra demain.","I think it will rain tomorrow.");
S("g97",1,"kono eiga は=top omoshiroi と=quote omou.masu","Je pense que ce film est intéressant.","I think this movie is interesting.");
S("g97",2,"tanaka は=top kuru と=quote omou.masu","Je pense que M. Tanaka viendra.","I think Mr Tanaka will come.");
S("g97",2,"nihongo は=top muzukashii.kunai と=quote omou.masu","Je pense que le japonais n'est pas difficile.","I don't think Japanese is difficult.");
S("g97",3,"yamada は=top mou kaeru.ta と=quote omou.masu","Je pense que Mme Yamada est déjà rentrée.","I think Ms Yamada has already gone home.");
// g98 と言いました
S("g98",1,"tanaka は=top ashita kuru と=quote iu.mashita","M. Tanaka a dit qu'il viendrait demain.","Mr Tanaka said he would come tomorrow.");
S("g98",2,"yamada は=top isogashii と=quote iu.mashita","Mme Yamada a dit qu'elle était occupée.","Ms Yamada said she was busy.");
S("g98",2,"kodomo は=top nan と=quote iu.mashita か=q","Qu'a dit l'enfant ?","What did the child say?");
S("g98",3,"sensei は=top ashita は=contrast yasumi desu.da と=quote iu.mashita","Le professeur a dit que demain c'était congé.","The teacher said tomorrow is a day off.");
S("g98",3,"tomodachi は=top kono eiga は=contrast omoshiroi と=quote iu.mashita","Mon ami a dit que ce film était intéressant.","My friend said this movie is interesting.");
// g99 でしょう
S("g99",1,"ashita は=top hare desu.deshou","Demain, il fera sans doute beau.","Tomorrow will probably be sunny.");
S("g99",1,"ashita は=top ame desu.deshou","Demain, il pleuvra sans doute.","Tomorrow it will probably rain.");
S("g99",2,"raishuu は=top samui desu.deshou","La semaine prochaine, il fera sans doute froid.","Next week will probably be cold.");
S("g99",2,"tanaka は=top kuru desu.deshou","M. Tanaka viendra sans doute.","Mr Tanaka will probably come.");
S("g99",3,"kono hon は=top takai desu.deshou","Ce livre est sans doute cher.","This book is probably expensive.");
// g100 だ・普通体
S("g100",1,"watashi は=top gakusei desu.da","Je suis étudiant. (familier)","I'm a student. (casual)");
S("g100",1,"kore は=top watashi の=poss hon desu.da","C'est mon livre. (familier)","This is my book. (casual)");
S("g100",2,"ashita mata kuru","Je reviens demain. (familier)","I'll come again tomorrow. (casual)");
S("g100",2,"kono keeki は=top oishii ね=agree","Ce gâteau est bon, hein ! (familier)","This cake is good, eh! (casual)");
S("g100",3,"ima uchi に=exist iru","Je suis à la maison, là. (familier)","I'm home now. (casual)");

/* ============================================================================
 * APPENDIX — kanji the carnet listed but the corpus never wrote (v3.2.0)
 *
 * Twenty-six of the 111 kanji in the library grid appeared in no sentence at
 * all, so their lens opened on "0 phrases" and neither 読み nor 漢字-fill could
 * ever ask about them. These sentences close that gap.
 *
 * WHY THEY ARE DOWN HERE AND NOT BESIDE THEIR OWN GRAMMAR POINT:
 * a sentence's index IS its identity — notes.js is keyed by it and the save's
 * sentSeen map is keyed by it. Inserting one in the middle would renumber every
 * sentence after it and silently rewrite what the learner has already seen.
 * The engine reaches sentences through sentencesFor(gp), which filters rather
 * than slices, so file position is irrelevant to it. Order here is by grammar
 * point, so this block still reads in journey order.
 * ========================================================================== */

/* --- 東京 --- */
// g06 AのB
S("g06",2,"tanaka の=poss kuni は=top nihon です","Le pays de M. Tanaka, c'est le Japon.","Mr Tanaka's country is Japan.");
// g14 どこですか
S("g14",1,"anata の=poss kuni は=top doko です か=q","De quel pays viens-tu ?","What country are you from?");

/* --- 横浜 --- */
// g17 いくらですか
S("g17",2,"kono kaban は=top ichiman-en です","Ce sac coûte 10 000 yens.","This bag costs 10,000 yen.");
S("g17",3,"sono tokei は=top ichiman-en です か=q","Cette montre coûte-t-elle 10 000 yens ?","Does that watch cost 10,000 yen?");
// g18 何時ですか
S("g18",1,"ima rokuji です","Il est six heures.","It is six o'clock.");
S("g18",2,"gozen hachiji です","Il est huit heures du matin.","It is eight in the morning.");
// g19 何曜日ですか
S("g19",2,"mokuyoubi は=top yasumi です","Le jeudi, c'est congé.","Thursday is a day off.");
S("g19",3,"raishuu の=poss mokuyoubi は=top tanjoubi です","Jeudi prochain, c'est mon anniversaire.","Next Thursday is my birthday.");

/* --- 鎌倉 --- */
// g21 ～がいます
S("g21",1,"otokonohito が=subj iru.masu","Il y a un homme.","There is a man.");
S("g21",2,"onnanohito が=subj iru.masu か=q","Y a-t-il une femme ?","Is there a woman?");
// g22 場所に～があります
S("g22",1,"soto に=exist inu が=subj iru.masu","Il y a un chien dehors.","There is a dog outside.");
S("g22",2,"kyouto に=exist kawa が=subj aru.masu","Il y a une rivière à Kyoto.","There is a river in Kyoto.");
S("g22",3,"machi の=poss higashi に=exist yama が=subj aru.masu","À l'est de la ville, il y a une montagne.","There is a mountain east of the town.");
// g23 上・下・中・前・後ろ
S("g23",1,"eki の=poss migi に=exist ginkou が=subj aru.masu","Il y a une banque à droite de la gare.","There is a bank to the right of the station.");
S("g23",2,"mise の=poss hidari に=exist kouen が=subj aru.masu","Il y a un parc à gauche du magasin.","There is a park to the left of the shop.");
S("g23",2,"gakkou の=poss soto に=exist gakusei が=subj iru.masu","Il y a des étudiants à l'extérieur de l'école.","There are students outside the school.");
S("g23",3,"gakkou の=poss nishi に=exist hoteru が=subj aru.masu","Il y a un hôtel à l'ouest de l'école.","There is a hotel west of the school.");
S("g23",3,"kouen の=poss minami に=exist kawa が=subj aru.masu","Il y a une rivière au sud du parc.","There is a river south of the park.");
// g26 一つ・二人・三本…
S("g26",2,"onnanohito が=subj futari iru.masu","Il y a deux femmes.","There are two women.");
S("g26",3,"otokonohito が=subj sannin iru.masu","Il y a trois hommes.","There are three men.");

/* --- 富士山 --- */
// g33 から・まで
S("g33",3,"nihon は=top kita から=from minami まで=until nagai です","Le Japon est long, du nord au sud.","Japan is long, from north to south.");
// g36 七時に
S("g36",1,"rokuji に=time okiru.masu","Je me lève à six heures.","I get up at six.");
S("g36",2,"hachiji に=time gakkou へ=dir iku.masu","Je vais à l'école à huit heures.","I go to school at eight.");

/* --- 名古屋 --- */
// g40 ～ました
S("g40",2,"kyonen nihon に=dest iku.mashita","L'année dernière, je suis allé au Japon.","Last year I went to Japan.");
// g41 ～ませんでした
S("g41",2,"kyonen は=top umi に=dest iku.masendeshita","L'année dernière, je ne suis pas allé à la mer.","Last year I didn't go to the sea.");
// g42 場所で～ます
S("g42",2,"kawa で=place asobu.mashita","Nous avons joué à la rivière.","We played at the river.");

/* --- 大阪 --- */
// g59 高いです
S("g59",1,"sora は=top aoi です","Le ciel est bleu.","The sky is blue.");
S("g59",1,"me が=subj itai です","J'ai mal aux yeux.","My eyes hurt.");
S("g59",2,"kono kawa は=top nagai です","Cette rivière est longue.","This river is long.");
S("g59",2,"kono uchi は=top furui です","Cette maison est vieille.","This house is old.");
S("g59",2,"kodomo は=top me が=subj ookii です","Les enfants ont de grands yeux.","Children have big eyes.");
S("g59",3,"kono inu は=top ashi が=subj nagai です","Ce chien a de longues pattes.","This dog has long legs.");
// g60 高くないです
S("g60",2,"kono michi は=top nagai.kunai です","Cette route n'est pas longue.","This road is not long.");
// g61 高かったです
S("g61",2,"kinou は=top ashi が=subj itai.katta です","Hier, j'avais mal aux jambes.","My legs hurt yesterday.");
S("g61",3,"sono hoteru は=top furui.katta です","Cet hôtel était vieux.","That hotel was old.");
// g62 元気です
S("g62",2,"kyou は=top sora が=subj kirei です","Aujourd'hui, le ciel est beau.","The sky is beautiful today.");
// g63 大きい犬・元気な人
S("g63",2,"shiroi hana を=obj kau.mashita","J'ai acheté des fleurs blanches.","I bought white flowers.");
S("g63",2,"chiisai mise で=place pan を=obj kau.mashita","J'ai acheté du pain dans un petit magasin.","I bought bread at a small shop.");
S("g63",3,"shiroi kuruma が=obj hoshii です","Je veux une voiture blanche.","I want a white car.");
// g64 とても・あまり
S("g64",2,"kyou は=top hito が=subj totemo ooi です","Aujourd'hui, il y a vraiment beaucoup de monde.","There are a lot of people today.");
S("g64",3,"kono inu は=top mimi が=subj totemo ookii です","Ce chien a de très grandes oreilles.","This dog has very big ears.");
S("g64",3,"kono machi は=top mise が=subj ooi です","Dans cette ville, les magasins sont nombreux.","This town has a lot of shops.");
// g65 どうですか・どんな
S("g65",2,"donna kuni です か=q","C'est quel genre de pays ?","What kind of country is it?");

/* --- 広島 --- */
// g70 AはBより
S("g70",2,"kita は=top minami より=than samui です","Le nord est plus froid que le sud.","The north is colder than the south.");
S("g70",3,"nishi の=poss machi は=top higashi の=poss machi より=than shizuka です","La ville de l'ouest est plus calme que celle de l'est.","The western town is quieter than the eastern one.");
// g72 ～がいちばん
S("g72",3,"nihon で=place kita が=subj ichiban samui です","Au Japon, c'est le nord le plus froid.","In Japan, the north is the coldest.");
// g73 ～は～が、～は～
S("g73",2,"natsu は=contrast minami へ=dir iku.masu が=but 、 fuyu は=contrast kita へ=dir iku.masu","En été je vais dans le sud, en hiver dans le nord.","In summer I go south, in winter I go north.");
S("g73",3,"inu は=contrast mimi が=subj ookii です が=but 、 neko は=contrast chiisai です","Le chien a de grandes oreilles, le chat les a petites.","Dogs have big ears, cats have small ones.");

/* --- 福岡 --- */
// g78 ～てください
S("g78",1,"kuchi を=obj akeru.te kudasai","Ouvrez la bouche, s'il vous plaît.","Please open your mouth.");
S("g78",2,"migi を=obj miru.te kudasai","Regardez à droite, s'il vous plaît.","Please look to the right.");
S("g78",2,"hidari に=dest iku.te kudasai","Allez à gauche, s'il vous plaît.","Please go left.");
S("g78",3,"koko に=exist tatsu.te kudasai","Tenez-vous ici, s'il vous plaît.","Please stand here.");
// g80 ～ています (état)
S("g80",3,"eki の=poss mae に=exist onnanohito が=subj tatsu.teimasu","Une femme est debout devant la gare.","A woman is standing in front of the station.");
// g81 ～てもいいですか
S("g81",2,"soto に=dest deru.te ~もいいですか","Puis-je sortir dehors ?","May I go outside?");
// g83 ～て、～て
S("g83",3,"kuchi を=obj akeru.te 、 kusuri を=obj nomu.mashita","J'ai ouvert la bouche et j'ai pris le médicament.","I opened my mouth and took the medicine.");

if (typeof module !== "undefined") module.exports = { SENTENCES };
