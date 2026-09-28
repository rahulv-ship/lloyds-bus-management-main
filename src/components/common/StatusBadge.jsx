import { CheckCircle2, Clock, XCircle, Ban, CalendarDays } from 'lucide-react'
import './StatusBadge.css'

const STATUS_CONFIG = {
  APPROVED: { label: 'Approved', icon: CheckCircle2, tone: 'success' },
  PENDING: { label: 'Pending Approval', icon: Clock, tone: 'warning' },
  PENDING_APPROVAL: { label: 'Pending Approval', icon: Clock, tone: 'warning' },
  REJECTED: { label: 'Rejected', icon: XCircle, tone: 'danger' },
  CANCELLED: { label: 'Cancelled', icon: Ban, tone: 'neutral' },
  BOOKED: { label: 'Booked', icon: CalendarDays, tone: 'success' },
}

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    icon: Clock,
    tone: 'neutral',
  }

  const Icon = config.icon

  return (
    <span className={`status-badge status-badge--${config.tone} status-badge--${size}`}>
      <Icon aria-hidden="true" size={size === 'sm' ? 13 : 15} />
      {config.label}
    </span>
  )
}
