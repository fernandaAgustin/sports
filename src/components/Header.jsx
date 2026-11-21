import { useEffect, useState } from 'react';
import { Icon, Logo } from './Icons.jsx';

const initialTheme = () =>
  localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const TABS = [['home', 'Inicio', 'home'], ['est', 'Alumnos', 'users'], ['act', 'Actividad', 'bolt'], ['his', 'Historial', 'list'], ['des', 'Desempeño', 'chart']];

export default function Header({ view, setView }) {
  const [online, setOnline] = useState(navigator.onLine);
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    addEventListener('online', on); addEventListener('offline', off);
    return () => { removeEventListener('online', on); removeEventListener('offline', off); };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      <header className="top">
        <Logo size={34} />
        <h1>SportSchool</h1>
        <span className={'pill' + (online ? '' : ' off')}><i />{online ? 'En línea' : 'Sin conexión'}</span>
        <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Cambiar entre modo claro y oscuro">
          <Icon n={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
      </header>
      <nav id="tabs" aria-label="Secciones">
        {TABS.map(([k, t, i]) => (
          <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)} aria-current={view === k ? 'page' : undefined}>
            <Icon n={i} size={20} /><span>{t}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
