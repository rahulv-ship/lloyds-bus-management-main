import { useState } from 'react'
import StatusBadge from '../common/StatusBadge'
import AlertModal from '../common/AlertModal'
import { formatDate } from '../../utils/format'
import './ApplicationsList.css'

const datesLabel = (application) =>
  application.booking_dates?.length
    ? application.booking_dates.map((item) => formatDate(item.booking_date)).join(', ')
    : `${formatDate(application.pass_valid_from)} – ${formatDate(application.pass_valid_to)}`

const canCancel = (status) => status === 'PENDING_APPROVAL' || status === 'APPROVED'

const isDateEditable = (dateStatus) => dateStatus === 'BOOKED'

export default function ApplicationsList({ apps, cancelApplication, cancelBookingDates }) {
  if (!apps.length) {
    return <p>No applications match these filters.</p>
  }

  return (
    <div className="app-table-wrap">
      <table className="app-table">
        <thead>
          <tr>
            <th>Application</th>
            <th>Route</th>
            <th>Bus</th>
            <th>Shift</th>
            <th>Booking dates</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((application) => {
            const bookingDates = application.booking_dates || []
            const cancellableDates = bookingDates.filter((date) => isDateEditable(date.status))

            return (
              <tr key={application.id}>
                <td className="font-mono">{application.application_number}</td>
                <td>{application.route?.route_number || '—'}</td>
                <td>{application.bus?.bus_number || '—'}</td>
                <td>{application.shift?.shift_name || '—'}</td>
                <td>
                  <DateDropdown
                    application={application}
                    bookingDates={bookingDates}
                    cancellableDates={cancellableDates}
                    onCancelDates={cancelBookingDates}
                  />
                </td>
                <td>
                  <StatusBadge status={application.status} size="sm" />
                  {application.rejection_reason && (
                    <div className="app-table__reason">{application.rejection_reason}</div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function DateDropdown({ application, bookingDates, cancellableDates, onCancelDates }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingIds, setPendingIds] = useState([])

  const toggleSelection = (dateId) => {
    setSelectedIds((current) =>
      current.includes(dateId)
        ? current.filter((id) => id !== dateId)
        : [...current, dateId]
    )
  }

  const selectAll = () => {
    setSelectedIds(cancellableDates.map((date) => date.id))
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  const requestCancel = () => {
    if (!selectedIds.length) return
    setPendingIds([...selectedIds])
    setConfirmOpen(true)
  }

  const handleConfirmCancel = async () => {
    setConfirmOpen(false)
    await onCancelDates?.(application.id, pendingIds)
    clearSelection()
    setPendingIds([])
  }

  const handleCancelConfirm = () => {
    setConfirmOpen(false)
    setPendingIds([])
  }

  const allSelected = cancellableDates.length > 0 && selectedIds.length === cancellableDates.length

  return (
    <div className="date-dropdown">
      <button type="button" className="date-dropdown__trigger" onClick={() => setIsOpen((current) => !current)}>
        <span>
          {bookingDates.length
            ? `${bookingDates.length} date${bookingDates.length === 1 ? '' : 's'}`
            : datesLabel(application)}
        </span>
        <span className={`date-dropdown__arrow ${isOpen ? 'date-dropdown__arrow--open' : ''}`}>▾</span>
      </button>
      {isOpen && (
        <div className="date-dropdown__panel">
          {bookingDates.length > 0 && (
            <div className="date-dropdown__actions">
              <button type="button" onClick={allSelected ? clearSelection : selectAll}>
                {allSelected ? 'Clear selection' : 'Select all'}
              </button>
              {selectedIds.length > 0 && (
                <button type="button" className="date-dropdown__cancel-selected" onClick={requestCancel}>
                  Cancel {selectedIds.length} date{selectedIds.length > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
          <div className="date-dropdown__list">
            {bookingDates.length
              ? bookingDates.map((item) => {
                  const isCancelled = item.status === 'CANCELLED'
                  const isSelected = selectedIds.includes(item.id)
                  const disabled = isCancelled || !isDateEditable(item.status)

                  return (
                    <label
                      key={item.id}
                      className={`date-dropdown__item ${isSelected ? 'date-dropdown__item--selected' : ''} ${isCancelled ? 'date-dropdown__item--cancelled' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={disabled}
                        onChange={() => toggleSelection(item.id)}
                      />
                      <span className="date-dropdown__checkbox" />
                      <span className="date-dropdown__date">{formatDate(item.booking_date)}</span>
                      <StatusBadge status={isCancelled ? 'CANCELLED' : 'BOOKED'} size="sm" />
                    </label>
                  )
                })
              : (
                <div className="date-dropdown__empty">No dates</div>
              )}
          </div>
        </div>
      )}

      <AlertModal
        open={confirmOpen}
        title="Confirm cancellation"
        message={`Are you sure you want to cancel ${pendingIds.length} date${pendingIds.length > 1 ? 's' : ''}?`}
        tone="danger"
        confirmLabel="Yes, cancel"
        cancelLabel="No, keep"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelConfirm}
      />
    </div>
  )
}
