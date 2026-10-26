function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-seafoam/25" />
          <span className="absolute -inset-2 rounded-full border border-lagoon/15" />
          <Icon className="relative h-7 w-7 text-lagoon" />
        </div>
      )}
      <p className="font-display text-2xl text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState
