import { useRef } from 'react'
import { FileUp, CheckCircle2, RefreshCw } from 'lucide-react'

// A simple file picker: click the box, choose a file, its name is shown.
function FileField({ label, hint, file, onChange, error }) {
  const inputRef = useRef(null)

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className={
          'group flex w-full items-center gap-4 rounded-xl border border-dashed px-4 py-4 text-left transition-all duration-200 ' +
          (error
            ? 'border-coral bg-coral/5'
            : file
              ? 'border-lagoon/50 bg-seafoam/15'
              : 'border-[#b7c9cc] bg-white hover:border-lagoon hover:bg-seafoam/10')
        }
      >
        <span
          className={
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ' +
            (file ? 'bg-lagoon text-white' : 'bg-porcelain text-lagoon group-hover:bg-white')
          }
        >
          {file ? <CheckCircle2 className="h-5 w-5" /> : <FileUp className="h-5 w-5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">{file ? file.name : 'Choose a file'}</span>
          <span className="block text-xs text-slate">
            {file ? `${(file.size / 1024).toFixed(0)} KB · click to replace` : hint}
          </span>
        </span>
        {file && <RefreshCw className="h-4 w-4 shrink-0 text-slate" />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(e) => onChange(e.target.files[0] ?? null)}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-coral">{error}</p>}
    </div>
  )
}

export default FileField
