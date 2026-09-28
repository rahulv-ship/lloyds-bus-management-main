import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import './Notice.css'

const ICONS = {
  success: CheckCircle2,
  danger: AlertCircle,
  info: Info,
}

// Tone is inferred from message content when not passed explicitly,
// since the original app used one generic "notice" string for both
// success and error text.
const inferTone = (message = '') => {
  const lower = message.toLowerCase()
  if (lower.includes('success')) return 'success'
  if (lower.includes('approved')) return 'success'
  if (lower.includes('rejected') || lower.includes('failed') || lower.includes('please')) {
    return 'danger'
  }
  return 'info'
}

export default function Notice({ children, tone }) {
  if (!children) return null

  const resolvedTone = tone || inferTone(String(children))
  const Icon = ICONS[resolvedTone]

  return (
    <div className={`notice notice--${resolvedTone}`} role="status">
      <Icon aria-hidden="true" size={17} />
      <span>{children}</span>
    </div>
  )
}
