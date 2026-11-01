/*
 * offerupkh service worker.
 *
 * Goals: instant repeat loads, an offline fallback, and never leaking one user's data to another.
 *
 * - /_next/static/*            cache-first (content-hashed, immutable)
 * - images, icons, fonts       stale-while-revalidate, size-capped
 * - page navigations           network-first with navigation preload; offline page on failure.
 *                              HTML is NEVER cached: the root layout embeds the signed-in user.
 * - everything else            untouched (API calls are cross-origin, RSC payloads, POSTs,
 *                              auth and admin routes go straight to the network).
 *
 * Bump VERSION to invalidate every cache on the next activation.
 */
const VERSION = "v1"
const STATIC_CACHE = `k26-static-${VERSION}`
const MEDIA_CACHE = `k26-media-${VERSION}`
const SHELL_CACHE = `k26-shell-${VERSION}`
const OFFLINE_URL = "/offline.html"
const MEDIA_MAX_ENTRIES = 250

const SHELL_ASSETS = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/images/logo.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS.map((url) => new Request(url, { cache: "reload" }))))
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([STATIC_CACHE, MEDIA_CACHE, SHELL_CACHE])
      const keys = await caches.keys()
      await Promise.all(keys.filter((key) => key.startsWith("k26-") && !keep.has(key)).map((key) => caches.delete(key)))
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable()
      }
      await self.clients.claim()
    })()
  )
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

function isBypassed(url, request) {
  if (request.method !== "GET") return true
  if (url.origin !== self.location.origin) return true
  // RSC payloads and prefetches are per-user and handled by the Next.js router cache.
  if (request.headers.get("RSC") || request.headers.get("Next-Router-Prefetch")) return true
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return true
  if (url.pathname === "/sw.js") return true
  return false
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length <= maxEntries) return
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)))
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(event) {
  const { request } = event
  const cache = await caches.open(MEDIA_CACHE)
  // Searches every cache so precached shell assets (logo, icons) also serve offline.
  const cached = await caches.match(request)
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone())
        await trimCache(MEDIA_CACHE, MEDIA_MAX_ENTRIES)
      }
      return response
    })
    .catch(() => cached)
  if (cached) {
    event.waitUntil(network)
    return cached
  }
  const response = await network
  return response || Response.error()
}

async function networkFirstNavigation(event) {
  try {
    const preloaded = await event.preloadResponse
    if (preloaded) return preloaded
    return await fetch(event.request)
  } catch {
    const cache = await caches.open(SHELL_CACHE)
    return (await cache.match(OFFLINE_URL)) || Response.error()
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (isBypassed(url, request)) return

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(event))
    return
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request))
    return
  }

  if (
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(staleWhileRevalidate(event))
  }
})
