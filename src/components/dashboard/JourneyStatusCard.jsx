import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bus, MapPin, Clock, Route as RouteIcon } from 'lucide-react'
import EmptyState from '../common/EmptyState'
import Button from '../common/Button'
import { formatTime } from '../../utils/format'
import './JourneyStatusCard.css'

export default function JourneyStatusCard({ approvedApp, loading }) {
  if (loading) {
    return <div className="card journey-card journey-card--loading" aria-busy="true" />
  }

  if (!approvedApp) {
    return (
      <div className="card journey-card">
        <EmptyState
          icon={Bus}
          title="No active bus pass yet"
          message="Book your first journey to get a digital pass with QR boarding."
          action={
            <Link to="/app/book">
              <Button variant="primary">Book your bus</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <motion.div
      className="card journey-card journey-card--active"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="journey-card__eyebrow">Active bus pass</div>
      <div className="journey-card__route">
        <span>{approvedApp.pickupStop?.stop_name || '—'}</span>
        <span className="journey-card__route-line" aria-hidden="true">
          <RouteIcon size={14} />
        </span>
        <span>Plant</span>
      </div>

      <div className="journey-card__grid">
        <div>
          <MapPin size={15} aria-hidden="true" />
          <div>
            <b>Route</b>
            <span>
              {approvedApp.route?.route_number} · {approvedApp.route?.route_name}
            </span>
          </div>
        </div>
        <div>
          <Bus size={15} aria-hidden="true" />
          <div>
            <b>Bus</b>
            <span>{approvedApp.bus?.bus_number || '—'}</span>
          </div>
        </div>
        <div>
          <Clock size={15} aria-hidden="true" />
          <div>
            <b>Boarding</b>
            <span>{formatTime(approvedApp.shift?.start_time)}</span>
          </div>
        </div>
      </div>

      <Link to="/app/pass">
        <Button variant="secondary" size="sm">
          View digital pass
        </Button>
      </Link>
    </motion.div>
  )
}
