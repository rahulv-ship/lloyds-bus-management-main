import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useAlerts } from '../../hooks/useAlerts'
import { NavLink } from 'react-router-dom'
import './AlertBell.css'

export default function AlertBell() {
  const { alerts, unreadCount, acknowledge } = useAlerts()
  const [open, setOpen] = useState(false)

  return (
    <div className="alert-bell">
      <button
        type="button"
        className="alert-bell__trigger"
        aria-label={`Alerts${unreadCount ? ` (${unreadCount})` : ''}`}
        onClick={() => setOpen((current) => !current)}
      >
        <AlertTriangle size={18} />
        {unreadCount > 0 && <span className="alert-bell__badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="alert-bell__popover">
          <div className="alert-bell__popover-head">
            <b>Alerts</b>
            <NavLink className="alert-bell__view-all" to="/app/alerts" onClick={() => setOpen(false)}>
              View all
            </NavLink>
          </div>
          <div className="alert-bell__list">
            {alerts.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className={`alert-bell__item ${item.acknowledged ? 'alert-bell__item--read' : ''} alert-bell__item--${(item.severity || 'info').toLowerCase()}`}
                onClick={() => acknowledge(item.id)}
              >
                <div className="alert-bell__item-title">{item.title}</div>
                <div className="alert-bell__item-message">{item.message}</div>
                <div className="alert-bell__item-time">
                  {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
                </div>
              </div>
            ))}
            {!alerts.length && (
              <div className="alert-bell__empty">No alerts yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
