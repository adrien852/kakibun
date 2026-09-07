/* Kakibun — the landscape every screen stands on.
 *
 * One layer, rendered once, shared by all five screens and by the session
 * overlay. It deliberately never re-renders on navigation: moving between
 * screens should feel like turning around in one place, not like loading a new
 * page. Only the clock changes it.
 *
 * Structure, back to front:
 *   sky        one of sixteen gradients          (--sky)
 *   light      sun or moon, breathing            (--light-*)
 *   hills      three receding ridges             (--hill-1..3)
 *   particles  petals / specks / leaves / snow
 *   vignette   ground ink rising from the bottom (--ground-ink)
 *   scrim      night and dawn darkening          (--night-scrim)
 */
const Scene = (() => {
  let root = null, tick = null, lastState = "";

  /* Per-season particle character. The prototype used three static elements;
   * this is the continuous system its handoff asked for. */
  const PARTICLES = {
    haru: { n: 9,  cls: "p-petal", size: [7, 13], dur: [10, 17], reverse: false,
            colors: ["#fff0f6", "#ffd3e2", "#ffffff"] },
    natsu:{ n: 7,  cls: "p-speck", size: [4, 8],  dur: [14, 18], reverse: true,
            colors: ["#ffffff", "#eafaff"] },
    aki:  { n: 10, cls: "p-leaf",  size: [7, 13], dur: [8, 14],  reverse: false,
            colors: ["#ffdca8", "#f6a663", "#c9482c"] },
    fuyu: { n: 14, cls: "p-snow",  size: [4, 9],  dur: [22, 27], reverse: false,
            colors: ["#ffffff", "#eef4fb"] }
  };

  const reduced = () => typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  function build() {
    root = document.getElementById("scene");
    if (!root) return;
    root.innerHTML =
      `<div class="sky"></div>
       <div class="light"></div>
       <div class="hill hill-1"></div>
       <div class="hill hill-2"></div>
       <div class="hill hill-3"></div>
       <div class="chime" aria-hidden="true">🎐</div>
       <div class="particles" id="particles" aria-hidden="true"></div>
       <div class="vignette"></div>
       <div class="scrim"></div>`;
  }

  /* Seeded so the same season always falls the same way — a landscape that
   * reshuffles every time you open the app reads as noise, not as weather. */
  function seedParticles() {
    const host = document.getElementById("particles");
    if (!host) return;
    host.innerHTML = "";
    if (reduced()) return;                       // stop them entirely, as asked
    const p = PARTICLES[Season.key()];
    if (!p) return;
    let h = 0;
    for (const c of Season.key()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const rnd = () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
    let html = "";
    for (let i = 0; i < p.n; i++) {
      const size = p.size[0] + rnd() * (p.size[1] - p.size[0]);
      const dur  = p.dur[0]  + rnd() * (p.dur[1]  - p.dur[0]);
      html += `<i class="${p.cls}" style="left:${(rnd() * 100).toFixed(1)}%;
        width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;
        background:${p.colors[i % p.colors.length]};
        opacity:${(0.55 + rnd() * 0.42).toFixed(2)};
        animation-duration:${dur.toFixed(1)}s;
        animation-delay:-${(rnd() * dur).toFixed(1)}s;
        animation-direction:${p.reverse ? "reverse" : "normal"}"></i>`;
    }
    host.innerHTML = html;
  }

  /* Re-apply only when the (season, band) pair actually changed, so the
   * hourly check costs nothing and never restarts the animations for free. */
  function refresh(force) {
    const state = Season.key() + "/" + Season.band();
    Season.apply();
    if (!force && state === lastState) return false;
    lastState = state;
    seedParticles();
    return true;
  }

  function start() {
    build();
    refresh(true);
    // a PWA is left open for hours; follow the real clock rather than the one
    // it happened to boot at
    if (tick) clearInterval(tick);
    tick = setInterval(() => refresh(false), 60000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(false); });
    window.addEventListener("focus", () => refresh(false));
    if (typeof matchMedia === "function") {
      const mq = matchMedia("(prefers-reduced-motion: reduce)");
      const onChange = () => seedParticles();
      if (mq.addEventListener) mq.addEventListener("change", onChange);
    }
  }

  return { start, refresh, seedParticles, PARTICLES };
})();
if (typeof module !== "undefined") module.exports = { Scene };
