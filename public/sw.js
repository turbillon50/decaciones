// Service Worker — NETWORK-FIRST (siempre la ultima version; el cache solo es respaldo).
const CACHE_NAME = "decaciones-v4";
const STATIC = ["/manifest.json", "/icons/decaciones-icon.svg", "/icons/maskable-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(STATIC.map((u) => cache.add(u)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Nunca cachear APIs ni terceros (YouTube, etc.) — siempre red.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return; // deja pasar a la red normal
  }

  const isStatic = /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|ttf|mp3|wav)$/i.test(url.pathname)
    || url.pathname.startsWith("/icons/")
    || url.pathname.startsWith("/images/");

  if (isStatic) {
    // cache-first solo para media estatica
    event.respondWith(
      caches.match(req).then((c) => c || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => c))
    );
    return;
  }

  // TODO lo demas (HTML, JS, CSS, navegaciones) = network-first.
  event.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
      return res;
    }).catch(() =>
      caches.match(req).then((c) => c || caches.match("/"))
    )
  );
});
