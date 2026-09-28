import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  BadgeCheck,
  Building2,
  LogOut,
  IdCard,
  User,
} from 'lucide-react'
import { useSessionContext } from '../../hooks/SessionContext'
// import Button from '../common/Button'
import './ProfilePage.css'
import Button from '../../components/common/Button'
const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const item = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28 } },
}

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ProfilePage() {
  const { session, logout } = useSessionContext()
  const user = session?.user || {}

  const fullName = user.name || user.employee_name || 'Employee'
  const fields = [
    { icon: User, label: 'Full name', value: fullName },
    { icon: IdCard, label: 'Employee ID', value: user.employeeId || user.employee_id },
    { icon: Building2, label: 'Department', value: user.departmentName || user.department },
    { icon: Mail, label: 'Email', value: user.email, type: 'email' },
    { icon: Phone, label: 'Mobile', value: user.mobile, type: 'tel' },
  ]

  return (
    <div className="profile-page stack">
      {/* ---------- Hero ---------- */}
      <motion.div className="profile-hero" {...fadeUp}>
        <div className="profile-hero__glow" aria-hidden="true" />

        <div className="profile-hero__avatar" aria-hidden="true">
          {getInitials(fullName)}
          <span className="profile-hero__verified" title="Verified">
            <BadgeCheck size={16} />
          </span>
        </div>

        <h2 className="profile-hero__name">{fullName}</h2>

        <div className="profile-hero__meta">
          {(user.departmentName || user.department) && (
            <span className="profile-hero__chip">
              <Building2 size={12} aria-hidden="true" />
              {user.departmentName || user.department}
            </span>
          )}
          {(user.employeeId || user.employee_id) && (
            <span className="profile-hero__chip">
              <IdCard size={12} aria-hidden="true" />
              {user.employeeId || user.employee_id}
            </span>
          )}
        </div>
      </motion.div>

      {/* ---------- Details ---------- */}
      <motion.div className="profile-card" variants={stagger} initial="initial" animate="animate">
        <div className="profile-card__header">
          <h3>Account details</h3>
          <p>Your registered information</p>
        </div>

        <div className="profile-grid">
          {fields.map(({ icon: Icon, label, value, type }) => (
            <motion.div className="profile-field" key={label} variants={item}>
              <span className="profile-field__icon" aria-hidden="true">
                <Icon size={15} />
              </span>
              <div className="profile-field__body">
                <span className="profile-field__label">{label}</span>
                {value ? (
                  type === 'email' ? (
                    <a className="profile-field__value" href={`mailto:${value}`}>
                      {value}
                    </a>
                  ) : type === 'tel' ? (
                    <a className="profile-field__value" href={`tel:${value}`}>
                      {value}
                    </a>
                  ) : (
                    <span className="profile-field__value">{value}</span>
                  )
                ) : (
                  <span className="profile-field__value profile-field__value--empty">—</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ---------- Sign out ---------- */}
      <motion.div className="profile-danger" {...fadeUp}>
        <div className="profile-danger__text">
          <b>Sign out</b>
          <span>You'll need to log in again on this device.</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={logout}
          className="profile-danger__btn"
        >
          <LogOut size={14} aria-hidden="true" />
          Sign out
        </Button>
      </motion.div>
    </div>
  )
}