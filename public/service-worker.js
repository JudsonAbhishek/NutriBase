const CACHE_PREFIX = "nutribase-static-";
const STATIC_CACHE = `${CACHE_PREFIX}v1`;
const FOOD_IMAGE_CACHE = `${CACHE_PREFIX}food-images-v1`;
const MAX_CACHED_STATIC_ASSETS = 150;
const MAX_CACHED_FOOD_IMAGES = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith(CACHE_PREFIX) &&
                cacheName !== STATIC_CACHE &&
                cacheName !== FOOD_IMAGE_CACHE
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isFoodImageRequest(url) {
  if (url.pathname.startsWith("/food-images/")) return true;
  if (url.pathname !== "/_next/image") return false;

  const source = url.searchParams.get("url");
  return source !== null && source.startsWith("/food-images/");
}

async function cacheFirst(request, cacheName, maxEntries) {
  let cache;

  try {
    cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
  } catch (error) {
    console.error("NutriBase cache read failed:", error);
  }

  const response = await fetch(request);

  if (cache && response.ok && response.type === "basic") {
    try {
      await cache.put(request, response.clone());

      if (maxEntries) {
        const cachedRequests = await cache.keys();
        const excessCount = cachedRequests.length - maxEntries;
        await Promise.all(
          cachedRequests
            .slice(0, Math.max(0, excessCount))
            .map((cachedRequest) => cache.delete(cachedRequest))
        );
      }
    } catch (error) {
      console.error("NutriBase cache write failed:", error);
    }
  }

  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      cacheFirst(request, STATIC_CACHE, MAX_CACHED_STATIC_ASSETS)
    );
  } else if (isFoodImageRequest(url)) {
    event.respondWith(
      cacheFirst(request, FOOD_IMAGE_CACHE, MAX_CACHED_FOOD_IMAGES)
    );
  }
});
