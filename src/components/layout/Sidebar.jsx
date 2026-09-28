import { NavLink } from 'react-router-dom'
import { Bell, Bus, Home, IdCard, CalendarClock, UserRound } from 'lucide-react'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/book', label: 'Book Bus', icon: Bus },
  { to: '/app/pass', label: 'My Pass', icon: IdCard },
  { to: '/app/bookings', label: 'My Bookings', icon: CalendarClock },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img className="sidebar__logo" src="/lloyds-metals-logo.png" alt="Lloyds Metals & Energy" />
      </div>

      <nav aria-label="Main navigation" className="sidebar__route">
        <span className="sidebar__route-line" aria-hidden="true" />
        <ul>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `sidebar__stop ${isActive ? 'is-active' : ''}`}
              >
                <span className="sidebar__dot" aria-hidden="true" />
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
