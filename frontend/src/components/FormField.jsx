function FormField({ label, error, hint, as = 'input', icon: Icon, children, ...inputProps }) {
  const fieldClasses =
    'w-full rounded-xl border bg-white px-4 text-[15px] text-ink shadow-[0_1px_2px_rgba(6,28,34,.04)] ' +
    'placeholder:text-[#9db0b5] transition-all duration-150 focus:outline-none focus:ring-4 ' +
    (as === 'textarea' ? 'py-3 ' : as === 'select' ? 'h-12 ' : 'h-12 ') +
    (Icon ? 'pl-11 ' : '') +
    (error
      ? 'border-coral focus:ring-coral/15'
      : 'border-hair hover:border-[#bccdd0] focus:border-lagoon focus:ring-lagoon/15')

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-[13px] h-[18px] w-[18px] text-[#8aa0a6]" />
        )}
        {as === 'select' ? (
          <select className={fieldClasses} {...inputProps}>{children}</select>
        ) : as === 'textarea' ? (
          <textarea className={fieldClasses} {...inputProps} />
        ) : (
          <input className={fieldClasses} {...inputProps} />
        )}
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-slate">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-coral">{error}</p>}
    </div>
  )
}

export default FormField
