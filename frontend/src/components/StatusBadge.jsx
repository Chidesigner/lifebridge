import { CheckCircle2, Clock } from 'lucide-react'

/**
 * A small status pill with an icon, used anywhere something is
 * "Verified" or "Pending" — the icon carries meaning even before the
 * color/text is read, which matters for quick scanning of a table.
 */
function StatusBadge({ verified }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-brand-green-dark">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
      <Clock className="h-3.5 w-3.5" />
      Pending
    </span>
  )
}

export default StatusBadge
