import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, User, Eye, EyeOff } from 'lucide-react'
import Button from '../common/Button'
import AlertModal from '../common/AlertModal'
import ThemeToggle from '../layout/ThemeToggle'
import { useSessionContext } from '../../hooks/SessionContext'
import './LoginPanel.css'

export default function LoginPanel() {
  const { signInAdmin, signInEmployee } = useSessionContext()

  const [loginType, setLoginType] = useState('EMPLOYEE')
  const [adminForm, setAdminForm] = useState({ username: '', password: '' })
  const [employeeForm, setEmployeeForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmployeePassword, setShowEmployeePassword] = useState(false)
  const [showAdminPassword, setShowAdminPassword] = useState(false)

  const handleAdminSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInAdmin(adminForm.username, adminForm.password)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmployeeSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!employeeForm.email) {
      setError('Please enter your email.')
      return
    }

    if (!employeeForm.password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    try {
      await signInEmployee(employeeForm.email, employeeForm.password)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Employee login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-screen__toggle">
        <ThemeToggle />
      </div>

      <motion.div
        className="login-screen__panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
      >
        <div className="login-brand">
          <img className="login-brand__logo" src="/lloyds-metals-logo.png" alt="Lloyds Metals & Energy" />
        </div>

        <h1 className="login-headline">Your journey. Simplified.</h1>
        <p className="login-subhead">
          Book your seat, manage your pass, and see every trip in one place.
        </p>

        <div className="login-tabs" role="tablist" aria-label="Sign-in type">
          <button
            type="button"
            role="tab"
            aria-selected={loginType === 'EMPLOYEE'}
            className={`login-tab ${loginType === 'EMPLOYEE' ? 'is-active' : ''}`}
            onClick={() => {
              setLoginType('EMPLOYEE')
              setError('')
            }}
          >
            <User size={16} aria-hidden="true" />
            Employee
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={loginType === 'ADMIN'}
            className={`login-tab login-tab--admin ${loginType === 'ADMIN' ? 'is-active' : ''}`}
            onClick={() => {
              setLoginType('ADMIN')
              setError('')
            }}
          >
            <ShieldCheck size={16} aria-hidden="true" />
            Administrator
          </button>
        </div>

         {error && (
           <AlertModal
            open={Boolean(error)}
            title="Close box"
            message={error}
            confirmLabel="Close"
            onConfirm={() => setError('')}
          />
        )}

        {loginType === 'EMPLOYEE' && (
          <form className="login-form" onSubmit={handleEmployeeSubmit}>
            <p className="login-form__hint">Sign in with your Lloyds company credentials.</p>

            <label className="field">
              <span className="field__label">Employee email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                placeholder="you@lloydsmetals.com"
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <div className="field__password">
                <input
                  type={showEmployeePassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={employeeForm.password}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="field__eye"
                  onClick={() => setShowEmployeePassword((v) => !v)}
                  aria-label={showEmployeePassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showEmployeePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            <p className="login-form__footnote">Authentication is handled by the Lloyds SSO system.</p>
          </form>
        )}

        {loginType === 'ADMIN' && (
          <form className="login-form" onSubmit={handleAdminSubmit}>
            <p className="login-form__hint">Administrator access is restricted to authorized users.</p>

            <label className="field">
              <span className="field__label">Username</span>
              <input
                type="text"
                autoComplete="username"
                required
                value={adminForm.username}
                onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <div className="field__password">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                />
                <button
                  type="button"
                  className="field__eye"
                  onClick={() => setShowAdminPassword((v) => !v)}
                  aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              loading={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Signing in…' : 'Sign in as administrator'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  )
}