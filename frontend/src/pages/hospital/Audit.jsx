import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Search, AlertCircle, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import AppShell from '../../components/AppShell'
import Skeleton from '../../components/Skeleton'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { paginate } from '../../lib/pagination'
import { timeAgo } from '../../lib/format'

function Audit() {
  const { hospital } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

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

  const visibleLogs = paginate(logs, page)

  return (
    <AppShell title="Audit log" subtitle="A permanent record of every NIN your hospital has searched.">
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-seafoam/20 px-5 py-4 ring-1 ring-inset ring-lagoon/15">
        <ShieldCheck className="h-5 w-5 shrink-0 text-lagoon" />
        <p className="flex-1 text-sm text-deep">
          Entries are written automatically when you search. They can't be edited or deleted from the app.
        </p>
        {!loading && <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink">{logs.length} search{logs.length === 1 ? '' : 'es'}</span>}
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-coral/25 bg-coral/5 px-5 py-4 text-sm font-medium text-coral">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="surface overflow-hidden">
        {loading ? (
          <Skeleton rows={5} />
        ) : logs.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No searches yet"
            description="When your hospital searches a NIN, it will be recorded here."
            action={<Link to="/search"><Button><Search className="h-4 w-4" />Search a NIN</Button></Link>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-hair bg-porcelain/70 text-xs font-bold text-slate">
                    <th className="px-6 py-4">NIN searched</th>
                    <th className="px-6 py-4">When</th>
                    <th className="px-6 py-4 text-right">Date and time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hair/70">
                  {visibleLogs.map((log) => (
                    <tr key={log.log_id} className="transition-colors hover:bg-porcelain/60">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne/20 text-champagne-deep"><Search className="h-4 w-4" /></span>
                          <span className="font-bold tabular-nums text-ink">{log.searched_nin}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate">{timeAgo(log.search_time)}</td>
                      <td className="px-6 py-4 text-right text-xs tabular-nums text-slate">{new Date(log.search_time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} itemCount={logs.length} onPageChange={setPage} />
          </>
        )}
      </div>
    </AppShell>
  )
}
export default Audit
