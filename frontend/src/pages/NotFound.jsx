import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Compass className="h-7 w-7 text-gray-400" />
      </div>
      <h1 className="mt-5 text-4xl font-bold text-brand-navy">404</h1>
      <p className="mt-2 text-gray-600">This page does not exist.</p>
      <Link to="/" className="mt-6 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy-dark">
        Back to LifeBridge
      </Link>
    </div>
  )
}
export default NotFound
