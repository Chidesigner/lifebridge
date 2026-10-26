import { useEffect, useMemo, useState } from 'react'
import { ClipboardList, Search as SearchIcon, AlertCircle, Building2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import AppShell from '../../components/AppShell'
import Skeleton from '../../components/Skeleton'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import { paginate } from '../../lib/pagination'
import { timeAgo } from '../../lib/format'

function AuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterText, setFilterText] = useState('')
  const [page, setPage] = useState(1)

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

  // Changing the filter changes how many pages exist, so reset to page 1.
  function handleFilterChange(value) {
    setFilterText(value)
    setPage(1)
  }

  const visibleLogs = paginate(filteredLogs, page)
  const hospitalCount = new Set(logs.map((l) => l.hospital_id)).size

  return (
    <AppShell title="System audit log" subtitle="Every NIN search, across every hospital on LifeBridge.">
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="surface flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-champagne/25 text-champagne-deep"><ClipboardList className="h-5 w-5" /></span>
          <div>
            <p className="font-display text-[40px] leading-none text-ink">{loading ? '–' : logs.length}</p>
            <p className="mt-1 text-xs font-semibold text-slate">Total searches</p>
          </div>
        </div>
        <div className="surface flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seafoam/30 text-deep"><Building2 className="h-5 w-5" /></span>
          <div>
            <p className="font-display text-[40px] leading-none text-ink">{loading ? '–' : hospitalCount}</p>
            <p className="mt-1 text-xs font-semibold text-slate">Hospitals searching</p>
          </div>
        </div>
      </section>

      <div className="relative mt-8 max-w-md">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8aa0a6]" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => handleFilterChange(e.target.value)}
          placeholder="Filter by hospital name or NIN"
          className="h-12 w-full rounded-full border border-hair bg-white pl-11 pr-4 text-sm shadow-[0_1px_2px_rgba(6,28,34,.04)] placeholder:text-[#9db0b5] focus:border-lagoon focus:outline-none focus:ring-4 focus:ring-lagoon/15"
        />
      </div>

      {error && (
        <div className="mt-5 flex items-center gap-2.5 rounded-2xl border border-coral/25 bg-coral/5 px-5 py-4 text-sm font-medium text-coral">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="surface mt-6 overflow-hidden">
        {loading ? (
          <Skeleton rows={5} />
        ) : filteredLogs.length === 0 ? (
          <EmptyState icon={ClipboardList} title={logs.length === 0 ? 'No searches have been made yet' : 'No entries match your filter'} description={logs.length === 0 ? 'Searches by hospitals will be recorded here.' : 'Try a different hospital name or NIN.'} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-hair bg-porcelain/70 text-xs font-bold text-slate">
                    <th className="px-6 py-4">Hospital</th>
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
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-seafoam/30 text-deep"><Building2 className="h-4 w-4" /></span>
                          <span className="font-bold text-ink">{log.hospitals?.name ?? 'Unknown hospital'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold tabular-nums text-ink">{log.searched_nin}</td>
                      <td className="px-6 py-4 text-slate">{timeAgo(log.search_time)}</td>
                      <td className="px-6 py-4 text-right text-xs tabular-nums text-slate">{new Date(log.search_time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} itemCount={filteredLogs.length} onPageChange={setPage} />
          </>
        )}
      </div>
    </AppShell>
  )
}
export default AuditLog
