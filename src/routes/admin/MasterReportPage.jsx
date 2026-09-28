import { useEffect, useState } from 'react'
import api from '../../services/api'
import Button from '../../components/common/Button'
import AlertModal from '../../components/common/AlertModal'
import StatusBadge from '../../components/common/StatusBadge'
import './MasterReportPage.css'

const TABLE_CONFIG = {
  buses: {
    label: 'Buses',
    columns: [
      { key: 'bus_number', label: 'Bus Number' },
      { key: 'registration_number', label: 'Registration' },
      { key: 'seating_capacity', label: 'Seats' },
      { key: 'vendor.vendor_name', label: 'Vendor' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => {
      if (key.includes('.')) {
        return key.split('.').reduce((obj, k) => (obj && obj[k]), row) || '—'
      }
      return row[key] ?? '—'
    },
  },
  routes: {
    label: 'Routes',
    columns: [
      { key: 'route_number', label: 'Route No.' },
      { key: 'route_name', label: 'Route Name' },
      { key: 'source', label: 'Source' },
      { key: 'destination', label: 'Destination' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => row[key] ?? '—',
  },
  stops: {
    label: 'Stops',
    columns: [
      { key: 'stop_code', label: 'Code' },
      { key: 'stop_name', label: 'Stop Name' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => row[key] ?? '—',
  },
  shifts: {
    label: 'Shifts',
    columns: [
      { key: 'shift_code', label: 'Code' },
      { key: 'shift_name', label: 'Shift Name' },
      { key: 'start_time', label: 'Start Time' },
      { key: 'end_time', label: 'End Time' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => row[key] ?? '—',
  },
  vendors: {
    label: 'Vendors',
    columns: [
      { key: 'vendor_code', label: 'Code' },
      { key: 'vendor_name', label: 'Vendor Name' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => row[key] ?? '—',
  },
  drivers: {
    label: 'Drivers',
    columns: [
      { key: 'driver_code', label: 'Code' },
      { key: 'driver_name', label: 'Name' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'bus.bus_number', label: 'Bus' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => {
      if (key.includes('.')) {
        return key.split('.').reduce((obj, k) => (obj && obj[k]), row) || '—'
      }
      return row[key] ?? '—'
    },
  },
  conductors: {
    label: 'Conductors',
    columns: [
      { key: 'conductor_code', label: 'Code' },
      { key: 'conductor_name', label: 'Name' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'bus.bus_number', label: 'Bus' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => {
      if (key.includes('.')) {
        return key.split('.').reduce((obj, k) => (obj && obj[k]), row) || '—'
      }
      return row[key] ?? '—'
    },
  },
  services: {
    label: 'Services',
    columns: [
      { key: 'bus.bus_number', label: 'Bus' },
      { key: 'route.route_number', label: 'Route' },
      { key: 'shift.shift_name', label: 'Shift' },
      { key: 'employee_capacity', label: 'Capacity' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    getValue: (row, key) => {
      if (key.includes('.')) {
        return key.split('.').reduce((obj, k) => (obj && obj[k]), row) || '—'
      }
      return row[key] ?? '—'
    },
  },
}

export default function MasterReportPage() {
  const [r, setR] = useState(null)
  const [e, setE] = useState('')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    api.get('/admin/master-report')
      .then(x => setR(x.data.data))
      .catch(x => {
        setE(x.response?.data?.message || x.message)
        setShowError(true)
      })
  }, [])

  useEffect(() => {
    if (e) setShowError(true)
  }, [e])

  const dl = () => {
    const lines = Object.entries(r).flatMap(([t, a]) =>
      a.map(x => `${t},${x.id},${x.bus_number || x.route_number || x.stop_name || x.shift_name || x.vendor_name || x.driver_name || x.conductor_name || ''},${x.status || ''}`)
    )
    const u = URL.createObjectURL(new Blob([`Type,ID,Name,Status\n${lines.join('\n')}`], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = u
    a.download = 'bus-master-report.csv'
    a.click()
    URL.revokeObjectURL(u)
  }

  if (!r) {
    return (
      <div className="stack master-report-page">
        <div className="page-header">
          <div>
            <h1>Master Report</h1>
            <p className="page-subtitle">Consolidated overview of all system master data.</p>
          </div>
        </div>
        <AlertModal open={showError} title="Close box" message={e} confirmLabel="Close" onConfirm={() => setShowError(false)} />
        <section className="card">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Preparing report…</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="stack master-report-page">
      <div className="page-header">
        <div>
          <h1>Master Report</h1>
          <p className="page-subtitle">Consolidated overview of all system master data.</p>
        </div>
        <Button onClick={dl} className="btn-download">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download CSV
        </Button>
      </div>

      <AlertModal open={showError} title="Close box" message={e} confirmLabel="Close" onConfirm={() => setShowError(false)} />

      <section className="card">
        <h2>Summary</h2>
        <div className="admin-stat-grid">
          {Object.entries(r).map(([k, v]) => (
            <article key={k} className="stat-card">
              <b>{v.length}</b>
              <span>{k.replace(/_/g, ' ')}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="master-report-tables">
        {Object.entries(r).map(([key, rows]) => {
          const config = TABLE_CONFIG[key]
          if (!config || !rows.length) return null

          return (
            <section key={key} className="card master-report-section">
              <h2>{config.label}</h2>
              <div className="master-report-table-wrap">
                <table className="master-report-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {config.columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, idx) => (
                      <tr key={row.id || idx}>
                        <td className="master-report-table__index">{idx + 1}</td>
                        {config.columns.map((col) => (
                          <td key={col.key}>
                            {col.type === 'status'
                              ? <StatusBadge status={config.getValue(row, col.key)} size="sm" />
                              : config.getValue(row, col.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
