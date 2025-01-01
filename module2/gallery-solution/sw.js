const CACHE_VERSION = 'v1';

const cacheFirst = async (request) => {
    const cache = await caches.open(CACHE_VERSION);
    const responseFromCache = await cache.match(request, {
        ignoreSearch: true
    });

    if (responseFromCache) {
        return responseFromCache;
    }

    try {
        const responseFromNetwork = await fetch(request.clone());
        await cache.put(request, responseFromNetwork.clone());

        return responseFromNetwork;
    } catch (error) {
        return new Response('Network Error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
};

const cleanup = async () => {
    const keys = await caches.keys();
    const oldCache = keys.filter(key => key != CACHE_VERSION);

    return Promise.all(oldCache.map(key => caches.delete(key)))
}

const addResources = async () => {
    const cache = await caches.open(CACHE_VERSION);
    return cache.addAll([
        'https://placehold.co/2000x2000/FFFF00/000000/png'
    ]);
}

self.addEventListener('install', (event) => event.waitUntil(addResources()))
self.addEventListener('activate', (event) => event.waitUntil(cleanup()));
self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request));
});