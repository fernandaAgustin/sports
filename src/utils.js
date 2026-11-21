export const fmtTime = m => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);
export const totals = list => ({
  n: list.length,
  min: list.reduce((a, x) => a + x.min, 0),
  km: list.reduce((a, x) => a + x.km, 0),
});
export async function notify(title, body) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') await Notification.requestPermission();
  if (Notification.permission !== 'granted') return;
  const reg = await navigator.serviceWorker?.getRegistration();
  const opts = { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' };
  reg ? reg.showNotification(title, opts) : new Notification(title, opts);
}
