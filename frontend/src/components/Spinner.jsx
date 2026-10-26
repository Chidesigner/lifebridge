import { Loader2 } from 'lucide-react'

function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate">
      <Loader2 className="h-4 w-4 animate-spin text-lagoon" />
      <span>{label}</span>
    </div>
  )
}

export default Spinner
