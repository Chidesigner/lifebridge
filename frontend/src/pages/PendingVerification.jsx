import { Link } from 'react-router-dom'
import { Clock, HeartPulse, ShieldCheck, LogOut, ClipboardCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function PendingVerification() {
  const { logout } = useAuth()

  return (
    <div className="error-screen" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(15,148,136,.08), transparent 30rem), #f5f7fa' }}>
      <Link to="/" className="site-logo" style={{ marginBottom: 20 }}>
        <span className="site-logo-mark"><HeartPulse size={22} /></span>
        <span><span className="site-logo-word">LifeBridge</span><span className="site-logo-tagline">A connected-care network</span></span>
      </Link>
      <div className="pending-card">
        <div className="page-eyebrow" style={{ justifyContent: 'center' }}><ShieldCheck size={13} /> Facility onboarding</div>
        <div className="pending-orbit"><Clock size={30} /></div>
        <h1>Verification in progress</h1>
        <p>
          Your hospital’s registration is with the LifeBridge System Administrator for review.
          Once your facility’s CAC and MDCN details have been verified, network access can be granted.
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 25, padding: 16, border: '1px solid #e3ecec', borderRadius: 14, background: '#f8fbfa', textAlign: 'left' }}>
          <ClipboardCheck size={18} color="#0f9488" style={{ flex: '0 0 auto', marginTop: 2 }} />
          <div>
            <div style={{ color: '#26495a', fontSize: 11, fontWeight: 800 }}>What happens next?</div>
            <div style={{ marginTop: 5, color: '#81939e', fontSize: 10, lineHeight: 1.8 }}>An administrator will review your submitted facility credentials. You can sign out while the review is pending.</div>
          </div>
        </div>
        <button type="button" onClick={logout} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 25, border: 0, background: 'transparent', color: '#718694', fontSize: 11, fontWeight: 800 }}>
          <LogOut size={14} /> Sign out
        </button>
      </div>
      <p style={{ marginTop: 25, color: '#9aabb4', fontSize: 10 }}>LifeBridge · Nsukka, Enugu case-study area</p>
    </div>
  )
}
export default PendingVerification
