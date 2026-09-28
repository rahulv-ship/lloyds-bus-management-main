import { useState } from 'react'
import { adminLogin, employeeSsoLogin } from '../services/authService'

// Same localStorage keys and session shape as the original App.jsx —
// nothing about how a session is stored, read, or cleared has changed.
const savedSession = () => {
  try {
    return JSON.parse(localStorage.getItem('lloyds_session') || 'null')
  } catch {
    localStorage.clear()
    return null
  }
}

export function useSession() {
  const [session, setSession] = useState(savedSession)

  const signInAdmin = async (username, password) => {
    const response = await adminLogin(username, password)

    const newSession = {
      token: response.token,
      user: response.user,
    }

    localStorage.setItem('lloyds_token', newSession.token)
    localStorage.setItem('lloyds_session', JSON.stringify(newSession))

    setSession(newSession)
    return newSession
  }

  const signInEmployee = async (email, password) => {
    const response = await employeeSsoLogin(email, password)

    if (!response?.token) {
      throw new Error(response?.message || 'Employee login failed.')
    }

    const newSession = {
      token: response.token,
      user: {
        ...response.user,
        role: 'EMPLOYEE',
      },
    }

    localStorage.setItem('lloyds_token', response.token)
    localStorage.setItem('lloyds_session', JSON.stringify(newSession))

    setSession(newSession)
    return newSession
  }

  const logout = () => {
    localStorage.removeItem('lloyds_token')
    localStorage.removeItem('lloyds_session')
    setSession(null)
  }

  const isAuthenticated = Boolean(session?.token && session?.user?.role)

  return {
    session,
    isAuthenticated,
    role: session?.user?.role || null,
    signInAdmin,
    signInEmployee,
    logout,
  }
}
