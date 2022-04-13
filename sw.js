// const cacheName = "LakshmiConstruction-v1";
// const staticAssets = ["./", "./index.html", "./assets"];

// self.addEventListener("install", async (e) => {
//   const cache = await caches.open(cacheName);
//   await cache.addAll(staticAssets);
//   return self.skipWaiting();
// });

// self.addEventListener("activate", (e) => {
//   self.clients.claim();
// });

// self.addEventListener("fetch", async (e) => {
//   const req = e.request;
//   const url = new URL(req.url);

//   if (url.origin === location.origin) {
//     e.respondWith(cacheFirst(req));
//   } else {
//     e.respondWith(networkAndCache(req));
//   }
// });

// async function cacheFirst(req) {
//   const cache = await caches.open(cacheName);
//   const cached = await cache.match(req);
//   return cached || fetch(req);
// }

// async function networkAndCache(req) {
//   const cache = await caches.open(cacheName);
//   try {
//     const fresh = await fetch(req);
//     await cache.put(req, fresh.clone());
//     return fresh;
//   } catch (e) {
//     const cached = await cache.match(req);
//     return cached;
//   }
// }
var cacheAll = false;
var CACHE_NAME = "webapk-cache";
var urlsToCache = ["./", "./index.html", "./assets"];
var urlsNotToCache = [];

// Install Event
self.addEventListener("install", function (event) {
  console.log("[SW] install event: ", event);
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("[SW] Opened cache: ", cache);
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Event
self.addEventListener("fetch", function (event) {
  console.log("[SW] fetch event: ", event);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) return response;
      else if (!cacheAll || urlsNotToCache.indexOf(event.request) !== -1)
        return fetch(event.request);
      else {
        fetch(event.request).then(function (response) {
          if (!response || response.status !== 200 || response.type !== "basic")
            return response;
          var responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      }
    })
  );
});
