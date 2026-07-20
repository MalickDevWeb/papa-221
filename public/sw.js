const CACHE_NAME = 'ecole-221-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/pwa-icon.jpg',
  '/manifest.json'
];

// Installe le Service Worker et met en cache les ressources de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Mise en cache des ressources de base');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Active le Service Worker et nettoie les anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stratégie d'interception des requêtes (Network first pour API/Firebase, Cache first pour les assets statiques)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ne pas intercepter les requêtes Firestore ou les requêtes API en tâche de fond (on les laisse passer directement au réseau)
  if (
    url.pathname.startsWith('/api/') || 
    url.hostname.includes('firestore') || 
    url.hostname.includes('googleapis') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Retourner la version en cache, et mettre à jour le cache en arrière-plan (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => { /* ignorer les erreurs de réseau en arrière-plan */ });
        return cachedResponse;
      }

      // Si pas dans le cache, faire la requête réseau
      return fetch(event.request)
        .then((networkResponse) => {
          // Mettre en cache les nouveaux fichiers d'assets statiques (JS, CSS, images) s'ils proviennent de notre site
          if (
            networkResponse.status === 200 &&
            event.request.method === 'GET' &&
            (url.origin === self.location.origin) &&
            !url.pathname.includes('/api/')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si hors-ligne et que le document principal est demandé, retourner l'index en cache
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
