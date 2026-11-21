import { useState } from 'react';
import StatCards from './StatCards.jsx';
import { Icon } from './Icons.jsx';
import { totals, sendToServer } from '../lib/utils.js';
import { put } from '../lib/db.js';

export default function Home({ students, acts, setView, reload, toast }) {
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function sync() {
    const pend = acts.filter(a => !a.synced);
    if (!navigator.onLine) { setMsg('Sin conexión: tus datos siguen guardados en el dispositivo.'); return toast('Sin conexión', 'info', 'Podrás enviar los datos cuando vuelvas a estar en línea.'); }
    setBusy(true); setMsg('');
    try {
      const j = await sendToServer(pend);
      for (const a of pend) await put('activities', { ...a, synced: true });
      setMsg(`Solicitud Fetch exitosa (id de respuesta: ${j.id}). Es un endpoint de prueba: no hay sincronización real.`);
      toast('Datos enviados', 'ok', `${pend.length} actividad(es) en la solicitud de prueba.`);
      reload();
    } catch (e) {
      setMsg('No se pudo completar la solicitud: ' + e.message + '. Tus datos locales no se perdieron.');
      toast('No se pudo enviar', 'err', 'Tus datos siguen guardados localmente.');
    } finally { setBusy(false); }
  }
  async function perm() {
    if (!('Notification' in window)) return toast('Sin soporte', 'err', 'Tu navegador no soporta notificaciones.');
    const p = await Notification.requestPermission();
    p === 'granted' ? toast('Notificaciones activadas', 'ok', 'Te avisaremos al guardar cada actividad.') : toast('Permiso no concedido', 'info', 'Puedes activarlo desde los ajustes del navegador.');
  }
  return (
    <section className="view">
      <div className="hero">
        <h2>Cada kilómetro cuenta</h2>
        <p>Registra a tus estudiantes, anota sus entrenamientos y mira cómo avanzan, con o sin conexión.</p>
        <div className="row">
          <button className="btn light" onClick={() => setView('act')}><Icon n="plus" size={18} />Nueva actividad</button>
          <button className="btn ghost" onClick={() => setView('est')}><Icon n="users" size={18} />Nuevo estudiante</button>
        </div>
      </div>
      <StatCards t={totals(acts)} students={students.length} />
      <div className="card tools">
        <h3>Herramientas</h3>
        <div className="row">
          <button className="btn alt" onClick={sync} disabled={busy}>{busy ? <span className="spin" /> : <Icon n="send" size={18} />}{busy ? 'Enviando…' : 'Enviar al servidor'}</button>
          <button className="btn alt" onClick={perm}><Icon n="bell" size={18} />Activar notificaciones</button>
        </div>
        {msg && <p className="note" role="status"><Icon n="info" size={16} />{msg}</p>}
      </div>
    </section>
  );
}
