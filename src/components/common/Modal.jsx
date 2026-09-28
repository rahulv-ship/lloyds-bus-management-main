import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button'
import './Modal.css'

export default function Modal({ open, title, message, confirmLabel = 'OK', onConfirm }) {
  const onConfirmRef = useRef(onConfirm)
  useEffect(() => {
    onConfirmRef.current = onConfirm
  }, [onConfirm])

  useEffect(() => {
    if (!open) return
    const handler = (event) => {
      if (event.key === 'Escape') onConfirmRef.current?.()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal__backdrop" onClick={() => onConfirmRef.current?.()} />
      <div className="modal__panel">
        <div className="modal__header">
          <h3 id="modal-title">{title}</h3>
          <button type="button" className="modal__close" onClick={() => onConfirmRef.current?.()} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">
          <p>{message}</p>
        </div>
        <div className="modal__footer">
          <Button variant="primary" onClick={() => onConfirmRef.current?.()}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
