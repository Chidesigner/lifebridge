import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, Search as SearchIcon, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import AdminNav from '../../components/AdminNav'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'

function AuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    setLoading(true)
    setError('')
    const { data, error: fetchError } = await supabase
      .from('audit_logs')
      .select('*, hospitals(name)')
      .order('search_time', { ascending: false })
    if (fetchError) {
      setError('Could not load the audit log. Please refresh the page.')
    } else {
      setLogs(data)
    }
    setLoading(false)
  }

  const filteredLogs = useMemo(() => {
    const query = filterText.trim().toLowerCase()
    if (!query) return logs
    return logs.filter(
      (log) =>
        log.searched_nin.toLowerCase().includes(query) ||
        (log.hospitals?.name ?? '').toLowerCase().includes(query)
    )
  }, [logs, filterText])

  return (
    <div className="app-shell min-h-screen">
      <AdminNav />
      <main className="page-content p-8">
        <div className="page-eyebrow"><ShieldCheck size={13} /> NETWORK OVERSIGHT</div>
        <h1 className="text-xl font-semibold text-brand-navy">System audit trail</h1>
        <p className="mt-1 text-sm text-gray-500">Every NIN search across every hospital on LifeBridge.</p>

        <div className="relative mt-4 max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter by hospital name or NIN..."
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
          />
        </div>

        {error && <div className="mt-4 rounded-md border border-brand-red/30 bg-red-50 px-3 py-2 text-sm text-brand-red">{error}</div>}

        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {loading ? (
            <div className="p-6"><Spinner label="Loading the audit log..." /></div>
          ) : filteredLogs.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={logs.length === 0 ? 'No searches have been made yet' : 'No entries match your filter'}
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">NIN Searched</th>
                  <th className="px-4 py-3">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <tr key={log.log_id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{log.hospitals?.name ?? 'Unknown hospital'}</td>
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
export default AuditLog
