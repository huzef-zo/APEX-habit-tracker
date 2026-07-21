const CACHE_NAME = 'apex-pwa-v15';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './worker.js',
  'https://esm.run/@mlc-ai/web-llm@0.2.84'
];

// Install event - caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ SW: Pre-caching assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 SW: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first for assets, network-first for HTML
self.addEventListener('fetch', (event) => {
  const isHTML = event.request.mode === 'navigate';

  if (isHTML) {
    // Network-first strategy for HTML
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('./index.html'))
    );
  } else {
    // Cache-first strategy for other assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          // Dynamically cache WebLLM library and model CDN files on first download
          if (event.request.url.includes('cdn.jsdelivr.net') || event.request.url.includes('esm.run')) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
