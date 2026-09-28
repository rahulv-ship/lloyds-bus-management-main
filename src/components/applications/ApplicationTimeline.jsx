import { Check } from 'lucide-react'
import './ApplicationTimeline.css'

const STEPS = ['Application Submitted', 'Under Review', 'Approved', 'Digital Pass Ready']

const stepIndexForStatus = (status) => {
  if (status === 'APPROVED') return 3
  if (status === 'REJECTED' || status === 'CANCELLED') return 1
  return 1 // PENDING sits at "Under Review"
}

export default function ApplicationTimeline({ status }) {
  const activeIndex = stepIndexForStatus(status)
  const isTerminalNegative = status === 'REJECTED' || status === 'CANCELLED'

  return (
    <ol className="app-timeline" aria-label="Application status">
      {STEPS.map((step, index) => {
        const isDone = index < activeIndex || (index === activeIndex && !isTerminalNegative && status === 'APPROVED')
        const isCurrent = index === activeIndex
        const isFailed = isCurrent && isTerminalNegative

        return (
          <li
            key={step}
            className={`app-timeline__step ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''} ${isFailed ? 'is-failed' : ''}`}
          >
            <span className="app-timeline__dot" aria-hidden="true">
              {isDone && !isFailed && <Check size={11} strokeWidth={3} />}
            </span>
            <span className="app-timeline__label">
              {isFailed ? (status === 'REJECTED' ? 'Rejected' : 'Cancelled') : step}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
