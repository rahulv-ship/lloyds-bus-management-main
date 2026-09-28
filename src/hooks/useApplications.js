import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { errorMessage } from '../utils/format'

export function useApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const loadApps = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/bus-pass/my-applications')
      setApps(response.data.applications || [])
    } catch (error) {
      setNotice(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadApps()
    }, 0)
    return () => clearTimeout(timer)
  }, [loadApps])

  const approved = apps.find((application) => application.status === 'APPROVED')

  const cancelApplication = useCallback(async (id) => {
    setNotice('')
    try {
      await api.put(`/bus-pass/my-applications/${id}/cancel`)
      setNotice('Booking cancelled successfully.')
      await loadApps()
      return true
    } catch (error) {
      setNotice(errorMessage(error))
      return false
    }
  }, [loadApps])

  const cancelBookingDates = useCallback(async (id, dateIds) => {
    setNotice('')
    try {
      const response = await api.put(`/bus-pass/my-applications/${id}/dates/cancel`, { dateIds })
      setNotice(response.data.message || 'Selected dates cancelled.')
      await loadApps()
      return true
    } catch (error) {
      setNotice(errorMessage(error))
      return false
    }
  }, [loadApps])

  const sendQRCodeEmail = useCallback(async (id) => {
    setNotice('')
    try {
      const response = await api.post(`/bus-pass/my-applications/${id}/send-qr`)
      setNotice(response.data.message || 'QR code sent to your email.')
      return true
    } catch (error) {
      setNotice(errorMessage(error))
      return false
    }
  }, [])

  return { apps, approved, loading, notice, setNotice, reload: loadApps, cancelApplication, cancelBookingDates, sendQRCodeEmail }
}
