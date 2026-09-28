import './EmptyState.css'

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {Icon && <Icon size={28} strokeWidth={1.6} />}
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
