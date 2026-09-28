import { Navigate } from 'react-router-dom'
import { useSessionContext } from '../hooks/SessionContext'

// Same guard logic the original App.jsx expressed as conditional
// rendering (`!session?.token || !session?.user?.role` → login;
// `role === 'ADMIN'` / `role === 'EMPLOYEE'` → the right screen),
// now expressed as route guards.
export default function RequireRole({ role, children }) {
  const { isAuthenticated, role: currentRole } = useSessionContext()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (currentRole !== role) {
    // Signed in, but wrong section — send them to their own home
    // rather than showing a dead end or exposing the other role's nav.
    return <Navigate to={currentRole === 'ADMIN' ? '/admin' : '/app/home'} replace />
  }

  return children
}
