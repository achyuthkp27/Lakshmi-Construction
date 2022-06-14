//Files to save in cache
var files = [
  "./",
  "./index.html?utm=homescreen", //SW treats query string as new request
  "https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i", //caching 3rd party content
  "./assets",
  "./manifest.json",
  "./portfolio.html",
];
self.addEventListener("install", function (event) {
  console.log("[Service Worker] Installing Service Worker ...", event);
  event.waitUntil(
    caches.open("static").then(function (cache) {
      cache.addAll(files);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("[Service Worker] Activating Service Worker ....", event);
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function (res) {
          return caches.open("dynamic").then(function (cache) {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
