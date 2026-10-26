import { Link } from 'react-router-dom'
import { Compass, ArrowLeft, HeartPulse } from 'lucide-react'

function NotFound() {
  return (
    <div className="error-screen">
      <Link to="/" className="site-logo" style={{ marginBottom: 38 }}>
        <span className="site-logo-mark"><HeartPulse size={22} /></span>
        <span><span className="site-logo-word">LifeBridge</span><span className="site-logo-tagline">A connected-care network</span></span>
      </Link>
      <div className="error-code">404</div>
      <div style={{ display: 'grid', width: 52, height: 52, marginTop: 28, placeItems: 'center', border: '1px solid #d7e9e5', borderRadius: 17, background: '#edf8f4', color: '#0f9488' }}>
        <Compass size={24} />
      </div>
      <h1>This page isn’t on the map.</h1>
      <p>The address may be outdated, or the page may have moved.</p>
      <Link to="/" className="site-btn site-btn-primary" style={{ marginTop: 24 }}><ArrowLeft size={14} /> Return to LifeBridge</Link>
    </div>
  )
}
export default NotFound
