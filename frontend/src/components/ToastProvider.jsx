import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((message, { type = 'success', duration = 3800 } = {}) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            style={{ animation: 'toast-in 300ms cubic-bezier(.2,.7,.2,1)' }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-abyss/95 p-4 text-white shadow-[0_24px_50px_-16px_rgba(6,28,34,.7)] backdrop-blur"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-seafoam" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9a8f]" />
            )}
            <p className="flex-1 text-sm leading-snug text-white/90">{t.message}</p>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/50 transition-colors hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
