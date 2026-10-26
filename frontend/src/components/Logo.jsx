import { Link } from 'react-router-dom'

// The LifeBridge mark: an arch (a bridge) with a pulse dot above it.
export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="LifeBridge">
      <defs>
        <linearGradient id="lb-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14606b" />
          <stop offset="1" stopColor="#061c22" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#lb-mark)" />
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="11.25" fill="none" stroke="rgba(255,255,255,.18)" />
      <path d="M9.5 27.5V25c0-9 4.5-13 10.5-13s10.5 4 10.5 13v2.5" fill="none" stroke="#8fe3cf" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6.5 28.5h27" stroke="#c9a96e" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 17v7M16.5 20.5h7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function Logo({ light = false, to = '/', subtitle }) {
  return (
    <Link to={to} className="inline-flex items-center gap-3">
      <LogoMark />
      <span className="leading-tight">
        <span className={'block font-display text-[27px] font-medium ' + (light ? 'text-white' : 'text-ink')}>
          LifeBridge
        </span>
        {subtitle && (
          <span className={'block text-[11px] font-medium ' + (light ? 'text-white/60' : 'text-slate')}>{subtitle}</span>
        )}
      </span>
    </Link>
  )
}

export default Logo
