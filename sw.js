const CACHE_NAME = 'app-gestion-v2.6';

const urlsToCache = [
    '/',
    '/index.html',
    '/login.html',
    '/Frontend/html/persInfo.html',
    '/Frontend/html/sidebar.html',
    '/Frontend/html/home.html',
    '/Frontend/html/incidencias.html',
    '/Frontend/html/settings.html',
    '/Frontend/html/profile.html',
    '/Frontend/html/logs.html',
    '/Frontend/html/listEmp.html',
    '/Frontend/html/bajs.html',
    '/Frontend/html/altasInfo/persDt.html',
    '/Frontend/html/altasInfo/dom.html',
    '/Frontend/html/altasInfo/infoSal.html',
    '/Frontend/html/altasInfo/segBan.html',
    '/Frontend/html/altasInfo/add.html',
    '/Frontend/css/styles.css',
    '/Frontend/js/animations.js',
    '/Frontend/js/home.js',
    '/Frontend/js/dashboard.js',
    '/Frontend/js/scrollbar.js',
    '/Frontend/js/persInfo.js',
    '/Frontend/js/incidencias.js',
    '/Frontend/js/main.js',
    '/manifest.json',
    '/Frontend/icons/icon-72x72.png',
    '/Frontend/icons/icon-96x96.png',
    '/Frontend/icons/icon-128x128.png',
    '/Frontend/icons/icon-144x144.png',
    '/Frontend/icons/icon-152x152.png',
    '/Frontend/icons/icon-192x192.png',
    '/Frontend/icons/icon-384x384.png',
    '/Frontend/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando archivos estáticos:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('[Service Worker] Fallo al cachear:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Solo cacheamos solicitudes GET
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Fetch falló para:', event.request.url, error);
                        return caches.match('/offline.html');
                    });
            })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
