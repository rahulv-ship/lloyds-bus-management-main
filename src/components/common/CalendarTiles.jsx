import { useMemo } from 'react'
import './CalendarTiles.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  const days = []
  for (let i = 0; i < startWeekday; i += 1) days.push(null)
  for (let date = 1; date <= daysInMonth; date += 1) days.push(date)
  return days
}

function buildDateMap(dates, includePassRange = false, passValidFrom, passValidTo) {
  const map = new Map()
  dates.forEach((item) => {
    if (item.booking_date) {
      const d = new Date(`${item.booking_date}T00:00:00`)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      map.set(key, {
        date: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        status: item.status,
        isPassRange: false,
        isPassStart: false,
        isPassEnd: false,
      })
    }
  })
  if (includePassRange && passValidFrom && passValidTo) {
    const from = new Date(`${passValidFrom}T00:00:00`)
    const to = new Date(`${passValidTo}T00:00:00`)
    const current = new Date(from)
    while (current <= to) {
      const key = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`
      if (!map.has(key)) {
        map.set(key, {
          date: current.getDate(),
          month: current.getMonth(),
          year: current.getFullYear(),
          status: 'PASS_RANGE',
          isPassRange: true,
          isPassStart: current.getTime() === from.getTime(),
          isPassEnd: current.getTime() === to.getTime(),
        })
      }
      current.setDate(current.getDate() + 1)
    }
  }
  return map
}

export default function CalendarTiles({ dates, passValidFrom, passValidTo, maxMonths = 4 }) {
  const dateMap = useMemo(() => buildDateMap(dates, true, passValidFrom, passValidTo), [dates, passValidFrom, passValidTo])
  const monthGroups = useMemo(() => {
    const entries = Array.from(dateMap.entries()).map(([, value]) => value)
    entries.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      if (a.month !== b.month) return a.month - b.month
      return a.date - b.date
    })
    const monthMap = new Map()
    entries.forEach((entry) => {
      const key = `${entry.year}-${entry.month}`
      if (!monthMap.has(key)) monthMap.set(key, { year: entry.year, month: entry.month, days: [] })
      monthMap.get(key).days.push(entry)
    })
    return Array.from(monthMap.entries()).map(([, value]) => value).slice(0, maxMonths)
  }, [dateMap, maxMonths])

  if (!dates.length && !passValidFrom) {
    return <div className="calendar-tiles calendar-tiles--empty">No dates selected</div>
  }

  return (
    <div className="calendar-tiles">
      {monthGroups.map((group) => {
        const days = getCalendarDays(group.year, group.month)
        return (
          <div key={`${group.year}-${group.month}`} className="calendar-tiles__month">
            <div className="calendar-tiles__month-title">
              <span>{MONTH_NAMES[group.month]}</span>
              <span>{group.year}</span>
            </div>
            <div className="calendar-tiles__weekdays">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-tiles__grid">
              {days.map((date, index) => {
                const entry = date
                  ? dateMap.get(`${group.year}-${group.month}-${date}`)
                  : null
                const statusClass = entry?.isPassRange
                  ? 'calendar-tiles__day--pass'
                  : entry?.status === 'CANCELLED'
                    ? 'calendar-tiles__day--cancelled'
                    : entry?.status === 'BOOKED'
                      ? 'calendar-tiles__day--booked'
                      : 'calendar-tiles__day--empty'
                const shapeClass = entry?.isPassStart || entry?.isPassEnd
                  ? 'calendar-tiles__day--edge'
                  : ''
                return (
                  <div key={`${group.year}-${group.month}-${index}`} className="calendar-tiles__cell">
                    {date && (
                      <span className={`calendar-tiles__day ${statusClass} ${shapeClass}`}>
                        {entry?.isPassStart && <span className="calendar-tiles__pill calendar-tiles__pill--start">Start</span>}
                        {entry?.isPassEnd && <span className="calendar-tiles__pill calendar-tiles__pill--end">End</span>}
                        <span className="calendar-tiles__day-number">{date}</span>
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
