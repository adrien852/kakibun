/* Kakibun — the season, taken from the real calendar.
 *
 * The journey is a year of travel across Japan, so the app ought to know what
 * month it is. Opening it in April and in November should not look identical.
 *
 * Deliberately restrained: the app's own palette (vermillion on cream) stays
 * exactly as it is, and the season only supplies ONE accent colour — used for
 * the rail line, the traveller and the season badge — plus a motif and the
 * Japanese name. Repainting the whole interface four times a year would be
 * noise; changing the thread you travel along is enough.
 *
 * Japanese convention, which is calendar months rather than solstices:
 *   春 March–May · 夏 June–August · 秋 September–November · 冬 December–February
 */
const Season = (() => {
  const SEASONS = {
    haru: { jp: "春", motif: "🌸", accent: "#d9799b", soft: "#fbeef3",
            fr: "printemps", en: "spring", noteFr: "les cerisiers", noteEn: "cherry blossom" },
    natsu:{ jp: "夏", motif: "🎐", accent: "#2f8f8f", soft: "#e7f4f4",
            fr: "été", en: "summer", noteFr: "les carillons à vent", noteEn: "wind chimes" },
    aki:  { jp: "秋", motif: "🍁", accent: "#c9622e", soft: "#fbeee6",
            fr: "automne", en: "autumn", noteFr: "les érables rouges", noteEn: "red maples" },
    fuyu: { jp: "冬", motif: "❄️", accent: "#5f86ad", soft: "#eaf1f7",
            fr: "hiver", en: "winter", noteFr: "la neige", noteEn: "snow" }
  };

  /* month is 0-based from Date#getMonth */
  function keyFor(month) {
    if (month >= 2 && month <= 4) return "haru";
    if (month >= 5 && month <= 7) return "natsu";
    if (month >= 8 && month <= 10) return "aki";
    return "fuyu";
  }
  const current = (d) => SEASONS[keyFor((d || new Date()).getMonth())];
  const key = (d) => keyFor((d || new Date()).getMonth());

  /* One custom property, set on the root. Everything seasonal in the CSS reads
   * --season / --season-soft, so nothing else has to know what month it is. */
  function apply(d) {
    const s = current(d);
    const r = document.documentElement;
    r.style.setProperty("--season", s.accent);
    r.style.setProperty("--season-soft", s.soft);
    r.dataset.season = key(d);
    return s;
  }

  /* "秋 · automne" — shown on the map header */
  const label = (lang, d) => { const s = current(d); return s.jp + " · " + s[lang || "fr"]; };

  return { current, key, apply, label, SEASONS };
})();
if (typeof module !== "undefined") module.exports = { Season };
