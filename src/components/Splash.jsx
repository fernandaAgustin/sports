import { useEffect, useState } from 'react';
import { Logo } from './Icons.jsx';

export default function Splash() {
  const [ready, setReady] = useState(false);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const im = new Image();
    im.onload = im.onerror = () => setReady(true);
    im.src = './icons/icon-512.png';
    const safe = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(safe);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const a = setTimeout(() => setOut(true), 1500), b = setTimeout(() => setGone(true), 2100);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [ready]);

  if (gone) return null;
  return (
    <div id="splash" className={out ? 'out' : ''}>
      <Logo size={96} />
      <div className="logo">SportSchool</div>
      <p>Seguimiento deportivo escolar</p>
    </div>
  );
}
