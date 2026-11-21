import { useCallback, useEffect, useState } from 'react';
import Splash from './components/Splash.jsx';
import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import StudentForm from './components/StudentForm.jsx';
import ActivityForm from './components/ActivityForm.jsx';
import History from './components/History.jsx';
import Performance from './components/Performance.jsx';
import Toasts from './components/Toast.jsx';
import { getAll } from './lib/db.js';

const VIEWS = ['home', 'est', 'act', 'his', 'des'];
const fromHash = () => (VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home');

export default function App() {
  const [view, setView] = useState(fromHash);
  const [students, setStudents] = useState([]);
  const [acts, setActs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const reload = useCallback(async () => {
    const [s, a] = await Promise.all([getAll('students'), getAll('activities')]);
    setStudents(s); setActs(a);
  }, []);
  const close = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);
  const toast = useCallback((title, type = 'ok', msg = '') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t.slice(-2), { id, title, type, msg }]);
    setTimeout(() => close(id), 4200);
  }, [close]);

  useEffect(() => { reload().catch(() => toast('Error al abrir la base de datos local', 'err')); }, [reload, toast]);
  useEffect(() => {
    const onMsg = e => { if (e.data?.type === 'goto' && VIEWS.includes(e.data.view)) setView(e.data.view); };
    navigator.serviceWorker?.addEventListener('message', onMsg);
    return () => navigator.serviceWorker?.removeEventListener('message', onMsg);
  }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [view]);

  const p = { students, acts, reload, toast, setView };
  return (
    <>
      <Splash />
      <Header view={view} setView={setView} />
      <main>
        {view === 'home' && <Home {...p} />}
        {view === 'est' && <StudentForm {...p} />}
        {view === 'act' && <ActivityForm {...p} />}
        {view === 'his' && <History {...p} />}
        {view === 'des' && <Performance {...p} />}
      </main>
      <Toasts items={toasts} close={close} />
    </>
  );
}
