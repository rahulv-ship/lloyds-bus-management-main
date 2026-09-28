import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { errorMessage } from '../utils/format'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/notifications')
      setNotifications(response.data.notifications || [])
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      setNotice(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const markRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, read: true, read_at: new Date() } : item))
      )
      setUnreadCount((current) => Math.max(0, current - 1))
    } catch (error) {
      setNotice(errorMessage(error))
    }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications((current) => current.map((item) => ({ ...item, read: true, read_at: new Date() })))
      setUnreadCount(0)
    } catch (error) {
      setNotice(errorMessage(error))
    }
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    notice,
    refresh: loadNotifications,
    markRead,
    markAllRead,
  }
}
