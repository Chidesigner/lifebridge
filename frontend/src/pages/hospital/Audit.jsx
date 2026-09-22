import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import HospitalNav from '../../components/HospitalNav'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'

function Audit() {
  const { hospital } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { loadLogs() }, [])

  async function loadLogs() {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('hospital_id', hospital.hospital_id)
      .order('search_time', { ascending: false })
    if (fetchError) {
      setError('Could not load your audit log. Please refresh the page.')
    } else {
      setLogs(data)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HospitalNav />
      <main className="p-8">
        <h1 className="text-xl font-semibold text-brand-navy">Audit Log</h1>
        <p className="mt-1 text-sm text-gray-500">Every NIN your hospital has searched, and when.</p>

        {error && <div className="mt-4 rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">{error}</div>}

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {loading ? (
            <div className="p-6"><Spinner label="Loading your search history..." /></div>
          ) : logs.length === 0 ? (
            <EmptyState icon={ClipboardList} title="You haven't searched any NINs yet" description="Your search history will appear here." />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">NIN Searched</th>
                  <th className="px-4 py-3">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.log_id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-900">{log.searched_nin}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(log.search_time).toLocaleString()}</td>
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
export default Audit
