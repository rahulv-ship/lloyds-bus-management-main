import { Bus, MapPin, Clock } from 'lucide-react'
import SeatOccupancyRing from './SeatOccupancyRing'
import { formatTime, getDateLabel } from '../../utils/format'
import './BusCard.css'

export default function BusCard({ bus, selected, onSelect }) {
  const capacity = bus.capacity || 52
  const unavailableDates = (bus.date_wise_capacity || []).filter((d) => !d.available)

  return (
    <div
      className={`bus-card ${selected ? 'is-selected' : ''} ${!bus.available ? 'is-unavailable' : ''}`}
    >
      <div className="bus-card__head">
        <div className="bus-card__title">
          <Bus size={16} aria-hidden="true" />
          <span>{bus.bus_number}</span>
        </div>
        <SeatOccupancyRing remaining={bus.remaining_capacity} capacity={capacity} />
      </div>

      <div className="bus-card__route">
        {bus.route_number} · {bus.route_name}
      </div>

      <ul className="bus-card__meta">
        <li>
          <MapPin size={13} aria-hidden="true" />
          {bus.pickup_stop_name}
        </li>
        <li>
          <Clock size={13} aria-hidden="true" />
          {formatTime(bus.onboarding_time)} boarding
        </li>
        <li>
          <MapPin size={13} aria-hidden="true" />
          {bus.drop_stop_name || 'Plant'}
        </li>
      </ul>

      <div className="bus-card__capacity">
        Capacity {capacity} · {bus.remaining_capacity} remaining
      </div>

      {bus.date_wise_capacity?.length > 0 && (
        <div className="bus-card__dates">
          {bus.date_wise_capacity.map((item) => (
            <div key={item.date} className={`bus-card__date-row ${!item.available ? 'is-full' : ''}`}>
              <span>{getDateLabel(item.date)}</span>
              <span className="font-mono">
                {item.available ? `${item.remaining}/${item.capacity}` : 'Full'}
              </span>
            </div>
          ))}
        </div>
      )}

      {!bus.available && unavailableDates.length > 0 && (
        <p className="bus-card__reason">
          Not enough seats on {unavailableDates.map((d) => getDateLabel(d.date)).join(', ')}.
        </p>
      )}

      <button
        type="button"
        className={`bus-card__select ${selected ? 'is-selected' : ''}`}
        disabled={!bus.available}
        onClick={() => onSelect(bus)}
      >
        {selected ? 'Bus selected' : bus.available ? 'Select this bus' : 'Not available'}
      </button>
    </div>
  )
}
