import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-abyss text-white shadow-[0_8px_20px_-8px_rgba(6,28,34,.6)] hover:bg-deep',
  accent:
    'bg-gradient-to-b from-[#e4cf9f] to-champagne text-abyss shadow-[0_10px_26px_-10px_rgba(201,169,110,.8)] hover:from-[#ecdab0] hover:to-[#d4b57a]',
  light: 'bg-white text-abyss shadow-[0_10px_26px_-12px_rgba(0,0,0,.5)] hover:bg-porcelain',
  ghost: 'border border-white/25 bg-white/5 text-white hover:bg-white/15',
  success: 'bg-lagoon text-white shadow-[0_8px_20px_-8px_rgba(20,96,107,.7)] hover:bg-deep',
  destructive: 'bg-coral text-white shadow-[0_8px_20px_-8px_rgba(194,73,63,.6)] hover:bg-[#a53a31]',
  secondary: 'border border-hair bg-white text-ink hover:border-[#bccdd0] hover:bg-porcelain',
}
const SIZES = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
  xl: 'h-14 px-8 text-base',
}

function Button({ variant = 'primary', size = 'md', loading = false, fullWidth = false, className = '', children, disabled, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ' +
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98] ' +
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ' +
        VARIANTS[variant] + ' ' + SIZES[size] + (fullWidth ? ' w-full' : '') + ' ' + className
      }
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export default Button
