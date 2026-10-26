import { Link } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Lock, ScrollText } from 'lucide-react'
import Logo from './Logo'
import BridgeArc from './BridgeArc'

const POINTS = [
  { icon: BadgeCheck, text: 'Only verified hospitals can see patient records' },
  { icon: Lock, text: 'Access rules are enforced inside the database' },
  { icon: ScrollText, text: 'Every search is written to a permanent audit log' },
]

/**
 * Split screen for login and registration: a dark brand panel on the
 * left (hidden on phones) and the form on the right.
 */
function AuthLayout({ title, subtitle, children, eyebrow, panelTitle = 'One record, every hospital, the moment it matters.' }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-abyss text-white grain md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-between md:p-12">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-lagoon/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[26rem] w-[26rem] rounded-full bg-champagne/15 blur-3xl" />
        <div className="grid-lines pointer-events-none absolute inset-0" />

        <div className="relative"><Logo light /></div>

        <div className="relative">
          <BridgeArc className="mx-auto mb-8 w-full max-w-md" />
          <h2 className="max-w-md font-display text-[44px] leading-[1.08]">{panelTitle}</h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/75">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-4 w-4 text-seafoam" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">Case study: Nsukka, Enugu · Final-year project prototype</p>
      </aside>

      <div className="flex min-h-screen flex-col bg-porcelain px-5 py-8 sm:px-10">
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate transition-colors hover:text-ink">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="md:hidden"><Logo /></div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10" style={{ animation: 'rise .7s cubic-bezier(.2,.7,.2,1) both' }}>
          {eyebrow}
          <h1 className="font-display text-[44px] leading-[1.05] text-ink">{title}</h1>
          {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-slate">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
