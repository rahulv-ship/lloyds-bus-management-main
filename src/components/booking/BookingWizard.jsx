import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CalendarDays, MapPin, Route, Bus as BusIcon, PartyPopper, UserRound, Sparkles } from 'lucide-react'
import Calendar from './Calendar'
import BusStep from './steps/BusStep'
import Button from '../common/Button'
import AlertModal from '../common/AlertModal'
import Modal from '../common/Modal'
import { useBookingForm } from '../../hooks/useBookingForm'
import { useSessionContext } from '../../hooks/SessionContext'
import './BookingWizard.css'

export default function BookingWizard({ onSubmitted, adminBooking = false }) {
  const booking = useBookingForm({ onSubmitted, adminBooking })
  const { session } = useSessionContext()
  const employee = session?.user || {}
  const { setNotice } = booking
  const readyForBuses = Boolean(booking.form.source && booking.form.pickup_stop_id && booking.form.shift_id && booking.form.booking_dates.length)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (booking.notice) setAlert(booking.notice)
  }, [booking.notice])

  const handleSubmit = async () => {
    const success = await booking.submit()
    if (success) {
      setShowSuccessModal(true)
    }
  }

  return (
    <div className={`booking-page ${adminBooking ? 'special-booking' : ''}`}>
      <section className="booking-hero">
        <div>
          <span className="booking-hero__eyebrow">{adminBooking ? 'Transport desk · priority service' : 'Employee transport'}</span>
          <h2>{adminBooking ? 'Create a special booking' : 'Book your bus pass'}</h2>
          <p>{adminBooking ? 'Reserve a seat for an employee with live capacity checks.' : 'Select your journey details below. Available buses update automatically.'}</p>
        </div>
        <div className="booking-hero__icon" aria-hidden="true">{adminBooking ? <Sparkles size={28} /> : <BusIcon size={28} />}</div>
      </section>

      {booking.notice && !showSuccessModal && (
        <AlertModal
          open={Boolean(booking.notice)}
          title="Close box"
          message={booking.notice}
          confirmLabel="Close"
          onConfirm={() => setNotice('')}
        />
      )}

      <section className="card booking-wizard">
        {!adminBooking && <div className="booking-identity"><UserRound size={18} /><div><span>Booking for</span><b>{employee.name || employee.employee_name || 'Employee'} · {employee.employeeId || employee.employee_id || '—'}</b></div><small>{employee.department || 'Department unavailable'}</small></div>}
        {adminBooking && <section className="special-booking__employee"><div className="special-booking__employee-icon"><UserRound size={20} /></div><div className="special-booking__employee-copy"><b>Employee details</b><span>Employee ID is verified against the active employee master during submission.</span></div><div className="special-booking__employee-fields"><label className="booking-field"><span>Employee name</span><input value={booking.form.employee_name} onChange={(event) => booking.setEmployee('employee_name', event.target.value)} placeholder="Full name" /></label><label className="booking-field"><span>Employee ID</span><input value={booking.form.employee_code} onChange={(event) => booking.setEmployee('employee_code', event.target.value)} placeholder="e.g. EMP-1024" /></label><label className="booking-field"><span>Department</span><input value={booking.form.employee_department} onChange={(event) => booking.setEmployee('employee_department', event.target.value)} placeholder="e.g. Operations" /></label></div></section>}
        <div className="booking-wizard__section-head">
          <div><span className="booking-wizard__step">1</span><h3>Journey details</h3></div>
          <p>Choose where and when you travel.</p>
        </div>
        <div className="booking-fields">
          <label className="booking-field">
            <span><Route size={16} aria-hidden="true" /> Source</span>
            <select value={booking.form.source} onChange={(event) => booking.setSource(event.target.value)}>
              <option value="">Select source</option>
              {booking.sources.map((source) => <option key={source.key} value={source.key}>{source.label}</option>)}
            </select>
          </label>
          <label className="booking-field">
            <span><MapPin size={16} aria-hidden="true" /> Boarding stop</span>
            <select value={booking.form.pickup_stop_id} disabled={!booking.form.source || booking.loadingBoarding} onChange={(event) => booking.setBoardingPoint(event.target.value)}>
              <option value="">{booking.loadingBoarding ? 'Loading stops…' : 'Select boarding stop'}</option>
              {booking.boardingPoints.map((point) => <option key={point.stop_id} value={point.stop_id}>{point.stop_name}</option>)}
            </select>
          </label>
          <label className="booking-field">
            <span><CalendarDays size={16} aria-hidden="true" /> Shift</span>
            <select value={booking.form.shift_id} onChange={(event) => booking.setShift(event.target.value)}>
              <option value="">Select shift</option>
              {booking.shifts.map((shift) => <option key={shift.id} value={shift.id}>{shift.shift_name}</option>)}
            </select>
          </label>
          {!adminBooking && <label className="booking-field booking-field--weekoff"><span><CalendarDays size={16} aria-hidden="true" /> Weekly off</span><select value={booking.form.weekoff_day} onChange={(event) => booking.setWeekoffDay(event.target.value)}><option value="">No weekly off selected</option><option value="0">Sunday</option><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option><option value="6">Saturday</option></select><small>Weekly-off dates are locked as holidays.</small></label>}
        </div>
        <div className="booking-calendar">
          <div className="booking-wizard__section-head">
            <div><span className="booking-wizard__step">2</span><h3>Travel dates</h3></div>
            <p>Pick one or more days for this pass.</p>
          </div>
          <Calendar calendarMonth={booking.calendarMonth} monthDates={booking.monthDates} today={booking.today} isDateSelected={booking.isDateSelected} selectableCount={booking.selectableMonthDates.length} selectedCount={booking.form.booking_dates.length} onToggleDate={booking.toggleDate} onChangeMonth={booking.changeCalendarMonth} onSelectWholeMonth={booking.selectWholeMonth} onClearDates={booking.clearDates} onSelectNext15Days={booking.selectNext15Days} onSelectNext30Days={booking.selectNext30Days} weekoffDay={booking.form.weekoff_day} />
        </div>
      </section>

      <section className="card booking-buses">
        <div className="booking-wizard__section-head">
          <div><span className="booking-wizard__step">3</span><h3>Choose an available bus</h3></div>
          <p>{readyForBuses ? 'Select the bus that suits you.' : 'Complete the journey details to see buses.'}</p>
        </div>
        <BusStep buses={booking.buses} selectedBusId={booking.form.bus_id} onSelect={booking.selectBus} loading={booking.loadingBuses} ready={readyForBuses} />
      </section>

      <motion.div className="booking-submit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div><b>{booking.selectedBus ? `${booking.selectedBus.bus_number} selected` : 'Choose a bus to continue'}</b><span>{booking.form.booking_dates.length} travel {booking.form.booking_dates.length === 1 ? 'day' : 'days'} selected</span></div>
        <Button variant="primary" size="lg" icon={PartyPopper} loading={booking.loading} disabled={!booking.canSubmit} onClick={handleSubmit}>{adminBooking ? 'Confirm special booking' : 'Submit this application'}</Button>
      </motion.div>

      <Modal
        open={showSuccessModal}
        title="Booking submitted"
        message="Bus pass application submitted successfully and is pending approval."
        confirmLabel="Continue"
        onConfirm={() => setShowSuccessModal(false)}
      />
    </div>
  )
}
