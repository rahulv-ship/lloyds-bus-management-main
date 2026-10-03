import { useState } from 'react'
import { Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'
import AlertBell from './AlertBell'
import { useSessionContext } from '../../hooks/SessionContext'
import './TopBar.css'

export default function TopBar({ title }) {
  const { session, logout } = useSessionContext()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

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
        <AlertBell />
        <ThemeToggle />

        <div className="topbar__profile">
          <button
            type="button"
            className="topbar__avatar"
            aria-expanded={open}
            aria-haspopup="true"
            onClick={() => setOpen((current) => !current)}
          >
            {initials}
            <ChevronDown size={14} />
          </button>

          {open && (
            <div className="topbar__dropdown">
              <NavLink className="topbar__dropdown-item" to="/app/profile" onClick={() => setOpen(false)}>
                <User size={16} />
                <span>Profile</span>
              </NavLink>
              <button type="button" className="topbar__dropdown-item" onClick={() => { setOpen(false); navigate('/app/settings') }}>
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <div className="topbar__dropdown-separator" />
              <button type="button" className="topbar__dropdown-item topbar__dropdown-item--danger" onClick={() => { setOpen(false); logout() }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
