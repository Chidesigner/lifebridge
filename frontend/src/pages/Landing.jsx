import { Link } from 'react-router-dom'
import { ShieldCheck, Search, Building2, ClipboardList, ArrowRight } from 'lucide-react'
import Reveal from '../components/Reveal'

/**
 * A hand-built illustration (no external image files) showing hospitals
 * connected to one shared, secured record. The dashed lines animate
 * with a slow, looping "flow" — a deliberate, purposeful motion that
 * represents data moving between facilities, not decoration for its
 * own sake. Disabled entirely under prefers-reduced-motion.
 */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
      <style>{`
        @keyframes lb-flow { to { stroke-dashoffset: -24; } }
        .lb-flow-line { animation: lb-flow 1.8s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lb-flow-line { animation: none; }
        }
      `}</style>

      <line className="lb-flow-line" x1="240" y1="200" x2="100" y2="90" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
      <line className="lb-flow-line" x1="240" y1="200" x2="380" y2="90" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
      <line className="lb-flow-line" x1="240" y1="200" x2="100" y2="320" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
      <line className="lb-flow-line" x1="240" y1="200" x2="380" y2="320" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />

      {[[100, 90], [380, 90], [100, 320], [380, 320]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="34" fill="#EFF6FF" stroke="#1E3A5F" strokeWidth="2" />
          <rect x={cx - 14} y={cy - 12} width="28" height="22" rx="2" fill="#1E3A5F" />
          <rect x={cx - 3} y={cy - 8} width="6" height="6" fill="white" />
          <rect x={cx - 3} y={cy + 2} width="6" height="6" fill="white" />
        </g>
      ))}

      <circle cx="240" cy="200" r="52" fill="#F0FDF4" stroke="#16A34A" strokeWidth="3" />
      <rect x="220" y="176" width="40" height="48" rx="4" fill="#16A34A" />
      <rect x="227" y="186" width="26" height="4" rx="2" fill="white" />
      <rect x="227" y="196" width="26" height="4" rx="2" fill="white" />
      <rect x="227" y="206" width="16" height="4" rx="2" fill="white" />
    </svg>
  )
}

const FEATURES = [
  {
    icon: Building2,
    title: 'Verified hospitals only',
    description: 'Every facility on LifeBridge is checked against its CAC and MDCN registration before it can access anything.',
  },
  {
    icon: Search,
    title: 'Search by NIN',
    description: "One number, one search, every hospital's records for that patient returned instantly.",
  },
  {
    icon: ShieldCheck,
    title: 'Secured at the database level',
    description: 'Access rules are enforced by the database itself, not just the app — the strongest place to put them.',
  },
  {
    icon: ClipboardList,
    title: 'Every search is logged',
    description: 'A full audit trail of who searched what, and when, with no way for a hospital to skip being recorded.',
  },
]

const STEPS = [
  { number: '01', title: 'Register', description: 'A hospital submits its CAC and MDCN details.' },
  { number: '02', title: 'Get verified', description: 'The System Administrator reviews and approves access.' },
  { number: '03', title: 'Share & search', description: 'Upload records and search any patient by NIN.' },
]

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-bold text-brand-navy">LifeBridge</span>
        <nav className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-navy">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-navy-dark hover:shadow-md active:translate-y-0"
          >
            Register your hospital
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-green-dark">
            Nsukka, Enugu Case Study
          </span>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.1] tracking-tight text-brand-navy sm:text-6xl">
            Cross-facility patient records, without the wait.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            LifeBridge lets verified Nigerian hospitals share critical patient
            information, allergies, medications, blood type, and history,
            using the National Identification Number as a single, secure key.
          </p>
          <div className="mt-9 flex items-center gap-6">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-md bg-brand-green px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-green-dark hover:shadow-lg active:translate-y-0"
            >
              Register your hospital
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link to="/login" className="text-sm font-medium text-gray-600 transition-colors hover:text-brand-navy">
              Already registered? Log in
            </Link>
          </div>
        </div>
        <Reveal delay={150} className="flex justify-center">
          <HeroIllustration />
        </Reveal>
      </section>

      {/* Features — a flatter, editorial list rather than a grid of
          identical bordered cards, per LifeBridge's design principle
          of restraint over decoration. */}
      <section className="border-t border-gray-100 bg-gray-50/60">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-medium text-brand-navy">
              Built for how hospitals actually work together
            </h2>
          </Reveal>
          <div className="mt-12 divide-y divide-gray-200 border-t border-gray-200">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white ring-1 ring-gray-200">
                    <Icon className="h-5 w-5 text-brand-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-600">{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-medium text-brand-navy">How it works</h2>
        </Reveal>
        <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-gray-200 sm:block" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 100} className="relative text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white ring-4 ring-white">
                {step.number}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        LifeBridge — a cross-facility health information platform for Nigeria.
      </footer>
    </div>
  )
}

export default Landing
