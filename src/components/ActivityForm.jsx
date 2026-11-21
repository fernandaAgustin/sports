import { useState } from 'react';
import { add } from '../lib/db.js';
import { Icon } from './Icons.jsx';
import { notify, fmtTime } from '../lib/utils.js';

const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ estId: '', fecha: today(), actividad: '', min: '', km: '', obs: '' });

export default function ActivityForm({ students, acts, reload, toast }) {
  const [f, setF] = useState(blank());
  const [geo, setGeo] = useState(null);
  const [geoMsg, setGeoMsg] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const estId = f.estId || (students[0] ? String(students[0].id) : '');

  function locate() {
    if (!navigator.geolocation) return setGeoMsg('Geolocalización no disponible.');
    setGeoMsg('Obteniendo ubicación…');
    navigator.geolocation.getCurrentPosition(
      p => { const g = { lat: p.coords.latitude, lng: p.coords.longitude }; setGeo(g); setGeoMsg(`${g.lat.toFixed(4)}, ${g.lng.toFixed(4)}`); toast('Ubicación agregada', 'ok'); },
      err => { setGeoMsg('No se pudo obtener la ubicación.'); toast('Sin ubicación', 'info', err.message); },
      { enableHighAccuracy: true, timeout: 10000 });
  }
  async function submit(e) {
    e.preventDefault();
    if (!estId) return toast('Primero registra un estudiante', 'err');
    const a = { estId: +estId, fecha: f.fecha, actividad: f.actividad.trim(), min: +f.min, km: +f.km, obs: f.obs.trim(),
      lat: geo?.lat ?? null, lng: geo?.lng ?? null, synced: false };
    await add('activities', a);
    setF(blank()); setGeo(null); setGeoMsg('');
    await reload();
    const s = students.find(x => x.id === a.estId);
    const total = acts.filter(x => x.estId === a.estId).length + 1;
    toast('Actividad guardada', 'ok', `${s?.nombre} · ${a.actividad}`);
    notify({
      title: `Actividad registrada · ${s?.nombre}`,
      body: `${a.actividad}: ${fmtTime(a.min)} y ${a.km} km.\nLleva ${total} ${total === 1 ? 'actividad' : 'actividades'} registradas.`,
      tag: 'actividad-' + a.estId
    });
  }
  return (
    <section className="view">
      <h2>Registro de actividad</h2>
      <form className="card" onSubmit={submit}>
        <label>Estudiante
          <select value={estId} onChange={set('estId')} required>
            {students.length ? students.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.grupo})</option>)
              : <option value="">Primero registra un estudiante</option>}
          </select>
        </label>
        <div className="two">
          <label>Fecha<input type="date" value={f.fecha} onChange={set('fecha')} required /></label>
          <label>Actividad<input value={f.actividad} onChange={set('actividad')} required maxLength={60} placeholder="Ej. Carrera continua" /></label>
        </div>
        <div className="two">
          <label>Duración (minutos)<input type="number" inputMode="numeric" min="1" step="1" value={f.min} onChange={set('min')} required /></label>
          <label>Distancia (km)<input type="number" inputMode="decimal" min="0" step="0.01" value={f.km} onChange={set('km')} required /></label>
        </div>
        <label>Observaciones<textarea rows="3" maxLength={300} value={f.obs} onChange={set('obs')} /></label>
        <div className="row tight">
          <button type="button" className="btn alt" onClick={locate}><Icon n="pin" size={18} />Agregar mi ubicación</button>
          {geoMsg && <span className="chip">{geoMsg}</span>}
        </div>
        <button className="btn"><Icon n="check" size={18} />Guardar actividad</button>
      </form>
    </section>
  );
}
