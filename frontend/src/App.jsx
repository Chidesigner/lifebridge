import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import PendingVerification from './pages/PendingVerification'
import NotFound from './pages/NotFound'
import Dashboard from './pages/hospital/Dashboard'
import UploadRecord from './pages/hospital/UploadRecord'
import MyRecords from './pages/hospital/MyRecords'
import Search from './pages/hospital/Search'
import Audit from './pages/hospital/Audit'
import AdminHospitals from './pages/admin/Hospitals'
import AdminAuditLog from './pages/admin/AuditLog'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/pending-verification" element={<PendingVerification />} />

      <Route path="/dashboard" element={<ProtectedRoute role="hospital" requireVerified><Dashboard /></ProtectedRoute>} />
      <Route path="/records/upload" element={<ProtectedRoute role="hospital" requireVerified><UploadRecord /></ProtectedRoute>} />
      <Route path="/records/my-records" element={<ProtectedRoute role="hospital" requireVerified><MyRecords /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute role="hospital" requireVerified><Search /></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute role="hospital" requireVerified><Audit /></ProtectedRoute>} />

      <Route path="/admin/hospitals" element={<ProtectedRoute role="admin"><AdminHospitals /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute role="admin"><AdminAuditLog /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
