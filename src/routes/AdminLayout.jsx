import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Database, FileSpreadsheet, ClipboardCheck, LogOut, ShieldCheck, TicketPlus, Map, Receipt } from 'lucide-react'
import ThemeToggle from '../components/layout/ThemeToggle'
import { useSessionContext } from '../hooks/SessionContext'
import './AdminLayout.css'

export default function AdminLayout() {
  const { logout } = useSessionContext()

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
          <button type="button" className="admin-topbar__logout" onClick={logout}>
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
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
      </nav>
      <main className="container admin-shell__content">
        <Outlet />
      </main>
    </div>
  )
}
