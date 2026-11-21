const CACHE = 'sportschool-v4';
const ASSETS = __PRECACHE__; // se reemplaza en el build

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return; // API remota: no interceptar
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
  );
});

// Al tocar la notificación: enfocar la app y abrir la vista indicada
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const view = e.notification.data?.view || 'his';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    if (cs.length) { cs[0].postMessage({ type: 'goto', view }); return cs[0].focus(); }
    return self.clients.openWindow('./#' + view);
  }));
});
