import { Check } from 'lucide-react'
import './StepIndicator.css'

const STEPS = ['Source', 'Stop', 'Shift', 'Dates', 'Bus', 'Confirm']

export default function StepIndicator({ current, onStepClick, maxReached }) {
  return (
    <ol className="step-indicator" aria-label="Booking steps">
      {STEPS.map((label, index) => {
        const stepNum = index + 1
        const isDone = stepNum < current
        const isActive = stepNum === current
        const isReachable = stepNum <= maxReached

        return (
          <li key={label} className="step-indicator__item">
            <button
              type="button"
              className={`step-indicator__step ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}
              onClick={() => isReachable && onStepClick(stepNum)}
              disabled={!isReachable}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="step-indicator__num">
                {isDone ? <Check size={12} strokeWidth={3} /> : String(stepNum).padStart(2, '0')}
              </span>
              <span className="step-indicator__label">{label}</span>
            </button>
            {index < STEPS.length - 1 && <span className="step-indicator__connector" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
