import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import AlertModal from '../../components/common/AlertModal'
import Button from '../../components/common/Button'
import './BillingPage.css'

export default function BillingPage() {
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))
        setRecords([
          { id: 1, month: '2026-09', bus: 'BUS-01', route: 'Route 1', trips: 22, amount: 44000, status: 'PAID' },
          { id: 2, month: '2026-09', bus: 'BUS-02', route: 'Route 2', trips: 18, amount: 36000, status: 'PENDING' },
          { id: 3, month: '2026-08', bus: 'BUS-01', route: 'Route 1', trips: 20, amount: 40000, status: 'PAID' },
        ])
      } catch (e) {
        setError(e.response?.data?.message || e.message)
        setShowError(true)
      }
    }

    load()
  }, [])

  const dl = () => {
    const lines = records.map(x => `${x.month},${x.bus},${x.route},${x.trips},${x.amount},${x.status}`)
    const u = URL.createObjectURL(new Blob([`Month,Bus,Route,Trips,Amount,Status\n${lines.join('\n')}`], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = u
    a.download = 'billing.csv'
    a.click()
    URL.revokeObjectURL(u)
  }

  return (
    <div className="stack billing-page">
      <h1>Billing</h1>
      <p>Trip billing, usage-based charges, and payment status.</p>

      <AlertModal open={showError} title="Close box" message={error} confirmLabel="Close" onConfirm={() => setShowError(false)} />

      <div className="card">
        <div className="billing-header">
          <h2>Billing records</h2>
          <Button onClick={dl} className="btn-download">
            <Download size={18} />
            Download CSV
          </Button>
        </div>

        <div className="billing-table-wrap">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Bus</th>
                <th>Route</th>
                <th>Trips</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.id}>
                  <td>{row.month}</td>
                  <td className="font-mono">{row.bus}</td>
                  <td>{row.route}</td>
                  <td>{row.trips}</td>
                  <td>{row.amount.toLocaleString()}</td>
                  <td>
                    <span className={`billing-status billing-status--${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!records.length && (
                <tr>
                  <td colSpan={6} className="billing-empty">No billing records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
