import { Link, useLocation } from 'react-router-dom'
import { Building2, ClipboardList, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
  { to: '/admin/audit', label: 'Audit Log', icon: ClipboardList },
]

function AdminNav() {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-navy" />
          <span className="text-lg font-bold text-brand-navy">LifeBridge Admin</span>
        </div>
        <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-brand-navy hover:underline">
          Log out
        </button>
      </div>
      <nav className="flex gap-1 px-8">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to
          const Icon = link.icon
          return (
            <Link
              key={link.to}
              to={link.to}
              className={
                'flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ' +
                (isActive
                  ? 'border-brand-navy text-brand-navy'
                  : 'border-transparent text-gray-500 hover:text-brand-navy')
              }
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

export default AdminNav
