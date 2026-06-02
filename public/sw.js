const CACHE_NAME = "decaciones-v2";
const APP_SHELL = [
  "/",
  "/decades",
  "/genres",
  "/favorites",
  "/player",
  "/ai",
  "/spotify",
  "/settings",
  "/manifest.json",
  "/icons/decaciones-icon.svg",
  "/icons/maskable-icon.svg",
  "/images/decaciones-hero.svg",
  "/images/album-gold.svg",
  "/images/album-amber.svg",
  "/images/album-teal.svg",
  "/images/album-rose.svg",
  "/images/vu-meters.svg",
  "/audio/60s/demo.wav",
  "/audio/70s/demo.wav",
  "/audio/80s/demo.wav",
  "/audio/90s/demo.wav",
  "/audio/2000s/demo.wav",
  "/audio/salsa/demo.wav",
  "/audio/merengue/demo.wav",
  "/audio/romanticas/demo.wav",
  "/audio/electronica/demo.wav"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(() => caches.match("/"));
    })
  );
});
