import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Database, FileSpreadsheet, ClipboardCheck, LogOut, ShieldCheck, TicketPlus, Map, Receipt, User, Settings, ChevronDown, AlertTriangle } from 'lucide-react'
import ThemeToggle from '../components/layout/ThemeToggle'
import AlertBell from '../components/layout/AlertBell'
import { useSessionContext } from '../hooks/SessionContext'
import './AdminLayout.css'

export default function AdminLayout() {
  const { session, logout } = useSessionContext()
  const [open, setOpen] = useState(false)

  const initials = (session?.user?.name || session?.user?.employee_name || 'A')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <img className="admin-topbar__logo" src="/lloyds-metals-logo.png" alt="Lloyds Metals & Energy" />
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Lloyds Metals &amp; Energy — Administration</span>
        </div>
        <div className="admin-topbar__actions">
          <ThemeToggle />
          <AlertBell />
          <div className="admin-topbar__profile">
            <button
              type="button"
              className="admin-topbar__avatar"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((current) => !current)}
            >
              {initials}
              <ChevronDown size={14} />
            </button>

            {open && (
              <div className="admin-topbar__dropdown">
                <NavLink className="admin-topbar__dropdown-item" to="/admin" onClick={() => setOpen(false)}>
                  <User size={16} />
                  <span>Profile</span>
                </NavLink>
                <button type="button" className="admin-topbar__dropdown-item" onClick={() => setOpen(false)}>
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="admin-topbar__dropdown-separator" />
                <button type="button" className="admin-topbar__dropdown-item admin-topbar__dropdown-item--danger" onClick={() => { setOpen(false); logout(); }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <nav className="admin-nav" aria-label="Administration navigation">
        <NavLink end to="/admin"><LayoutDashboard size={16} /> Overview</NavLink>
        <NavLink to="/admin/approvals"><ClipboardCheck size={16} /> Approvals</NavLink>
        <NavLink to="/admin/special-booking"><TicketPlus size={16} /> Special booking</NavLink>
        <NavLink to="/admin/gps-dashboard"><Map size={16} /> GPS Dashboard</NavLink>
        <NavLink to="/admin/billing"><Receipt size={16} /> Billing</NavLink>
        <NavLink to="/admin/master-data"><Database size={16} /> Master data</NavLink>
        <NavLink to="/admin/master-report"><FileSpreadsheet size={16} /> Master report</NavLink>
        <NavLink to="/app/alerts"><AlertTriangle size={16} /> Alerts</NavLink>
      </nav>
      <main className="container admin-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
