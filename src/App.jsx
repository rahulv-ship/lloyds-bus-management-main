import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ScreenErrorBoundary from './components/common/ErrorBoundary'
import { SessionProvider, useSessionContext } from './hooks/SessionContext'
import RequireRole from './routes/RequireRole'
import LoginRoute from './routes/LoginRoute'
import EmployeeLayout from './routes/EmployeeLayout'
import AdminLayout from './routes/AdminLayout'
import DashboardPage from './routes/employee/DashboardPage'
import BookBusPage from './routes/employee/BookBusPage'
import MyPassPage from './routes/employee/MyPassPage'
import MyBookingsPage from './routes/employee/MyBookingsPage'
import NotificationsPage from './routes/employee/NotificationsPage'
import AlertsPage from './routes/employee/AlertsPage'
import ProfilePage from './routes/employee/ProfilePage'
import ApprovalsPage from './routes/admin/ApprovalsPage'
import AdminDashboardPage from './routes/admin/AdminDashboardPage'
import MasterDataPage from './routes/admin/MasterDataPage'
import MasterReportPage from './routes/admin/MasterReportPage'
import SpecialBookingPage from './routes/admin/SpecialBookingPage'
import GpsDashboard from './routes/admin/GpsDashboard'
import BillingPage from './routes/admin/BillingPage'
import './App.css'

// Root "/" shows the login screen unless already authenticated, in
// which case it redirects straight to the right section — same
// behavior as the original App.jsx's top-level conditional render.
function RootRoute() {
  const { isAuthenticated, role } = useSessionContext()

  if (isAuthenticated) {
    return <Navigate to={role === 'ADMIN' ? '/admin' : '/app/home'} replace />
  }

  return <LoginRoute />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />

      <Route
        path="/app"
        element={
          <RequireRole role="EMPLOYEE">
            <EmployeeLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<DashboardPage />} />
        <Route path="book" element={<BookBusPage />} />
        <Route path="pass" element={<MyPassPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole role="ADMIN">
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="gps-dashboard" element={<GpsDashboard />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="master-data" element={<MasterDataPage />} />
        <Route path="master-report" element={<MasterReportPage />} />
        <Route path="special-booking" element={<SpecialBookingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <AppRoutes />
      </SessionProvider>
    </BrowserRouter>
  )
}

function Root() {
  return (
    <ScreenErrorBoundary>
      <App />
    </ScreenErrorBoundary>
  )
}

export default Root
