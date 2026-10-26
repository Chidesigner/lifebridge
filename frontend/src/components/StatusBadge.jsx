import { BadgeCheck, Clock } from 'lucide-react'

function StatusBadge({ verified }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-seafoam/30 px-3 py-1 text-xs font-semibold text-deep ring-1 ring-inset ring-lagoon/20">
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne/20 px-3 py-1 text-xs font-semibold text-champagne-deep ring-1 ring-inset ring-champagne/40">
      <Clock className="h-3.5 w-3.5" />
      Awaiting review
    </span>
  )
}

export default StatusBadge
