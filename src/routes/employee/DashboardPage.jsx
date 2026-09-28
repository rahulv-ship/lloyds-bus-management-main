import { Link } from 'react-router-dom'
import GreetingHeader from '../../components/dashboard/GreetingHeader'
import JourneyStatusCard from '../../components/dashboard/JourneyStatusCard'
import ApplicationTimeline from '../../components/applications/ApplicationTimeline'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { useApplications } from '../../hooks/useApplications'
import { CalendarClock } from 'lucide-react'
import './DashboardPage.css'

export default function DashboardPage() {
  const { apps, approved, loading } = useApplications()

  const mostRecent = apps[0]

  return (
    <div className="stack dashboard-page">
      <GreetingHeader hasUpcomingTrip={Boolean(approved)} />

      <JourneyStatusCard approvedApp={approved} loading={loading} />

      <section className="card">
        <div className="dashboard-page__section-head">
          <h2>Latest application</h2>
          <Link to="/app/bookings" className="dashboard-page__link">
            View all
          </Link>
        </div>

        {!loading && !mostRecent && (
          <EmptyState
            icon={CalendarClock}
            title="No applications yet"
            message="Once you apply for a bus pass, its status will appear here."
          />
        )}

        {mostRecent && (
          <div className="dashboard-page__recent">
            <div className="dashboard-page__recent-head">
              <div>
                <b>{mostRecent.application_number}</b>
                <span>
                  {mostRecent.route?.route_number} · {mostRecent.bus?.bus_number || '—'}
                </span>
              </div>
              <StatusBadge status={mostRecent.status} />
            </div>
            <ApplicationTimeline status={mostRecent.status} />
            {mostRecent.rejection_reason && (
              <p className="dashboard-page__reason">{mostRecent.rejection_reason}</p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
