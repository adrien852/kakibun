/* Kakibun sync relay — a single Cloudflare Worker.
 *
 * It is a locker, not a server: it stores two JSON blobs and hands them back.
 * No accounts, no database schema, no merge logic — the secret in the URL is
 * the whole access control, and each blob has exactly one writer.
 *
 *   GET  /s/<secret>/progress   → the Kakibun save          (KakiBridge reads)
 *   POST /s/<secret>/progress   ← the Kakibun save          (Kakibun writes)
 *   GET  /s/<secret>/mined      → words mined by KakiBridge (Kakibun reads)
 *   POST /s/<secret>/mined      ← words mined by KakiBridge (KakiBridge writes)
 *   GET  /s/<secret>/status     → {progress:{at,bytes}, mined:{at,bytes}}
 *
 * POST bodies are {"data": …}; a bare JSON value is accepted too. GET returns
 * {"data": …, "at": <epoch ms>} and 404 with an empty body when nothing has
 * been stored yet, which the app reads as "nothing there", not as an error.
 *
 * ---------------------------------------------------------------------------
 * SETUP  (about five minutes, free tier, no card)
 *
 *  1. dash.cloudflare.com → Workers & Pages → Create → Worker → Deploy.
 *  2. Edit code, paste this whole file over what's there, Deploy.
 *  3. Storage & Databases → KV → Create namespace, call it KAKIBUN.
 *  4. Back in the Worker → Settings → Bindings → Add → KV namespace:
 *        Variable name: KV        Namespace: KAKIBUN
 *     Deploy again.
 *  5. Invent a secret — long and random, e.g. from `openssl rand -hex 16`.
 *     It is the only thing standing between your save and the internet.
 *  6. Your relay address is:
 *        https://<worker-name>.<your-subdomain>.workers.dev/s/<secret>
 *     Paste exactly that (no trailing slash, no /progress) into
 *     Kakibun → Réglages → Synchronisation automatique, and into KakiBridge.
 *
 * To rotate the secret, just start using a new one — the old blobs age out on
 * their own (TTL below) and nothing else has to change.
 *
 * Free tier headroom: 100k reads and 1k writes a day. Kakibun writes a handful
 * of times a day. There is no plausible way to exceed this by studying.
 * ---------------------------------------------------------------------------
 */

const MAX_BYTES = 2 * 1024 * 1024;      // a save is ~50 KB; this is pure sanity
const TTL = 60 * 60 * 24 * 180;         // 180 days without a write and it lapses
const BOXES = new Set(["progress", "mined"]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" }
  });

const empty = (status) => new Response(null, { status, headers: { ...CORS, "Cache-Control": "no-store" } });

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return empty(204);

    const url = new URL(request.url);
    // /s/<secret>/<box>
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length !== 3 || parts[0] !== "s") return json({ error: "bad path" }, 404);
    const [, secret, box] = parts;
    if (secret.length < 12) return json({ error: "secret too short" }, 400);

    if (box === "status") {
      const out = {};
      for (const b of BOXES) {
        const meta = await env.KV.getWithMetadata(`${secret}:${b}`, { type: "text" });
        out[b] = meta.value ? { at: (meta.metadata && meta.metadata.at) || 0, bytes: meta.value.length } : null;
      }
      return json(out);
    }
    if (!BOXES.has(box)) return json({ error: "unknown box" }, 404);
    const key = `${secret}:${box}`;

    if (request.method === "GET") {
      const { value, metadata } = await env.KV.getWithMetadata(key, { type: "text" });
      if (value === null) return empty(404);          // nothing stored yet — not an error
      return new Response(
        `{"at":${(metadata && metadata.at) || 0},"data":${value}}`,
        { headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } }
      );
    }

    if (request.method === "POST") {
      const text = await request.text();
      if (text.length > MAX_BYTES) return json({ error: "too big" }, 413);
      let body;
      try { body = JSON.parse(text); } catch (e) { return json({ error: "not json" }, 400); }
      // accept {"data": …} or a bare value, and store only the payload
      const data = (body && typeof body === "object" && "data" in body) ? body.data : body;
      if (data === undefined || data === null) return json({ error: "empty" }, 400);
      const at = Date.now();
      await env.KV.put(key, JSON.stringify(data), { expirationTtl: TTL, metadata: { at } });
      return json({ ok: true, at });
    }

    return json({ error: "method not allowed" }, 405);
  }
};
