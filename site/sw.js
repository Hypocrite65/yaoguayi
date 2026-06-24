const CACHE_NAME = 'yaoguayi-v1';

const PRECACHE = [
  '/',
  '/hexagrams.html',
  '/qigua.html',
  '/guanxiang.html',
  '/learn.html',
  '/hexagram.html',
  '/css/common.css',
  '/css/tool-window.css',
  '/js/search.js',
  '/js/layout.js',
  '/js/theme.js',
  '/js/auth.js',
  '/js/admin-panel.js',
  '/data/hexagrams.json',
  '/data/knowledge.json',
  '/favicon.svg',
  '/manifest.json',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; })
          .map(function (n) { return caches.delete(n); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res.ok) {
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(e.request, clone);
        });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
