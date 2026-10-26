function Skeleton({ rows = 4 }) {
  return (
    <div className="space-y-3 p-5" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="skeleton-line h-11 w-11 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-line h-3.5 w-1/3 rounded-full" />
            <div className="skeleton-line h-3 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Skeleton
