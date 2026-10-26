import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Clock, HeartPulse, ShieldCheck, LogOut, ClipboardCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function PendingVerification() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function handleSignOut() {
    setSigningOut(true)
    setLogoutError('')

    try {
      const error = await logout()
      if (error) {
        setLogoutError('We could not sign you out. Please check your connection and try again.')
        setSigningOut(false)
        return
      }

      // This route is public, so signing out does not automatically
      // redirect away from it. Navigate explicitly after sign-out.
      navigate('/login', { replace: true })
    } catch {
      setLogoutError('We could not sign you out. Please check your connection and try again.')
      setSigningOut(false)
    }
  }

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

        {logoutError && (
          <div role="alert" style={{ marginTop: 18, padding: '11px 13px', border: '1px solid #f0caca', borderRadius: 11, background: '#fff0ef', color: '#b63d43', fontSize: 11, lineHeight: 1.6 }}>
            {logoutError}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 25, padding: '10px 14px', border: '1px solid #d9e5e9', borderRadius: 11, background: '#fff', color: '#526d7d', fontSize: 11, fontWeight: 800, opacity: signingOut ? 0.65 : 1 }}
        >
          <LogOut size={14} /> {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
      <p style={{ marginTop: 25, color: '#9aabb4', fontSize: 10 }}>LifeBridge · Nsukka, Enugu case-study area</p>
    </div>
  )
}
export default PendingVerification
