import { useNavigate } from 'react-router-dom'
import { Check, Clock, FileSearch, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Button from '../components/Button'
import { longDate } from '../lib/format'

const STEPS = [
  { icon: Check, title: 'Application received', text: 'Your details and documents are saved.', state: 'done' },
  { icon: FileSearch, title: 'Documents under review', text: 'An administrator checks your CAC certificate and facility licence.', state: 'active' },
  { icon: ShieldCheck, title: 'Access granted', text: 'You can upload records and search by NIN.', state: 'todo' },
]

function PendingVerification() {
  const { logout, hospital } = useAuth()
  const navigate = useNavigate()

  // This page isn't behind ProtectedRoute (unverified hospitals need
  // to reach it), so nothing else forces a redirect after signing out.
  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-abyss px-5 py-12 text-white grain">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-lagoon/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 h-[30rem] w-[30rem] rounded-full bg-champagne/15 blur-3xl" />
      <div className="grid-lines pointer-events-none absolute inset-0" />

      <div className="relative mb-10"><Logo light /></div>

      <div className="glass relative w-full max-w-xl rounded-[28px] p-8 sm:p-10" style={{ animation: 'rise .8s cubic-bezier(.2,.7,.2,1) both' }}>
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-champagne/30" style={{ animation: 'ring-pulse 2.6s ease-out infinite' }} />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e4cf9f] to-champagne text-abyss">
            <Clock className="h-7 w-7" />
          </span>
        </div>

        <h1 className="mt-6 text-center font-display text-[42px] leading-tight">Your application is in review</h1>
        <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-white/70">
          {hospital?.name ? <><span className="font-semibold text-white">{hospital.name}</span> </> : 'Your hospital '}
          {hospital?.created_at ? `applied on ${longDate(hospital.created_at)}. ` : 'has applied. '}
          You'll get access as soon as the administrator confirms your details.
        </p>

        <ol className="mt-9 space-y-5">
          {STEPS.map(({ icon: Icon, title, text, state }, index) => (
            <li key={title} className="relative flex gap-4">
              {index < STEPS.length - 1 && (
                <span className={'absolute left-[19px] top-10 h-[calc(100%-8px)] w-px ' + (state === 'done' ? 'bg-seafoam/60' : 'bg-white/15')} />
              )}
              <span
                className={
                  'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ' +
                  (state === 'done'
                    ? 'bg-seafoam text-abyss ring-seafoam'
                    : state === 'active'
                      ? 'bg-champagne/20 text-champagne ring-champagne/60'
                      : 'bg-white/5 text-white/40 ring-white/15')
                }
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className={state === 'todo' ? 'opacity-55' : ''}>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-0.5 text-sm text-white/60">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-9 flex justify-center">
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PendingVerification
