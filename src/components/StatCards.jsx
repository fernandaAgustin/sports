import { fmtTime } from '../lib/utils.js';
import { Icon } from './Icons.jsx';

const Stat = ({ i, v, l }) => (
  <div className="stat"><span className="s-ico"><Icon n={i} size={20} /></span><div><b>{v}</b><span>{l}</span></div></div>
);
export default function StatCards({ t, students }) {
  return (
    <div className="grid">
      {students !== undefined && <Stat i="users" v={students} l="Estudiantes" />}
      <Stat i="bolt" v={t.n} l="Actividades" />
      <Stat i="clock" v={fmtTime(t.min)} l="Tiempo acumulado" />
      <Stat i="route" v={t.km.toFixed(2) + ' km'} l="Distancia recorrida" />
    </div>
  );
}
