/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

if (workbox) {
  workbox.routing.registerRoute(
    ({ event }) =>
      event.request.destination === "script" ||
      event.request.destination === "document",
    new workbox.strategies.NetworkFirst({
      cacheName: "general",
    })
  );
  workbox.routing.registerRoute(
    /^https:\/\/media[0-9].giphy.com\/(.*)/,
    new workbox.strategies.CacheFirst({
      cacheName: "images",
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 2 * 24 * 60 * 60, // 2 Day
          purgeOnQuotaError: true,
        }),
      ],
    })
  );
}

workbox.core.setCacheNameDetails({ prefix: "gifty" });

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
