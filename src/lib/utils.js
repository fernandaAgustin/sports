export const fmtTime = m => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);
export const totals = list => ({
  n: list.length,
  min: list.reduce((a, x) => a + x.min, 0),
  km: list.reduce((a, x) => a + x.km, 0)
});
export const initials = n => n.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

// Notificación local (previa autorización). Con Service Worker incluye acción y abre el historial al tocarla.
export async function notify({ title, body, tag = 'actividad', view = 'his' }) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') await Notification.requestPermission();
  if (Notification.permission !== 'granted') return;
  const base = { body, tag, renotify: true, icon: './icons/icon-192.png', badge: './icons/icon-192.png', vibrate: [80, 40, 80], timestamp: Date.now(), data: { view } };
  const reg = await navigator.serviceWorker?.getRegistration();
  reg ? reg.showNotification(title, { ...base, actions: [{ action: 'ver', title: 'Ver historial' }] }) : new Notification(title, base);
}

// Fetch API: endpoint de prueba (sustituir por el del docente)
export const ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';
export async function sendToServer(pending) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app: 'SportSchool', pendientes: pending.length, actividades: pending })
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
