/* Kakibun — the season and the hour.
 *
 * The whole redesign rests on one idea: the app is a PLACE you are standing in,
 * and that place follows the real calendar and the real clock. Everything
 * visual — sky, light, hills, ink, accent — is derived from exactly two numbers,
 * (month, hour), and nothing else. There is no override and no simulated clock:
 * the design handoff's preview harness is deliberately not shipped.
 *
 *   season   春 Mar–May · 夏 Jun–Aug · 秋 Sep–Nov · 冬 Dec–Feb  (Japanese convention)
 *   band     dawn 05–07 · day 08–15 · dusk 16–18 · night 19–04
 *
 * 4 × 4 = sixteen states, each a hand-picked gradient. Everything else that
 * depends on the season reads the custom properties this module sets, so no
 * other module has to know what month it is.
 */
const Season = (() => {

  const SEASONS = {
    haru: { jp: "春", fr: "printemps", en: "spring", accent: "#e58fae",
            head: "花見", poeticFr: "les cerisiers s'ouvrent à Kyoto",
            poeticEn: "the cherry trees open over Kyoto",
            inkLight: "#4a2333", subLight: "#6d3346", ground: "#3a1f2c",
            hills: ["#f2b3c8", "#e08fae", "#b9678a"],
            chord: [349, 523, 698, 1046] },
    natsu:{ jp: "夏", fr: "été", en: "summer", accent: "#7fd8cd",
            head: "真夏", poeticFr: "les cigales couvrent Kyoto",
            poeticEn: "the cicadas cover Kyoto",
            inkLight: "#08333f", subLight: "#0b4553", ground: "#082722",
            hills: ["#3f9c63", "#1f6b4a", "#0d3b2e"],
            chord: [440, 659, 880, 1318] },
    aki:  { jp: "秋", fr: "automne", en: "autumn", accent: "#ffd08a",
            head: "紅葉", poeticFr: "les érables rougissent à Kyoto",
            poeticEn: "the maples redden over Kyoto",
            inkLight: "#4a1f14", subLight: "#6b2f1e", ground: "#2b1512",
            hills: ["#a4462d", "#7a2e2b", "#4d1d1c"],
            chord: [293, 440, 587, 880] },
    fuyu: { jp: "冬", fr: "hiver", en: "winter", accent: "#a8c6e8",
            head: "雪見", poeticFr: "la neige tient sur Kyoto",
            poeticEn: "the snow holds over Kyoto",
            inkLight: "#1b2d47", subLight: "#2c4a6b", ground: "#0f1a2e",
            // winter inverts: pale snow in front, darker rock behind
            hills: ["#8fa9c9", "#c9dcef", "#eef4fb"],
            chord: [196, 294, 392, 784] }
  };

  const SKY = {
    haru: { dawn: "linear-gradient(180deg,#2f2b47 0%,#7d6a8e 34%,#e8a6b8 58%,#f6c9d6 66%)",
            day:  "linear-gradient(180deg,#dff0fb 0%,#eee6f2 30%,#f7dfe8 48%,#f2b7cd 64%)",
            dusk: "linear-gradient(180deg,#6b5a86 0%,#b98099 34%,#efb0be 56%,#f0c0cd 66%)",
            night:"linear-gradient(180deg,#171430 0%,#2b2447 40%,#4a3a5e 60%,#5f4a6b 68%)" },
    natsu:{ dawn: "linear-gradient(180deg,#1d3a56 0%,#4f7f96 34%,#a8dbe2 58%,#d8f0ea 66%)",
            day:  "linear-gradient(180deg,#3fb0dd 0%,#7fcfe8 30%,#c9ecf2 52%,#e8f6f2 62%)",
            dusk: "linear-gradient(180deg,#2c5d7a 0%,#6fa2a8 34%,#e8c98f 58%,#f2d9a8 66%)",
            night:"linear-gradient(180deg,#08131f 0%,#123045 40%,#1d4a5c 62%,#256070 70%)" },
    aki:  { dawn: "linear-gradient(180deg,#33203a 0%,#7d4a4a 34%,#e0925f 58%,#f5c184 66%)",
            day:  "linear-gradient(180deg,#8fc9e8 0%,#c9dfe8 28%,#f2d9a8 50%,#f7b267 64%)",
            dusk: "linear-gradient(180deg,#fbd8a0 0%,#f7b267 26%,#ef8f57 46%,#d1622f 62%)",
            night:"linear-gradient(180deg,#180f16 0%,#2f1a22 40%,#4d2622 60%,#63332a 70%)" },
    fuyu: { dawn: "linear-gradient(180deg,#131c33 0%,#3a4a70 34%,#8fa6c9 58%,#c2d2e8 68%)",
            day:  "linear-gradient(180deg,#9ec4e8 0%,#c9dcef 30%,#e4eef8 52%,#f2f7fc 64%)",
            dusk: "linear-gradient(180deg,#2b3a5c 0%,#5f6f96 32%,#a89ab0 56%,#d0b3b8 68%)",
            night:"linear-gradient(180deg,#0f1a2e 0%,#1b2a44 34%,#33547a 56%,#5f86ad 66%)" }
  };

  /* One light source, per hour band rather than per season. At night the same
   * element reads as a moon: cooler gradient, higher and further right. */
  const LIGHT = {
    dawn:  { x: "12%", y: "22%", size: "56px", bg: "radial-gradient(circle,#fff4e2,#ffcf9e 58%,rgba(255,207,158,0))" },
    day:   { x: "44%", y: "8%",  size: "58px", bg: "radial-gradient(circle,#fff,#fffce8 52%,rgba(255,252,232,0))" },
    dusk:  { x: "60%", y: "20%", size: "74px", bg: "radial-gradient(circle,#fff6dd,#ffd88a 62%,rgba(255,216,138,0))" },
    night: { x: "66%", y: "9%",  size: "52px", bg: "radial-gradient(circle,#fdfeff,#dce9f7 56%,rgba(220,233,247,0))" }
  };

  const keyFor  = (m) => (m >= 2 && m <= 4) ? "haru" : (m >= 5 && m <= 7) ? "natsu"
                       : (m >= 8 && m <= 10) ? "aki" : "fuyu";        // m is 0-based
  const bandFor = (h) => (h >= 5 && h < 8) ? "dawn" : (h >= 8 && h < 16) ? "day"
                       : (h >= 16 && h < 19) ? "dusk" : "night";

  const key     = (d) => keyFor((d || new Date()).getMonth());
  const band    = (d) => bandFor((d || new Date()).getHours());
  const current = (d) => SEASONS[key(d)];

  /* Dawn and night are dark enough that headline ink must go white. */
  const isDark = (d) => { const b = band(d); return b === "night" || b === "dawn"; };

  const sky   = (d) => SKY[key(d)][band(d)];
  const light = (d) => LIGHT[band(d)];
  const scrim = (d) => { const b = band(d); return b === "night" ? 0.34 : b === "dawn" ? 0.16 : 0; };

  /* The session scrim sits OVER the landscape but under the cards, so the
   * season stays visible behind every exercise. */
  const sessionScrim = (d) => isDark(d) ? "rgba(9,12,20,.82)" : "rgba(14,16,26,.74)";

  /* Everything seasonal in the CSS reads these — nothing else needs the date. */
  function apply(d) {
    const s = current(d), b = band(d), L = LIGHT[b], dark = isDark(d);
    const r = document.documentElement;
    const set = (k, v) => r.style.setProperty(k, v);
    set("--accent", s.accent);
    set("--sky", SKY[key(d)][b]);
    set("--ground-ink", s.ground);
    set("--night-scrim", String(scrim(d)));
    set("--sess-scrim", sessionScrim(d));
    set("--ink-head", dark ? "#ffffff" : s.inkLight);
    set("--ink-sub",  dark ? "#f2f4f8" : s.subLight);
    set("--head-shadow", dark ? "0 2px 16px rgba(6,10,20,.75)"
                             : "0 1px 10px rgba(255,255,255,.5)");
    set("--light-x", L.x); set("--light-y", L.y);
    set("--light-size", L.size); set("--light-bg", L.bg);
    s.hills.forEach((c, i) => set("--hill-" + (i + 1), c));
    r.dataset.season = key(d);
    r.dataset.band = b;
    return s;
  }

  /* "秋 · 17:20" for the status pill */
  function clock(d) {
    const t = d || new Date();
    return String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0");
  }
  const label   = (lang, d) => { const s = current(d); return s.jp + " · " + s[lang === "en" ? "en" : "fr"]; };
  const poetic  = (lang, d) => { const s = current(d); return lang === "en" ? s.poeticEn : s.poeticFr; };
  /* The design gives three greetings for four bands. `day` runs 08–15, so
   * mapping it wholesale to "cet après-midi" greets 10 a.m. as the afternoon;
   * split it at noon, which costs nothing and stops the copy lying. */
  function dayPart(d) {
    const b = band(d);
    if (b === "dawn") return "morning";
    if (b === "day") return (d || new Date()).getHours() < 12 ? "morning" : "afternoon";
    return "evening";
  }

  return { current, key, band, apply, label, poetic, clock, dayPart,
           isDark, sky, light, scrim, sessionScrim, SEASONS, SKY, LIGHT };
})();
if (typeof module !== "undefined") module.exports = { Season };
