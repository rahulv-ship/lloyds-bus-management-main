import './SeatOccupancyRing.css'

// capacity is always whatever the backend reports (52 by business rule,
// but this component never hardcodes or assumes that number itself).
export default function SeatOccupancyRing({ remaining, capacity, size = 44 }) {
  const filled = Math.max(0, capacity - remaining)
  const ratio = capacity > 0 ? filled / capacity : 0
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - ratio)

  const isFull = remaining <= 0
  const isNearFull = !isFull && ratio >= 0.85

  return (
    <div className="seat-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="seat-ring__track"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`seat-ring__fill ${isFull ? 'is-full' : isNearFull ? 'is-near-full' : ''}`}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="seat-ring__label">{isFull ? 'Full' : remaining}</span>
    </div>
  )
}
