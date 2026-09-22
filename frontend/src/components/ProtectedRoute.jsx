import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ role, requireVerified = false, children }) {
  const { loading, user, isAdmin, hospital, isVerified } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/login" replace />
  }

  if (role === 'hospital') {
    if (!hospital) {
      return <Navigate to="/login" replace />
    }
    if (requireVerified && !isVerified) {
      return <Navigate to="/pending-verification" replace />
    }
  }

  return children
}

export default ProtectedRoute
