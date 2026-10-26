import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import AdminNav from '../../components/AdminNav'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'

function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  async function loadHospitals() {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: false })
    if (fetchError) {
      setError('Could not load hospitals. Please refresh the page.')
    } else {
      setHospitals(data)
    }
    setLoading(false)
  }

  useEffect(() => { loadHospitals() }, [])

  async function setVerified(hospitalId, verified) {
    setUpdatingId(hospitalId)
    const { error: updateError } = await supabase
      .from('hospitals')
      .update({ is_verified: verified })
      .eq('hospital_id', hospitalId)
    if (updateError) {
      setError('Could not update this hospital. Please try again.')
    } else {
      setHospitals((prev) => prev.map((h) => (h.hospital_id === hospitalId ? { ...h, is_verified: verified } : h)))
    }
    setUpdatingId(null)
  }

  return (
    <div className="app-shell min-h-screen">
      <AdminNav />
      <main className="page-content p-8">
        <h1 className="text-xl font-semibold text-brand-navy">Hospitals</h1>
        <p className="mt-1 text-sm text-gray-500">Approve a hospital to give it access to LifeBridge, or revoke access at any time.</p>
        {error && <div className="mt-4 rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">{error}</div>}
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {loading ? (
            <div className="p-6"><Spinner label="Loading hospitals..." /></div>
          ) : hospitals.length === 0 ? (
            <EmptyState icon={Building2} title="No hospitals have registered yet" description="New registrations will appear here for review." />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">CAC No.</th>
                  <th className="px-4 py-3">MDCN No.</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hospitals.map((hospital) => (
                  <tr key={hospital.hospital_id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{hospital.name}</div>
                      <div className="text-xs text-gray-500">{hospital.contact_email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{hospital.cac_number}</td>
                    <td className="px-4 py-3 text-gray-600">{hospital.mdcn_number}</td>
                    <td className="px-4 py-3 text-gray-600">{hospital.state}</td>
                    <td className="px-4 py-3">
                      <StatusBadge verified={hospital.is_verified} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {hospital.is_verified ? (
                        <button onClick={() => setVerified(hospital.hospital_id, false)} disabled={updatingId === hospital.hospital_id} className="rounded-md border border-brand-red/40 px-3 py-1.5 text-xs font-medium text-brand-red transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
                          {updatingId === hospital.hospital_id ? 'Updating...' : 'Revoke'}
                        </button>
                      ) : (
                        <button onClick={() => setVerified(hospital.hospital_id, true)} disabled={updatingId === hospital.hospital_id} className="rounded-md bg-brand-green px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-60">
                          {updatingId === hospital.hospital_id ? 'Updating...' : 'Approve'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
export default Hospitals
