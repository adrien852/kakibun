# Kakibun ⇄ KakiBridge — automatic sync

The point: never copy a JSON file by hand again. Kakibun uploads its save when
something changes; KakiBridge downloads it whenever it wants to look. Nothing
in this folder is part of the app — it is not precached and never loaded by
`index.html`. It is the *other end* of the pipe.

## Why a relay at all

Kakibun runs on the phone as an HTTPS page. A page served over HTTPS cannot
fetch `http://192.168.1.x` — the browser blocks it as mixed content, and there
is no flag, no exception, no header that changes that (only `localhost` is
exempt, and the PC is not the phone's localhost). So the phone and the PC
cannot talk directly over the home network. They need a meeting point that
speaks HTTPS, which is what the relay is: a locker with two shelves.

## The design in one line

Two named boxes, **one writer each**, so there is nothing to merge.

| box        | written by | read by    | contents                     |
|------------|------------|------------|------------------------------|
| `progress` | Kakibun    | KakiBridge | the whole Kakibun save        |
| `mined`    | KakiBridge | Kakibun    | words mined on the PC         |

Because no blob ever has two writers, there is no conflict resolution — the
part of a sync feature that is always subtly wrong is simply absent.

## Set it up

`worker.js` is a complete Cloudflare Worker — one file, no build step, no
dependencies. Two ways to get it up there; either is five minutes on the free
tier, no card.

### A. Dashboard (nothing to install)

1. Workers & Pages → **Create** → **Workers** → **Start with "Hello World!"**.
   Name it, Deploy. That publishes Cloudflare's stub.
2. **Edit code** → select all → paste `worker.js` over it → **Deploy**.
3. Storage & Databases → **KV** → Create namespace, call it `KAKIBUN`.
4. Back in the Worker → Settings → **Bindings** → add a KV namespace binding:
   variable name `KV`, namespace `KAKIBUN`. Deploy again.

> **Paste the code — never upload the file.** Dragging `worker.js` into the
> uploader gets you *"This uploader does not yet support projects that require a
> build process… please use `wrangler deploy` instead."* That path expects a
> pre-built site, not a single script. Nothing is wrong with the file.

Cloudflare reshuffles this dashboard regularly, so the labels may not match
word for word. What you want is the plain **Hello World** starter — the one that
gives you an online editor.

### B. Command line (`wrangler`)

Needs Node, which you already have for KakiBridge. From this folder:

    npx wrangler kv namespace create KAKIBUN     # prints an id
    # paste that id into wrangler.toml
    npx wrangler deploy

The first `deploy` opens a browser to log in, then prints your `workers.dev`
URL. On older wrangler the first command is `kv:namespace create`, with a colon.
`wrangler.toml` sits next to `worker.js` and already has everything else filled
in.

### Then, either way

5. Invent a secret — long and random, e.g. from `openssl rand -hex 16`.
   It is the only thing standing between your save and the internet.
6. Your relay address is:

```
https://<worker>.<subdomain>.workers.dev/s/<secret>
```

Paste that — no trailing slash, no `/progress` — into **Kakibun → Réglages →
Synchronisation automatique**, tap *Enregistrer*, then *Synchroniser* once to
confirm it answers. Give KakiBridge the same address.

The secret in the path is the whole access control, so make it long and random
(`openssl rand -hex 16`). It lives only in the two devices' settings, never in
any repo.

## Wire contract (this is what KakiBridge implements)

Base = the address above.

```
GET  <base>/progress
  200 {"at": 1757000000000, "data": { …the Kakibun save… }}
  404 (empty body)                      nothing uploaded yet — not an error

POST <base>/mined
  body: {"data": [ …mined words… ]}     Content-Type: text/plain;charset=UTF-8
  200 {"ok": true, "at": 1757000000000}

GET  <base>/status
  200 {"progress": {"at": …, "bytes": …} | null, "mined": … | null}
```

Notes for the KakiBridge side:

- `at` is epoch milliseconds of the last write. Poll `/status` (cheap) and only
  pull `/progress` when `at` has moved.
- A bare JSON value is accepted on POST as well as `{"data": …}`; both store the
  same thing. GET always returns the `{at, data}` envelope.
- `text/plain;charset=UTF-8` on POST is deliberate — it keeps the request
  CORS-"simple" so browsers skip the preflight. A desktop client can send
  `application/json` instead; the worker doesn't inspect the header.
- 2 MB cap per box; a blob lapses after 180 days with no write.

The Kakibun save is the same object as *Réglages → Exporter* produces —
`{app:"kakibun", v, at, state:{…}}` — minus its `sync` block, which is
per-device and never travels.

## What Kakibun does, and when

- **On open** — pushes if the save changed since the last upload, then pulls `mined`.
- **End of a session or an exam** — pushes (4 s debounce, so a burst is one upload).
- **After a Kakikana import, or when new kanji appear** — pushes.
- **After restoring a backup** — pushes immediately, force, so the relay can't
  hand the old save back to the PC.
- **Leaving the app** — `sendBeacon`, which the browser delivers even if the
  phone kills the page.

An unchanged save is never re-uploaded (a cheap hash guards it), so leaving
auto-sync on costs a few requests a day. Failures are silent apart from the
status line in Settings — a dead network mid-session should never interrupt a
lesson, and the next push carries the same data anyway.

## The other option: no relay, no cloud

If you'd rather nothing ever leaves your machines: put both the phone and the PC
on a [Tailscale](https://tailscale.com) tailnet, turn on **HTTPS certificates**,
and run `tailscale serve` in front of a tiny local HTTP server implementing the
same four routes. The phone then reaches
`https://pc-name.<tailnet>.ts.net/s/<secret>` — a real HTTPS origin, so mixed
content doesn't apply, and the traffic never leaves the tailnet. Everything
above is unchanged except the address you paste in.
