/* Kakibun — 書, the mark.
 *
 * One kanji on the same valley the app itself stands in: a seasonal sky, one
 * point of light, two ridges. The glyph and the geometry never change; only the
 * colours follow the season, so the icon on the home screen is always in the
 * same season as the app behind it.
 *
 * THE GLYPH IS GEOMETRY, NOT TYPE. `GLYPH_D` is 書 in Shippori Mincho ExtraBold
 * converted to outlines and normalised into a 1000-unit box (ink bounds, y
 * already flipped for SVG). The handoff is explicit that the mark must never
 * depend on a webfont, and this is also why the icon renders identically in a
 * favicon, in the app and in an exported PNG — one path, no font loading, no
 * fallback face. Do not re-set 書 in another family anywhere: the Mincho stroke
 * IS the mark.
 *
 * SEASON COMES FROM ONE PLACE. `Season.key()` is the source of truth; this
 * module never looks at the date. In node (asset export) there is no Season, so
 * `palette(key)` takes the key explicitly and the browser passes Season.key().
 */
const Mark = (() => {

  /* 書 — Shippori Mincho ExtraBold, outlined. Ink box 962.88 × 1000. */
  const GLYPH_W = 962.88, GLYPH_H = 1000;
  const GLYPH_D = "M842.0 184.5Q846.2 178.2 853.1 168.1Q860.0 158.0 864.3 153.2Q868.5 148.5 872.7 148.5Q879.1 148.5 901.4 167.0Q923.6 185.6 943.3 206.3Q962.9 226.9 962.9 234.4Q959.7 250.3 936.4 250.3H796.4V377.5Q796.4 379.6 787.9 384.9Q843.1 425.2 887.6 465.5Q883.4 482.5 861.1 482.5H533.4V566.3H789.0L816.5 529.2Q820.8 523.9 829.3 513.3Q837.8 502.7 843.1 497.3Q848.4 492.0 852.6 492.0Q859.0 492.0 884.9 511.1Q910.9 530.2 933.7 550.9Q956.5 571.6 956.5 579.0Q953.3 596.0 929.0 596.0H186.6Q111.3 597.0 27.6 610.8L1.1 557.8Q59.4 564.2 142.1 566.3H415.7V482.5H267.2Q191.9 483.6 108.2 497.3L80.6 443.3Q138.9 449.6 221.6 451.7H415.7V369.0H301.2Q225.9 370.1 142.1 383.9L113.5 329.8Q171.8 336.2 254.5 338.3H415.7V250.3H185.6Q110.3 251.3 26.5 265.1L0.0 212.1Q58.3 218.5 141.0 220.6H415.7V134.7H307.5Q232.2 135.7 148.5 149.5L119.8 95.4Q178.2 101.8 260.9 103.9H415.7Q415.7 44.5 409.3 0.0Q495.2 19.1 528.1 30.2Q561.0 41.4 561.0 49.8Q561.0 54.1 552.5 59.4L533.4 72.1V103.9H672.3L695.7 74.2Q698.8 70.0 706.3 61.5Q713.7 53.0 718.5 48.8Q723.2 44.5 727.5 44.5Q733.8 44.5 760.9 63.6Q787.9 82.7 811.2 103.4Q834.6 124.1 834.6 131.5Q821.8 146.3 796.4 151.6V220.6H818.7ZM681.9 134.7H533.4V220.6H681.9ZM681.9 250.3H533.4V338.3H681.9ZM774.1 392.4Q729.6 410.4 701.0 410.4H681.9V369.0H533.4V451.7H725.3ZM283.1 961.8Q283.1 968.2 267.2 977.2Q251.3 986.2 228.0 993.1Q204.7 1000.0 182.4 1000.0Q170.7 1000.0 164.9 993.6Q159.1 987.3 159.1 978.8Q163.3 936.4 165.4 873.8V810.2Q165.4 687.2 153.8 616.1L291.6 672.3H671.3L695.7 641.6Q699.9 636.3 707.3 627.3Q714.7 618.2 719.5 614.0Q724.3 609.8 728.5 609.8Q734.9 609.8 763.5 629.4Q792.2 649.0 817.6 670.7Q843.1 692.5 843.1 699.9Q827.1 717.9 801.7 723.2V804.9Q803.8 903.5 808.1 961.8Q802.8 971.4 766.2 983.6Q729.6 995.8 701.0 995.8Q676.6 995.8 676.6 974.5Q676.6 974.5 680.8 957.6V937.4H283.1ZM680.8 785.8V702.0H283.1V785.8ZM283.1 816.5V907.7H680.8V816.5Z";

  /* Per-season icon palette. These are the MARK's colours: the sky and ridges
   * here are the icon's own (one fixed dusk-into-night valley per season), not
   * the app's 16 hour-band skies — an app icon can't follow the clock. The
   * accents are the app's own season accents, unchanged. */
  const PALETTE = {
    haru: { accent:"#e58fae", sky:["#2b2438","#3a1f2c"],                 back:"#2a1621", front:"#1c0e16", light:"#ffe8f0", flat:"#3a1f2c" },
    natsu:{ accent:"#7fd8cd", sky:["#0b3b46","#082722"],                 back:"#051d19", front:"#03120f", light:"#e6fffb", flat:"#0b3b46" },
    aki:  { accent:"#ffd08a", sky:["#2a2036","#4a1f14","#2b1512"],       back:"#20120f", front:"#150c0a", light:"#ffe6bd", flat:"#3d1a11" },
    fuyu: { accent:"#a8c6e8", sky:["#1b2d47","#0f1a2e"],                 back:"#0a1120", front:"#060c17", light:"#eaf3ff", flat:"#1b2d47" }
  };
  const DEFAULT = "aki";                 // the static launcher icon, per the handoff

  /* Geometry, as fractions of icon width. Taken from the prototype's 256px
   * master, which is self-consistent across its five sizes — see README. */
  const G = {
    radius:     0.2344,                  // iOS squircle equivalent
    lightD:     0.125,
    lightCX:    0.195,               // the spec's position, not the prototype's:
    lightCY:    0.172,               // further from the glyph, and it reads clearer
    glowR:      0.172,                   // outer blur radius
    backW:      1.60,  backH: 0.750, backTop:  0.6563,
    frontW:     1.50,  frontH: 0.719, frontTop: 0.7813,
    soloW:      1.60,  soloH:  0.750, soloTop:  0.6563,   // the single ridge under 128
    glyphH:     0.5459,                  // ink height (the prototype's 148px at 256)
    glyphRise:  0.047,                   // optical lift against the ridge mass
    smallGlyph: 0.66,                    // < 40px: glyph only, bigger
    smallRadius:0.25
  };

  const palette = (key) => PALETTE[key] || PALETTE[DEFAULT];
  const seasonKey = () => (typeof Season !== "undefined" && Season.key) ? Season.key() : DEFAULT;

  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const n = (v) => Math.round(v * 1000) / 1000;

  /* How much artwork survives at this size (handoff §2). */
  function tier(size) {
    if (size < 40)  return "flat";       // glyph on a flat ground, no ridge, no light
    if (size < 76)  return "plain";      // one ridge, no light point
    if (size < 100) return "lit";        // one ridge + light, no glow
    if (size < 128) return "single";     // one ridge, light + glow
    return "full";                       // both ridges
  }

  /* The mark as a standalone <svg> string, `size` px wide.
   * opts: {key, id, cls, variant:"seasonal"|"paper"|"ink"|"outline", rounded:false} */
  function svg(size, opts) {
    const o = opts || {};
    const key = o.key || seasonKey();
    const p = palette(key);
    const t = o.bare ? "bare"
            : o.variant && o.variant !== "seasonal" ? "flat" : tier(size);
    const W = 1000, uid = o.id || ("m" + Math.random().toString(36).slice(2, 8));
    const px = (f) => n(f * W);

    /* monochrome variants: ground + glyph, nothing else */
    let ground, ink, extra = "", stroke = "";
    if (o.variant === "paper")        { ground = "#f4efe6"; ink = "#4a1f14"; }
    else if (o.variant === "ink")     { ground = "#1b1917"; ink = "#ffffff"; }
    else if (o.variant === "outline") { ground = "none";    ink = "#ffffff";
      stroke = `<rect x="${n(W*0.016)}" y="${n(W*0.016)}" width="${n(W*0.968)}" height="${n(W*0.968)}"
        rx="${px(G.radius)}" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="${n(W*0.031)}"/>`; }
    else if (t === "bare")            { ground = "none";    ink = p.accent; }
    else if (t === "flat")            { ground = p.flat;    ink = p.accent; }
    else                              { ground = `url(#${uid}s)`; ink = p.accent; }

    const radius = px(t === "flat" && o.variant !== "outline" && size < 40 ? G.smallRadius : G.radius);

    /* sky */
    let defs = "";
    if (ground === `url(#${uid}s)`) {
      const stops = p.sky.length === 3
        ? [[0,p.sky[0]],[0.62,p.sky[1]],[1,p.sky[2]]]
        : [[0,p.sky[0]],[1,p.sky[1]]];
      defs += `<linearGradient id="${uid}s" x1="0" y1="0" x2="0" y2="1">` +
        stops.map(([off,c]) => `<stop offset="${off}" stop-color="${c}"/>`).join("") + `</linearGradient>`;
    }

    /* light point + its glow */
    if (t === "full" || t === "single" || t === "lit") {
      const cx = px(G.lightCX), cy = px(G.lightCY), r = px(G.lightD / 2);
      if (t !== "lit") {
        defs += `<radialGradient id="${uid}g"><stop offset="0" stop-color="${p.accent}" stop-opacity=".45"/>` +
                `<stop offset="1" stop-color="${p.accent}" stop-opacity="0"/></radialGradient>`;
        extra += `<circle cx="${cx}" cy="${cy}" r="${px(G.glowR)}" fill="url(#${uid}g)"/>`;
      }
      extra += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.light}"/>`;
    }

    /* ridges — ellipses whose top arc is the skyline */
    const ridge = (w, h, top, fill) => {
      const rx = px(w) / 2, ry = px(h) / 2;
      return `<ellipse cx="${px(0.5)}" cy="${n(px(top) + ry)}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
    };
    if (t === "full")
      extra += ridge(G.backW, G.backH, G.backTop, p.back) + ridge(G.frontW, G.frontH, G.frontTop, p.front);
    else if (t !== "flat" && t !== "bare")   // "bare" is the glyph and nothing else
      extra += ridge(G.soloW, G.soloH, G.soloTop, p.front);

    /* the glyph, placed by its INK box so every size lands identically */
    const gh = px(t === "bare" ? 1 : t === "flat" ? G.smallGlyph : G.glyphH);
    const gw = gh * (GLYPH_W / GLYPH_H);
    const rise = (t === "flat" || t === "bare") ? 0 : px(G.glyphRise);
    const gx = (W - gw) / 2, gy = (W - gh) / 2 - rise;
    const glyph = `<g transform="translate(${n(gx)} ${n(gy)}) scale(${n(gw / GLYPH_W)} ${n(gh / GLYPH_H)})">` +
                  `<path d="${GLYPH_D}" fill="${ink}"/></g>`;

    const clip = o.rounded === false ? "" : ` clip-path="url(#${uid}c)"`;
    if (o.rounded !== false)
      defs += `<clipPath id="${uid}c"><rect width="${W}" height="${W}" rx="${radius}"/></clipPath>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${size}" height="${size}"` +
      (o.cls ? ` class="${esc(o.cls)}"` : "") + ` role="img" aria-label="Kakibun">` +
      `<defs>${defs}</defs><g${clip}>` +
      (ground === "none" ? "" : `<rect width="${W}" height="${W}" fill="${ground}"/>`) +
      extra + glyph + `</g>${stroke}</svg>`;
  }

  /* ---------- in-app pieces ---------- */

  /* compact lockup: icon + lowercase wordmark. Gap = 27% of icon height. */
  function lockup(size, opts) {
    const o = opts || {};
    const gap = Math.round(size * 0.27);
    const word = Math.round(size * 0.62);
    return `<span class="mk-lock" style="gap:${gap}px">${svg(size, o)}` +
      `<span class="mk-word" style="font-size:${word}px">kakibun</span></span>`;
  }

  /* the full signature, with the tagline */
  function signature(opts) {
    const o = opts || {};
    const p = palette(o.key || seasonKey());
    return `<span class="mk-sig">${svg(52, o)}<span class="mk-sig-t">` +
      `<span class="mk-word" style="font-size:32px">kakibun</span>` +
      `<span class="mk-tag" style="color:${p.accent}">書き文 · KYOTO</span></span></span>`;
  }

  /* ---------- the launch screen ----------
   * Painted from <head>, before the app boots, so the first frame a person sees
   * is the mark in today's season rather than an empty valley. It reads
   * Season.key() like everything else here — no second copy of the month logic. */
  function paintLaunch() {
    const el = document.getElementById("launch");
    if (!el) return;
    const key = seasonKey(), p = palette(key), r = document.documentElement.style;
    const sky = p.sky.length === 3
      ? `linear-gradient(180deg,${p.sky[0]} 0%,${p.sky[1]} 58%,${p.sky[2]} 100%)`
      : `linear-gradient(180deg,${p.sky[0]} 0%,${p.sky[1]} 100%)`;
    r.setProperty("--lx-sky", sky);
    r.setProperty("--lx-light", p.light);
    r.setProperty("--lx-glow", hexA(p.accent, 0.4));
    r.setProperty("--lx-back", p.back);
    r.setProperty("--lx-front", p.front);
    r.setProperty("--accent-lit", lighten(p.accent));
    const g = document.getElementById("lx-glyph");
    if (g) g.innerHTML = svg(84, { key, rounded: false, bare: true });
    const line = document.getElementById("lx-poetic");
    if (line && typeof Season !== "undefined" && Season.poetic) {
      let lang = "fr";
      try { const raw = localStorage.getItem("kakibun.state.v1");
            if (raw) lang = (JSON.parse(raw).settings || {}).lang || "fr"; } catch (e) {}
      line.textContent = Season.poetic(lang);
    }
  }
  /* the app has drawn; fade the launch screen out and take it off the tree */
  function dismissLaunch() {
    const el = document.getElementById("launch");
    if (!el || el.hidden) return;
    el.classList.add("gone");
    const done = () => { el.hidden = true; };
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduce) done(); else setTimeout(done, 340);
  }

  const hexA = (hex, a) => {
    const h = hex.replace("#", "");
    return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`;
  };
  /* the hover tint: the accent lifted toward white, not a second hard-coded hex */
  const lighten = (hex) => {
    const h = hex.replace("#", "");
    const up = (i) => Math.round(parseInt(h.slice(i, i+2), 16) * 0.72 + 255 * 0.28);
    return `rgb(${up(0)},${up(2)},${up(4)})`;
  };

  return { svg, lockup, signature, palette, seasonKey, PALETTE, G, DEFAULT,
           paintLaunch, dismissLaunch, GLYPH_D, GLYPH_W, GLYPH_H, tier };
})();
if (typeof module !== "undefined") module.exports = { Mark };
