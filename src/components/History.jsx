import { useState } from 'react';
import { remove } from '../lib/db.js';
import { Icon } from './Icons.jsx';

export default function History({ students, acts, reload, toast }) {
  const [filt, setFilt] = useState('all');
  const name = id => students.find(s => s.id === id)?.nombre ?? '(eliminado)';
  const rows = acts.filter(a => filt === 'all' || String(a.estId) === filt).sort((a, b) => b.fecha.localeCompare(a.fecha));
  async function del(a) { if (confirm('¿Borrar esta actividad?')) { await remove('activities', a.id); toast('Actividad borrada', 'info'); reload(); } }
  return (
    <section className="view">
      <h2>Historial deportivo</h2>
      <label className="filter">Estudiante
        <select value={filt} onChange={e => setFilt(e.target.value)}>
          <option value="all">Todos</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.grupo})</option>)}
        </select>
      </label>
      <div className="card scroll"><table>
        <thead><tr><th>Fecha</th><th>Estudiante</th><th>Actividad</th><th>Min</th><th>Km</th><th>Observaciones</th><th>Ubicación</th><th></th></tr></thead>
        <tbody>
          {rows.length ? rows.map(a => (
            <tr key={a.id}><td>{a.fecha}</td><td><b>{name(a.estId)}</b></td><td><em className="chip hot">{a.actividad}</em></td><td>{a.min}</td><td>{a.km}</td><td>{a.obs}</td>
              <td>{a.lat != null ? <em className="chip">{a.lat.toFixed(3)}, {a.lng.toFixed(3)}</em> : '—'}</td>
              <td><button className="icon-btn danger" onClick={() => del(a)} aria-label="Borrar actividad"><Icon n="trash" size={16} /></button></td></tr>
          )) : <tr><td colSpan="8" className="empty-td">Sin actividades registradas.</td></tr>}
        </tbody></table></div>
    </section>
  );
}
