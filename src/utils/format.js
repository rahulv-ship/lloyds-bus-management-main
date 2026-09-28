// Extracted verbatim from the original App.jsx — logic unchanged.

export const errorMessage = (e) =>
  e.response?.data?.message || e.message || 'Request failed.'

export const formatDate = (value) => {
  if (!value) return '—'

  const d = new Date(value)

  if (Number.isNaN(d.getTime())) {
    return value
  }

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatTime = (value) => {
  if (!value) return '—'

  const parts = String(value).split(':')

  if (parts.length < 2) {
    return value
  }

  const hour = Number(parts[0])
  const minute = parts[1]

  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minute} ${suffix}`
}

export const getTodayString = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getMonthString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

export const getDatesForMonth = (monthValue) => {
  if (!monthValue) {
    return []
  }

  const [year, month] = monthValue.split('-').map(Number)

  const lastDay = new Date(year, month, 0).getDate()

  const dates = []

  for (let day = 1; day <= lastDay; day += 1) {
    const date = new Date(year, month - 1, day)

    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')

    dates.push(`${yyyy}-${mm}-${dd}`)
  }

  return dates
}

export const getDateLabel = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

export const getWeekdayLabel = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString('en-IN', { weekday: 'short' })
}

export const getDayNumber = (dateString) => Number(dateString.slice(-2))

export const dayName = (date) => {
  if (!date || Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', { weekday: 'short' })
}
