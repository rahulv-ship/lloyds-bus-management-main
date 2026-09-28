import { Bell, LogOut } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'
import { useSessionContext } from '../../hooks/SessionContext'
import './TopBar.css'

export default function TopBar({ title }) {
  const { session, logout } = useSessionContext()

  const initials = (session?.user?.name || session?.user?.employee_name || 'E')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="topbar">
      <h1 className="topbar__title">{title}</h1>

      <div className="topbar__actions">
        <NotificationBell />
        <ThemeToggle />

        <div className="topbar__avatar" aria-hidden="true">
          {initials}
        </div>

        <button type="button" className="topbar__logout" onClick={logout} aria-label="Sign out">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
