import { useEffect, useState } from 'react'
import api from '../services/api'
import { errorMessage } from '../utils/format'

export function useAdminApprovals() {
  const [apps, setApps] = useState([])
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingList, setLoadingList] = useState(true)

  const load = async () => {
    setLoadingList(true)
    try {
      const response = await api.get('/bus-pass/admin/pending')
      setApps(Array.isArray(response.data.applications) ? response.data.applications : [])
    } catch (error) {
      setNotice(errorMessage(error))
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void load()
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const act = async (id, type, rejectionReason) => {
    let body = {}

    if (type === 'reject') {
      if (!rejectionReason) {
        return
      }
      body = { rejection_reason: rejectionReason }
    }

    setLoading(true)
    setNotice('')

    try {
      await api.put(`/bus-pass/admin/${id}/${type}`, body)

      setNotice(
        type === 'approve'
          ? 'Application approved successfully.'
          : 'Application rejected successfully.'
      )

      await load()
    } catch (error) {
      setNotice(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return { apps, notice, loading, loadingList, act, reload: load }
}
