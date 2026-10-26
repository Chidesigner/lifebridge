import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Search, ClipboardList, UploadCloud, ArrowRight,
  Activity, ShieldCheck, Clock3, ArrowUpRight
} from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import HospitalNav from '../../components/HospitalNav'
import Spinner from '../../components/Spinner'
import EmptyState from '../../components/EmptyState'

const QUICK_ACTIONS = [
  { to: '/records/upload', icon: UploadCloud, title: 'Add a patient record', description: 'Contribute clinical information to the shared network.', action: 'Upload record' },
  { to: '/search', icon: Search, title: 'Find a patient', description: 'Locate relevant history using a patient’s NIN.', action: 'Start a lookup' },
  { to: '/records/my-records', icon: FileText, title: 'Manage records', description: 'Review and update records your facility submitted.', action: 'View records' },
]

function initialsFor(record) {
  return [record.first_name, record.last_name].filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase()
}

function Dashboard() {
  const { hospital } = useAuth()
  const [recordCount, setRecordCount] = useState(null)
  const [searchCount, setSearchCount] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hospital?.hospital_id) loadDashboard()
  }, [hospital?.hospital_id])

  async function loadDashboard() {
    setLoading(true)
    const [{ count: records }, { count: searches }, { data: recent }] = await Promise.all([
      supabase.from('patient_records').select('*', { count: 'exact', head: true }).eq('hospital_id', hospital.hospital_id),
      supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('hospital_id', hospital.hospital_id),
      supabase.from('patient_records').select('record_id, first_name, last_name, nin, created_at')
        .eq('hospital_id', hospital.hospital_id).order('created_at', { ascending: false }).limit(5),
    ])
    setRecordCount(records ?? 0)
    setSearchCount(searches ?? 0)
    setRecentRecords(recent ?? [])
    setLoading(false)
  }

  return (
    <div className="app-shell min-h-screen">
      <HospitalNav />
      <main>
        <div className="dashboard-welcome">
          <div>
            <div className="dashboard-eyebrow"><Activity size={14} /> Facility intelligence</div>
            <h1>Good to see you, {hospital?.name || 'team'}.</h1>
            <p style={{ marginTop: 10 }}>Here’s your hospital’s activity across the LifeBridge network, all in one place.</p>
          </div>
          <span className="dashboard-live">Network workspace</span>
        </div>

        <section aria-label="Hospital activity summary">
          <div className="dashboard-section-head">
            <div className="dashboard-section-title">Your activity at a glance</div>
            <div className="dashboard-section-kicker">All-time activity</div>
          </div>
          <div className="dashboard-stats">
            <article className="dashboard-stat">
              <div className="dashboard-stat-icon"><FileText size={22} /></div>
              <div>
                <div className="dashboard-stat-label">Records contributed</div>
                <div className="dashboard-stat-value">{loading ? '—' : recordCount}</div>
                <div className="dashboard-stat-note">Patient records uploaded by your facility</div>
              </div>
            </article>
            <article className="dashboard-stat">
              <div className="dashboard-stat-icon"><Search size={22} /></div>
              <div>
                <div className="dashboard-stat-label">Patient lookups</div>
                <div className="dashboard-stat-value">{loading ? '—' : searchCount}</div>
                <div className="dashboard-stat-note">Searches recorded in your audit trail</div>
              </div>
            </article>
          </div>
        </section>

        <section style={{ marginTop: 36 }} aria-label="Quick actions">
          <div className="dashboard-section-head">
            <div className="dashboard-section-title">Where would you like to go?</div>
            <div className="dashboard-section-kicker">Your core tools</div>
          </div>
          <div className="dashboard-actions">
            {QUICK_ACTIONS.map(({ to, icon: Icon, title, description, action }) => (
              <Link key={to} to={to} className="dashboard-action">
                <span className="dashboard-action-icon"><Icon size={19} /></span>
                <span className="dashboard-action-arrow">
                  <span className="dashboard-action-title">{title}</span>
                  <ArrowUpRight size={16} />
                </span>
                <span className="dashboard-action-copy">{description}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 15, color: '#0c8b80', fontSize: 10, fontWeight: 800 }}>
                  {action} <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 36 }} aria-label="Recently uploaded patient records">
          <div className="dashboard-section-head">
            <div>
              <div className="dashboard-section-title">Recently contributed records</div>
              <div className="dashboard-section-kicker" style={{ marginTop: 5 }}>The latest records submitted by your facility</div>
            </div>
            <Link to="/records/my-records" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#0c8b80', fontSize: 10, fontWeight: 800 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="dashboard-recent">
            {loading ? (
              <div style={{ padding: 35 }}><Spinner label="Loading recent activity..." /></div>
            ) : recentRecords.length === 0 ? (
              <EmptyState icon={FileText} title="Your network starts here" description="When you upload your first patient record, it will appear here." />
            ) : (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {recentRecords.map((record) => (
                  <li key={record.record_id} className="dashboard-record">
                    <div className="dashboard-record-identity">
                      <span className="dashboard-record-avatar">{initialsFor(record)}</span>
                      <span style={{ minWidth: 0 }}>
                        <span className="dashboard-record-name" style={{ display: 'block' }}>{record.first_name} {record.last_name}</span>
                        <span className="dashboard-record-nin" style={{ display: 'block' }}>NIN · {record.nin}</span>
                      </span>
                    </div>
                    <span className="dashboard-record-date"><Clock3 size={11} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />{new Date(record.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, color: '#8295a2', fontSize: 10 }}>
            <ShieldCheck size={13} color="#0d9488" /> All patient lookups are recorded in your facility’s access history.
            <Link to="/audit" style={{ color: '#0c8b80', fontWeight: 800 }}>Review log</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
export default Dashboard
