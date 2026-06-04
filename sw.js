const CACHE_NAME = 'levelup-life-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/storage.js',
  '/js/habits.js',
  '/js/weight.js',
  '/js/meals.js',
  '/js/goals.js',
  '/js/debt.js',
  '/js/verse.js',
  '/js/routine.js',
  '/data/recipes.json',
  '/data/books.json',
  '/data/verses.json',
  '/data/exercises.json',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
