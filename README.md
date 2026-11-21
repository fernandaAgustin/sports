# SportSchool (PWA con React + Vite)

## Estructura
- `public/manifest.webmanifest`, `public/sw.js`, `public/icons/` — archivos PWA
- `src/lib/db.js` (IndexedDB), `src/lib/utils.js` (Fetch, notificaciones, utilidades)
- `src/components/` — Splash, Header, Home, StudentForm, ActivityForm, History, Performance, StatCards
- `dist/` — versión compilada lista para publicar

## Ejecutar
Desarrollo: `npm install && npm run dev` (el Service Worker se prueba mejor con la versión compilada)
Producción: `npm install && npm run build && npm run preview` → http://localhost:8080
Publicar: subir el contenido de `dist/` a GitHub Pages / Netlify / Vercel (HTTPS).

## Pruebas (Chrome DevTools)
1. Registrar un estudiante y 2 actividades; recargar: los datos persisten (Application > IndexedDB > sportschool).
2. Application > Service Workers: "activated"; Cache Storage: sportschool-v2; Manifest sin errores.
3. Network > Offline y recargar: la app y los datos cargan.
4. "Enviar al servidor": POST con Fetch a jsonplaceholder (endpoint de prueba; NO es sincronización real).
5. Guardar actividad con permiso concedido: notificación local. Geolocalización opcional en el formulario.
6. Lighthouse > Progressive Web App.
