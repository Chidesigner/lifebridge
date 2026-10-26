import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, UploadCloud, FileText, Search, ClipboardList, HeartPulse, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/records/upload', label: 'Upload record', icon: UploadCloud },
  { to: '/records/my-records', label: 'Patient records', icon: FileText },
  { to: '/search', label: 'Find a patient', icon: Search },
  { to: '/audit', label: 'Access history', icon: ClipboardList },
]

function HospitalNav() {
  const { hospital, logout } = useAuth()
  const location = useLocation()
  const initials = (hospital?.name || 'Hospital')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()

  return (
    <aside className="app-sidebar" aria-label="Hospital workspace navigation">
      <Link to="/dashboard" className="app-brand">
        <span className="app-brand-mark"><HeartPulse size={23} strokeWidth={2.1} /></span>
        <span className="app-brand-copy">
          <span className="app-brand-name">LifeBridge</span>
          <span className="app-brand-caption">Clinical network</span>
        </span>
      </Link>

      <p className="sidebar-eyebrow">Workspace</p>
      <nav className="app-nav-links">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to
          const Icon = link.icon
          return (
            <Link
              key={link.to}
              to={link.to}
              aria-current={isActive ? 'page' : undefined}
              className={'app-nav-link' + (isActive ? ' active' : '')}
            >
              <Icon aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="app-sidebar-spacer" />

      <div className="sidebar-status">
        <span className="sidebar-status-dot" />
        <div>
          <div className="sidebar-status-title">Verified facility</div>
          <div className="sidebar-status-copy">Your hospital workspace is cleared to access the network.</div>
        </div>
      </div>

      <div className="sidebar-account">
        <span className="sidebar-avatar">{initials || 'H'}</span>
        <span className="sidebar-account-copy">
          <span className="sidebar-account-name">{hospital?.name || 'Hospital workspace'}</span>
          <span className="sidebar-account-role"><ShieldCheck size={11} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />Verified hospital</span>
        </span>
        <button type="button" className="sidebar-logout" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

export default HospitalNav
