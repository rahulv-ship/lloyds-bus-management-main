import { useMemo, useState, useCallback, useEffect } from 'react'
import { CalendarClock } from 'lucide-react'
import ApplicationFilters from '../../components/applications/ApplicationFilters'
import ApplicationsList from '../../components/applications/ApplicationsList'
import EmptyState from '../../components/common/EmptyState'
import AlertModal from '../../components/common/AlertModal'
import { SkeletonCard } from '../../components/common/Skeleton'
import { useApplications } from '../../hooks/useApplications'

export default function MyBookingsPage() {
  const { apps, loading, cancelApplication, cancelBookingDates, notice, setNotice } = useApplications()
  const [filters, setFilters] = useState({ status: 'ALL', route: 'ALL', bus: 'ALL', month: '' })
  const [alert, setAlert] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingAppId, setPendingAppId] = useState(null)

  useEffect(() => {
    if (notice) setAlert(notice)
  }, [notice])

  const handleCloseAlert = useCallback(() => {
    setAlert('')
    setNotice('')
  }, [setNotice])

  const handleCancel = useCallback(
    (appId) => {
      setPendingAppId(appId)
      setConfirmOpen(true)
    },
    []
  )

  const confirmCancel = useCallback(async () => {
    setConfirmOpen(false)
    if (!pendingAppId) return
    try {
      await cancelApplication(pendingAppId)
    } catch (err) {
      setAlert(err?.response?.data?.message || 'Failed to cancel booking.')
    } finally {
      setPendingAppId(null)
    }
  }, [cancelApplication, pendingAppId])

  const cancelConfirm = useCallback(() => {
    setConfirmOpen(false)
    setPendingAppId(null)
  }, [])

  const filtered = useMemo(() => {
    return apps.filter((app) => {
      if (filters.status !== 'ALL' && app.status !== filters.status) return false
      if (filters.route !== 'ALL' && app.route?.route_number !== filters.route) return false
      if (filters.bus !== 'ALL' && app.bus?.bus_number !== filters.bus) return false
      if (filters.month) {
        const inMonth = app.booking_dates?.some((d) => d.booking_date?.startsWith(filters.month))
        if (!inMonth) return false
      }
      return true
    })
  }, [apps, filters])

  const handleCancelDates = useCallback(
    async (appId, dateIds) => {
      try {
        await cancelBookingDates(appId, dateIds)
      } catch (err) {
        setAlert(err?.response?.data?.message || 'Failed to cancel booking dates.')
      }
    },
    [cancelBookingDates]
  )

  return (
    <div className="stack">
      <h2>My Bookings</h2>

      <div className="card">
        {loading && <SkeletonCard lines={4} />}

        {!loading && apps.length === 0 && (
          <EmptyState
            icon={CalendarClock}
            title="No bookings yet"
            message="Your bus pass applications will show up here once you apply."
          />
        )}

        {!loading && apps.length > 0 && (
          <>
            <ApplicationFilters apps={apps} filters={filters} onChange={setFilters} />
            <ApplicationsList apps={filtered} cancelApplication={handleCancel} cancelBookingDates={handleCancelDates} />
          </>
        )}
      </div>

      <AlertModal
        open={confirmOpen}
        title="Cancel booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        tone="danger"
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
        onConfirm={confirmCancel}
        onCancel={cancelConfirm}
      />

      <AlertModal
        open={Boolean(alert)}
        title="Close box"
        message={alert}
        confirmLabel="Close"
        onConfirm={handleCloseAlert}
      />
    </div>
  )
}
