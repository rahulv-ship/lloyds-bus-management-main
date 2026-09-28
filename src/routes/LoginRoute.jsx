import { useState } from 'react'
import LoginCinematic from '../components/login/LoginCinematic'
import LoginPanel from '../components/login/LoginPanel'

export default function LoginRoute() {
  const [cinematicDone, setCinematicDone] = useState(false)

  return (
    <>
      <LoginPanel />
      {!cinematicDone && <LoginCinematic onComplete={() => setCinematicDone(true)} />}
    </>
  )
}
