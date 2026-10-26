import { useId } from 'react'

/**
 * Shared, accessible field styling for inputs, selects and textareas.
 * Labels are programmatically associated with their controls, and
 * error states are consistently announced below the relevant field.
 */
function FormField({ label, error, as = 'input', icon: Icon, children, id, ...inputProps }) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const baseFieldClasses =
    'w-full rounded-md border px-3 py-2 text-sm text-gray-900 shadow-sm ' +
    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ' +
    (Icon ? 'pl-9 ' : '') +
    (error
      ? 'border-brand-red focus:ring-brand-red/40'
      : 'border-gray-300 focus:border-brand-navy focus:ring-brand-navy/30')

  return (
    <div>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        )}
        {as === 'select' ? (
          <select id={fieldId} aria-invalid={Boolean(error)} className={baseFieldClasses} {...inputProps}>
            {children}
          </select>
        ) : as === 'textarea' ? (
          <textarea id={fieldId} aria-invalid={Boolean(error)} className={baseFieldClasses} {...inputProps} />
        ) : (
          <input id={fieldId} aria-invalid={Boolean(error)} className={baseFieldClasses} {...inputProps} />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-brand-red" role="alert">{error}</p>}
    </div>
  )
}

export default FormField
