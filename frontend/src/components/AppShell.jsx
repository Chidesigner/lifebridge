import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, UploadCloud, FileText, Search, ClipboardList,
  Building2, ShieldCheck, LogOut, Menu, X, BadgeCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import { nameInitials } from '../lib/format'

const HOSPITAL_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/search', label: 'Search by NIN', icon: Search },
  { to: '/records/upload', label: 'Upload record', icon: UploadCloud },
  { to: '/records/my-records', label: 'My records', icon: FileText },
  { to: '/audit', label: 'Audit log', icon: ClipboardList },
]
const ADMIN_LINKS = [
  { to: '/admin/hospitals', label: 'Hospitals', icon: Building2 },
  { to: '/admin/audit', label: 'System audit log', icon: ClipboardList },
]

/**
 * The frame around every signed-in page: a dark sidebar on the left,
 * a title bar on top, and the page content below. Pages only supply
 * a title, a subtitle, optional action buttons and their content.
 */
function AppShell({ title, subtitle, actions, children }) {
  const { hospital, user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const links = isAdmin ? ADMIN_LINKS : HOSPITAL_LINKS

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const displayName = isAdmin ? 'System Administrator' : hospital?.name ?? 'Hospital'
  const displaySub = isAdmin ? user?.email : 'Verified hospital'

  const sidebar = (
    <div className="relative flex h-full flex-col overflow-hidden bg-abyss px-5 py-7 text-white grain">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lagoon/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-champagne/10 blur-3xl" />

      <div className="relative px-2">
        <Logo light to={isAdmin ? '/admin/hospitals' : '/dashboard'} />
      </div>

      <nav className="relative mt-10 flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ' +
              (isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white')
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute -left-5 top-2.5 bottom-2.5 w-1 rounded-r-full bg-champagne" />}
                <Icon className={'h-[18px] w-[18px] transition-colors ' + (isActive ? 'text-seafoam' : 'text-white/50 group-hover:text-seafoam')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-seafoam to-lagoon text-sm font-extrabold text-abyss">
            {isAdmin ? <ShieldCheck className="h-5 w-5" /> : nameInitials(displayName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{displayName}</p>
            <p className="flex items-center gap-1 truncate text-xs text-white/55">
              {!isAdmin && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-seafoam" />}
              {displaySub}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-porcelain">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] lg:block">{sidebar}</aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-abyss/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[290px] max-w-[85vw]" style={{ animation: 'dialog-in 200ms ease-out' }}>
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-20 border-b border-hair/70 bg-porcelain/85 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-5 py-5 sm:px-8 lg:px-12">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-hair bg-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-[30px] leading-tight text-ink sm:text-[38px]">{title}</h1>
              {subtitle && <p className="mt-0.5 hidden max-w-2xl text-sm text-slate sm:block">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
      </div>
      {open && (
        <button onClick={() => setOpen(false)} aria-label="Close menu" className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-lg lg:hidden">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export default AppShell
