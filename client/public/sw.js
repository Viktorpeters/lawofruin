/* The Laws of Ruin service worker.
   Keeps the whole book readable with no signal once it has been opened one time:
   - pages (/app): network first, the saved copy when offline;
   - the app's code, fonts and styles (/_next/static), the hourglass, icons and photos:
     saved the first time they load, then served from the phone.
   - the book's words (/api/book on the server): fetched fresh, the saved copy when offline,
     so a reader who opened the book once can read it on a plane. */
const SHELL = "lor-shell-v3";
const ASSETS = "lor-assets-v2";
const PRECACHE = ["/app", "/icons/icon-192.png", "/loader/hourglass.webp"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isAsset = (url) =>
  url.origin === self.location.origin &&
  (url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/figures/") ||
    url.pathname.startsWith("/loader/") ||
    url.pathname.startsWith("/hourglass/") ||
    url.pathname.startsWith("/icons/"));

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // the book's words: fresh when there is signal, the last copy when there is none
  if (url.pathname === "/api/book") {
    const key = url.origin + url.pathname + url.search;   // one saved copy per language
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(SHELL).then((c) => c.put(key, copy)); }
          return res;
        })
        .catch(() => caches.match(key).then((hit) => hit || Response.error()))
    );
    return;
  }

  // the app's files never change under the same name, so the saved copy is always right
  if (isAsset(url)) {
    event.respondWith(
      caches.open(ASSETS).then((c) =>
        c.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res.ok) c.put(req, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  // pages: network first, fall back to the saved copy when offline
  if (req.mode !== "navigate") return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(SHELL).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("/app")))
  );
});
