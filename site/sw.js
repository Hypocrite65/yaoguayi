/* 爻卦易 PWA Service Worker：离线可用 */
const CACHE_NAME = 'yaoguayi-v4';

const PRECACHE = [
  '/',
  '/index.html',
  '/hexagrams.html',
  '/hexagram.html',
  '/divination.html',
  '/glossary.html',
  '/learn.html',
  '/guanxiang.html',
  '/js/theme.js',
  '/js/version.js',
  '/js/search.js',
  '/js/tool-window.js',
  '/css/tool-window.css',
  '/data/hexagrams.json',
  '/data/annotations.json',
  '/data/knowledge.json',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/img/og-cover.png',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    }).catch(function () {
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
  // API 请求不缓存
  if (e.request.url.includes('/api/')) return;

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
