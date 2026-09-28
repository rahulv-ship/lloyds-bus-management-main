import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import AlertModal from '../../components/common/AlertModal'
import { SkeletonCard } from '../../components/common/Skeleton'
import Button from '../../components/common/Button'
import { useAdminApprovals } from '../../hooks/useAdminApprovals'
import { formatDate } from '../../utils/format'
import './ApprovalsPage.css'

export default function ApprovalsPage() {
  const { apps, notice, loading, loadingList, act } = useAdminApprovals()
  const [openNotice, setOpenNotice] = useState('')

  useEffect(() => {
    if (notice) setOpenNotice(notice)
  }, [notice])

  const handleReject = (id) => {
    const reason = window.prompt('Rejection reason:')
    if (!reason) return
    act(id, 'reject', reason)
  }

  const datesLabel = (application) => {
    const dates = application.booking_dates?.length
      ? application.booking_dates.map((item) => formatDate(item.booking_date)).join(', ')
      : `${formatDate(application.pass_valid_from)} – ${formatDate(application.pass_valid_to)}`
    return dates || '—'
  }

  return (
    <div className="stack approvals-page">
      <h1>Bus Pass Approvals</h1>

      <AlertModal
        open={Boolean(openNotice)}
        title="Close box"
        message={openNotice}
        confirmLabel="Close"
        onConfirm={() => setOpenNotice('')}
      />

      {!loadingList && !apps.length && (
        <div className="card">
          <p>No pending applications.</p>
        </div>
      )}

      {!loadingList && apps.length > 0 && (
        <div className="approvals-table-wrap">
          <table className="approvals-table">
            <thead>
              <tr>
                <th>Application</th>
                <th>Route</th>
                <th>Bus</th>
                <th>Shift</th>
                <th>Booking dates</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((application) => (
                <tr key={application.id}>
                  <td className="font-mono">{application.application_number}</td>
                  <td>{application.route?.route_number}</td>
                  <td>{application.bus?.bus_number}</td>
                  <td>{application.shift?.shift_name || '—'}</td>
                  <td>
                    <DateDropdown application={application} />
                  </td>
                  <td>
                    <span className={`approval-status approval-status--${String(application.status || 'pending').toLowerCase()}`}>
                      {application.status || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <div className="cluster">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={CheckCircle2}
                        disabled={loading}
                        onClick={() => act(application.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={XCircle}
                        disabled={loading}
                        onClick={() => handleReject(application.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="approvals-footer">
            <span>Total records: <b>{apps.length}</b></span>
            <span>Pending approvals</span>
          </div>
        </div>
      )}
    </div>
  )
}

function DateDropdown({ application }) {
  const [isOpen, setIsOpen] = useState(false)
  const bookingDates = application.booking_dates || []
  const fallback = !bookingDates.length && (application.pass_valid_from || application.pass_valid_to)

  return (
    <div className="date-dropdown">
      <button
        type="button"
        className="date-dropdown__trigger"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          {bookingDates.length
            ? `${bookingDates.length} date${bookingDates.length === 1 ? '' : 's'}`
            : fallback
              ? `${formatDate(application.pass_valid_from)} – ${formatDate(application.pass_valid_to)}`
              : '—'}
        </span>
        <span className={`date-dropdown__arrow ${isOpen ? 'date-dropdown__arrow--open' : ''}`}>▾</span>
      </button>
      {isOpen && (
        <div className="date-dropdown__panel">
          <div className="date-dropdown__list">
            {bookingDates.length
              ? bookingDates.map((item) => (
                  <div key={item.id} className="date-dropdown__item">
                    <span className="date-dropdown__date">{formatDate(item.booking_date)}</span>
                    <span className={`approval-status approval-status--${String(item.status || 'booked').toLowerCase()}`}>
                      {item.status || 'BOOKED'}
                    </span>
                  </div>
                ))
              : fallback && (
                  <div className="date-dropdown__item">
                    <span>{`${formatDate(application.pass_valid_from)} – ${formatDate(application.pass_valid_to)}`}</span>
                  </div>
                )}
            {!bookingDates.length && !fallback && (
              <div className="date-dropdown__empty">No dates</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
