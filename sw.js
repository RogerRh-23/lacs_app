// Nombre de la caché para esta versión de la PWA
const CACHE_NAME = 'app-gestion-v1';

// Lista de archivos que queremos cachear al instalar la PWA
// Asegúrate de incluir todos los archivos HTML, CSS, JS, e íconos necesarios para el funcionamiento offline
const urlsToCache = [
    '/', // La raíz de tu aplicación
    '/login.html',
    '/Frontend/html/persInfo.html', // Si cargas persInfo.html dinámicamente, también debe estar en caché
    '/Frontend/html/sidebar.html', // Si cargas sidebar.html dinámicamente
    '/Frontend/html/home.html',
    '/Frontend/css/style.css',
    '/Frontend/css/sidebar.css',
    '/Frontend/css/scrollbar.css',
    '/Frontend/css/persInfo.css',
    '/Frontend/js/animations.js',
    '/Frontend/js/dashboard.js',
    '/Frontend/js/scrollbar.js',
    '/Frontend/js/persInfo.js',
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
                        // Si la respuesta de la red es válida, la cachea para futuras solicitudes
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
