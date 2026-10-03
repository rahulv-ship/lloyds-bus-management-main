import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { errorMessage } from '../utils/format'

export function useAlerts() {
  const [alerts, setAlerts] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const loadAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/alerts')
      setAlerts(response.data.alerts || [])
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      setNotice(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  const acknowledge = useCallback(async (id) => {
    try {
      await api.put(`/alerts/${id}/acknowledge`)
      setAlerts((current) =>
        current.map((item) => (item.id === id ? { ...item, acknowledged: true, acknowledged_at: new Date() } : item))
      )
      setUnreadCount((current) => Math.max(0, current - 1))
    } catch (error) {
      setNotice(errorMessage(error))
    }
  }, [])

  const acknowledgeAll = useCallback(async () => {
    try {
      await api.put('/alerts/acknowledge-all')
      setAlerts((current) => current.map((item) => ({ ...item, acknowledged: true, acknowledged_at: new Date() })))
      setUnreadCount(0)
    } catch (error) {
      setNotice(errorMessage(error))
    }
  }, [])

  return {
    alerts,
    unreadCount,
    loading,
    notice,
    refresh: loadAlerts,
    acknowledge,
    acknowledgeAll,
  }
}
