import './ApplicationFilters.css'

export default function ApplicationFilters({ apps, filters, onChange }) {
  const statuses = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
  const routes = [...new Set(apps.map((a) => a.route?.route_number).filter(Boolean))]
  const buses = [...new Set(apps.map((a) => a.bus?.bus_number).filter(Boolean))]

  return (
    <div className="app-filters">
      <select value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })}>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s === 'ALL' ? 'All statuses' : s}
          </option>
        ))}
      </select>

      {routes.length > 0 && (
        <select value={filters.route} onChange={(e) => onChange({ ...filters, route: e.target.value })}>
          <option value="ALL">All routes</option>
          {routes.map((r) => (
            <option key={r} value={r}>
              Route {r}
            </option>
          ))}
        </select>
      )}

      {buses.length > 0 && (
        <select value={filters.bus} onChange={(e) => onChange({ ...filters, bus: e.target.value })}>
          <option value="ALL">All buses</option>
          {buses.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      )}

      <input
        type="month"
        value={filters.month}
        onChange={(e) => onChange({ ...filters, month: e.target.value })}
        aria-label="Filter by month"
      />
    </div>
  )
}
