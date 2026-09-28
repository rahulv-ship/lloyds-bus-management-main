import { useMemo } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import './NotificationsPage.css'

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, loading } = useNotifications()

  const grouped = useMemo(() => {
    const unread = notifications.filter((item) => !item.read)
    const read = notifications.filter((item) => item.read)
    return { unread, read }
  }, [notifications])

  if (loading) {
    return <div className="notifications-page">Loading notifications…</div>
  }

  return (
    <div className="notifications-page">
      <div className="notifications-page__header">
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount} unread notification{unreadCount === 1 ? '' : 's'}</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="btn btn--primary" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {!notifications.length && (
        <div className="notifications-page__empty">No notifications yet.</div>
      )}

      <div className="notifications-page__list">
        {grouped.unread.map((item) => (
          <div
            key={item.id}
            className="notifications-page__item notifications-page__item--unread"
            onClick={() => markRead(item.id)}
          >
            <div className="notifications-page__item-title">{item.title}</div>
            <div className="notifications-page__item-message">{item.message}</div>
            <div className="notifications-page__item-time">
              {new Date(item.created_at).toLocaleString()}
            </div>
          </div>
        ))}
        {grouped.read.map((item) => (
          <div
            key={item.id}
            className="notifications-page__item notifications-page__item--read"
            onClick={() => markRead(item.id)}
          >
            <div className="notifications-page__item-title">{item.title}</div>
            <div className="notifications-page__item-message">{item.message}</div>
            <div className="notifications-page__item-time">
              {new Date(item.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
