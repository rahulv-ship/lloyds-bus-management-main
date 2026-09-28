import { useSessionContext } from '../../hooks/SessionContext'
import './GreetingHeader.css'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', icon: '☀️' }
  if (hour < 17) return { text: 'Good afternoon', icon: '🌤️' }
  return { text: 'Good evening', icon: '🌙' }
}

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function GreetingHeader({ hasUpcomingTrip }) {
  const { session } = useSessionContext()
  const user = session?.user || {}

  const fullName = user.name || user.employee_name || 'there'
  const firstName = fullName.split(' ')[0]
  const greeting = getGreeting()

  const employeeId = user.employeeId || user.employee_id || '—'
  const department = user.departmentName || user.department || '—'

  return (
    <div className="greeting-header">
      <div className="greeting-header__glow" aria-hidden="true" />

      <div className="greeting-header__content">
        <div className="greeting-header__avatar" aria-hidden="true">
          {getInitials(fullName)}
          <span className="greeting-header__status" />
        </div>

        <div className="greeting-header__main">
          <h2 className="greeting-header__title">
            {greeting.text}, <span className="greeting-header__name">{firstName}</span>
            <span className="greeting-header__wave" aria-hidden="true">{greeting.icon}</span>
          </h2>

          <p
            className={`greeting-header__sub ${
              hasUpcomingTrip ? 'greeting-header__sub--positive' : ''
            }`}
          >
            <span className="greeting-header__dot" aria-hidden="true" />
            {hasUpcomingTrip
              ? 'Your next journey is booked — details below.'
              : "You don't have an upcoming journey booked yet."}
          </p>
        </div>
      </div>

      <div className="greeting-header__meta">
        <div className="greeting-header__meta-item">
          <span className="greeting-header__meta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="9" cy="10" r="2" />
              <path d="M15 8h3M15 12h3M7 16h10" />
            </svg>
          </span>
          <div className="greeting-header__meta-text">
            <b>Employee ID</b>
            <span>{employeeId}</span>
          </div>
        </div>

        <div className="greeting-header__meta-divider" aria-hidden="true" />

        <div className="greeting-header__meta-item">
          <span className="greeting-header__meta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
            </svg>
          </span>
          <div className="greeting-header__meta-text">
            <b>Department</b>
            <span>{department}</span>
          </div>
        </div>
      </div>
    </div>
  )
}