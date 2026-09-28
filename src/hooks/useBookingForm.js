import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../services/api'
import { errorMessage, getDatesForMonth, getMonthString, getTodayString } from '../utils/format'

// Extracted from the original Employee component. Every API call,
// param name, cascading effect, and validation rule is unchanged —
// only the state now lives in a hook so step components can share it.
export function useBookingForm({ onSubmitted, adminBooking = false } = {}) {
  const [sources, setSources] = useState([])
  const [shifts, setShifts] = useState([])
  const [boardingPoints, setBoardingPoints] = useState([])
  const [buses, setBuses] = useState([])

  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMaster, setLoadingMaster] = useState(true)
  const [loadingBoarding, setLoadingBoarding] = useState(false)
  const [loadingBuses, setLoadingBuses] = useState(false)
  const [loadingEmployee, setLoadingEmployee] = useState(false)

  const [form, setForm] = useState({
    source: '',
    pickup_stop_id: '',
    drop_stop_id: '',
    shift_id: '',
    bus_id: '',
    route_id: '',
    booking_dates: [],
    weekoff_day: '',
    employee_code: '',
    employee_name: '',
    employee_department: '',
  })

  const [calendarMonth, setCalendarMonth] = useState(getMonthString(new Date()))
  const employeeLookupTimeout = useRef(null)

  /* ---- autopopulate employee details in admin booking ----- */
  useEffect(() => {
    if (!adminBooking || !form.employee_code) {
      return
    }

    setLoadingEmployee(true)
    setNotice('')

    employeeLookupTimeout.current = setTimeout(async () => {
      try {
        const response = await api.get(`/admin/employees/${encodeURIComponent(form.employee_code)}`)
        const employee = response.data.data
        if (employee) {
          setForm((current) => ({
            ...current,
            employee_name: employee.employee_name || '',
            employee_department: employee.department || '',
          }))
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          setNotice(errorMessage(error))
        }
      } finally {
        setLoadingEmployee(false)
      }
    }, 300)

    return () => {
      if (employeeLookupTimeout.current) {
        clearTimeout(employeeLookupTimeout.current)
      }
    }
  }, [form.employee_code, adminBooking])

  /* ---- initial master data load ---------------------------- */
  useEffect(() => {
    const loadMaster = async () => {
      setLoadingMaster(true)
      try {
        const requests = [
          api.get('/master/sources'),
          api.get('/master/shifts'),
        ]
        const [sourceResponse, shiftResponse] = await Promise.all(requests)

        setSources(sourceResponse.data.data || [])
        // Keep the office shift first; it is the most commonly selected option.
        setShifts(
          [...(shiftResponse.data.data || [])].sort((a, b) => {
            const aIsGeneral = /^general\b/i.test(a.shift_name) ? -1 : 0
            const bIsGeneral = /^general\b/i.test(b.shift_name) ? -1 : 0
            return aIsGeneral - bIsGeneral || String(a.shift_name).localeCompare(String(b.shift_name))
          })
        )
      } catch (error) {
        setNotice(errorMessage(error))
      } finally {
        setLoadingMaster(false)
      }
    }

    loadMaster()
  }, [])

  /* ---- boarding points when source changes ------------------ */
  useEffect(() => {
    if (!form.source) {
      return
    }

    const loadBoardingPoints = async () => {
      setLoadingBoarding(true)
      setNotice('')

      try {
        const response = await api.get('/master/boarding-points', {
          params: { source: form.source },
        })

        setBoardingPoints(response.data.data || [])
      } catch (error) {
        setBoardingPoints([])
        setNotice(errorMessage(error))
      } finally {
        setLoadingBoarding(false)
      }
    }

    loadBoardingPoints()
  }, [form.source])

  /* ---- available buses ---------------------------------------- */
  useEffect(() => {
    const loadAvailableBuses = async () => {
      if (!form.source || !form.pickup_stop_id || !form.shift_id || !form.booking_dates.length) {
        setBuses([])
        return
      }

      setLoadingBuses(true)
      setNotice('')

      try {
        const response = await api.get('/master/available-buses', {
          params: {
            source: form.source,
            pickup_stop_id: form.pickup_stop_id,
            shift_id: form.shift_id,
            booking_dates: form.booking_dates.join(','),
          },
        })

        setBuses(response.data.data || [])
      } catch (error) {
        setBuses([])
        setNotice(errorMessage(error))
      } finally {
        setLoadingBuses(false)
      }
    }

    loadAvailableBuses()
  }, [form.source, form.pickup_stop_id, form.shift_id, form.booking_dates])

  /* ---- field setters -------------------------------------------- */
  const setSource = (value) => {
    setNotice('')
    setBoardingPoints([])
    setBuses([])

    setForm((current) => ({
      ...current,
      source: value,
      pickup_stop_id: '',
      drop_stop_id: '',
      bus_id: '',
      route_id: '',
      booking_dates: [],
    }))
  }

  const setBoardingPoint = (value) => {
    setNotice('')
    setBuses([])

    setForm((current) => ({
      ...current,
      pickup_stop_id: value,
      drop_stop_id: '',
      bus_id: '',
      route_id: '',
    }))
  }

  const setShift = (value) => {
    setNotice('')
    setBuses([])

    setForm((current) => ({
      ...current,
      shift_id: value,
      bus_id: '',
      route_id: '',
      drop_stop_id: '',
    }))
  }

  const setWeekoffDay = (value) => {
    setNotice('')
    setBuses([])
    setForm((current) => ({
      ...current,
      weekoff_day: value,
      booking_dates: current.booking_dates.filter((date) => String(new Date(`${date}T00:00:00`).getDay()) !== value),
      bus_id: '',
      route_id: '',
    }))
  }

  const setEmployee = (field, value) => {
    setNotice('')
    setForm((current) => ({ ...current, [field]: value }))
  }

  /* ---- calendar -------------------------------------------------- */
  const monthDates = useMemo(() => getDatesForMonth(calendarMonth), [calendarMonth])
  const today = getTodayString()

  const selectableMonthDates = useMemo(
    () => monthDates.filter((date) => date >= today && String(new Date(`${date}T00:00:00`).getDay()) !== form.weekoff_day),
    [monthDates, today, form.weekoff_day]
  )

  const isDateSelected = (date) => form.booking_dates.includes(date)

  const toggleDate = (date) => {
    if (date < today || String(new Date(`${date}T00:00:00`).getDay()) === form.weekoff_day) {
      return
    }

    setNotice('')
    setBuses([])

    setForm((current) => {
      const exists = current.booking_dates.includes(date)

      const nextDates = exists
        ? current.booking_dates.filter((item) => item !== date)
        : [...current.booking_dates, date]

      return {
        ...current,
        booking_dates: nextDates.sort(),
        bus_id: '',
        route_id: '',
      }
    })
  }

  const selectWholeMonth = () => {
    setNotice('')
    setBuses([])

    setForm((current) => ({
      ...current,
      booking_dates: [...selectableMonthDates].sort(),
      bus_id: '',
      route_id: '',
    }))
  }

  const clearDates = () => {
    setNotice('')
    setBuses([])

    setForm((current) => ({
      ...current,
      booking_dates: [],
      bus_id: '',
      route_id: '',
    }))
  }

  const getSelectableDatesFromToday = (limit) => {
    const dates = []
    const todayDate = new Date(`${today}T00:00:00`)
    let current = new Date(todayDate)

    while (dates.length < limit) {
      const yyyy = current.getFullYear()
      const mm = String(current.getMonth() + 1).padStart(2, '0')
      const dd = String(current.getDate()).padStart(2, '0')
      const dateStr = `${yyyy}-${mm}-${dd}`

      const dayOfWeek = String(current.getDay())
      const isWeekoff = dayOfWeek === form.weekoff_day
      const isPast = dateStr < today

      if (!isPast && !isWeekoff) {
        dates.push(dateStr)
      }

      current.setDate(current.getDate() + 1)
    }

    return dates
  }

  const selectNext15Days = () => {
    setNotice('')
    setBuses([])

    const dates = getSelectableDatesFromToday(15)

    setForm((current) => ({
      ...current,
      booking_dates: [...dates].sort(),
      bus_id: '',
      route_id: '',
    }))
  }

  const selectNext30Days = () => {
    setNotice('')
    setBuses([])

    const dates = getSelectableDatesFromToday(30)

    setForm((current) => ({
      ...current,
      booking_dates: [...dates].sort(),
      bus_id: '',
      route_id: '',
    }))
  }

  const changeCalendarMonth = (offset) => {
    const [year, month] = calendarMonth.split('-').map(Number)
    const next = new Date(year, month - 1 + offset, 1)
    setCalendarMonth(getMonthString(next))
  }

  /* ---- bus selection ------------------------------------------------ */
  const selectedBus = useMemo(
    () => buses.find((bus) => String(bus.bus_id) === String(form.bus_id)) || null,
    [buses, form.bus_id]
  )

  const selectedShift = useMemo(
    () => shifts.find((shift) => String(shift.id) === String(form.shift_id)) || null,
    [shifts, form.shift_id]
  )

  const selectBus = (bus) => {
    if (!bus.available) {
      return
    }

    setNotice('')

    setForm((current) => ({
      ...current,
      bus_id: String(bus.bus_id),
      route_id: String(bus.route_id),
      drop_stop_id: String(bus.drop_stop_id),
    }))
  }

  /* ---- submit ------------------------------------------------------ */
  const canSubmit =
    (!adminBooking || (Boolean(form.employee_code) && Boolean(form.employee_name) && Boolean(form.employee_department))) &&
    Boolean(form.source) &&
    Boolean(form.pickup_stop_id) &&
    Boolean(form.shift_id) &&
    form.booking_dates.length > 0 &&
    Boolean(selectedBus) &&
    Boolean(selectedBus?.available)

  const submit = async () => {
    setNotice('')

    if (adminBooking && (!form.employee_name || !form.employee_code || !form.employee_department)) {
      setNotice('Enter the employee name, ID, and department before booking.')
      return false
    }
    if (!form.source) {
      setNotice('Please select source.')
      return false
    }

    if (!form.pickup_stop_id) {
      setNotice('Please select boarding point.')
      return false
    }

    if (!form.shift_id) {
      setNotice('Please select shift.')
      return false
    }

    if (!form.booking_dates.length) {
      setNotice('Please select at least one booking date.')
      return false
    }

    if (!selectedBus) {
      setNotice('Please select a bus.')
      return false
    }

    if (!selectedBus.available) {
      setNotice('Selected bus is not available for all selected dates.')
      return false
    }

    setLoading(true)

    try {
      await api.post(adminBooking ? '/bus-pass/admin/special-bookings' : '/bus-pass/applications', {
        route_id: Number(form.route_id),
        shift_id: Number(form.shift_id),
        bus_id: Number(form.bus_id),
        pickup_stop_id: Number(form.pickup_stop_id),
        drop_stop_id: Number(form.drop_stop_id),
        booking_dates: form.booking_dates,
        ...(adminBooking ? { employee_code: form.employee_code } : {}),
      })

      setNotice('Bus pass application submitted successfully and is pending approval.')

      setForm((current) => ({
        ...current,
        bus_id: '',
        route_id: '',
        drop_stop_id: '',
        booking_dates: [],
      }))

      setBuses([])

      onSubmitted?.()
      return true
    } catch (error) {
      setNotice(errorMessage(error))
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    sources,
    shifts,
    boardingPoints,
    buses,
    form,
    notice,
    setNotice,
    loading,
    loadingMaster,
    loadingBoarding,
    loadingBuses,
    loadingEmployee,
    calendarMonth,
    monthDates,
    today,
    selectableMonthDates,
    isDateSelected,
    selectedBus,
    canSubmit,
    setSource,
    setEmployee,
    setBoardingPoint,
    setShift,
    setWeekoffDay,
    toggleDate,
    selectWholeMonth,
    clearDates,
    selectNext15Days,
    selectNext30Days,
    changeCalendarMonth,
    selectBus,
    submit,
  }
}
