import StatCards from './StatCards.jsx';
import { totals, fmtTime } from '../lib/utils.js';

export default function Performance({ students, acts }) {
  const rows = students.map(s => ({ s, t: totals(acts.filter(a => a.estId === s.id)) }));
  const maxKm = Math.max(1, ...rows.map(r => r.t.km));
  return (
    <section className="view">
      <h2>Desempeño</h2>
      <StatCards t={totals(acts)} />
      <div className="card scroll"><table>
        <thead><tr><th>Estudiante</th><th>Actividades</th><th>Tiempo total</th><th>Distancia</th></tr></thead>
        <tbody>
          {rows.length ? rows.map(({ s, t }) => (
            <tr key={s.id}><td><b>{s.nombre}</b></td><td>{t.n}</td><td>{fmtTime(t.min)}</td>
              <td><div className="bar"><i style={{ width: (t.km / maxKm) * 100 + '%' }} /></div>{t.km.toFixed(2)} km</td></tr>
          )) : <tr><td colSpan="4" className="empty-td">Sin datos.</td></tr>}
        </tbody></table></div>
    </section>
  );
}
