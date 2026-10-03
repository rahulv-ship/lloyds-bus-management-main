import { useMemo } from 'react'
import { useAlerts } from '../../hooks/useAlerts'
import './AlertsPage.css'

const severityConfig = {
  INFO: { label: 'Info', className: 'alerts-page__item--info' },
  WARNING: { label: 'Warning', className: 'alerts-page__item--warning' },
  CRITICAL: { label: 'Critical', className: 'alerts-page__item--critical' },
}

export default function AlertsPage() {
  const { alerts, unreadCount, acknowledge, acknowledgeAll, loading } = useAlerts()

  const grouped = useMemo(() => {
    const unread = alerts.filter((item) => !item.acknowledged)
    const read = alerts.filter((item) => item.acknowledged)
    return { unread, read }
  }, [alerts])

  if (loading) {
    return <div className="alerts-page">Loading alerts…</div>
  }

  return (
    <div className="alerts-page">
      <div className="alerts-page__header">
        <div>
          <h1>Alerts</h1>
          <p>{unreadCount} unread alert{unreadCount === 1 ? '' : 's'}</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="btn btn--primary" onClick={acknowledgeAll}>
            Acknowledge all
          </button>
        )}
      </div>

      {!alerts.length && (
        <div className="alerts-page__empty">No alerts yet.</div>
      )}

      <div className="alerts-page__list">
        {grouped.unread.map((item) => (
          <div
            key={item.id}
            className={`alerts-page__item alerts-page__item--unread ${severityConfig[item.severity]?.className || ''}`}
            onClick={() => acknowledge(item.id)}
          >
            <div className="alerts-page__item-head">
              <span className={`alerts-page__badge alerts-page__badge--${item.severity?.toLowerCase() || 'info'}`}>
                {severityConfig[item.severity]?.label || item.severity}
              </span>
              <span className="alerts-page__item-category">{item.category}</span>
            </div>
            <div className="alerts-page__item-title">{item.title}</div>
            <div className="alerts-page__item-message">{item.message}</div>
            <div className="alerts-page__item-time">
              {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
            </div>
          </div>
        ))}
        {grouped.read.map((item) => (
          <div
            key={item.id}
            className={`alerts-page__item alerts-page__item--read ${severityConfig[item.severity]?.className || ''}`}
          >
            <div className="alerts-page__item-head">
              <span className={`alerts-page__badge alerts-page__badge--${item.severity?.toLowerCase() || 'info'}`}>
                {severityConfig[item.severity]?.label || item.severity}
              </span>
              <span className="alerts-page__item-category">{item.category}</span>
            </div>
            <div className="alerts-page__item-title">{item.title}</div>
            <div className="alerts-page__item-message">{item.message}</div>
            <div className="alerts-page__item-time">
              {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
