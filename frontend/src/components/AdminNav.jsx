import { Link, useLocation } from 'react-router-dom'
import { Building2, ClipboardList, ShieldCheck, LogOut, HeartPulse } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/admin/hospitals', label: 'Hospital approvals', icon: Building2 },
  { to: '/admin/audit', label: 'System audit trail', icon: ClipboardList },
]

function AdminNav() {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <aside className="app-sidebar" aria-label="System administration navigation">
      <Link to="/admin/hospitals" className="app-brand">
        <span className="app-brand-mark"><HeartPulse size={23} strokeWidth={2.1} /></span>
        <span className="app-brand-copy">
          <span className="app-brand-name">LifeBridge</span>
          <span className="app-brand-caption">System control</span>
        </span>
      </Link>

      <p className="sidebar-eyebrow">Administration</p>
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
          <div className="sidebar-status-title">Administrator access</div>
          <div className="sidebar-status-copy">Review facility credentials and oversee network access history.</div>
        </div>
      </div>

      <div className="sidebar-account">
        <span className="sidebar-avatar"><ShieldCheck size={16} /></span>
        <span className="sidebar-account-copy">
          <span className="sidebar-account-name">System Administrator</span>
          <span className="sidebar-account-role">Privileged workspace</span>
        </span>
        <button type="button" className="sidebar-logout" onClick={logout} aria-label="Log out" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}

export default AdminNav
