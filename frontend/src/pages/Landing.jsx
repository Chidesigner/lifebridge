import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ShieldCheck, Search, Building2, ClipboardList, FileLock2, Database,
  Check, Menu, X, Activity, Pill, AlertTriangle, Droplets, BadgeCheck, KeyRound, Eye, Layers,
} from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/Button'
import BridgeArc from '../components/BridgeArc'

/* ---------- small helpers ---------- */

// Fades a block in once when it scrolls into view.
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(22px)',
        transition: `opacity .8s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function Eyebrow({ children, light = false }) {
  return (
    <p className={'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] ' + (light ? 'text-seafoam' : 'text-lagoon')}>
      <span className={'h-px w-6 ' + (light ? 'bg-seafoam/60' : 'bg-lagoon/50')} />
      {children}
    </p>
  )
}

/* ---------- the animated lookup console (hero) ---------- */

const DEMO_NIN = '12345678901'
const DEMO_RESULTS = [
  { hospital: 'Greenfield Hospital', note: 'Allergy: Penicillin', when: 'Uploaded 3 weeks ago', tone: 'alert' },
  { hospital: 'Lion Crest Clinic', note: 'Hypertension · Amlodipine 5mg', when: 'Uploaded 2 months ago', tone: 'neutral' },
  { hospital: 'Ezeani Memorial Hospital', note: 'Appendectomy, 2021', when: 'Uploaded 8 months ago', tone: 'neutral' },
]
const CYCLE = 64
const TICK_MS = 110

function LookupConsole() {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [tick, setTick] = useState(reduced ? 44 : 0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setTick((t) => (t + 1) % CYCLE), TICK_MS)
    return () => clearInterval(id)
  }, [reduced])

  const typed = Math.min(tick, 11)
  const searching = tick >= 13 && tick < 19
  const shown = tick < 19 ? 0 : Math.min(3, Math.floor((tick - 19) / 5) + 1)
  const logged = tick >= 36
  const nin = DEMO_NIN.slice(0, typed)

  return (
    <div className="glass relative w-full max-w-[460px] rounded-[28px] p-5 sm:p-6" aria-label="Animated example of a patient lookup">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-seafoam/15 px-3 py-1 text-[11px] font-bold text-seafoam">
          <span className="h-1.5 w-1.5 rounded-full bg-seafoam" />Verified hospital
        </span>
      </div>

      <p className="mt-6 text-[11px] font-bold uppercase tracking-[.16em] text-white/45">Patient lookup</p>
      <div className="mt-2 flex h-14 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4">
        <Search className="h-5 w-5 text-white/50" />
        <span className="text-lg font-semibold tracking-[.14em] text-white tabular-nums">
          {nin || <span className="text-sm font-normal tracking-normal text-white/35">Enter 11-digit NIN</span>}
          {typed < 11 && !reduced && <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 bg-seafoam" style={{ animation: 'caret 1s steps(1) infinite' }} />}
        </span>
      </div>

      <div className="mt-4 min-h-[212px] space-y-2.5">
        {searching && (
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-4 text-sm text-white/60">
            <span className="h-4 w-4 rounded-full border-2 border-seafoam/30 border-t-seafoam" style={{ animation: 'spin-slow .7s linear infinite' }} />
            Searching every verified hospital…
          </div>
        )}
        {DEMO_RESULTS.slice(0, shown).map((r) => (
          <div key={r.hospital} className="rounded-2xl bg-white/[.09] px-4 py-3.5 ring-1 ring-inset ring-white/10" style={{ animation: 'pop-in .5s cubic-bezier(.2,.7,.2,1) both' }}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-seafoam to-lagoon text-[11px] font-extrabold text-abyss">AO</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">Adaeze Okonkwo</p>
                <p className="truncate text-[11px] text-white/55">{r.hospital} · {r.when}</p>
              </div>
              {r.tone === 'alert' && <AlertTriangle className="h-4 w-4 shrink-0 text-champagne" />}
            </div>
            <p className="mt-2.5 rounded-lg bg-black/20 px-3 py-1.5 text-xs font-semibold text-white/80">{r.note}</p>
          </div>
        ))}
      </div>

      <div className={'mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-500 ' + (logged ? 'bg-seafoam/15 text-seafoam opacity-100' : 'bg-white/5 text-white/25 opacity-70')}>
        <ShieldCheck className="h-4 w-4" />
        {logged ? 'Search logged in your hospital’s audit trail' : 'Every search is logged'}
      </div>
    </div>
  )
}

/* ---------- page sections ---------- */

const STEPS = [
  { icon: Building2, title: 'Register your hospital', text: 'Create an account with your CAC and MDCN numbers and upload your certificates.' },
  { icon: BadgeCheck, title: 'Get verified', text: 'A LifeBridge administrator reviews your documents and approves your facility.' },
  { icon: ClipboardList, title: 'Share records', text: 'Add the patients you treat. Each record is tied to a National Identification Number.' },
  { icon: Search, title: 'Look up anyone', text: 'Enter a NIN and see what every other verified hospital has recorded. Instantly.' },
]

const SECURITY = [
  { icon: BadgeCheck, title: 'Verified facilities', text: 'Nothing is reachable until an administrator has reviewed your documents.' },
  { icon: Database, title: 'Rules inside the database', text: 'Access is enforced by Postgres row-level security, not just by buttons in the interface.' },
  { icon: ClipboardList, title: 'An audit trail you cannot skip', text: 'The search itself writes the log entry. There is no way to look without being recorded.' },
  { icon: FileLock2, title: 'Private documents', text: 'Certificates sit in a private bucket and open only through a link that expires in 60 seconds.' },
]

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#how', label: 'How it works' },
    { href: '#features', label: 'Features' },
    { href: '#security', label: 'Security' },
  ]

  return (
    <div className="bg-porcelain">
      {/* ---------- nav ---------- */}
      <header className={'fixed inset-x-0 top-0 z-40 transition-all duration-300 ' + (scrolled ? 'border-b border-white/10 bg-abyss/80 backdrop-blur-xl' : 'bg-transparent')}>
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo light />
          <nav className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-white/70 transition-colors hover:text-white">{l.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="px-4 py-2 text-sm font-bold text-white/85 transition-colors hover:text-white">Log in</Link>
            <Link to="/register"><Button variant="accent" size="md">Register hospital<ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-white/10 bg-abyss/95 px-5 pb-6 pt-3 backdrop-blur-xl md:hidden">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-3 text-base font-semibold text-white/80">{l.label}</a>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/login"><Button variant="light" fullWidth>Log in</Button></Link>
              <Link to="/register"><Button variant="accent" fullWidth>Register hospital</Button></Link>
            </div>
          </div>
        )}
      </header>

      {/* ---------- hero ---------- */}
      <section className="relative isolate overflow-hidden bg-abyss text-white grain">
        <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-lagoon/50 blur-[130px]" />
        <div className="pointer-events-none absolute -right-32 -top-20 -z-10 h-[30rem] w-[30rem] rounded-full bg-seafoam/20 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-80 w-[40rem] rounded-full bg-champagne/10 blur-[120px]" />
        <div className="grid-lines pointer-events-none absolute inset-0 -z-10" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-36 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:pb-32 lg:pt-44">
          <div>
            <p className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-4 text-xs font-bold text-white/80" style={{ animationDelay: '.05s' }}>
              <span className="rounded-full bg-champagne px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-abyss">Pilot</span>
              Cross-hospital patient records for Nsukka, Enugu
            </p>
            <h1 className="hero-rise mt-7 font-display text-[46px] leading-[1.06] sm:text-[64px] lg:text-[72px]" style={{ animationDelay: '.15s' }}>
              A patient’s history shouldn’t stop at the <span className="text-gold italic">hospital door.</span>
            </h1>
            <p className="hero-rise mt-7 max-w-xl text-lg leading-relaxed text-white/70" style={{ animationDelay: '.28s' }}>
              LifeBridge lets verified hospitals share patient records through a single National Identification Number, so the next doctor knows the allergy, the condition and the medication before the first question.
            </p>
            <div className="hero-rise mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '.4s' }}>
              <Link to="/register"><Button variant="accent" size="xl">Register your hospital<ArrowRight className="h-5 w-5" /></Button></Link>
              <a href="#how"><Button variant="ghost" size="xl" className="!text-white !ring-white/25 hover:!bg-white/10">See how it works</Button></a>
            </div>
            <ul className="hero-rise mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-white/65" style={{ animationDelay: '.52s' }}>
              {['Verified hospitals only', 'Every search logged', 'Patients never need an account'].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-seafoam" />{t}</li>
              ))}
            </ul>
          </div>

          <div className="hero-rise relative flex justify-center lg:justify-end" style={{ animationDelay: '.35s' }}>
            <BridgeArc className="pointer-events-none absolute -top-20 left-1/2 w-[130%] -translate-x-1/2 opacity-30" />
            <div className="relative w-full max-w-[460px]">
              <LookupConsole />
              <div className="glass absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/20 text-champagne"><ClipboardList className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-bold text-white">Audit entry written</p>
                  <p className="text-[11px] text-white/50">Automatically, every time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the problem ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="mt-5 font-display text-[40px] leading-[1.08] text-ink sm:text-[46px]">
              Your records are in three places. Your doctor can see one.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate">
              Patients move between clinics, pharmacies and referral hospitals. Their history stays behind in paper files and separate systems. The new doctor starts from zero, and the patient repeats the same story, or leaves out the one detail that mattered.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------- how it works ---------- */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8 lg:pb-32">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-5 font-display text-[40px] leading-[1.08] text-ink sm:text-[44px]">Four steps from sign-up to a shared record.</h2>
          </div>
        </Reveal>
        <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-[52px] hidden h-px border-t border-dashed border-lagoon/30 lg:block" />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="surface surface-hover relative h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-deep to-abyss text-seafoam shadow-lg shadow-abyss/20">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-[56px] leading-none text-hair">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- features (bento) ---------- */}
      <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8 lg:pb-32">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>Features</Eyebrow>
            <h2 className="mt-5 font-display text-[40px] leading-[1.08] text-ink sm:text-[44px]">Built for the way a clinic actually works.</h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {/* big: one search */}
          <Reveal className="lg:col-span-4">
            <div className="surface-dark grain h-full p-8 sm:p-10">
              <div className="relative grid items-center gap-8 md:grid-cols-[1fr_.9fr]">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seafoam/15 text-seafoam"><Search className="h-5 w-5" /></span>
                  <h3 className="mt-6 font-display text-[34px] leading-tight">One search. Every hospital.</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    Type a NIN and LifeBridge returns what each verified hospital has on file, with the hospital’s name beside every entry so you know exactly who to call.
                  </p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { icon: AlertTriangle, label: 'Allergies' },
                    { icon: Activity, label: 'Chronic conditions' },
                    { icon: Pill, label: 'Current medications' },
                    { icon: Droplets, label: 'Blood type' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/[.07] px-4 py-3 ring-1 ring-inset ring-white/10">
                      <Icon className="h-4 w-4 text-champagne" />
                      <span className="text-sm font-semibold text-white/85">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={100}>
            <div className="surface surface-hover h-full p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/20 text-champagne-deep"><ClipboardList className="h-5 w-5" /></span>
              <h3 className="mt-6 font-display text-[30px] leading-tight text-ink">Every lookup is on the record</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">Each search writes an audit entry automatically. Hospitals see their own history, administrators see all of it.</p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2">
            <div className="surface surface-hover h-full p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seafoam/30 text-deep"><FileLock2 className="h-5 w-5" /></span>
              <h3 className="mt-6 font-display text-[30px] leading-tight text-ink">Private documents</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">Certificates are stored privately and opened only by administrators, through links that expire in a minute.</p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={100}>
            <div className="surface surface-hover h-full p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seafoam/30 text-deep"><Database className="h-5 w-5" /></span>
              <h3 className="mt-6 font-display text-[30px] leading-tight text-ink">Rules in the database</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">Access control lives in Postgres policies, so it holds even if someone bypasses the interface.</p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={200}>
            <div className="surface surface-hover h-full p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/20 text-champagne-deep"><Layers className="h-5 w-5" /></span>
              <h3 className="mt-6 font-display text-[30px] leading-tight text-ink">Edit yours, never theirs</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">You can correct the records you uploaded. You can never change another hospital’s.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- security ---------- */}
      <section id="security" className="relative isolate scroll-mt-20 overflow-hidden bg-abyss text-white grain">
        <div className="pointer-events-none absolute -right-40 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-lagoon/40 blur-[130px]" />
        <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-70" />
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:py-32">
          <Reveal>
            <div>
              <Eyebrow light>Security in layers</Eyebrow>
              <h2 className="mt-5 font-display text-[40px] leading-[1.08] sm:text-[46px]">Health data deserves more than a login screen.</h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
                Four independent layers stand between a record and anyone who shouldn’t see it. Remove one and the others still hold.
              </p>
              <div className="relative mx-auto mt-12 hidden h-64 w-64 lg:block">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="absolute rounded-full border border-seafoam/30" style={{ inset: `${i * 28}px`, opacity: 1 - i * 0.18 }} />
                ))}
                <span className="absolute inset-[84px] flex items-center justify-center rounded-full bg-gradient-to-br from-champagne to-champagne-deep text-abyss shadow-[0_0_60px_rgba(201,169,110,.45)]">
                  <KeyRound className="h-7 w-7" />
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {SECURITY.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="glass h-full rounded-3xl p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-seafoam/15 text-seafoam"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-base font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Nsukka ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <Eyebrow>Starting in Nsukka</Eyebrow>
              <h2 className="mt-5 font-display text-[40px] leading-[1.08] text-ink sm:text-[44px]">Small enough to pilot. Designed to grow.</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate">
                The pilot is scoped to Nsukka in Enugu State. A state ministry of health or a health board is the natural body to confirm hospitals and run the administrator role as it scales.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '11', label: 'digits in a NIN is all you need' },
                { value: '1', label: 'search reaches every hospital' },
                { value: '0', label: 'patient accounts to manage' },
              ].map((s) => (
                <div key={s.value} className="surface p-5 text-center sm:p-7">
                  <p className="text-gold font-display text-[64px] leading-none sm:text-[84px]">{s.value}</p>
                  <p className="mt-3 text-xs font-semibold leading-snug text-slate">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="surface-dark grain relative px-7 py-16 text-center sm:px-16 sm:py-24">
            <BridgeArc className="pointer-events-none absolute left-1/2 top-0 w-[900px] max-w-none -translate-x-1/2 opacity-25" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-[38px] leading-[1.08] sm:text-[54px]">Bring your hospital onto the bridge.</h2>
              <p className="mt-5 text-base leading-relaxed text-white/65">Register in about five minutes. An administrator will review your documents and approve your facility.</p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link to="/register"><Button variant="accent" size="xl">Register hospital<ArrowRight className="h-5 w-5" /></Button></Link>
                <Link to="/login"><Button variant="ghost" size="xl" className="!text-white !ring-white/25 hover:!bg-white/10">Log in</Button></Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="border-t border-hair bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <Logo />
          <p className="max-w-xl text-xs leading-relaxed text-slate">
            LifeBridge is a final-year BSc Computer Science project at the University of Nigeria, Nsukka. It is a working prototype and must not be used with real patient data.
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-ink">
            <Link to="/login" className="hover:text-lagoon">Log in</Link>
            <Link to="/register" className="hover:text-lagoon">Register</Link>
            <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-slate hover:text-lagoon"><Eye className="h-3.5 w-3.5" />Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
