import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartPulse, ShieldCheck, Activity } from 'lucide-react'

function AuthLayout({ title, subtitle, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="auth-shell">
      <section className="auth-brand-panel">
        <Link to="/" className="app-brand" style={{ padding: 0, color: '#f9ffff' }}>
          <span className="app-brand-mark"><HeartPulse size={23} /></span>
          <span className="app-brand-copy">
            <span className="app-brand-name">LifeBridge</span>
            <span className="app-brand-caption" style={{ color: '#9ab9c7' }}>Connected care, considered.</span>
          </span>
        </Link>

        <div className="auth-brand-quote">
          <span className="auth-brand-overline"><Activity size={14} /> Connected clinical intelligence</span>
          <h2>Every detail matters.<br />Every <em>connection</em> counts.</h2>
          <p>
            A considered workspace for verified hospitals to contribute and find patient records
            across the LifeBridge network, with accountability built into every lookup.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 25 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid rgba(168,230,219,.18)', borderRadius: 999, padding: '9px 12px', color: '#d1e9e8', fontSize: 10 }}>
              <ShieldCheck size={13} color="#8ce0d0" /> Verified facilities
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid rgba(168,230,219,.18)', borderRadius: 999, padding: '9px 12px', color: '#d1e9e8', fontSize: 10 }}>
              <Activity size={13} color="#8ce0d0" /> Accountable access
            </span>
          </div>
        </div>

        <p className="auth-brand-foot">A cross-facility health information project · Nsukka, Enugu</p>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Link to="/" className="site-logo" style={{ marginBottom: 23 }}>
            <span className="site-logo-mark"><HeartPulse size={20} /></span>
            <span>
              <span className="site-logo-word">LifeBridge</span>
              <span className="site-logo-tagline">A connected-care network</span>
            </span>
          </Link>

          <div className={'auth-card transition-all duration-500 ease-out motion-reduce:transition-none ' + (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')}>
            <div className="page-eyebrow"><ShieldCheck size={13} /> Secure workspace</div>
            <h1>{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            {children}
          </div>
          <p style={{ marginTop: 20, color: '#94a3ad', fontSize: 10, lineHeight: 1.8, textAlign: 'center' }}>
            LifeBridge access is intended for registered facilities and the system administrator.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AuthLayout
