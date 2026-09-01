/* Kakibun — conjugation engine.
 * Conj.verb(entry, form) → {k, r}  (k = kanji surface or null, r = kana)
 * Works on both the kanji surface and the kana reading in parallel, so
 * furigana alignment survives conjugation.
 *
 * Verb forms: dict stem masu masen mashita masendeshita masenka mashou mashouka
 *             tai takunai te ta nai nakatta naide nakereba nakutemo teimasu
 * i-adj forms: base kunai katta kunakatta kute ku
 * copula forms: desu deshita janai janakatta da deshou de
 */
const Conj = (() => {

  // godan: ending → [a-row, i-row, te, ta]
  const GODAN = {
    "う":["わ","い","って","った"], "く":["か","き","いて","いた"], "ぐ":["が","ぎ","いで","いだ"],
    "す":["さ","し","して","した"], "つ":["た","ち","って","った"], "ぬ":["な","に","んで","んだ"],
    "ぶ":["ば","び","んで","んだ"], "む":["ま","み","んで","んだ"], "る":["ら","り","って","った"]
  };

  // build from stem pieces: {a,i,te,ta,dict} each as {k,r} suffix-applied strings
  function assemble(form, p) {
    // p: {dict:{k,r}, a:{k,r}, i:{k,r}, te:{k,r}, ta:{k,r}}
    const add = (base, suf) => base == null ? null : base + suf;
    const F = {
      dict:   () => p.dict,
      stem:   () => p.i,
      masu:   () => ({ k:add(p.i.k,"ます"), r:p.i.r+"ます" }),
      masen:  () => ({ k:add(p.i.k,"ません"), r:p.i.r+"ません" }),
      mashita:() => ({ k:add(p.i.k,"ました"), r:p.i.r+"ました" }),
      masendeshita:() => ({ k:add(p.i.k,"ませんでした"), r:p.i.r+"ませんでした" }),
      masenka:() => ({ k:add(p.i.k,"ませんか"), r:p.i.r+"ませんか" }),
      mashou: () => ({ k:add(p.i.k,"ましょう"), r:p.i.r+"ましょう" }),
      mashouka:() => ({ k:add(p.i.k,"ましょうか"), r:p.i.r+"ましょうか" }),
      tai:    () => ({ k:add(p.i.k,"たいです"), r:p.i.r+"たいです" }),
      takunai:() => ({ k:add(p.i.k,"たくないです"), r:p.i.r+"たくないです" }),
      te:     () => p.te,
      ta:     () => p.ta,
      teimasu:() => ({ k:add(p.te.k,"います"), r:p.te.r+"います" }),
      nai:    () => ({ k:add(p.a.k,"ない"), r:p.a.r+"ない" }),
      nakatta:() => ({ k:add(p.a.k,"なかった"), r:p.a.r+"なかった" }),
      naide:  () => ({ k:add(p.a.k,"ないで"), r:p.a.r+"ないで" }),
      nakereba:() => ({ k:add(p.a.k,"なければ"), r:p.a.r+"なければ" }),
      nakutemo:() => ({ k:add(p.a.k,"なくても"), r:p.a.r+"なくても" }),
      tari:   () => ({ k:add(p.ta.k,"り"), r:p.ta.r+"り" }),
      tekudasai:() => ({ k:add(p.te.k,"ください"), r:p.te.r+"ください" }),
      temoii: () => ({ k:add(p.te.k,"もいいです"), r:p.te.r+"もいいです" }),
      tewaikemasen:() => ({ k:add(p.te.k,"はいけません"), r:p.te.r+"はいけません" }),
      tekara: () => ({ k:add(p.te.k,"から"), r:p.te.r+"から" }),
      naidekudasai:() => ({ k:add(p.a.k,"ないでください"), r:p.a.r+"ないでください" }),
      nakerebanarimasen:() => ({ k:add(p.a.k,"なければなりません"), r:p.a.r+"なければなりません" }),
      nakutemoiidesu:() => ({ k:add(p.a.k,"なくてもいいです"), r:p.a.r+"なくてもいいです" }),
      takotoga:() => ({ k:add(p.ta.k,"ことがあります"), r:p.ta.r+"ことがあります" })
    };
    const f = F[form];
    if (!f) throw new Error("unknown verb form: " + form);
    return f();
  }

  function verbPieces(entry) {
    const k = entry.k, r = entry.r;
    const cut = (s) => s == null ? null : s.slice(0, -1);
    if (entry.pos === "v1") {
      const bk = cut(k), br = cut(r);
      return { dict:{k,r}, a:{k:bk,r:br}, i:{k:bk,r:br},
               te:{k:bk==null?null:bk+"て", r:br+"て"}, ta:{k:bk==null?null:bk+"た", r:br+"た"} };
    }
    if (entry.pos === "v5") {
      const last = r.slice(-1), bk = cut(k), br = cut(r);
      const g = GODAN[last];
      if (!g) throw new Error("bad godan ending: " + entry.id);
      let te = g[2], ta = g[3];
      if (entry.irr === "iku") { te = "って"; ta = "った"; }
      const pieces = {
        dict:{k,r},
        a:{k:bk==null?null:bk+g[0], r:br+g[0]},
        i:{k:bk==null?null:bk+g[1], r:br+g[1]},
        te:{k:bk==null?null:bk+te, r:br+te},
        ta:{k:bk==null?null:bk+ta, r:br+ta}
      };
      if (entry.irr === "aru") { pieces.a = {k:null, r:""}; } // ある → ない
      return pieces;
    }
    if (entry.pos === "vk") { // 来る
      return { dict:{k:"来る",r:"くる"}, a:{k:"来",r:"こ"}, i:{k:"来",r:"き"},
               te:{k:"来て",r:"きて"}, ta:{k:"来た",r:"きた"} };
    }
    if (entry.pos === "vs" || entry.pos === "vs0") { // noun + する
      const nk = entry.pos === "vs" ? (entry.k != null ? entry.k : null) : "";
      const nr = entry.pos === "vs" ? entry.r : "";
      const P = (kk, rr) => ({ k: (entry.pos==="vs" && nk==null) ? null : (nk||"") + kk, r: nr + rr });
      return { dict:P("する","する"), a:P("し","し"), i:P("し","し"), te:P("して","して"), ta:P("した","した") };
    }
    throw new Error("not a verb: " + entry.id);
  }

  function verb(entry, form) {
    if (form === "noun" && entry.pos === "vs") return { k: entry.k, r: entry.r };
    const p = verbPieces(entry);
    if (entry.irr === "aru" && (form === "nai" || form === "nakatta")) {
      return form === "nai" ? {k:null,r:"ない"} : {k:null,r:"なかった"};
    }
    return assemble(form || "dict", p);
  }

  function adji(entry, form) {
    const k = entry.k, r = entry.r;
    let bk, br;
    if (entry.irr === "ii") { bk = null; br = "よ"; }
    else { bk = k == null ? null : k.slice(0,-1); br = r.slice(0,-1); }
    const mk = (suf) => ({ k: bk == null ? null : bk + suf, r: br + suf });
    switch (form || "base") {
      case "base": return {k, r};
      case "kunai": return mk("くない");
      case "katta": return mk("かった");
      case "kunakatta": return mk("くなかった");
      case "kute": return mk("くて");
      case "ku": return mk("く");
      default: throw new Error("unknown adj form: " + form);
    }
  }

  function adjna(entry, form) {
    const k = entry.k, r = entry.r;
    const mk = (suf) => ({ k: k == null ? null : k + suf, r: r + suf });
    switch (form || "base") {
      case "base": return {k, r};
      case "na": return mk("な");
      case "de": return mk("で");
      case "ni": return mk("に");
      default: throw new Error("unknown na-adj form: " + form);
    }
  }

  function copula(form) {
    const T = {
      desu:"です", deshita:"でした", janai:"じゃありません", janakatta:"じゃありませんでした",
      da:"だ", deshou:"でしょう", de:"で"
    };
    const r = T[form || "desu"];
    if (!r) throw new Error("unknown copula form: " + form);
    return { k:null, r };
  }

  function conj(entry, form) {
    if (entry.pos === "cop") return copula(form);
    if (entry.pos === "adji") return adji(entry, form);
    if (entry.pos === "adjna") return adjna(entry, form);
    if (entry.pos === "v1" || entry.pos === "v5" || entry.pos === "vk" || entry.pos === "vs" || entry.pos === "vs0")
      return verb(entry, form);
    if (form) throw new Error(entry.id + " cannot take form ." + form);
    return { k: entry.k, r: entry.r };
  }

  // every form id, for building transform distractors
  const VERB_FORMS = ["dict","masu","masen","mashita","masendeshita","masenka","mashou","mashouka",
                      "tai","takunai","te","ta","teimasu","nai","nakatta","naide","nakereba","nakutemo",
                      "tari","tekudasai","temoii","tewaikemasen","tekara","naidekudasai",
                      "nakerebanarimasen","nakutemoiidesu","takotoga"];
  const ADJ_FORMS = ["base","kunai","katta","kunakatta","kute","ku"];
  const ADJNA_FORMS = ["base","na","de","ni"];
  const COP_FORMS = ["desu","deshita","janai","janakatta","da","deshou"];

  return { conj, verb, adji, adjna, copula, VERB_FORMS, ADJ_FORMS, ADJNA_FORMS, COP_FORMS };
})();
if (typeof module !== "undefined") module.exports = { Conj };
