import { useState, useEffect } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import AlertModal from '../../components/common/AlertModal'
import './GpsDashboard.css'

export default function GpsDashboard() {
  const [buses, setBuses] = useState([])
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))
        setBuses([
          { bus_id: 1, bus_number: 'BUS-01', route: 'Route 1', shift: 'Shift A', lat: 19.076, lng: 72.8777, status: 'ACTIVE' },
          { bus_id: 2, bus_number: 'BUS-02', route: 'Route 2', shift: 'Shift B', lat: 19.089, lng: 72.8677, status: 'ACTIVE' },
          { bus_id: 3, bus_number: 'BUS-03', route: 'Route 3', shift: 'Shift C', lat: 19.061, lng: 72.889, status: 'INACTIVE' },
        ])
      } catch (e) {
        setError(e.response?.data?.message || e.message)
        setShowError(true)
      }
    }

    load()
  }, [])

  return (
    <div className="stack gps-dashboard">
      <h1>GPS Dashboard</h1>
      <p>Live bus tracking and route visibility.</p>

      <AlertModal open={showError} title="Close box" message={error} confirmLabel="Close" onConfirm={() => setShowError(false)} />

      <div className="gps-map">
        <div className="gps-map__placeholder">
          <Navigation size={32} />
          <span>Live map view will appear here once GPS feed is connected.</span>
        </div>
      </div>

      <div className="card">
        <h2>Bus status</h2>
        <div className="gps-table-wrap">
          <table className="gps-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Route</th>
                <th>Shift</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.bus_id}>
                  <td className="font-mono">{bus.bus_number}</td>
                  <td>{bus.route}</td>
                  <td>{bus.shift}</td>
                  <td>
                    <span className={`gps-status gps-status--${bus.status.toLowerCase()}`}>
                      {bus.status}
                    </span>
                  </td>
                  <td>
                    <span className="gps-location">
                      <MapPin size={14} />
                      {bus.lat.toFixed(3)}, {bus.lng.toFixed(3)}
                    </span>
                  </td>
                </tr>
              ))}
              {!buses.length && (
                <tr>
                  <td colSpan={5} className="gps-empty">No bus tracking data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
