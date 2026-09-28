import { MapPinned } from 'lucide-react'
import Skeleton from '../../common/Skeleton'
import './SourceStep.css'

export default function BoardingPointStep({ points, value, onChange, loading }) {
  if (loading) {
    return (
      <div className="stack">
        <h3>Choose your boarding point</h3>
        <div className="source-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="52px" radius="var(--radius-md)" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="stack">
      <h3>Choose your boarding point</h3>
      {!points.length && <p>No boarding points found for this source yet.</p>}
      <div className="source-grid">
        {points.map((point) => (
          <button
            type="button"
            key={point.stop_id}
            className={`source-option ${String(value) === String(point.stop_id) ? 'is-selected' : ''}`}
            onClick={() => onChange(String(point.stop_id))}
          >
            <MapPinned size={18} aria-hidden="true" />
            {point.stop_name}
          </button>
        ))}
      </div>
    </div>
  )
}
