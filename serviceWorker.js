//Cache polyfil to support cacheAPI in all browsers
importScripts("./cache-polyfill.js");

var cacheName = "cache-v4";

//Files to save in cache
var files = [
  "./",
  "./index.html?utm=homescreen", //SW treats query string as new request
  "https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i", //caching 3rd party content
  "./assets",
  "./manifest.json",
  "./portfolio.html",
];

//Adding `install` event listener
self.addEventListener("install", (event) => {
  console.info("Event: Install");

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      //[] of files to cache & if any of the file not present `addAll` will fail
      return cache
        .addAll(files)
        .then(() => {
          console.info("All files are cached");
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
        .catch((error) => {
          console.error("Failed to cache", error);
        });
    })
  );
});

/*
  FETCH EVENT: triggered for every request made by index page, after install.
*/

//Adding `fetch` event listener
self.addEventListener("fetch", (event) => {
  console.info("Event: Fetch");

  var request = event.request;
  var url = new URL(request.url);
  if (url.origin === location.origin) {
    // Static files cache
    event.respondWith(cacheFirst(request));
  } else {
    // Dynamic API cache
    event.respondWith(networkFirst(request));
  }

  // // Checking for navigation preload response
  // if (event.preloadResponse) {
  //   console.info('Using navigation preload');
  //   return response;
  // }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open(cacheName);
  try {
    const networkResponse = await fetch(request);
    // Cache the dynamic API response
    dynamicCache.put(request, networkResponse.clone()).catch((err) => {
      console.warn(request.url + ": " + err.message);
    });
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dynamicCache.match(request);
    return cachedResponse;
  }
}

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener("activate", (event) => {
  console.info("Event: Activate");

  //Navigation preload is help us make parallel request while service worker is booting up.
  //Enable - chrome://flags/#enable-service-worker-navigation-preload
  //Support - Chrome 57 beta (behing the flag)
  //More info - https://developers.google.com/web/updates/2017/02/navigation-preload#the-problem

  // Check if navigationPreload is supported or not
  // if (self.registration.navigationPreload) {
  //   self.registration.navigationPreload.enable();
  // }
  // else if (!self.registration.navigationPreload) {
  //   console.info('Your browser does not support navigation preload.');
  // }

  //Remove old and unwanted caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== cacheName) {
              return caches.delete(cache); //Deleting the old cache (cache v1)
            }
          })
        );
      })
      .then(function () {
        console.info("Old caches are cleared!");
        // To tell the service worker to activate current one
        // instead of waiting for the old one to finish.
        return self.clients.claim();
      })
  );
});

/*
  BACKGROUND SYNC EVENT: triggers after `bg sync` registration and page has network connection.
  It will try and fetch github username, if its fulfills then sync is complete. If it fails,
  another sync is scheduled to retry (will will also waits for network connection)
*/

self.addEventListener("sync", (event) => {
  console.info("Event: Sync");

  //Check registered sync name or emulated sync from devTools
  if (event.tag === "github" || event.tag === "test-tag-from-devtools") {
    event.waitUntil(
      //To check all opened tabs and send postMessage to those tabs
      self.clients
        .matchAll()
        .then((all) => {
          return all.map((client) => {
            return client.postMessage("online"); //To make fetch request, check app.js - line no: 122
          });
        })
        .catch((error) => {
          console.error(error);
        })
    );
  }
});
