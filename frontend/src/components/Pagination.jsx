import { ChevronLeft, ChevronRight } from 'lucide-react'
import { totalPages as computeTotalPages } from '../lib/pagination'

/**
 * Prev/Next pagination bar. Renders nothing if everything fits on one
 * page, so pages using this never need their own "more than 10 rows" check.
 */
function Pagination({ page, itemCount, onPageChange }) {
  const pages = computeTotalPages(itemCount)
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-hair px-5 py-4">
      <p className="text-xs font-medium text-slate">
        Page {page} of {pages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-9 items-center gap-1 rounded-full border border-hair bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-porcelain disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="flex h-9 items-center gap-1 rounded-full border border-hair bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-porcelain disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
