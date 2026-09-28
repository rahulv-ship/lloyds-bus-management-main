import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../common/Button'
import { getDayNumber, getWeekdayLabel } from '../../utils/format'
import './Calendar.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar({
  calendarMonth,
  monthDates,
  today,
  isDateSelected,
  selectableCount,
  selectedCount,
  onToggleDate,
  onChangeMonth,
  onSelectWholeMonth,
  onClearDates,
  onSelectNext15Days,
  onSelectNext30Days,
  weekoffDay,
}) {
  const [year, month] = calendarMonth.split('-').map(Number)
  const firstDayOffset = new Date(year, month - 1, 1).getDay()
  const monthLabel = new Date(`${calendarMonth}-01T00:00:00`).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="calendar">
      <div className="calendar__head">
        <div>
          <h3>Select booking dates</h3>
          <p className="calendar__hint">Pick individual days or book the whole month.</p>
        </div>
        <div className="calendar__actions">
          <Button variant="ghost" size="sm" onClick={onSelectNext15Days} disabled={!selectableCount}>
            15 days
          </Button>
          <Button variant="ghost" size="sm" onClick={onSelectNext30Days} disabled={!selectableCount}>
            30 days
          </Button>
          <Button variant="ghost" size="sm" onClick={onSelectWholeMonth} disabled={!selectableCount}>
            Select whole month
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearDates} disabled={!selectedCount}>
            Clear
          </Button>
        </div>
      </div>

      <div className="calendar__nav">
        <button type="button" onClick={() => onChangeMonth(-1)} aria-label="Previous month" className="calendar__nav-btn">
          <ChevronLeft size={17} />
        </button>
        <span className="calendar__month-label">{monthLabel}</span>
        <button type="button" onClick={() => onChangeMonth(1)} aria-label="Next month" className="calendar__nav-btn">
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar__grid">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}

        {monthDates.map((date) => {
          const isPast = date < today
          const isToday = date === today
          const selected = isDateSelected(date)
          const isWeekoff = String(new Date(`${date}T00:00:00`).getDay()) === String(weekoffDay)

          return (
            <button
              type="button"
              key={date}
              disabled={isPast || isWeekoff}
              onClick={() => onToggleDate(date)}
              className={`calendar__day ${selected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''} ${isPast ? 'is-past' : ''} ${isWeekoff ? 'is-weekoff' : ''}`}
              aria-pressed={selected}
              aria-label={`${getWeekdayLabel(date)} ${getDayNumber(date)}${selected ? ', selected' : ''}${isPast ? ', unavailable' : ''}${isWeekoff ? ', weekly off' : ''}`}
            >
              {getDayNumber(date)}
            </button>
          )
        })}
      </div>

      <div className="calendar__summary" aria-live="polite">
        <b>{selectedCount}</b> travel {selectedCount === 1 ? 'day' : 'days'} selected
      </div>
    </div>
  )
}
