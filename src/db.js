let dbp;
function open() {
  return (dbp ??= new Promise((ok, fail) => {
    const r = indexedDB.open('sportschool', 1);
    r.onupgradeneeded = () => {
      r.result.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
      r.result.createObjectStore('activities', { keyPath: 'id', autoIncrement: true });
    };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => fail(r.error);
  }));
}
async function run(name, mode, fn) {
  const db = await open();
  return new Promise((ok, fail) => {
    const r = fn(db.transaction(name, mode).objectStore(name));
    r.onsuccess = () => ok(r.result);
    r.onerror = () => fail(r.error);
  });
}
export const getAll = n => run(n, 'readonly', s => s.getAll());
export const add = (n, o) => run(n, 'readwrite', s => s.add(o));
export const put = (n, o) => run(n, 'readwrite', s => s.put(o));
export const remove = (n, id) => run(n, 'readwrite', s => s.delete(id));
