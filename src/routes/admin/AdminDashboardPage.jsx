import { useEffect, useState } from 'react'
import { Bus, Route, ClipboardCheck, TriangleAlert, Activity } from 'lucide-react'
import api from '../../services/api'
import AlertModal from '../../components/common/AlertModal'
import './AdminDashboardPage.css'

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((r) => setData(r.data.data))
      .catch((e) => {
        setError(e.response?.data?.message || e.message)
        setShowError(true)
      })
  }, [])

  useEffect(() => {
    if (error) setShowError(true)
  }, [error])

  const stats = data?.stats
  return <div className="stack admin-dashboard">
    <section className="admin-dashboard__hero"><div><span className="admin-dashboard__eyebrow"><Activity size={14}/> Lloyds transport command centre</span><h1>Transport operations</h1><p>Fleet readiness, seat capacity, and employee services at a glance.</p></div><img src="/lloyds-metals-logo.png" alt="Lloyds Metals & Energy" /></section>
    <AlertModal open={showError} title="Close box" message={error} confirmLabel="Close" onConfirm={() => setShowError(false)} />
    <div className="admin-stat-grid">
      <article><Bus /><b>{stats ? `${stats.activeBuses} / ${stats.buses}` : '—'}</b><span>Active buses</span></article>
      <article><Route /><b>{stats ? `${stats.activeRoutes} / ${stats.routes}` : '—'}</b><span>Active routes</span></article>
      <article><ClipboardCheck /><b>{stats?.pending ?? '—'}</b><span>Pending approvals</span></article>
      <article><TriangleAlert /><b>{data?.alerts.length ?? '—'}</b><span>Capacity alerts</span></article>
    </div>
    <section className="card"><h2>Live seat availability</h2><p className="admin-dashboard__hint">Counts include pending and approved applications. GPS-based live position will be added when its API is available.</p>
      <div className="admin-utilization">{data?.utilization.map((item) => <div key={item.bus_route_id}><b>{item.bus_number}</b><span>{item.route_number} · {item.shift_name}</span><strong>Capacity: {item.capacity} · Booked: {item.booked} · Available: {item.available}</strong></div>)}</div>
    </section>
    <section className="card"><h2>Operational alerts</h2>{data?.alerts.length ? <ul className="admin-alerts">{data.alerts.map((alert, i) => <li className={alert.tone} key={i}>{alert.message}</li>)}</ul> : <p>No utilization alerts at the moment.</p>}</section>
  </div>
}
