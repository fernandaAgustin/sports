import { fmtTime } from '../utils.js';
export default function Stats({ t, students }) {
  return (
    <div className="grid">
      {students !== undefined && <div className="stat"><b>{students}</b><span>Estudiantes</span></div>}
      <div className="stat"><b>{t.n}</b><span>Actividades</span></div>
      <div className="stat"><b>{fmtTime(t.min)}</b><span>Tiempo acumulado</span></div>
      <div className="stat"><b>{t.km.toFixed(2)} km</b><span>Distancia recorrida</span></div>
    </div>
  );
}
