self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('owoc-tracker').then(function(cache) {
      return cache.addAll([
        '/',
        '/owoc.html',
        '/style.css',
        '/manifest.json',
        '/owoc.js',
        '/icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
