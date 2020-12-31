const staticCacheName = 'norse-apps-v1';
const assets = [
  '/',
  '/tree/shawnthebarber/index.html',
  '/tree/shawnthebarber/service-worker.js',
  '/tree/shawnthebarber/styles.css',
];
// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});
// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
const dynamicCacheName = 'site-dynamic-v1';
// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key =>  key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        })
      });
    })
  );
});
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
});
self.addEventListener('activate', function(event) {
 console.log('[Service Worker] Activating Service Worker ....', event);
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
caches.match(event.request).then(function(response) {
  if (response) {
    return response;
  } else {
    return fetch(event.request).then(function(res) {
      return caches.open('dynamic').then(function(cache) {
        cache.put(event.request.url, res.clone());
        return res;
      });
    });
  }
})
  );
});
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/tree/shawnthebarber/service-worker.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
}