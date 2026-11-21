import { useState } from 'react';
import { add, remove } from '../lib/db.js';
import { Icon } from './Icons.jsx';
import { initials } from '../lib/utils.js';

const DISC = ['Atletismo', 'Fútbol', 'Baloncesto', 'Voleibol', 'Natación', 'Ciclismo', 'Otra'];
const empty = { nombre: '', grupo: '', disciplina: '' };

export default function StudentForm({ students, acts, reload, toast }) {
  const [f, setF] = useState(empty);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    await add('students', { nombre: f.nombre.trim(), grupo: f.grupo.trim(), disciplina: f.disciplina });
    toast('Estudiante guardado', 'ok', `${f.nombre.trim()} · ${f.disciplina}`);
    setF(empty); await reload();
  }
  async function del(s) {
    if (!confirm('¿Eliminar estudiante y sus actividades?')) return;
    await remove('students', s.id);
    for (const a of acts.filter(x => x.estId === s.id)) await remove('activities', a.id);
    toast('Estudiante eliminado', 'info', s.nombre);
    reload();
  }
  return (
    <section className="view">
      <h2>Registro de estudiantes</h2>
      <form className="card" onSubmit={submit}>
        <label>Nombre<input value={f.nombre} onChange={set('nombre')} required maxLength={80} /></label>
        <div className="two">
          <label>Grupo<input value={f.grupo} onChange={set('grupo')} required maxLength={20} placeholder="Ej. 3°A" /></label>
          <label>Disciplina deportiva
            <select value={f.disciplina} onChange={set('disciplina')} required>
              <option value="">Selecciona…</option>
              {DISC.map(d => <option key={d}>{d}</option>)}
            </select>
          </label>
        </div>
        <button className="btn"><Icon n="plus" size={18} />Guardar estudiante</button>
      </form>
      <ul className="list">
        {students.length ? students.map(s => (
          <li key={s.id} className="card">
            <span className="avatar">{initials(s.nombre)}</span>
            <div className="who"><b>{s.nombre}</b><span><em className="chip">{s.grupo}</em><em className="chip hot">{s.disciplina}</em></span></div>
            <button className="icon-btn danger" onClick={() => del(s)} aria-label={`Eliminar a ${s.nombre}`}><Icon n="trash" size={18} /></button>
          </li>
        )) : <li className="empty card"><Icon n="users" size={32} /><b>Aún no hay estudiantes</b><span>Registra el primero con el formulario de arriba.</span></li>}
      </ul>
    </section>
  );
}
