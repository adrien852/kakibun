/* Kakibun service worker — bump VERSION on every release (and APP_VERSION in js/app.js). */
const VERSION = "3.6.0";
const CACHE = "kakibun-" + VERSION;

const PRECACHE = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "css/style.css",
  "data/i18n.js",
  "data/kanji_info.js",
  "data/particles.js",
  "data/grammar.js",
  "data/lexicon.js",
  "data/sentences.js",
  "data/notes.js",
  "data/dialogues.js",
  "js/conjugate.js",
  "js/parse.js",
  "js/kana.js",
  "js/bridge.js",
  "js/season.js",
  "js/scene.js",
  "js/mark.js",
  "js/engine.js",
  "js/sfx.js",
  "js/voice.js",
  "js/wordpop.js",
  "js/session.js",
  "js/exam.js",
  "js/map.js",
  "js/strengthen.js",
  "js/library.js",
  "js/settings.js",
  "js/app.js",
  "fonts/zkgn-400.woff2",
  "fonts/zkgn-500.woff2",
  "fonts/zkgn-700.woff2",
  "fonts/zkgn-900.woff2",
  "fonts/iserif-400i.woff2",
  "fonts/plexmono-400.woff2",
  "fonts/plexmono-500.woff2",
  "fonts/plexmono-600.woff2",
  "icons/icon-192.png",
  "icons/icon-master.svg",
  "icons/apple-touch-icon.png",
  "icons/favicon.ico",
  "icons/icon-512.png",
  "icons/maskable-192.png",
  "icons/maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("kakibun-") && k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        return res;
      }).catch(() => caches.match("index.html"));
    })
  );
});
