import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search, ClipboardList, UploadCloud, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import HospitalNav from '../../components/HospitalNav'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'

const QUICK_ACTIONS = [
  { to: '/records/upload', icon: UploadCloud, title: 'Upload a record', description: 'Add a new patient to the network.' },
  { to: '/search', icon: Search, title: 'Search by NIN', description: 'Look up a patient across all hospitals.' },
  { to: '/records/my-records', icon: FileText, title: 'View my records', description: 'See and edit what you\u2019ve uploaded.' },
]

function Dashboard() {
  const { hospital } = useAuth()
  const [recordCount, setRecordCount] = useState(null)
  const [searchCount, setSearchCount] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)

    const [{ count: records }, { count: searches }, { data: recent }] = await Promise.all([
      supabase
        .from('patient_records')
        .select('*', { count: 'exact', head: true })
        .eq('hospital_id', hospital.hospital_id),
      supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('hospital_id', hospital.hospital_id),
      supabase
        .from('patient_records')
        .select('record_id, first_name, last_name, nin, created_at')
        .eq('hospital_id', hospital.hospital_id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    setRecordCount(records ?? 0)
    setSearchCount(searches ?? 0)
    setRecentRecords(recent ?? [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HospitalNav />

      <main className="mx-auto max-w-5xl p-8">
        <h1 className="text-2xl font-bold text-brand-navy">Welcome, {hospital?.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Here's what's happening on LifeBridge for your hospital.</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50">
                <FileText className="h-5 w-5 text-brand-navy" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Records uploaded</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : recordCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <ClipboardList className="h-5 w-5 text-brand-green-dark" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Searches performed</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : searchCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUICK_ACTIONS.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-navy/30 hover:shadow-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-100 group-hover:bg-blue-50">
                <Icon className="h-4.5 w-4.5 text-brand-navy" />
              </div>
              <p className="mt-3 flex items-center gap-1 font-medium text-gray-900">
                {title}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </Link>
          ))}
        </div>

        {/* Recent activity */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Recently uploaded</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {loading ? (
              <div className="p-6"><Spinner label="Loading recent activity..." /></div>
            ) : recentRecords.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No records uploaded yet"
                description="Records you upload will show up here."
              />
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentRecords.map((record) => (
                  <li key={record.record_id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="font-medium text-gray-900">
                      {record.first_name} {record.last_name}
                      <span className="ml-2 font-normal text-gray-400">NIN: {record.nin}</span>
                    </span>
                    <span className="text-gray-400">{new Date(record.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
export default Dashboard
