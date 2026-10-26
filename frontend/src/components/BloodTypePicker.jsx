const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

// Tap-to-choose blood type. "Unknown" is the empty choice.
function BloodTypePicker({ value, onChange, label = 'Blood type' }) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {BLOOD_TYPES.map((type) => {
          const active = value === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(active ? 'Unknown' : type)}
              aria-pressed={active}
              className={
                'h-10 min-w-[3.25rem] rounded-xl border px-3 text-sm font-bold transition-all duration-150 ' +
                (active
                  ? 'border-abyss bg-abyss text-white shadow-[0_8px_18px_-8px_rgba(6,28,34,.7)]'
                  : 'border-hair bg-white text-ink hover:border-lagoon hover:bg-seafoam/10')
              }
            >
              {type}
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 text-xs text-slate">{value === 'Unknown' ? 'Not recorded. Tap to choose.' : 'Tap again to clear.'}</p>
    </div>
  )
}

export default BloodTypePicker
