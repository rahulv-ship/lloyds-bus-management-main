import { useEffect, useMemo, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import BottomNav from '../components/layout/BottomNav'
import TopBar from '../components/layout/TopBar'
import './EmployeeLayout.css'

const TITLES = {
  '/app/home': 'Home',
  '/app/book': 'Book Bus',
  '/app/pass': 'My Pass',
  '/app/bookings': 'My Bookings',
  '/app/notifications': 'Notifications',
  '/app/alerts': 'Alerts',
  '/app/profile': 'Profile',
}

export default function EmployeeLayout() {
  const location = useLocation()
  const mainRef = useRef(null)

  // Resolve title: exact match, else longest-prefix match for nested routes
  const title = useMemo(() => {
    const path = location.pathname
    if (TITLES[path]) return TITLES[path]
    const match = Object.keys(TITLES)
      .filter((k) => path.startsWith(k))
      .sort((a, b) => b.length - a.length)[0]
    return match ? TITLES[match] : 'Employee Transport'
  }, [location.pathname])

  // Scroll main content to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="employee-shell">
      {/* Ambient background layers */}
      <div className="employee-shell__bg" aria-hidden="true">
        <span className="employee-shell__bg-blob employee-shell__bg-blob--a" />
        <span className="employee-shell__bg-blob employee-shell__bg-blob--b" />
        <span className="employee-shell__bg-grid" />
      </div>

      <Sidebar />

      <div className="employee-shell__main">
        <TopBar title={title} />

        <main ref={mainRef} className="employee-shell__content">
          <div className="container">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                className="employee-shell__page"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}