import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Activity, ShieldCheck, Search, Building2,
  ClipboardCheck, HeartPulse, LockKeyhole, FileText, BadgeCheck,
  Network, CheckCircle2, Stethoscope, Fingerprint, Clock3
} from 'lucide-react'

const FEATURES = [
  {
    icon: Network,
    title: 'One connected care network',
    copy: 'Bring a patient’s care history into view across participating facilities, instead of starting from zero at every visit.',
    number: '01',
  },
  {
    icon: Fingerprint,
    title: 'A consistent patient identifier',
    copy: 'Search with the National Identification Number to help locate records associated with a patient across the network.',
    number: '02',
  },
  {
    icon: ShieldCheck,
    title: 'Access built around trust',
    copy: 'Facility verification and database-enforced permissions help ensure access follows the rules, not just the interface.',
    number: '03',
  },
  {
    icon: ClipboardCheck,
    title: 'An accountable record trail',
    copy: 'Patient lookups are written to an audit log so facilities can review access activity and support accountability.',
    number: '04',
  },
]

const STEPS = [
  { number: '01', title: 'A facility applies', copy: 'The hospital submits its identity, registration and professional licence details.' },
  { number: '02', title: 'Credentials are reviewed', copy: 'A LifeBridge administrator reviews the facility before network access is granted.' },
  { number: '03', title: 'Care teams connect the dots', copy: 'Verified facilities can submit patient records and search the network when needed.' },
]

function Brand({ light = false }) {
  return (
    <Link to="/" className="site-logo" aria-label="LifeBridge home">
      <span className="site-logo-mark"><HeartPulse size={22} strokeWidth={2.1} /></span>
      <span>
        <span className="site-logo-word" style={light ? { color: '#f8ffff' } : undefined}>LifeBridge</span>
        <span className="site-logo-tagline" style={light ? { color: '#95b2bf' } : undefined}>Connected care, considered.</span>
      </span>
    </Link>
  )
}

function ProductPreview() {
  return (
    <div className="site-hero-visual" aria-label="Illustrative preview of the LifeBridge hospital dashboard">
      <div className="hero-glow" />
      <div className="demo-window">
        <div className="demo-topbar">
          <div className="demo-topbar-brand">
            <span className="demo-mini-mark"><HeartPulse size={15} /></span>
            LifeBridge <span style={{ color: '#9aabb4', fontWeight: 500 }}>/ Workspace</span>
          </div>
          <span className="demo-status">Secure network</span>
        </div>
        <div className="demo-body">
          <div className="demo-hello">
            <div>
              <div className="demo-hello-label">Hospital overview</div>
              <div className="demo-hello-title">Care, connected.</div>
            </div>
            <div className="demo-date">FACILITY WORKSPACE</div>
          </div>
          <div className="demo-stats">
            <div className="demo-stat">
              <span className="demo-stat-icon"><FileText size={14} /></span>
              <div className="demo-stat-value">—</div>
              <div className="demo-stat-label">Records contributed</div>
            </div>
            <div className="demo-stat">
              <span className="demo-stat-icon"><Search size={14} /></span>
              <div className="demo-stat-value">—</div>
              <div className="demo-stat-label">Patient lookups</div>
            </div>
            <div className="demo-stat">
              <span className="demo-stat-icon"><ShieldCheck size={14} /></span>
              <div className="demo-stat-value" style={{ fontSize: 17, letterSpacing: '-.035em', marginTop: 17 }}>Verified</div>
              <div className="demo-stat-label">Facility access</div>
            </div>
          </div>
          <div className="demo-section-title">A clearer picture of patient history</div>
          <div className="demo-record">
            <span className="demo-record-avatar"><Activity size={15} /></span>
            <span className="demo-record-copy">
              <span className="demo-record-name">Patient record</span>
              <span className="demo-record-meta">Identity-linked clinical information</span>
            </span>
            <span className="demo-record-badge">Accessible</span>
          </div>
          <div className="demo-record">
            <span className="demo-record-avatar"><ClipboardCheck size={15} /></span>
            <span className="demo-record-copy">
              <span className="demo-record-name">Access history</span>
              <span className="demo-record-meta">Searches recorded for accountability</span>
            </span>
            <span className="demo-record-badge">Logged</span>
          </div>
          <div className="demo-record">
            <span className="demo-record-avatar"><Building2 size={15} /></span>
            <span className="demo-record-copy">
              <span className="demo-record-name">Verified facilities</span>
              <span className="demo-record-meta">A network built around trusted access</span>
            </span>
            <span className="demo-record-badge">Trusted</span>
          </div>
        </div>
      </div>
      <div className="demo-float-card">
        <span className="demo-float-icon"><LockKeyhole size={17} /></span>
        <span><span className="demo-float-title">Privacy is foundational</span><span className="demo-float-copy">Permissions enforced at the data layer</span></span>
      </div>
    </div>
  )
}

function Landing() {
  return (
    <div className="site-shell min-h-screen">
      <header className="site-header">
        <div className="site-container site-header-inner">
          <Brand />
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#platform" className="site-nav-link">Platform</a>
            <a href="#workflow" className="site-nav-link">How it works</a>
            <a href="#security" className="site-nav-link">Security</a>
            <Link to="/login" className="site-nav-link">Sign in</Link>
            <Link to="/register" className="site-btn site-btn-primary">Register facility <ArrowUpRight size={14} /></Link>
          </nav>
        </div>
      </header>

      <main style={{ margin: 0, padding: 0, width: '100%', maxWidth: 'none' }}>
        <section className="site-hero">
          <div className="site-container site-hero-grid">
            <div className="site-hero-copy">
              <span className="site-kicker"><span className="site-kicker-dot" /> A connected-care initiative for Nsukka</span>
              <h1>Better context.<br />More <em>connected</em><br />care.</h1>
              <p>
                The right medical information can change what happens next. LifeBridge helps verified hospitals
                across the Nsukka case-study area find shared patient records when every moment and detail matters.
              </p>
              <div className="site-hero-actions">
                <Link to="/register" className="site-btn site-btn-primary">Bring your facility on board <ArrowRight size={15} /></Link>
                <Link to="/login" className="site-btn site-btn-outline">Sign in to LifeBridge</Link>
              </div>
              <div className="site-hero-note"><ShieldCheck size={15} /> Facility verification. Database-level access controls. Auditable lookups.</div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="site-proof" aria-label="Platform principles">
          <div className="site-container site-proof-inner">
            <div className="site-proof-intro">Designed around four principles</div>
            <div className="site-proof-item"><BadgeCheck size={17} /> Verified facilities</div>
            <div className="site-proof-item"><Fingerprint size={17} /> NIN-based lookup</div>
            <div className="site-proof-item"><ClipboardCheck size={17} /> Auditable access</div>
          </div>
        </section>

        <section id="platform" className="site-section">
          <div className="site-container">
            <div className="site-section-heading">
              <div className="site-section-eyebrow">A more connected picture</div>
              <h2>Patient information should move with the care journey.</h2>
              <p>
                When care is split across facilities, important history can be hard to find.
                LifeBridge is designed to make shared records easier to locate while keeping access controlled and accountable.
              </p>
            </div>
            <div className="site-feature-grid">
              {FEATURES.map(({ icon: Icon, title, copy, number }) => (
                <article className="site-feature-card" key={title}>
                  <div className="site-feature-icon"><Icon size={21} /></div>
                  <div className="site-feature-index">{number}</div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="site-section site-section-soft">
          <div className="site-container">
            <div className="site-section-heading">
              <div className="site-section-eyebrow">A deliberate process</div>
              <h2>Trusted access, from the very first step.</h2>
              <p>Each stage has a clear purpose: confirm who is joining the network, then give verified facilities the tools to contribute and find records.</p>
            </div>
            <div className="site-workflow">
              {STEPS.map((step) => (
                <article className="site-step" key={step.number}>
                  <div className="site-step-number"><span>THE PROCESS</span><span>{step.number}</span></div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="site-section site-section-dark">
          <div className="site-container security-layout">
            <div className="security-visual" aria-hidden="true">
              <div className="security-orbit" />
              <div className="security-shield"><ShieldCheck size={61} strokeWidth={1.15} /></div>
            </div>
            <div className="security-copy">
              <div className="site-section-eyebrow">Trust is part of the architecture</div>
              <h2>Built to take access seriously.</h2>
              <p>
                A clinical information network needs more than a polished interface. LifeBridge places access
                rules in PostgreSQL Row Level Security and records patient searches through a database function,
                tying the lookup and audit entry together.
              </p>
              <div className="security-list">
                <div className="security-list-item"><CheckCircle2 size={15} /> Facility verification before access</div>
                <div className="security-list-item"><CheckCircle2 size={15} /> Database-enforced permissions</div>
                <div className="security-list-item"><CheckCircle2 size={15} /> Search activity recorded in an audit trail</div>
                <div className="security-list-item"><CheckCircle2 size={15} /> Clear separation of hospital and admin roles</div>
              </div>
            </div>
          </div>
        </section>

        <section className="site-section">
          <div className="site-container">
            <div className="site-cta">
              <div>
                <h2>Bring a clearer picture to the next consultation.</h2>
                <p>LifeBridge is being developed for cross-facility record sharing in the Nsukka, Enugu case-study area.</p>
              </div>
              <Link to="/register" className="site-btn site-btn-primary">Register your facility <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-container site-footer-inner">
          <Brand />
          <div className="site-footer-copy">A final-year Computer Science project · University of Nigeria, Nsukka<br />LifeBridge demonstrates a model for connected cross-facility health information.</div>
          <div className="site-footer-links"><Link to="/login">Sign in</Link><Link to="/register">Facility registration</Link></div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
