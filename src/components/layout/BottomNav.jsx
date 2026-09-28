import { NavLink } from 'react-router-dom'
import { Bus, Home, IdCard, CalendarClock, UserRound } from 'lucide-react'
import './BottomNav.css'

const NAV_ITEMS = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/book', label: 'Book', icon: Bus },
  { to: '/app/pass', label: 'Pass', icon: IdCard },
  { to: '/app/bookings', label: 'Bookings', icon: CalendarClock },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          <Icon size={19} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
