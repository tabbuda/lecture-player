const CACHE_NAME = 'lecture-app-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Event: Files ko Cache me daalo
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate Event: Purana Cache safai
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Agar Offline ho to Cache se file do
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    }).catch(() => {
      // Fallback logic agar internet bhi nahi aur cache bhi nahi (Rare case)
      if (e.request.destination === 'document') {
         return caches.match('./index.html');
      }
    })
  );
});
