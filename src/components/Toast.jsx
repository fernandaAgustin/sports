import { Icon } from './Icons.jsx';
const ICON = { ok: 'check', err: 'alert', info: 'info' };

export default function Toasts({ items, close }) {
  return (
    <div id="toasts" aria-live="polite">
      {items.map(t => (
        <div key={t.id} className={'toast ' + t.type} role="status">
          <span className="t-ico"><Icon n={ICON[t.type]} size={18} /></span>
          <div className="t-body"><b>{t.title}</b>{t.msg && <span>{t.msg}</span>}</div>
          <button className="t-x" onClick={() => close(t.id)} aria-label="Cerrar aviso"><Icon n="close" size={16} /></button>
          <i className="t-bar" />
        </div>
      ))}
    </div>
  );
}
