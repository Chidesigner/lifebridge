import { AlertTriangle } from 'lucide-react'
import Button from './Button'

function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', onConfirm, onCancel, loading = false }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-abyss/55 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        style={{ animation: 'dialog-in 220ms cubic-bezier(.2,.7,.2,1)' }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_40px_80px_-24px_rgba(6,28,34,.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10">
          <AlertTriangle className="h-6 w-6 text-coral" />
        </div>
        <h2 className="mt-5 font-display text-3xl text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate">{description}</p>
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
