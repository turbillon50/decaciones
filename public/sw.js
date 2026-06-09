// Decaciones service worker — NETWORK FIRST.
// El SW anterior era cache-first y servia HTML viejo para siempre. Este
// siempre intenta la red primero (contenido fresco) y solo usa cache offline.
const CACHE_NAME = "decaciones-v5";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Borra TODO cache viejo (incluida la app shell stale).
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // No tocar otros origenes (Spotify CDN/SDK) ni las rutas de API.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || caches.match("/");
      }
    })(),
  );
});
