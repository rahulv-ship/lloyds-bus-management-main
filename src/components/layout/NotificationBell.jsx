import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import './NotificationBell.css'

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <div className="notifications">
      <button
        type="button"
        className="notifications__trigger"
        aria-label={`Notifications${unreadCount ? ` (${unreadCount})` : ''}`}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="notifications__badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notifications__popover">
          <div className="notifications__popover-head">
            <b>Notifications</b>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead}>Mark all read</button>
            )}
          </div>
          <div className="notifications__list">
            {notifications.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className={`notifications__item ${item.read ? 'notifications__item--read' : ''}`}
                onClick={() => markRead(item.id)}
              >
                <div className="notifications__item-title">{item.title}</div>
                <div className="notifications__item-message">{item.message}</div>
                <div className="notifications__item-time">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            ))}
            {!notifications.length && (
              <div className="notifications__empty">No notifications yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
