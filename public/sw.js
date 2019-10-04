importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// TODO: Add update notification!!!

workbox.routing.registerRoute(
  '/', new workbox.strategies.NetworkFirst()
)

workbox.routing.registerRoute(
  /\.(?:css|js)$/,
  new workbox.strategies.CacheFirst()
)

workbox.routing.registerRoute(
  'sw.js', new workbox.strategies.NetworkFirst()
)

workbox.routing.registerRoute(
  /\/manifest.json$/,
  new workbox.strategies.StaleWhileRevalidate()
)

workbox.routing.registerRoute(
  // Cache image files.
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // Use the cache if it's available.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images.
        maxEntries: 20,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
)
