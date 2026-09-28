import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Button from './Button'
import './Modal.css'

export default function AlertModal({ open, title, message, tone = 'danger', confirmLabel = 'OK', onConfirm, autoClose = false, cancelLabel, onCancel }) {
  const onConfirmRef = useRef(onConfirm)
  const onCancelRef = useRef(onCancel)
  useEffect(() => {
    onConfirmRef.current = onConfirm
  }, [onConfirm])
  useEffect(() => {
    onCancelRef.current = onCancel
  }, [onCancel])

  useEffect(() => {
    if (!open || !autoClose) return
    const timeout = setTimeout(() => {
      onConfirmRef.current?.()
    }, 2500)
    return () => clearTimeout(timeout)
  }, [open, autoClose])

  useEffect(() => {
    if (!open) return
    const handler = (event) => {
      if (event.key === 'Escape') {
        if (cancelLabel) {
          onCancelRef.current?.()
        } else {
          onConfirmRef.current?.()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, cancelLabel])

  if (!open) return null

  const handleBackdropClick = () => {
    if (cancelLabel) {
      onCancelRef.current?.()
    } else {
      onConfirmRef.current?.()
    }
  }

  const handleClose = () => {
    if (cancelLabel) {
      onCancelRef.current?.()
    } else {
      onConfirmRef.current?.()
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="alert-modal-title">
      <div className="modal__backdrop" onClick={handleBackdropClick} />
      <div className="modal__panel">
        <div className="modal__header">
          <h3 id="alert-modal-title">{title}</h3>
          <button type="button" className="modal__close" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">
          <p>{message}</p>
        </div>
        <div className={`modal__footer ${cancelLabel ? 'modal__footer--split' : ''}`}>
          {cancelLabel && (
            <Button variant="secondary" onClick={() => onCancelRef.current?.()}>{cancelLabel}</Button>
          )}
          <Button variant="primary" onClick={() => onConfirmRef.current?.()}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
