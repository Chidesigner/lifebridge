import { Link } from 'react-router-dom'
import { Clock, HeartPulse } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function PendingVerification() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-lg font-bold text-brand-navy">
          <HeartPulse className="h-6 w-6" />
          LifeBridge
        </Link>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <Clock className="h-7 w-7 text-amber-500" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-brand-navy">Verification Pending</h1>
        <p className="mt-3 text-sm text-gray-600">
          Your hospital's registration is under review by a LifeBridge
          System Administrator. You'll get access once your CAC and MDCN
          details are verified.
        </p>

        <button onClick={logout} className="mt-8 text-sm font-medium text-gray-500 hover:text-brand-navy hover:underline">
          Log out
        </button>
      </div>
    </div>
  )
}
export default PendingVerification
