import { Loader2 } from 'lucide-react'

/**
 * A small inline spinner + message, used anywhere data is loading.
 * Replaces plain "Loading..." text with something that actually
 * signals activity.
 */
function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Loader2 className="h-4 w-4 animate-spin text-brand-navy" />
      <span>{label}</span>
    </div>
  )
}

export default Spinner
