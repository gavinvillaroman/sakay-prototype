// Sakay service worker — minimal offline shell + asset cache.
// Bump CACHE_VERSION to force clients to update.
const CACHE_VERSION = "sakay-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE = ["/", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(CACHE_VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Strategy:
// - Navigations (HTML): network-first, fall back to cache, then offline page.
// - Same-origin static assets (/_next/static, /cars, icons, manifest): stale-while-revalidate.
// - Cross-origin (Unsplash, pravatar): cache-first.
// - Everything else: pass-through.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match("/offline")),
        ),
    );
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isStatic =
    sameOrigin &&
    (url.pathname.startsWith("/_next/static") ||
      url.pathname.startsWith("/cars/") ||
      url.pathname.startsWith("/icon") ||
      url.pathname.startsWith("/apple-icon") ||
      url.pathname === "/manifest.webmanifest" ||
      url.pathname === "/favicon.ico");

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  if (!sameOrigin) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req)
            .then((res) => {
              if (res.ok && res.type !== "opaqueredirect") {
                const copy = res.clone();
                caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
              }
              return res;
            })
            .catch(() => cached),
      ),
    );
  }
});
