import { ArrowRight, Bus, CalendarDays, MapPin, Route as RouteIcon, Clock } from 'lucide-react'
import Button from '../../common/Button'
import { formatDate, formatTime, getDateLabel } from '../../../utils/format'
import './ReviewStep.css'

export default function ReviewStep({ sourceLabel, boardingLabel, selectedBus, form, loading, onSubmit }) {
  return (
    <div className="stack">
      <h3>Review &amp; confirm</h3>

      <div className="review-ticket">
        <div className="review-ticket__row review-ticket__row--route">
          <span>{sourceLabel}</span>
          <ArrowRight size={15} aria-hidden="true" />
          <span>Plant</span>
        </div>

        <div className="review-ticket__perforation" aria-hidden="true" />

        <div className="review-ticket__grid">
          <div>
            <MapPin size={14} aria-hidden="true" />
            <div>
              <b>Boarding point</b>
              <span>{boardingLabel}</span>
            </div>
          </div>
          <div>
            <RouteIcon size={14} aria-hidden="true" />
            <div>
              <b>Route</b>
              <span>
                {selectedBus?.route_number} · {selectedBus?.route_name}
              </span>
            </div>
          </div>
          <div>
            <Bus size={14} aria-hidden="true" />
            <div>
              <b>Bus</b>
              <span>{selectedBus?.bus_number}</span>
            </div>
          </div>
          <div>
            <Clock size={14} aria-hidden="true" />
            <div>
              <b>Boarding time</b>
              <span>{formatTime(selectedBus?.onboarding_time)}</span>
            </div>
          </div>
          <div>
            <CalendarDays size={14} aria-hidden="true" />
            <div>
              <b>Selected dates</b>
              <span>{form.booking_dates.length} days</span>
            </div>
          </div>
        </div>

        <div className="review-ticket__dates">
          {form.booking_dates.map((d) => (
            <span key={d} className="review-ticket__date-chip">
              {getDateLabel(d)}
            </span>
          ))}
        </div>

        <div className="review-ticket__validity">
          Valid {formatDate(form.booking_dates[0])} – {formatDate(form.booking_dates[form.booking_dates.length - 1])}
        </div>
      </div>

      <Button variant="primary" size="lg" onClick={onSubmit} loading={loading} style={{ width: '100%' }}>
        Submit bus pass application
      </Button>
    </div>
  )
}
