import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BusScene from './BusScene'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './LoginCinematic.css'

const SEEN_KEY = 'lloyds_intro_seen'

// Full sequence ≈ 2.9s, short (repeat-visit) sequence ≈ 0.65s.
// Every phase is plain CSS keyframes (see LoginCinematic.css) —
// this component only decides *which* variant to play and when
// to signal completion.
export default function LoginCinematic({ onComplete }) {
  const reducedMotion = useReducedMotion()
  const [hasSeenBefore] = useState(() => localStorage.getItem(SEEN_KEY) === 'true')
  const [visible, setVisible] = useState(true)
  const curtainRef = useRef(null)

  const variant = hasSeenBefore ? 'short' : 'full'
  const skipInstant = reducedMotion

  const finish = () => {
    localStorage.setItem(SEEN_KEY, 'true')
    setVisible(false)
  }

  const handleSkip = () => {
    finish()
  }

  useEffect(() => {
    if (skipInstant) {
      // Reduced motion: no cinematic at all, just a quick fade handled
      // by the AnimatePresence exit below.
      const t = setTimeout(finish, 120)
      return () => clearTimeout(t)
    }
  }, [skipInstant])

  const handleCurtainAnimationEnd = (e) => {
    if (e.target !== curtainRef.current) return
    if (e.animationName !== 'ls-curtain-wipe' && e.animationName !== 'ls-curtain-wipe-short') {
      return
    }
    finish()
  }

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="ls-cinematic"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {!skipInstant && (
            <button type="button" className="ls-skip" onClick={handleSkip}>
              Skip intro
            </button>
          )}

          <div
            ref={curtainRef}
            className={`ls-curtain ${skipInstant ? '' : `ls-playing ls-variant-${variant}`}`}
            onAnimationEnd={handleCurtainAnimationEnd}
          >
            <div className="ls-scene">
              <BusScene />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
