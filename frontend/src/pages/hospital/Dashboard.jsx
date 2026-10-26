import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Search, ClipboardList, UploadCloud, ArrowUpRight, ArrowRight, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import AppShell from '../../components/AppShell'
import Skeleton from '../../components/Skeleton'
import EmptyState from '../../components/EmptyState'
import Button from '../../components/Button'
import BridgeArc from '../../components/BridgeArc'
import { validateNin } from '../../lib/validators'
import { greeting, initials, timeAgo, countByDay } from '../../lib/format'

const QUICK_ACTIONS = [
  { to: '/records/upload', icon: UploadCloud, title: 'Upload a record', description: 'Add a patient to the network.' },
  { to: '/records/my-records', icon: FileText, title: 'My records', description: 'Review and edit what you uploaded.' },
  { to: '/audit', icon: ClipboardList, title: 'Audit log', description: 'See every NIN your hospital searched.' },
]

// Seven small bars: one per day, today on the right.
function Sparkline({ values }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex h-12 items-end gap-1.5" aria-hidden="true">
      {values.map((value, index) => (
        <div
          key={index}
          className={'w-2.5 rounded-full transition-all ' + (index === values.length - 1 ? 'bg-lagoon' : 'bg-seafoam/70')}
          style={{ height: `${Math.max(10, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, loading, series, note }) {
  return (
    <div className="surface p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-seafoam/30">
          <Icon className="h-5 w-5 text-deep" />
        </div>
        <Sparkline values={series} />
      </div>
      <p className="mt-5 text-sm font-semibold text-slate">{label}</p>
      <p className="mt-1 font-display text-[56px] leading-none text-ink">{loading ? '–' : value}</p>
      <p className="mt-2 text-xs text-slate">{note}</p>
    </div>
  )
}

function Dashboard() {
  const { hospital } = useAuth()
  const navigate = useNavigate()
  const [recordCount, setRecordCount] = useState(null)
  const [searchCount, setSearchCount] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [recordSeries, setRecordSeries] = useState(Array(7).fill(0))
  const [searchSeries, setSearchSeries] = useState(Array(7).fill(0))
  const [loading, setLoading] = useState(true)
  const [nin, setNin] = useState('')
  const [ninError, setNinError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 6)
    weekAgo.setHours(0, 0, 0, 0)
    const since = weekAgo.toISOString()
    const id = hospital.hospital_id

    const [recordsHead, searchesHead, recent, searches, weekRecords, weekSearches] = await Promise.all([
      supabase.from('patient_records').select('*', { count: 'exact', head: true }).eq('hospital_id', id),
      supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('hospital_id', id),
      supabase.from('patient_records').select('record_id, first_name, last_name, nin, created_at').eq('hospital_id', id).order('created_at', { ascending: false }).limit(5),
      supabase.from('audit_logs').select('log_id, searched_nin, search_time').eq('hospital_id', id).order('search_time', { ascending: false }).limit(5),
      supabase.from('patient_records').select('created_at').eq('hospital_id', id).gte('created_at', since),
      supabase.from('audit_logs').select('search_time').eq('hospital_id', id).gte('search_time', since),
    ])

    setRecordCount(recordsHead.count ?? 0)
    setSearchCount(searchesHead.count ?? 0)
    setRecentRecords(recent.data ?? [])
    setRecentSearches(searches.data ?? [])
    setRecordSeries(countByDay((weekRecords.data ?? []).map((r) => r.created_at)))
    setSearchSeries(countByDay((weekSearches.data ?? []).map((r) => r.search_time)))
    setLoading(false)
  }

  function handleLookup(event) {
    event.preventDefault()
    const message = validateNin(nin)
    setNinError(message)
    if (!message) navigate(`/search?nin=${nin.trim()}`)
  }

  const weekRecordTotal = recordSeries.reduce((a, b) => a + b, 0)
  const weekSearchTotal = searchSeries.reduce((a, b) => a + b, 0)

  return (
    <AppShell
      title={`${greeting()}, ${hospital?.name}`}
      subtitle="Here's what has been happening at your hospital on LifeBridge."
      actions={<Link to="/records/upload" className="hidden sm:block"><Button size="md"><UploadCloud className="h-4 w-4" />Upload record</Button></Link>}
    >
      {/* Spotlight: the one thing most people come here to do */}
      <section className="surface-dark grain p-7 sm:p-10">
        <BridgeArc className="pointer-events-none absolute -right-10 -top-6 hidden w-[28rem] opacity-40 lg:block" />
        <div className="relative max-w-xl">
          <h2 className="font-display text-[38px] leading-[1.1] sm:text-[46px]">Look up a patient across every hospital.</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">Enter an 11-digit NIN. Every search is added to your hospital's audit log.</p>

          <form onSubmit={handleLookup} className="mt-7" noValidate>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                <input
                  value={nin}
                  onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  inputMode="numeric"
                  placeholder="Patient NIN"
                  aria-label="Patient NIN"
                  className="h-14 w-full rounded-full border border-white/20 bg-white/10 pl-14 pr-16 text-lg font-semibold tracking-[.14em] text-white placeholder:font-normal placeholder:tracking-normal placeholder:text-white/40 focus:border-seafoam focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-seafoam/20"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold tabular-nums text-white/50">{nin.length}/11</span>
              </div>
              <Button type="submit" variant="accent" size="xl">Search<ArrowRight className="h-4 w-4" /></Button>
            </div>
            {ninError && <p className="mt-2.5 text-sm font-medium text-[#ffb3aa]">{ninError}</p>}
          </form>
        </div>
      </section>

      {/* Numbers */}
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <StatCard icon={FileText} label="Records uploaded" value={recordCount} loading={loading} series={recordSeries} note={`${weekRecordTotal} added in the last 7 days`} />
        <StatCard icon={ClipboardList} label="Searches performed" value={searchCount} loading={loading} series={searchSeries} note={`${weekSearchTotal} in the last 7 days`} />
        <div className="surface flex flex-col justify-between p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-champagne/20">
            <Activity className="h-5 w-5 text-champagne-deep" />
          </div>
          <div>
            <p className="mt-5 text-sm font-semibold text-slate">This week</p>
            <p className="mt-1 font-display text-[56px] leading-none text-ink">{loading ? '–' : weekRecordTotal + weekSearchTotal}</p>
            <p className="mt-2 text-xs text-slate">Uploads and searches combined</p>
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {QUICK_ACTIONS.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="surface surface-hover group flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-porcelain text-lagoon transition-colors group-hover:bg-abyss group-hover:text-seafoam">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ink">{title}</span>
              <span className="block truncate text-xs text-slate">{description}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
          </Link>
        ))}
      </section>

      {/* Activity */}
      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="surface overflow-hidden">
          <div className="flex items-center justify-between px-6 pb-2 pt-6">
            <h2 className="font-display text-[26px]">Recently uploaded</h2>
            <Link to="/records/my-records" className="text-xs font-bold text-lagoon hover:underline">View all</Link>
          </div>
          {loading ? (
            <Skeleton rows={4} />
          ) : recentRecords.length === 0 ? (
            <EmptyState icon={FileText} title="No records yet" description="Records you upload will appear here." />
          ) : (
            <ul className="px-3 pb-3">
              {recentRecords.map((record) => (
                <li key={record.record_id} className="flex items-center gap-3.5 rounded-2xl px-3 py-3 transition-colors hover:bg-porcelain">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-seafoam/60 to-seafoam/20 text-sm font-extrabold text-deep">
                    {initials(record.first_name, record.last_name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink">{record.first_name} {record.last_name}</span>
                    <span className="block text-xs tabular-nums text-slate">NIN {record.nin}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate">{timeAgo(record.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface overflow-hidden">
          <div className="flex items-center justify-between px-6 pb-2 pt-6">
            <h2 className="font-display text-[26px]">Recent searches</h2>
            <Link to="/audit" className="text-xs font-bold text-lagoon hover:underline">View all</Link>
          </div>
          {loading ? (
            <Skeleton rows={4} />
          ) : recentSearches.length === 0 ? (
            <EmptyState icon={Search} title="No searches yet" description="Look up a patient by NIN and it will be logged here." />
          ) : (
            <ul className="px-3 pb-3">
              {recentSearches.map((log) => (
                <li key={log.log_id} className="flex items-center gap-3.5 rounded-2xl px-3 py-3 transition-colors hover:bg-porcelain">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne/20 text-champagne-deep">
                    <Search className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold tabular-nums text-ink">{log.searched_nin}</span>
                    <span className="block text-xs text-slate">Searched by your hospital</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate">{timeAgo(log.search_time)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  )
}
export default Dashboard
