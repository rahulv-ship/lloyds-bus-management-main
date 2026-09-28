import { Clock } from 'lucide-react'
import { formatTime } from '../../../utils/format'
import './SourceStep.css'

export default function ShiftStep({ shifts, value, onChange }) {
  return (
    <div className="stack">
      <h3>Which shift do you work?</h3>
      <div className="source-grid">
        {shifts.map((shift) => (
          <button
            type="button"
            key={shift.id}
            className={`source-option ${String(value) === String(shift.id) ? 'is-selected' : ''}`}
            onClick={() => onChange(String(shift.id))}
          >
            <Clock size={18} aria-hidden="true" />
            <span>
              {shift.shift_name}
              <br />
              <small style={{ fontWeight: 500, opacity: 0.75 }}>
                {formatTime(shift.start_time)} – {formatTime(shift.end_time)}
              </small>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
